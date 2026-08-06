import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { timeline } from "@/data/index";
import { disposeObject3D } from "@/lib/three-dispose";

const POINT_SPACING = 13;
const POINT_Y_AMPLITUDE = 5;
const POINT_Z_OFFSET = 4;
const START_X = -26;
const START_Z = -30;

const points = timeline.map(
  (_, i) =>
    new THREE.Vector3(
      START_X + i * POINT_SPACING,
      26 + Math.sin(i * 1.4) * POINT_Y_AMPLITUDE,
      START_Z + i * POINT_Z_OFFSET,
    ),
);

export function Constellation() {
  const group = useRef<THREE.Group>(null);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), []);

  // Dispose constellation geometry/material on unmount.
  useEffect(() => {
    const groupObj = group.current;
    return () => disposeObject3D(groupObj);
  }, []);

  useFrame(({ clock }) => {
    if (group.current) group.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.6;
  });

  return (
    <group ref={group}>
      <line>
        <primitive object={lineGeometry} attach="geometry" />
        <lineBasicMaterial color="#67e8f9" transparent opacity={0.35} />
      </line>
      {timeline.map((entry, i) => {
        const point = points[i];
        if (!point) return null;
        return (
          <group key={`${entry.year}-${i}`} position={point}>
            <mesh>
              <sphereGeometry args={[0.42, 20, 20]} />
              <meshStandardMaterial color="#e0f2fe" emissive="#67e8f9" emissiveIntensity={1.8} />
            </mesh>
            <Html center distanceFactor={48} position={[0, 2, 0]} style={{ pointerEvents: "none" }}>
              <div className="pointer-events-none w-40 select-none text-center">
                <p className="label-mono text-primary">{entry.year}</p>
                <p className="font-display text-sm font-semibold text-starlight">{entry.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{entry.body}</p>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
