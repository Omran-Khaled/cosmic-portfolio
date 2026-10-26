import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { orbits, planets, type Planet } from "@/data/index";
import { useUniverseStore } from "@/hooks/useUniverse";
import { disposeObject3D } from "@/lib/three-dispose";
import { createPlanetLayout, type PlanetLayout } from "@/lib/planet-layout";
import { setInclinedOrbitPosition } from "@/lib/orbit-geometry";
import {
  PLANET_OVERVIEW_SCALE,
  planetOrbitRadius,
  planetOrbitInclination,
} from "@/constants/layout";
import { dampSemanticScale } from "@/lib/semantic-scale";
import { ScreenLabel } from "@/components/shared/ScreenLabel";
import { gradePlanetColor } from "@/lib/planet-color";
import { createPlanetSurfaceTexture } from "@/lib/planet-surface-texture";
import { getPlanetVisualProfile } from "@/lib/planet-visual-profile";
import type { QualityTier } from "@/constants/cinematic";

const GEOMETRY_DETAIL: Record<
  QualityTier,
  {
    orbitSegments: number;
    moonSegments: number;
    planetSegments: number;
    glowSegments: number;
    ringSegments: number;
  }
> = {
  low: {
    orbitSegments: 72,
    moonSegments: 8,
    planetSegments: 20,
    glowSegments: 12,
    ringSegments: 32,
  },
  medium: {
    orbitSegments: 120,
    moonSegments: 12,
    planetSegments: 30,
    glowSegments: 16,
    ringSegments: 48,
  },
  high: {
    orbitSegments: 180,
    moonSegments: 16,
    planetSegments: 40,
    glowSegments: 24,
    ringSegments: 72,
  },
};

function OrbitRing({
  radius,
  color,
  index,
  inclination,
  segments,
}: {
  radius: number;
  color: string;
  index: number;
  inclination: number;
  segments: number;
}) {
  const { scene } = useThree();
  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const pts = curve.getPoints(segments).map((p: THREE.Vector2) => new THREE.Vector3(p.x, 0, p.y));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius, segments]);
  const line = useMemo(() => {
    const orbit = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.07 + Math.max(0, 0.035 - index * 0.004),
      }),
    );
    orbit.rotation.x = inclination;
    // Orbit rings are decorative; they must not block clicks on celestial bodies.
    orbit.raycast = () => {};
    return orbit;
  }, [color, geometry, inclination, index]);

  useEffect(
    () => () => {
      line.geometry.dispose();
      const material = line.material;
      if (Array.isArray(material)) material.forEach((item) => item.dispose());
      else material.dispose();
    },
    [line],
  );

  useFrame(() => {
    const dimming = scene.userData["deepSpaceDimming"] ?? 0;
    const visibility = THREE.MathUtils.lerp(1, 0.06, dimming);
    const material = line.material;
    if (!Array.isArray(material)) {
      material.opacity = (0.07 + Math.max(0, 0.035 - index * 0.004)) * visibility;
    }
  });

  return <primitive object={line} />;
}

function Moon({
  index,
  count,
  color,
  size,
  reducedMotion,
  segments,
}: {
  index: number;
  count: number;
  color: string;
  size: number;
  reducedMotion: boolean;
  segments: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const position = useRef(new THREE.Vector3());
  const dist = size * 2.2 + index * size * 0.9;
  const speed = 0.8 + index * 0.25;
  const phase = (index / count) * Math.PI * 2;

  // Resources are owned and disposed by the enclosing PlanetBody subtree.

  useFrame(({ clock }) => {
    const t = (reducedMotion ? 0 : clock.getElapsedTime()) * speed + phase;
    if (ref.current) {
      position.current.set(Math.cos(t) * dist, Math.sin(t * 1.4) * size * 0.5, Math.sin(t) * dist);
      ref.current.position.copy(position.current);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[Math.max(size * 0.3, 0.22), segments, segments]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.12}
        roughness={0.5}
      />
    </mesh>
  );
}

function PlanetBody({
  planet,
  layout,
  orbitColor,
  reducedMotion,
  quality,
}: {
  planet: Planet;
  layout: PlanetLayout;
  orbitColor: string;
  reducedMotion: boolean;
  quality: QualityTier;
}) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const worldPosition = useRef(new THREE.Vector3());
  const targetScale = useRef(new THREE.Vector3());
  const bodyMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const glowMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const surfaceTexture = useRef<THREE.CanvasTexture | null>(null);
  const { camera, scene } = useThree();
  const semanticScale = useRef(1);

  // Own the optional surface map and subtree resources. The map is detached first
  // so the subtree disposer does not dispose the same texture twice.
  useEffect(() => {
    const groupObj = group.current;
    return () => {
      const texture = surfaceTexture.current;
      if (texture && bodyMaterial.current) {
        let detached = false;
        if (bodyMaterial.current.map === texture) {
          bodyMaterial.current.map = null;
          detached = true;
        }
        if (bodyMaterial.current.bumpMap === texture) {
          bodyMaterial.current.bumpMap = null;
          bodyMaterial.current.bumpScale = 0;
          detached = true;
        }
        if (detached) bodyMaterial.current.needsUpdate = true;
      }
      if (texture) texture.dispose();
      disposeObject3D(groupObj);
    };
  }, []);

  // Narrow Zustand selectors: this planet re-renders ONLY when its own
  // hover/focus state changes — not when a sibling planet is hovered.
  const isHovered = useUniverseStore((s) => s.hovered === planet.id);
  const isFocused = useUniverseStore((s) => s.focus?.id === planet.id);
  const isActive = isHovered || isFocused;
  const visual = getPlanetVisualProfile(planet.id);
  const detail = GEOMETRY_DETAIL[quality];
  const gradedColor = useMemo(
    () => gradePlanetColor(planet.color, orbitColor),
    [planet.color, orbitColor],
  );

  const setFocus = useUniverseStore((s) => s.setFocus);
  const setHovered = useUniverseStore((s) => s.setHovered);
  const registerNode = useUniverseStore((s) => s.registerNode);

  // A compact color map remains enabled even on weak devices so planets keep
  // distinct surface silhouettes. Low quality skips bump sampling; stronger tiers
  // reuse that same texture for subtle relief instead of allocating another map.
  useEffect(() => {
    const material = bodyMaterial.current;
    if (!material) return;

    if (!surfaceTexture.current) {
      surfaceTexture.current = createPlanetSurfaceTexture(planet.id, gradedColor, visual.surface);
    }

    const texture = surfaceTexture.current;
    if (!texture) {
      material.color.set(gradedColor);
      material.bumpMap = null;
      material.bumpScale = 0;
      material.needsUpdate = true;
      return;
    }

    let changed = false;
    material.color.set("#ffffff");
    if (material.map !== texture) {
      material.map = texture;
      changed = true;
    }
    if (quality === "low") {
      if (material.bumpMap !== null) {
        material.bumpMap = null;
        changed = true;
      }
      material.bumpScale = 0;
    } else {
      if (material.bumpMap !== texture) {
        material.bumpMap = texture;
        changed = true;
      }
      material.bumpScale = layout.size * visual.bumpStrength;
    }
    if (changed) material.needsUpdate = true;
  }, [quality, planet.id, gradedColor, visual.surface, visual.bumpStrength, layout.size]);

  useFrame(({ clock }, delta) => {
    const t = (reducedMotion ? 0 : clock.getElapsedTime()) * layout.speed + layout.phase;
    if (group.current) {
      setInclinedOrbitPosition(group.current.position, layout.radius, t, layout.inclination);
      const distance = camera.position.distanceTo(
        group.current.getWorldPosition(worldPosition.current),
      );
      semanticScale.current = dampSemanticScale(semanticScale.current, distance, delta);
      group.current.scale.setScalar(
        PLANET_OVERVIEW_SCALE * THREE.MathUtils.lerp(1, semanticScale.current, 0.55),
      );
      // Only record the live position when this body is the focus target;
      // otherwise skip the world-matrix computation (throttling win).
      if (isFocused) {
        registerNode(planet.id, group.current.getWorldPosition(worldPosition.current));
      }
    }
    if (body.current) {
      if (!reducedMotion) body.current.rotation.y += 0.004;
      const target = isActive ? 1.08 : 1;
      targetScale.current.setScalar(target);
      body.current.scale.lerp(targetScale.current, 0.12);
    }
    const dimming = scene.userData["deepSpaceDimming"] ?? 0;
    const sceneBrightness = THREE.MathUtils.lerp(1, 0.1, dimming);
    if (bodyMaterial.current) {
      // Keep most of the night side genuinely dark; the sun and ambient fill do the lighting.
      bodyMaterial.current.emissiveIntensity = (isActive ? 0.035 : 0.004) * sceneBrightness;
    }
    if (glowMaterial.current) {
      glowMaterial.current.opacity =
        (isActive ? Math.min(visual.atmosphereOpacity * 1.45, 0.18) : visual.atmosphereOpacity) *
        sceneBrightness;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={body} raycast={() => null}>
        <sphereGeometry args={[layout.size, detail.planetSegments, detail.planetSegments]} />
        <meshStandardMaterial
          ref={bodyMaterial}
          color={gradedColor}
          emissive={gradedColor}
          emissiveIntensity={isActive ? 0.035 : 0.004}
          roughness={visual.roughness}
          metalness={visual.metalness}
        />
      </mesh>
      {visual.rings && (
        <mesh raycast={() => {}} rotation={[Math.PI / 2 + 0.28, 0.12, 0.18]}>
          <ringGeometry args={[layout.size * 1.22, layout.size * 2.08, detail.ringSegments]} />
          <meshBasicMaterial
            color={gradedColor}
            transparent
            opacity={0.46}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          setFocus({ kind: "planet", id: planet.id });
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(planet.id);
        }}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[Math.max(layout.size * 1.35, 1.15), 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {quality !== "low" && visual.atmosphere && (
        <mesh raycast={() => {}}>
          <sphereGeometry args={[layout.size * 1.105, detail.glowSegments, detail.glowSegments]} />
          <meshBasicMaterial
            ref={glowMaterial}
            color={gradedColor}
            transparent
            opacity={visual.atmosphereOpacity}
            side={THREE.BackSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      {planet.moons.map((moon, i) => (
        <Moon
          key={moon.name}
          index={i}
          count={planet.moons.length}
          color={planet.color}
          size={layout.size}
          reducedMotion={reducedMotion}
          segments={detail.moonSegments}
        />
      ))}
      {isActive && (
        <ScreenLabel position={[0, layout.size + 1.4, 0]} maxDistance={70}>
          <div className="glass-panel whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-starlight">
            {planet.name}
          </div>
        </ScreenLabel>
      )}
    </group>
  );
}

export function PlanetSystem({
  reducedMotion = false,
  quality = "medium",
}: {
  reducedMotion?: boolean;
  quality?: QualityTier;
}) {
  const layout = useMemo(() => createPlanetLayout(planets), []);
  return (
    <group>
      {orbits.map((orbit, index) => (
        <OrbitRing
          key={orbit.id}
          radius={planetOrbitRadius(index)}
          color={orbit.color}
          index={index}
          inclination={planetOrbitInclination(index)}
          segments={GEOMETRY_DETAIL[quality].orbitSegments}
        />
      ))}
      {planets.map((planet) => {
        const planetLayout = layout.get(planet.id);
        if (!planetLayout) return null;
        const orbit = orbits.find((candidate) => candidate.id === planet.orbit);
        if (!orbit) return null;
        return (
          <PlanetBody
            key={planet.id}
            planet={planet}
            layout={planetLayout}
            orbitColor={orbit.color}
            reducedMotion={reducedMotion}
            quality={quality}
          />
        );
      })}
    </group>
  );
}
