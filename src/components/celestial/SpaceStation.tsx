import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { contact } from "@/data/index";
import { useUniverseStore } from "@/hooks/useUniverse";
import { disposeObject3D } from "@/lib/three-dispose";

export function SpaceStation() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const worldPosition = useRef(new THREE.Vector3());

  // Dispose station geometry/material on unmount.
  useEffect(() => {
    return () => disposeObject3D(group.current);
  }, []);
  const active = useUniverseStore((s) => s.hovered === "station" || s.focus?.id === "station");
  const isFocused = useUniverseStore((s) => s.focus?.id === "station");
  const setFocus = useUniverseStore((s) => s.setFocus);
  const setHovered = useUniverseStore((s) => s.setHovered);
  const registerNode = useUniverseStore((s) => s.registerNode);

  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.5;
    if (group.current) {
      group.current.rotation.y += delta * 0.1;
      if (isFocused) {
        registerNode("station", group.current.getWorldPosition(worldPosition.current));
      }
    }
  });

  return (
    <group ref={group} position={contact.position}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          setFocus({ kind: "station", id: "station" });
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered("station");
        }}
        onPointerOut={() => setHovered(null)}
      >
        <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.6, 0.24, 12, 64]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#22d3ee"
            emissiveIntensity={active ? 2.4 : 1}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
        <mesh>
          <capsuleGeometry args={[0.5, 2.4, 8, 20]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.14, 5.6, 0.9]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.6}
            roughness={0.4}
            emissive="#0ea5e9"
            emissiveIntensity={0.35}
          />
        </mesh>
      </group>
      {active && (
        <Html center distanceFactor={36} position={[0, 4.2, 0]} style={{ pointerEvents: "none" }}>
          <div className="pointer-events-none select-none whitespace-nowrap text-center">
            <p className="label-mono text-primary">Uplink</p>
            <p className="font-display text-base font-semibold text-starlight">{contact.title}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
