import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { disposeObject3D } from "@/lib/three-dispose";

const STAR_PALETTE = [
  new THREE.Color("#bae6fd"),
  new THREE.Color("#f5d0fe"),
  new THREE.Color("#fde68a"),
  new THREE.Color("#ffffff"),
];

function createStarfieldGeometry(count: number): THREE.BufferGeometry {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = 90 + Math.random() * 160;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const c = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
    if (!c) continue;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

export function Starfield({ count = 2600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    // Use deterministic seed based on count to avoid hydration mismatch
    const originalRandom = Math.random;
    let seed = count;
    Math.random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const geo = createStarfieldGeometry(count);
    Math.random = originalRandom;
    return geo;
  }, [count]);

  // Dispose starfield geometry/material on unmount.
  useEffect(() => {
    return () => disposeObject3D(ref.current);
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.007;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.7}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}
