import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useUniverseStore } from "@/hooks/useUniverse";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  ORIGIN,
  WARP_FOV_BOOST,
  WARP_DECAY_RATE,
  DEEP_SPACE_DIMMING_START,
  DEEP_SPACE_DIMMING_END,
} from "@/constants/camera";
import { CameraDirector, type DirectorInput } from "@/lib/camera/camera-director";

type OrbitControlsLike = { target: THREE.Vector3; update: () => void };

const seededTarget = new THREE.Vector3();
const viewDirection = new THREE.Vector3();

/**
 * Thin R3F hook over CameraDirector. The director is the single owner of the
 * camera during programmatic moves; OrbitControls only drives the camera in
 * the "user" state. No per-frame allocations.
 */
export function CameraRig({
  controls,
  autoDrift,
}: {
  controls: React.RefObject<OrbitControlsLike | null>;
  autoDrift: boolean;
}) {
  const { camera, scene, clock, gl } = useThree();
  const focus = useUniverseStore((s) => s.focus);
  const nodes = useUniverseStore((s) => s.nodes);
  const introOpen = useUniverseStore((s) => s.introOpen);
  const userDriving = useUniverseStore((s) => s.userDriving);
  const setUserDriving = useUniverseStore((s) => s.setUserDriving);
  const warpAt = useUniverseStore((s) => s.warpAt);
  const reducedMotion = useReducedMotion();

  const director = useRef<CameraDirector>(new CameraDirector());
  const cam = camera as THREE.PerspectiveCamera;
  const baseFov = useRef<number | null>(null);
  const warpEnergy = useRef(0);
  const lastWarp = useRef(0);
  const lastIntro = useRef(false);
  const lastFocusId = useRef<string | null>(null);
  const lastNavigation = useRef(0);
  const directorInput = useRef<DirectorInput | null>(null);

  if (directorInput.current === null) {
    directorInput.current = {
      focus: null,
      nodes,
      panelOpen: false,
      userDriving: false,
      autoDrift,
      time: 0,
      delta: 0,
      reducedMotion,
    };
  }

  useEffect(() => {
    if (baseFov.current === null && cam.isPerspectiveCamera) baseFov.current = cam.fov;
  }, [cam]);

  useEffect(() => {
    const canvas = gl.domElement;
    let releaseTimer: number | null = null;
    const handleWheel = () => {
      setUserDriving(true);
      if (releaseTimer !== null) window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        setUserDriving(false);
        releaseTimer = null;
      }, 320);
    };

    canvas.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      if (releaseTimer !== null) window.clearTimeout(releaseTimer);
    };
  }, [gl, setUserDriving]);

  useEffect(() => {
    if (!userDriving) return;
    director.current.interrupt();
    const ctrl = controls.current;
    if (ctrl) {
      const distance = camera.position.distanceTo(ctrl.target);
      camera.getWorldDirection(viewDirection);
      seededTarget.copy(camera.position).addScaledVector(viewDirection, Math.max(distance, 1));
      ctrl.target.copy(seededTarget);
      ctrl.update();
    }
    director.current.syncExternal(camera.position, ctrl?.target ?? seededTarget, cam.fov);
  }, [cam, camera, controls, userDriving]);

  // Intro fly-in on dismiss.
  useEffect(() => {
    if (lastIntro.current === introOpen) return;
    lastIntro.current = introOpen;
    if (!introOpen) {
      director.current.startIntro(clock.getElapsedTime());
    }
  }, [clock, introOpen]);

  // Focus changes always preempt user control (fixes C3).
  useEffect(() => {
    const time = clock.getElapsedTime();
    if (!focus) {
      if (lastFocusId.current !== null || lastNavigation.current !== warpAt) {
        director.current.returnHome(time);
      }
      lastFocusId.current = null;
      lastNavigation.current = warpAt;
      setUserDriving(false);
      return;
    }
    if (lastFocusId.current === focus.id) return;
    lastFocusId.current = focus.id;
    setUserDriving(false);
    director.current.setFocus(focus, nodes, true, time);
  }, [clock, focus, nodes, setUserDriving, warpAt]);

  useFrame(({ clock }, delta) => {
    if (baseFov.current === null && cam.isPerspectiveCamera) baseFov.current = cam.fov;

    // Warp impulse whenever the destination changes.
    if (warpAt !== lastWarp.current) {
      lastWarp.current = warpAt;
      warpEnergy.current = 1;
    }
    warpEnergy.current = THREE.MathUtils.damp(warpEnergy.current, 0, WARP_DECAY_RATE, delta);
    scene.userData["warpEnergy"] = warpEnergy.current;

    // Deep-space dimming from actual camera-to-origin distance (not desiredTarget).
    const distFromOrigin = camera.position.distanceTo(ORIGIN);
    const deepSpaceDimming = THREE.MathUtils.clamp(
      (distFromOrigin - DEEP_SPACE_DIMMING_START) /
        Math.max(DEEP_SPACE_DIMMING_END - DEEP_SPACE_DIMMING_START, 1),
      0,
      1,
    );
    scene.userData["deepSpaceDimming"] = deepSpaceDimming;

    // Build director input and advance the state machine.
    const input = directorInput.current;
    if (!input) return;
    input.focus = focus;
    input.nodes = nodes;
    input.panelOpen = focus !== null;
    input.autoDrift = autoDrift;
    input.userDriving = userDriving;
    input.time = clock.getElapsedTime();
    input.delta = delta;
    input.reducedMotion = reducedMotion;

    // In default free flight, OrbitControls is the sole camera owner. This
    // prevents the director from overwriting wheel zoom or pan on the next frame.
    if (!focus && !autoDrift && !userDriving && director.current.getState() === "user") {
      const target = controls.current?.target;
      if (target) director.current.syncExternal(camera.position, target, cam.fov);
      return;
    }

    if (userDriving) {
      const target = controls.current?.target;
      if (target) director.current.syncExternal(camera.position, target, cam.fov);
    }

    const output = director.current.update(input);
    const pose = output.pose;

    // Apply pose to camera.
    camera.position.copy(pose.position);
    camera.lookAt(pose.target);

    if (cam.isPerspectiveCamera && baseFov.current !== null) {
      const travelDistance = camera.position.distanceTo(pose.target);
      const lensBreath = THREE.MathUtils.clamp((travelDistance - 80) / 300, -1, 1) * 4;
      const warpBoost = warpEnergy.current * WARP_FOV_BOOST;
      const targetFov = THREE.MathUtils.clamp(
        baseFov.current + lensBreath + warpBoost,
        baseFov.current - 2,
        baseFov.current + 10,
      );
      // Rebuild the projection matrix only when the FOV change is visually
      // meaningful. Keeping the prior FOV until the threshold is crossed lets
      // small per-frame changes accumulate instead of being lost.
      if (Math.abs(targetFov - cam.fov) >= 0.02) {
        cam.fov = targetFov;
        cam.updateProjectionMatrix();
      }
    }

    // OrbitControls: only owns the camera in "user" state.
    const ctrl = controls.current;
    if (ctrl) {
      if (output.state === "user") {
        ctrl.target.copy(pose.target);
        ctrl.update();
      }
      // When the director drives, we skip ctrl.update() so OrbitControls
      // does not fight the move.
    }
  });

  return null;
}
