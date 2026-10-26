/**
 * Pure easing functions. No allocations, no dependencies.
 * All functions accept a normalized progress t in [0, 1] and return [0, 1].
 */

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

/**
 * Clamp a value to [min, max] without allocating.
 */
export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}
