import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { comet } from "@/data/comet";
import { useUniverseStore } from "@/hooks/useUniverse";
import { disposeObject3D } from "@/lib/three-dispose";
import { ScreenLabel } from "@/components/shared/ScreenLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  COMET_HOVER_HEIGHT,
  COMET_LAP_SECONDS,
  COMET_TAIL_OFFSET,
  COMET_TAIL_ROTATION,
  COMET_TRAIL_POINTS,
  COMET_TRAIL_SAMPLE_SECONDS,
} from "@/constants/cinematic";

export function Comet() {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();
  const particlesRef = useRef<THREE.Points>(null);
  const progress = useRef(0);
  const paused = useRef(false);
  const point = useRef(new THREE.Vector3());
  const tangent = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const trailSampleTime = useRef(0);
  const hovered = useUniverseStore((state) => state.hovered === "comet");
  const setHovered = useUniverseStore((state) => state.setHovered);

  const curve = useMemo(() => {
    const { a, b, center, rotation } = comet.ellipticalOrbit;
    const points: THREE.Vector3[] = [];
    const rotationMatrix = new THREE.Matrix4().makeRotationY(rotation);
    for (let i = 0; i < 128; i += 1) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * a,
          center[1] + Math.sin(angle * 2) * 18,
          Math.sin(angle) * b,
        )
          .applyMatrix4(rotationMatrix)
          .add(new THREE.Vector3(center[0], 0, center[2])),
      );
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  const trail = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COMET_TRAIL_POINTS * 3);
    const position = curve.getPointAt(0);
    for (let i = 0; i < COMET_TRAIL_POINTS; i += 1) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
    }
    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    // This small trail buffer is updated at a fixed cadence; signal that intent
    // to the renderer so drivers can choose an appropriate buffer upload path.
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", positionAttribute);
    return geometry;
  }, [curve]);

  const trailMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: comet.color,
        size: 0.9,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    const object = groupRef.current;
    return () => {
      document.body.style.cursor = "";
      disposeObject3D(object);
      trail.dispose();
      trailMaterial.dispose();
    };
  }, [trail, trailMaterial]);

  useEffect(() => {
    // The motion loop intentionally exits when reduced motion is enabled. Place
    // a fresh comet at the start of its authored path so it remains visible.
    if (!reducedMotion || progress.current !== 0 || !groupRef.current) return;
    curve.getPointAt(0, point.current);
    curve.getTangentAt(0, tangent.current).normalize();
    groupRef.current.position.copy(point.current);
    lookTarget.current.copy(point.current).add(tangent.current);
    groupRef.current.lookAt(lookTarget.current);
  }, [curve, reducedMotion]);

  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current || !particlesRef.current || paused.current) return;
    progress.current = (progress.current + delta / COMET_LAP_SECONDS) % 1;
    curve.getPointAt(progress.current, point.current);
    curve.getTangentAt(progress.current, tangent.current).normalize();
    groupRef.current.position.copy(point.current);
    lookTarget.current.copy(point.current).add(tangent.current);
    groupRef.current.lookAt(lookTarget.current);

    trailSampleTime.current += delta;
    if (trailSampleTime.current >= COMET_TRAIL_SAMPLE_SECONDS) {
      trailSampleTime.current %= COMET_TRAIL_SAMPLE_SECONDS;
      const positions = particlesRef.current.geometry.getAttribute("position");
      for (let i = COMET_TRAIL_POINTS - 1; i > 0; i -= 1) {
        positions.setXYZ(i, positions.getX(i - 1), positions.getY(i - 1), positions.getZ(i - 1));
      }
      positions.setXYZ(0, point.current.x, point.current.y, point.current.z);
      positions.needsUpdate = true;
    }
  });

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    paused.current = true;
    setHovered("comet");
    document.body.style.cursor = "pointer";
  };
  const handleOut = () => {
    paused.current = false;
    setHovered(null);
    document.body.style.cursor = "";
  };

  return (
    <group>
      <group ref={groupRef}>
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            window.open("https://github.com/Omran-Khaled", "_blank", "noopener,noreferrer");
          }}
          onPointerOver={handleOver}
          onPointerOut={handleOut}
        >
          <sphereGeometry args={[1.6, 24, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={comet.color}
            emissiveIntensity={hovered ? 4 : 2}
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>
        <mesh position={[0, 0, COMET_TAIL_OFFSET]} rotation={[COMET_TAIL_ROTATION, 0, 0]}>
          <coneGeometry args={[0.9, 6, 16]} />
          <meshBasicMaterial color={comet.color} transparent opacity={0.35} depthWrite={false} />
        </mesh>
      </group>
      <points ref={particlesRef} geometry={trail} material={trailMaterial} />
      {hovered && (
        <ScreenLabel position={[0, COMET_HOVER_HEIGHT, 0]} maxDistance={80}>
          <div className="glass-panel whitespace-nowrap rounded-full px-3 py-1 text-xs text-starlight">
            {comet.name}
          </div>
        </ScreenLabel>
      )}
    </group>
  );
}
