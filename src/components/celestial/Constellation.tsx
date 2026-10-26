import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { timeline } from "@/data/index";
import { disposeObject3D } from "@/lib/three-dispose";
import { CONSTELLATION_RADIUS } from "@/constants/layout";
import { CONSTELLATION_REVEAL_DISTANCE } from "@/constants/cinematic";
import { ScreenLabel } from "@/components/shared/ScreenLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function ConstellationLabel({
  point,
  entry,
}: {
  point: THREE.Vector3;
  entry: (typeof timeline)[number];
}) {
  const camera = useThree((state) => state.camera);
  const details = useRef<HTMLDivElement>(null);
  const wasVisible = useRef<boolean | null>(null);
  const revealDistanceSquared = CONSTELLATION_REVEAL_DISTANCE * CONSTELLATION_REVEAL_DISTANCE;

  useFrame(() => {
    const element = details.current;
    if (!element) return;
    const visible = camera.position.distanceToSquared(point) < revealDistanceSquared;
    if (wasVisible.current === visible) return;
    element.style.visibility = visible ? "visible" : "hidden";
    wasVisible.current = visible;
  });

  return (
    <ScreenLabel position={[0, 2, 0]} maxDistance={CONSTELLATION_RADIUS + 160}>
      <div className="timeline-cosmic-label animate-timeline-glow pointer-events-none w-44 text-center">
        <p className="label-mono text-primary">{entry.year}</p>
        <div ref={details} style={{ visibility: "hidden" }}>
          <p className="font-display text-sm font-semibold text-starlight">{entry.title}</p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{entry.body}</p>
        </div>
      </div>
    </ScreenLabel>
  );
}

const points = timeline.map(
  (_, i) =>
    new THREE.Vector3(
      Math.cos(((285 + i * 10) * Math.PI) / 180) * CONSTELLATION_RADIUS,
      60 + Math.sin(i * 0.8) * 3,
      Math.sin(((285 + i * 10) * Math.PI) / 180) * CONSTELLATION_RADIUS,
    ),
);

export function Constellation() {
  const group = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), []);
  const lines = useMemo(() => {
    const dimLine = new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({ color: "#67e8f9", transparent: true, opacity: 0.22 }),
    );
    const highlightLine = new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({ color: "#d9faff", transparent: true, opacity: 0.62 }),
    );
    // These decorative connections should never intercept canvas interaction.
    dimLine.raycast = () => {};
    highlightLine.raycast = () => {};
    return [dimLine, highlightLine] as const;
  }, [lineGeometry]);

  // Dispose the shared geometry and both materials exactly once on unmount.
  useEffect(() => {
    const groupObj = group.current;
    return () => disposeObject3D(groupObj);
  }, []);

  useFrame(({ clock }) => {
    if (group.current && !reducedMotion) {
      group.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.6;
    }
  });

  return (
    <group ref={group}>
      <primitive object={lines[0]} />
      <primitive object={lines[1]} />
      {timeline.map((entry, i) => {
        const point = points[i];
        if (!point) return null;
        return (
          <group key={`${entry.year}-${i}`} position={point}>
            <mesh raycast={() => null}>
              <sphereGeometry args={[0.72, 24, 24]} />
              <meshStandardMaterial
                color="#e0f2fe"
                emissive="#67e8f9"
                emissiveIntensity={2.4}
                roughness={0.3}
              />
            </mesh>
            <mesh scale={1.8} raycast={() => null}>
              <sphereGeometry args={[0.72, 16, 16]} />
              <meshBasicMaterial color="#67e8f9" transparent opacity={0.08} side={THREE.BackSide} />
            </mesh>
            <ConstellationLabel point={point} entry={entry} />
          </group>
        );
      })}
    </group>
  );
}
