import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { galaxies, type Galaxy } from "@/data/index";
import { useUniverseStore } from "@/hooks/useUniverse";
import { disposeObject3D } from "@/lib/three-dispose";
import { createSeededRandom } from "@/lib/seeded-random";
import { GALAXY_VISUAL_SCALE } from "@/constants/camera";
import { ScreenLabel } from "@/components/shared/ScreenLabel";
import { dampSemanticScale } from "@/lib/semantic-scale";

const WHITE = new THREE.Color("#ffffff");

type GalaxyVisualConfig = {
  starCount: number;
  discRadius: number;
  armCount: number;
  thickness: number;
  coreRadius: number;
  pointSize: number;
  rotation: [number, number, number];
  visualScale: number;
};

const DEFAULT_VISUAL: GalaxyVisualConfig = {
  starCount: 2800,
  discRadius: 4.8,
  armCount: 4,
  thickness: 0.82,
  coreRadius: 0.76,
  pointSize: 0.16,
  rotation: [0.72, 0.18, -0.15],
  visualScale: 1.0,
};

const GALAXY_VISUALS: Record<string, GalaxyVisualConfig> = {
  khuta: {
    starCount: 3200,
    discRadius: 5.6,
    armCount: 3,
    thickness: 1.15,
    coreRadius: 0.9,
    pointSize: 0.18,
    rotation: [0.5, 0, 0.25],
    visualScale: GALAXY_VISUAL_SCALE.khuta,
  },
  nexara: {
    starCount: 3000,
    discRadius: 5.1,
    armCount: 2,
    thickness: 1.45,
    coreRadius: 1.02,
    pointSize: 0.17,
    rotation: [0.34, -0.2, 0.4],
    visualScale: GALAXY_VISUAL_SCALE.nexara,
  },
  finora: {
    starCount: 2400,
    discRadius: 4.35,
    armCount: 3,
    thickness: 0.64,
    coreRadius: 0.68,
    pointSize: 0.16,
    rotation: [0.95, 0.12, 0.1],
    visualScale: GALAXY_VISUAL_SCALE.finora,
  },
  "library-system": {
    starCount: 2800,
    discRadius: 5,
    armCount: 5,
    thickness: 0.95,
    coreRadius: 0.84,
    pointSize: 0.17,
    rotation: [0.45, -0.1, 0.2],
    visualScale: GALAXY_VISUAL_SCALE["library-system"],
  },
  wandr: {
    starCount: 2800,
    discRadius: 4.9,
    armCount: 4,
    thickness: 0.88,
    coreRadius: 0.78,
    pointSize: 0.17,
    rotation: [0.6, 0.1, -0.1],
    visualScale: GALAXY_VISUAL_SCALE.wandr,
  },
};

function createGalaxyGeometry(
  color: string,
  config: GalaxyVisualConfig,
  random: () => number,
  starCount: number,
): THREE.BufferGeometry {
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const base = new THREE.Color(color);

  for (let i = 0; i < starCount; i++) {
    const arm = i % config.armCount;
    const dist = Math.pow(random(), 0.62) * config.discRadius;
    const angle = dist * 0.9 + (arm / config.armCount) * Math.PI * 2 + (random() - 0.5) * 0.3;
    const spread = config.thickness * (0.18 + dist / config.discRadius);
    positions[i * 3] = Math.cos(angle) * dist + (random() - 0.5) * spread;
    positions[i * 3 + 1] =
      (random() - 0.5) * config.thickness * (1.1 - (dist / config.discRadius) * 0.45);
    positions[i * 3 + 2] = Math.sin(angle) * dist + (random() - 0.5) * spread;
    const c = base.clone().lerp(WHITE, Math.max(0, 1 - dist / config.discRadius));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

const GALAXY_VERTEX_SHADER = `
  attribute vec3 color;
  uniform float pixelRatio;
  uniform float pointScale;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float perspectiveSize = 115.0 * pointScale * pixelRatio / max(-mvPosition.z, 1.0);
    gl_PointSize = clamp(perspectiveSize, 1.8, 6.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const GALAXY_FRAGMENT_SHADER = `
  uniform float opacity;
  varying vec3 vColor;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    if (distanceToCenter > 0.5) discard;
    float core = 1.0 - smoothstep(0.0, 0.24, distanceToCenter);
    float halo = 1.0 - smoothstep(0.24, 0.5, distanceToCenter);
    gl_FragColor = vec4(vColor * (core * 1.35 + halo * 0.34), (core * 0.7 + halo * 0.45) * opacity);
  }
`;

function GalaxyDisc({
  galaxy,
  starCount,
  reducedMotion,
}: {
  galaxy: Galaxy;
  starCount: number;
  reducedMotion: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);
  const group = useRef<THREE.Group>(null);
  const disc = useRef<THREE.Points>(null);
  const discMaterial = useRef<THREE.ShaderMaterial>(null);
  const core = useRef<THREE.Mesh>(null);
  const worldPosition = useRef(new THREE.Vector3());
  const worldCenter = useRef(new THREE.Vector3());
  const semanticScale = useRef(1);
  const pixelRatio = useThree((state) => state.viewport.dpr);

  // Dispose GPU resources when this galaxy unmounts — prevents memory leaks.
  useEffect(() => {
    const groupObj = group.current;
    return () => disposeObject3D(groupObj);
  }, []);

  // Narrow selectors: only this galaxy re-renders on its own hover/focus change.
  const isHovered = useUniverseStore((s) => s.hovered === galaxy.id);
  const isFocused = useUniverseStore((s) => s.focus?.id === galaxy.id);
  const isActive = isHovered || isFocused;
  const visual = GALAXY_VISUALS[galaxy.id] ?? DEFAULT_VISUAL;
  const uniforms = useMemo(
    () => ({
      opacity: { value: 0.78 },
      pixelRatio: { value: pixelRatio },
      pointScale: { value: visual.visualScale },
    }),
    [pixelRatio, visual.visualScale],
  );

  const setFocus = useUniverseStore((s) => s.setFocus);
  const setHovered = useUniverseStore((s) => s.setHovered);
  const registerNode = useUniverseStore((s) => s.registerNode);

  // Use deterministic seed based on galaxy ID to avoid hydration mismatch
  const geometry = useMemo(() => {
    const seed = galaxy.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return createGalaxyGeometry(
      galaxy.color,
      visual,
      createSeededRandom(seed),
      Math.max(240, Math.round(visual.starCount * (starCount / 7600))),
    );
  }, [galaxy.color, galaxy.id, starCount, visual]);

  useFrame((_, delta) => {
    if (!reducedMotion && disc.current)
      disc.current.rotation.y += delta * (isHovered ? 0.28 : 0.08);
    if (group.current) {
      group.current.getWorldPosition(worldCenter.current);
      const distance = camera.position.distanceTo(worldCenter.current);
      semanticScale.current = THREE.MathUtils.clamp(
        dampSemanticScale(semanticScale.current, distance, delta),
        1,
        1.32,
      );
      if (group.current) {
        const scale = visual.visualScale * semanticScale.current;
        group.current.scale.setScalar(scale);
      }
      const distanceFade = THREE.MathUtils.clamp(1 - (distance - 95) / 360, 0.08, 0.78);
      const deepSpaceDimming = scene.userData["deepSpaceDimming"] ?? 0;
      const deepSpaceFade = THREE.MathUtils.lerp(1, 0.08, deepSpaceDimming);
      const targetOpacity = isActive ? 0.86 : distanceFade * deepSpaceFade;
      const material = discMaterial.current;
      if (material) {
        const opacityUniform = material.uniforms["opacity"];
        const pixelRatioUniform = material.uniforms["pixelRatio"];
        const pointScaleUniform = material.uniforms["pointScale"];
        if (opacityUniform) {
          opacityUniform.value = THREE.MathUtils.damp(
            opacityUniform.value,
            targetOpacity,
            4,
            delta,
          );
        }
        if (pixelRatioUniform) pixelRatioUniform.value = pixelRatio;
        if (pointScaleUniform) {
          const referencePointSize = DEFAULT_VISUAL.pointSize;
          pointScaleUniform.value =
            visual.visualScale * semanticScale.current * (visual.pointSize / referencePointSize);
        }
      }
      const coreMaterial = core.current?.material;
      if (coreMaterial instanceof THREE.MeshBasicMaterial) {
        coreMaterial.opacity = THREE.MathUtils.damp(
          coreMaterial.opacity,
          isActive ? 0.42 : distanceFade * deepSpaceFade * 0.2,
          4,
          delta,
        );
      }
      // Static scale set via JSX below — no per-frame mutation.
      // Only record live position when this galaxy is the focus target.
      if (isFocused) {
        registerNode(galaxy.id, group.current.getWorldPosition(worldPosition.current));
      }
    }
  });

  return (
    <group ref={group} position={galaxy.position} rotation={visual.rotation}>
      <points ref={disc} geometry={geometry} raycast={() => null}>
        <shaderMaterial
          ref={discMaterial}
          transparent
          opacity={0.78}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={GALAXY_VERTEX_SHADER}
          fragmentShader={GALAXY_FRAGMENT_SHADER}
        />
      </points>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          setFocus({ kind: "galaxy", id: galaxy.id });
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(galaxy.id);
        }}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[visual.discRadius * 0.96, 20, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={core} raycast={() => null}>
        <sphereGeometry args={[visual.coreRadius, 24, 24]} />
        <meshBasicMaterial
          color={galaxy.color}
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {isActive && (
        <ScreenLabel position={[0, 4.5, 0]} maxDistance={165}>
          <div className="galaxy-cosmic-label text-center">
            <p className="label-mono">Galaxy</p>
            <p className="font-display text-base font-semibold text-starlight">{galaxy.name}</p>
          </div>
        </ScreenLabel>
      )}
    </group>
  );
}

export function Galaxies({
  starCount = 7600,
  reducedMotion = false,
}: {
  starCount?: number;
  reducedMotion?: boolean;
}) {
  return (
    <group>
      {galaxies.map((galaxy) => (
        <GalaxyDisc
          key={galaxy.id}
          galaxy={galaxy}
          starCount={starCount}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}
