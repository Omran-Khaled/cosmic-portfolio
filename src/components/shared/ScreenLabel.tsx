import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { LABEL_FADE_DISTANCE } from "@/constants/cinematic";

type ScreenLabelProps = {
  children: React.ReactNode;
  position?: [number, number, number];
  maxDistance?: number;
  minDistance?: number;
};

export function ScreenLabel({
  children,
  position = [0, 0, 0],
  maxDistance = LABEL_FADE_DISTANCE,
  minDistance = 0,
}: ScreenLabelProps) {
  const wrapper = useRef<THREE.Group>(null);
  const element = useRef<HTMLDivElement>(null);
  const camera = useThree((state) => state.camera);
  const worldPosition = useRef(new THREE.Vector3());
  const lastOpacity = useRef<number | null>(null);

  useFrame(() => {
    if (!element.current || !wrapper.current) return;
    wrapper.current.getWorldPosition(worldPosition.current);
    const distance = camera.position.distanceTo(worldPosition.current);
    const opacity = THREE.MathUtils.clamp(
      (maxDistance - distance) / Math.max(maxDistance - minDistance, 1),
      0,
      1,
    );
    if (lastOpacity.current === null || Math.abs(lastOpacity.current - opacity) >= 0.005) {
      element.current.style.opacity = String(opacity);
      lastOpacity.current = opacity;
    }
  });

  return (
    <group ref={wrapper}>
      <Html center position={position} style={{ pointerEvents: "none" }}>
        <div ref={element} className="pointer-events-none select-none whitespace-nowrap">
          {children}
        </div>
      </Html>
    </group>
  );
}
