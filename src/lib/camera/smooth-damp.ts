/**
 * Frame-rate independent critically-damped smoothDamp (Unity-style).
 * No allocations. All state lives in the caller's ref.
 * Uses only module-level scratch vectors.
 */
import * as THREE from "three";

const _change = new THREE.Vector3();
const _blend = new THREE.Vector3();
const _next = new THREE.Vector3();

export interface SmoothDampState {
  current: THREE.Vector3;
  velocity: THREE.Vector3;
}

/**
 * Smoothly damp `state.current` toward `target` over `delta` seconds using
 * critical damping. Mutates `state` in place and returns `state.current`.
 *
 * @param state - Mutable state { current, velocity }.
 * @param target - Target position (never mutated).
 * @param smoothTime - Approximate time to reach target (seconds).
 * @param delta - Delta time (seconds).
 * @param maxSpeed - Optional speed clamp (units/second).
 */
export function smoothDamp(
  state: SmoothDampState,
  target: THREE.Vector3,
  smoothTime: number,
  delta: number,
  maxSpeed = Infinity,
): THREE.Vector3 {
  const clampedTime = Math.max(0.0001, smoothTime);
  const omega = 2 / clampedTime;
  const x = omega * delta;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  // change = target - current (scratch, no allocation)
  _change.copy(target).sub(state.current);

  // Clamp the requested travel distance so we never overshoot at huge deltas.
  let maxChange = maxSpeed * clampedTime;
  if (maxChange < Infinity) {
    const mag = _change.length();
    if (mag > maxChange && mag > 0) {
      _change.multiplyScalar(maxChange / mag);
    }
  } else {
    maxChange = Infinity;
  }

  // temp = (velocity + omega * change) * delta  → blended velocity term
  _blend.copy(state.velocity).addScaledVector(_change, omega).multiplyScalar(delta);

  // velocity = (velocity - omega * temp) * exp
  state.velocity.addScaledVector(_blend, -omega).multiplyScalar(exp);

  // next = current + (change + temp) * exp
  _next
    .copy(state.current)
    .add(_change)
    .add(_blend)
    .sub(state.current)
    .multiplyScalar(exp)
    .add(state.current);

  // Enforce max speed on the position step itself.
  if (maxChange < Infinity) {
    _change.copy(_next).sub(state.current);
    const step = _change.length();
    const maxStep = maxSpeed * delta;
    if (step > maxStep && step > 0) {
      _change.multiplyScalar(maxStep / step);
      state.current.add(_change);
    } else {
      state.current.copy(_next);
    }
  } else {
    state.current.copy(_next);
  }

  return state.current;
}
