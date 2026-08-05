import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { orbits, planets, type Planet } from "@/data/index";
import { useUniverseStore } from "@/hooks/useUniverse";

const ORBIT_SEGMENTS = 180;
const MOON_SEGMENTS = 16;
const PLANET_SEGMENTS = 40;
const GLOW_SEGMENTS = 24;

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const pts = curve
      .getPoints(ORBIT_SEGMENTS)
      .map((p: THREE.Vector2) => new THREE.Vector3(p.x, 0, p.y));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color={color} transparent opacity={0.18} />
    </line>
  );
}

function Moon({
  index,
  count,
  color,
  size,
}: {
  index: number;
  count: number;
  color: string;
  size: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const position = useRef(new THREE.Vector3());
  const dist = size * 2.2 + index * size * 0.9;
  const speed = 0.8 + index * 0.25;
  const phase = (index / count) * Math.PI * 2;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    if (ref.current) {
      position.current.set(Math.cos(t) * dist, Math.sin(t * 1.4) * size * 0.5, Math.sin(t) * dist);
      ref.current.position.copy(position.current);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size * 0.22, MOON_SEGMENTS, MOON_SEGMENTS]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.5}
      />
    </mesh>
  );
}

function PlanetBody({ planet }: { planet: Planet }) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const worldPosition = useRef(new THREE.Vector3());
  const targetScale = useRef(new THREE.Vector3());

  // Narrow Zustand selectors: this planet re-renders ONLY when its own
  // hover/focus state changes — not when a sibling planet is hovered.
  const isHovered = useUniverseStore((s) => s.hovered === planet.id);
  const isFocused = useUniverseStore((s) => s.focus?.id === planet.id);
  const isActive = isHovered || isFocused;

  const setFocus = useUniverseStore((s) => s.setFocus);
  const setHovered = useUniverseStore((s) => s.setHovered);
  const registerNode = useUniverseStore((s) => s.registerNode);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * planet.speed + planet.offset;
    if (group.current) {
      group.current.position.set(
        Math.cos(t) * planet.radius,
        Math.sin(t * 0.6) * 1.2,
        Math.sin(t) * planet.radius,
      );
      // Only record the live position when this body is the focus target;
      // otherwise skip the world-matrix computation (throttling win).
      if (isFocused) {
        registerNode(planet.id, group.current.getWorldPosition(worldPosition.current));
      }
    }
    if (body.current) {
      body.current.rotation.y += 0.004;
      const target = isActive ? 1.35 : 1;
      targetScale.current.setScalar(target);
      body.current.scale.lerp(targetScale.current, 0.12);
    }
  });

  return (
    <group ref={group}>
      <mesh
        ref={body}
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
        <sphereGeometry args={[planet.size, PLANET_SEGMENTS, PLANET_SEGMENTS]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={isActive ? 1.5 : 0.45}
          roughness={0.4}
          metalness={0.25}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[planet.size * 1.5, GLOW_SEGMENTS, GLOW_SEGMENTS]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={isActive ? 0.16 : 0.06}
          side={THREE.BackSide}
        />
      </mesh>
      {planet.moons.map((moon, i) => (
        <Moon
          key={moon.name}
          index={i}
          count={planet.moons.length}
          color={planet.color}
          size={planet.size}
        />
      ))}
      {isActive && (
        <Html
          center
          distanceFactor={30}
          position={[0, planet.size + 1.4, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="glass-panel pointer-events-none whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-starlight">
            {planet.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export function PlanetSystem() {
  return (
    <group>
      {planets.map((planet) => {
        const orbit = orbits.find((o) => o.id === planet.orbit);
        if (!orbit) return null;
        return (
          <group key={planet.id}>
            <OrbitRing radius={planet.radius} color={orbit.color} />
            <PlanetBody planet={planet} />
          </group>
        );
      })}
    </group>
  );
}
