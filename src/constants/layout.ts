import type { Vec3 } from "@/data/types";

export const ORBIT_RADII = [17, 28, 39, 50, 61, 72] as const;
/** Expands the planet display system while preserving the authored base radii. */
export const PLANET_ORBIT_SPACING_SCALE = 1.36;
export const PLANET_ORBIT_INCLINATION_STEP = 0.025;
export const PLANET_SCALE = 1.95;
export const PLANET_OVERVIEW_SCALE = 1.25;
export const GALAXY_RADIUS = 112;
export const STATION_RADIUS = 100;
export const BLACK_HOLE_RADIUS = 145;
export const CONSTELLATION_RADIUS = 150;
export const OUTER_STAR_INNER_RADIUS = 600;
export const OUTER_STAR_SPREAD = 500;

export const polarXZ = (radius: number, degrees: number, y: number): Vec3 => {
  const angle = (degrees * Math.PI) / 180;
  return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
};

export const orbitRadius = (orbitIndex: number): number => {
  const radius = ORBIT_RADII[orbitIndex];
  if (radius === undefined) {
    throw new Error(`Unknown orbit index: ${orbitIndex}`);
  }
  return radius;
};

/** Shared display radius for both planet motion and its decorative orbit ring. */
export const planetOrbitRadius = (orbitIndex: number): number =>
  orbitRadius(orbitIndex) * PLANET_ORBIT_SPACING_SCALE;

/** Shared inclination for the live planet path and the decorative orbit ring. */
export const planetOrbitInclination = (orbitIndex: number): number =>
  (orbitIndex - (ORBIT_RADII.length - 1) / 2) * PLANET_ORBIT_INCLINATION_STEP;
