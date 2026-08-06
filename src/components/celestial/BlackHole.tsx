import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { blackHole } from "@/data/index";
import { useUniverseStore } from "@/hooks/useUniverse";
import { disposeObject3D } from "@/lib/three-dispose";

export function BlackHole() {
  const group = useRef<THREE.Group>(null);
  const disc = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const worldPosition = useRef(new THREE.Vector3());

  // Dispose GPU resources when the black hole unmounts.
  useEffect(() => {
    const groupObj = group.current;
    return () => disposeObject3D(groupObj);
  }, []);
  const active = useUniverseStore((s) => s.hovered === "blackhole" || s.focus?.id === "blackhole");
  const setFocus = useUniverseStore((s) => s.setFocus);
  const setHovered = useUniverseStore((s) => s.setHovered);
  const registerNode = useUniverseStore((s) => s.registerNode);
  const isFocused = useUniverseStore((s) => s.focus?.id === "blackhole");

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (disc.current) disc.current.rotation.z += delta * (active ? 1.1 : 0.4);
    if (ring.current) {
      ring.current.rotation.z -= delta * 0.6;
      ring.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.03);
    }
    if (group.current && isFocused) {
      registerNode("blackhole", group.current.getWorldPosition(worldPosition.current));
    }
  });

  return (
    <group ref={group} position={blackHole.position} rotation={[0.55, 0.3, 0]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          setFocus({ kind: "blackhole", id: "blackhole" });
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered("blackhole");
        }}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[3.2, 48, 48]} />
        <meshBasicMaterial color="#03040a" />
      </mesh>
      <mesh ref={disc} rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[5.2, 0.75, 2, 128]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#a78bfa"
          emissiveIntensity={active ? 3 : 1.6}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[7.4, 0.12, 2, 128]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={active ? 0.8 : 0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[4.1, 32, 32]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      {active && (
        <Html center distanceFactor={46} position={[0, 9, 0]} style={{ pointerEvents: "none" }}>
          <div className="pointer-events-none select-none whitespace-nowrap text-center">
            <p className="label-mono text-nebula">Singularity</p>
            <p className="font-display text-base font-semibold text-starlight">{blackHole.title}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
