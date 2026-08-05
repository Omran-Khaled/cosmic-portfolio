import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useUniverseStore } from "@/hooks/useUniverse";
import {
  DEFAULT_POS,
  DEFAULT_TARGET,
  ORIGIN,
  UP_AXIS,
  FOCUS_DISTANCE,
  DRIFT_SPEED,
  DRIFT_RADIUS,
  DRIFT_BREATH_AMP,
  DRIFT_Y_BASE,
  DRIFT_Y_BREATH_AMP,
  DRIFT_Y_FREQ,
  DRIFT_FREQ,
  SWING_SPEED,
  SWING_AMPLITUDE,
  VERTICAL_OFFSET_RATIO,
  WARP_DISTANCE_MULTIPLIER,
  WARP_FOV_BOOST,
  WARP_DECAY_RATE,
  TRANSITION_SPEED_BASE,
  TRANSITION_SPEED_FACTOR,
  TRANSITION_SPEED_MAX,
  TARGET_LERP_SPEED,
  MIN_DIRECTION_LENGTH_SQ,
  DEFAULT_DIRECTION,
} from "@/constants/camera";

type OrbitControlsLike = { target: THREE.Vector3; update: () => void };

/**
 * Cinematic camera: eases toward the focused body, keeps a slow free drift while
 * exploring, and punches the field of view on every warp for a sense of travel.
 */
export function CameraRig({ controls }: { controls: React.RefObject<OrbitControlsLike | null> }) {
  const { camera } = useThree();
  const focus = useUniverseStore((s) => s.focus);
  const nodes = useUniverseStore((s) => s.nodes);
  const autoOrbit = useUniverseStore((s) => s.autoOrbit);
  const warpAt = useUniverseStore((s) => s.warpAt);
  const desiredPos = useRef(DEFAULT_POS.clone());
  const desiredTarget = useRef(DEFAULT_TARGET.clone());
  const drift = useRef(0);
  const lastWarp = useRef(0);
  const warpEnergy = useRef(0);
  const baseFov = useRef<number | null>(null);
  const nodePosition = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const verticalOffset = useRef(new THREE.Vector3());

  useFrame(({ clock }, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    if (baseFov.current === null && cam.isPerspectiveCamera) baseFov.current = cam.fov;

    // Warp impulse whenever the destination changes.
    if (warpAt !== lastWarp.current) {
      lastWarp.current = warpAt;
      warpEnergy.current = 1;
    }
    warpEnergy.current = THREE.MathUtils.damp(warpEnergy.current, 0, WARP_DECAY_RATE, delta);

    if (focus) {
      const node = focus.kind === "orbits" ? ORIGIN : nodes.get(focus.id);
      if (node) {
        const dist = FOCUS_DISTANCE[focus.kind] ?? 14;
        direction.current.copy(node).normalize();
        if (direction.current.lengthSq() < MIN_DIRECTION_LENGTH_SQ)
          direction.current.copy(DEFAULT_DIRECTION);
        // Slow parallax swing around the focused body — never a static frame.
        if (autoOrbit) {
          const swing = clock.getElapsedTime() * SWING_SPEED;
          direction.current.applyAxisAngle(UP_AXIS, Math.sin(swing) * SWING_AMPLITUDE);
        }
        desiredTarget.current.copy(node);
        nodePosition.current.copy(node);
        verticalOffset.current.set(0, dist * VERTICAL_OFFSET_RATIO, 0);
        desiredPos.current
          .copy(nodePosition.current)
          .add(
            direction.current.multiplyScalar(
              dist * (1 + warpEnergy.current * WARP_DISTANCE_MULTIPLIER),
            ),
          )
          .add(verticalOffset.current);
      }
    } else if (!autoOrbit) {
      // Fully manual: hand the camera over to OrbitControls, no override at all.
      const ctrlFree = controls.current;
      if (ctrlFree) {
        ctrlFree.update();
      }
      return;
    } else {
      // Free roam: a wide, slowly breathing establishing shot.
      drift.current += delta * DRIFT_SPEED;
      const r = DRIFT_RADIUS + Math.sin(clock.getElapsedTime() * DRIFT_FREQ) * DRIFT_BREATH_AMP;
      desiredPos.current.set(
        Math.sin(drift.current) * r,
        DRIFT_Y_BASE + Math.sin(clock.getElapsedTime() * DRIFT_Y_FREQ) * DRIFT_Y_BREATH_AMP,
        Math.cos(drift.current) * r,
      );
      desiredTarget.current.copy(DEFAULT_TARGET);
    }

    // Distance-aware easing: long jumps accelerate, arrivals settle softly.
    const gap = camera.position.distanceTo(desiredPos.current);
    const speed = THREE.MathUtils.clamp(
      TRANSITION_SPEED_BASE + gap * TRANSITION_SPEED_FACTOR,
      TRANSITION_SPEED_BASE,
      TRANSITION_SPEED_MAX,
    );
    camera.position.lerp(desiredPos.current, 1 - Math.exp(-speed * delta));

    if (cam.isPerspectiveCamera && baseFov.current !== null) {
      const targetFov = baseFov.current + warpEnergy.current * WARP_FOV_BOOST;
      cam.fov += (targetFov - cam.fov) * Math.min(1, delta * 6);
      cam.updateProjectionMatrix();
    }

    // Update OrbitControls target, but let OrbitControls handle its own update() call.
    const ctrl = controls.current;
    if (ctrl) {
      ctrl.target.lerp(desiredTarget.current, 1 - Math.exp(-TARGET_LERP_SPEED * delta));
    } else {
      camera.lookAt(desiredTarget.current);
    }
  });

  return null;
}
