import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { identity } from "@/data/index";
import { useUniverseStore } from "@/hooks/useUniverse";
import { disposeObject3D } from "@/lib/three-dispose";

export function Sun() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const worldPosition = useRef(new THREE.Vector3());

  // Dispose sun geometry/material on unmount.
  useEffect(() => {
    const groupObj = group.current;
    return () => disposeObject3D(groupObj);
  }, []);
  const active = useUniverseStore((s) => s.hovered === "sun");
  const isFocused = useUniverseStore((s) => s.focus?.id === "sun");
  const setFocus = useUniverseStore((s) => s.setFocus);
  const setHovered = useUniverseStore((s) => s.setHovered);
  const registerNode = useUniverseStore((s) => s.registerNode);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (core.current) {
      core.current.rotation.y = t * 0.08;
      const s = (active ? 1.12 : 1) + Math.sin(t * 1.4) * 0.015;
      core.current.scale.setScalar(s);
      if (isFocused) {
        registerNode("sun", core.current.getWorldPosition(worldPosition.current));
      }
    }
    if (halo.current) halo.current.scale.setScalar(1.5 + Math.sin(t * 0.9) * 0.05);
  });

  return (
    <group ref={group}>
      <pointLight intensity={2.2} distance={40} decay={2} color="#ffd8a8" />
      <mesh
        ref={core}
        onClick={(e) => {
          e.stopPropagation();
          setFocus({ kind: "sun", id: "sun" });
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered("sun");
        }}
        onPointerOut={() => setHovered(null)}
      >
        <icosahedronGeometry args={[2.6, 6]} />
        <meshStandardMaterial
          color="#ffb257"
          emissive="#ff9d3c"
          emissiveIntensity={active ? 3.2 : 2.2}
          roughness={0.35}
        />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[3.1, 32, 32]} />
        <meshBasicMaterial color="#ffb257" transparent opacity={0.09} side={THREE.BackSide} />
      </mesh>
      {(active || isFocused) && (
        <Html center distanceFactor={26} position={[0, 4.6, 0]} style={{ pointerEvents: "none" }}>
          <div className="pointer-events-none select-none whitespace-nowrap text-center">
            <p className="label-mono text-accent">Identity Core</p>
            <p className="font-display text-lg font-semibold text-starlight">{identity.name}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
