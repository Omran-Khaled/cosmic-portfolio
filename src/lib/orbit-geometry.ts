import type { Vector3 } from "three";

/** Write a body's center onto the same X-axis-inclined XZ plane as its orbit ring. */
export function setInclinedOrbitPosition(
  target: Vector3,
  radius: number,
  phase: number,
  inclination: number,
): void {
  const x = Math.cos(phase) * radius;
  const z = Math.sin(phase) * radius;
  target.set(x, -z * Math.sin(inclination), z * Math.cos(inclination));
}
