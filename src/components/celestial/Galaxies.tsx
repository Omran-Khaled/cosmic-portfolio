import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { galaxies, type Galaxy } from "@/data/index";
import { useUniverseStore } from "@/hooks/useUniverse";

const STAR_COUNT = 1400;
const DISC_RADIUS = 6;
const DISC_SEGMENTS = 3;
const WHITE = new THREE.Color("#ffffff");

function createGalaxyGeometry(color: string): THREE.BufferGeometry {
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const base = new THREE.Color(color);

  for (let i = 0; i < STAR_COUNT; i++) {
    const arm = i % DISC_SEGMENTS;
    const dist = Math.pow(Math.random(), 0.6) * DISC_RADIUS;
    const angle = dist * 0.9 + (arm / DISC_SEGMENTS) * Math.PI * 2 + Math.random() * 0.25;
    positions[i * 3] = Math.cos(angle) * dist + (Math.random() - 0.5) * 0.4;
    positions[i * 3 + 1] = (Math.random() - 0.5) * (1.4 - dist * 0.15);
    positions[i * 3 + 2] = Math.sin(angle) * dist + (Math.random() - 0.5) * 0.4;
    const c = base.clone().lerp(WHITE, Math.max(0, 1 - dist / 5));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

function GalaxyDisc({ galaxy }: { galaxy: Galaxy }) {
  const group = useRef<THREE.Group>(null);
  const disc = useRef<THREE.Points>(null);
  const worldPosition = useRef(new THREE.Vector3());
  const targetScale = useRef(new THREE.Vector3());

  // Narrow selectors: only this galaxy re-renders on its own hover/focus change.
  const isHovered = useUniverseStore((s) => s.hovered === galaxy.id);
  const isFocused = useUniverseStore((s) => s.focus?.id === galaxy.id);
  const isActive = isHovered || isFocused;

  const setFocus = useUniverseStore((s) => s.setFocus);
  const setHovered = useUniverseStore((s) => s.setHovered);
  const registerNode = useUniverseStore((s) => s.registerNode);

  const geometry = useMemo(() => createGalaxyGeometry(galaxy.color), [galaxy.color]);

  useFrame((_, delta) => {
    if (disc.current) disc.current.rotation.y += delta * (isHovered ? 0.28 : 0.08);
    if (group.current) {
      const target = isActive ? 1.18 : 1;
      targetScale.current.setScalar(target);
      group.current.scale.lerp(targetScale.current, 0.1);
      // Only record live position when this galaxy is the focus target.
      if (isFocused) {
        registerNode(galaxy.id, group.current.getWorldPosition(worldPosition.current));
      }
    }
  });

  return (
    <group ref={group} position={galaxy.position} rotation={[0.5, 0, 0.25]}>
      <points ref={disc} geometry={geometry}>
        <pointsMaterial
          size={0.16}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
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
        <sphereGeometry args={[5.6, 20, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.1, 24, 24]} />
        <meshBasicMaterial color={galaxy.color} transparent opacity={0.35} />
      </mesh>
      {isActive && (
        <Html center distanceFactor={44} position={[0, 6.5, 0]} style={{ pointerEvents: "none" }}>
          <div className="pointer-events-none select-none whitespace-nowrap text-center">
            <p className="label-mono">Galaxy</p>
            <p className="font-display text-base font-semibold text-starlight">{galaxy.name}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

export function Galaxies() {
  return (
    <group>
      {galaxies.map((galaxy) => (
        <GalaxyDisc key={galaxy.id} galaxy={galaxy} />
      ))}
    </group>
  );
}
