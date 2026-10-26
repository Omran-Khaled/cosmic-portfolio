/**
 * Quadratic Bézier sampling with zero allocations per call.
 * Reuses a single scratch vector so callers never allocate in useFrame.
 */
import * as THREE from "three";
import { clamp } from "./easing.ts";

const _scratch = new THREE.Vector3();

/**
 * Sample a quadratic Bézier at normalized time t in [0, 1].
 * Result is written into `out` (default: shared scratch) and returned.
 */
export function sampleQuadraticBezier(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  t: number,
  out?: THREE.Vector3,
): THREE.Vector3 {
  const result = out ?? _scratch;
  const ct = clamp(t, 0, 1);
  const oneMinusCt = 1 - ct;
  const x = oneMinusCt * oneMinusCt * p0.x + 2 * oneMinusCt * ct * p1.x + ct * ct * p2.x;
  const y = oneMinusCt * oneMinusCt * p0.y + 2 * oneMinusCt * ct * p1.y + ct * ct * p2.y;
  const z = oneMinusCt * oneMinusCt * p0.z + 2 * oneMinusCt * ct * p1.z + ct * ct * p2.z;
  return result.set(x, y, z);
}
