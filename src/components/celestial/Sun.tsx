import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { identity } from "@/data/index";
import { useUniverseStore } from "@/hooks/useUniverse";
import { disposeObject3D } from "@/lib/three-dispose";
import {
  SUN_CORONA_RADIUS,
  SUN_LIGHT_DECAY,
  SUN_LIGHT_DISTANCE,
  SUN_LIGHT_INTENSITY,
  SUN_RADIUS,
} from "@/constants/universe";
import { ScreenLabel } from "@/components/shared/ScreenLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Sun() {
  const group = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const worldPosition = useRef(new THREE.Vector3());
  const light = useRef<THREE.PointLight>(null);
  const coreMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const haloMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const envelopeMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const { scene } = useThree();

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
    const deepSpaceDimming = scene.userData["deepSpaceDimming"] ?? 0;
    const sceneBrightness = THREE.MathUtils.lerp(1, 0.08, deepSpaceDimming);
    if (core.current) {
      if (!reducedMotion) {
        core.current.rotation.y = t * 0.08;
        const s = (active ? 1.12 : 1) + Math.sin(t * 1.4) * 0.015;
        core.current.scale.setScalar(s);
      }
      if (isFocused) {
        registerNode("sun", core.current.getWorldPosition(worldPosition.current));
      }
    }
    if (light.current) light.current.intensity = SUN_LIGHT_INTENSITY * sceneBrightness;
    if (coreMaterial.current) {
      coreMaterial.current.emissiveIntensity = (active ? 1.8 : 1.2) * sceneBrightness;
    }
    if (haloMaterial.current) haloMaterial.current.opacity = 0.1 * sceneBrightness;
    if (envelopeMaterial.current) envelopeMaterial.current.opacity = 0.08 * sceneBrightness;
    if (halo.current && !reducedMotion) halo.current.scale.setScalar(1 + Math.sin(t * 0.9) * 0.025);
  });

  return (
    <group ref={group}>
      <pointLight
        ref={light}
        intensity={SUN_LIGHT_INTENSITY}
        distance={SUN_LIGHT_DISTANCE}
        decay={SUN_LIGHT_DECAY}
        color="#ffd8a8"
      />
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
        <sphereGeometry args={[SUN_RADIUS, 64, 48]} />
        <meshStandardMaterial
          ref={coreMaterial}
          color="#ffb257"
          emissive="#ff9d3c"
          emissiveIntensity={active ? 1.8 : 1.2}
          roughness={0.42}
        />
      </mesh>
      <mesh ref={halo} raycast={() => null}>
        <sphereGeometry args={[SUN_CORONA_RADIUS, 48, 32]} />
        <meshBasicMaterial
          ref={haloMaterial}
          color="#ffb257"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh scale={1.18} raycast={() => null}>
        <sphereGeometry args={[SUN_RADIUS * 1.12, 48, 32]} />
        <meshBasicMaterial
          ref={envelopeMaterial}
          color="#ffd29a"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh scale={1.3} raycast={() => null}>
        <sphereGeometry args={[SUN_RADIUS * 1.08, 32, 24]} />
        <meshBasicMaterial
          color="#ff9d55"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.04} raycast={() => null}>
        <torusGeometry args={[SUN_RADIUS * 1.08, 0.035, 8, 96]} />
        <meshBasicMaterial
          color="#ffd6a3"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {(active || isFocused) && (
        <ScreenLabel position={[0, SUN_CORONA_RADIUS + 1.4, 0]} maxDistance={100}>
          <div className="text-center">
            <p className="label-mono text-accent">Identity Core</p>
            <p className="font-display text-lg font-semibold text-starlight">{identity.name}</p>
          </div>
        </ScreenLabel>
      )}
    </group>
  );
}
