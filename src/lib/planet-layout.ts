import type { Planet } from "../data/types.ts";
import {
  ORBIT_RADII,
  PLANET_SCALE,
  orbitRadius,
  planetOrbitRadius,
  planetOrbitInclination,
} from "../constants/layout.ts";
import { orbits } from "../data/orbits.ts";

export type PlanetLayout = {
  radius: number;
  phase: number;
  speed: number;
  inclination: number;
  size: number;
};

export function createPlanetLayout(planets: readonly Planet[]): Map<string, PlanetLayout> {
  const byOrbit = new Map<string, Planet[]>();
  for (const planet of planets) {
    const members = byOrbit.get(planet.orbit) ?? [];
    members.push(planet);
    byOrbit.set(planet.orbit, members);
  }

  return new Map(
    planets.map((planet) => {
      const members = byOrbit.get(planet.orbit);
      if (!members || members.length === 0) {
        throw new Error(`Planet ${planet.id} has no orbit members`);
      }
      const orbitIndex = orbits.findIndex((orbit) => orbit.id === planet.orbit);
      if (orbitIndex < 0 || orbitIndex >= ORBIT_RADII.length) {
        throw new Error(`Planet ${planet.id} references unknown orbit ${planet.orbit}`);
      }
      const baseRadius = orbitRadius(orbitIndex);
      const radius = planetOrbitRadius(orbitIndex);
      const memberIndex = members.findIndex((member) => member.id === planet.id);
      return [
        planet.id,
        {
          radius,
          phase: (memberIndex / members.length) * Math.PI * 2 + orbitIndex * 0.37,
          // Keep the existing angular cycle rate; spacing is a composition change,
          // not a new motion model.
          speed: 0.62 / baseRadius,
          inclination: planetOrbitInclination(orbitIndex),
          size: planet.size * PLANET_SCALE,
        },
      ];
    }),
  );
}
