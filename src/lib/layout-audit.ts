import * as THREE from "three";

export type LayoutBody = { id: string; position: THREE.Vector3; radius: number };

export function auditLayout(
  bodies: readonly LayoutBody[],
  outerOrbitRadius: number,
  safetyMargin = 2,
): string[] {
  const warnings: string[] = [];
  for (let i = 0; i < bodies.length; i += 1) {
    const body = bodies[i];
    if (!body || !Number.isFinite(body.radius) || body.radius < 0) {
      warnings.push(`Invalid layout body at index ${i}`);
      continue;
    }
    if (
      body.id !== "sun" &&
      body.position.length() + body.radius > outerOrbitRadius + safetyMargin
    ) {
      warnings.push(`${body.id} exceeds the outer orbit boundary`);
    }
    for (let j = i + 1; j < bodies.length; j += 1) {
      const other = bodies[j];
      if (!other) continue;
      const distance = body.position.distanceTo(other.position);
      if (distance < body.radius + other.radius + safetyMargin) {
        warnings.push(
          `${body.id} and ${other.id} overlap: ${distance.toFixed(2)} < ${(body.radius + other.radius + safetyMargin).toFixed(2)}`,
        );
      }
    }
  }
  return warnings;
}
