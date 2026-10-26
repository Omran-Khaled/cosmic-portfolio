import assert from "node:assert/strict";
import test from "node:test";
import { planets } from "../data/planets.ts";
import { orbits } from "../data/orbits.ts";
import {
  CONSTELLATION_RADIUS,
  ORBIT_RADII,
  PLANET_ORBIT_SPACING_SCALE,
  PLANET_OVERVIEW_SCALE,
  planetOrbitInclination,
  planetOrbitRadius,
} from "../constants/layout.ts";
import { SEMANTIC_SCALE_MAX } from "../constants/cinematic.ts";
import { createPlanetLayout } from "./planet-layout.ts";

test("display orbit radii use one shared spacing scale", () => {
  for (let index = 0; index < ORBIT_RADII.length; index += 1) {
    assert.equal(planetOrbitRadius(index), ORBIT_RADII[index]! * PLANET_ORBIT_SPACING_SCALE);
    assert.ok(planetOrbitRadius(index) > (ORBIT_RADII[index] ?? 0));
  }
});

test("all configured planets align with their orbit rings", () => {
  const layout = createPlanetLayout(planets);
  for (const planet of planets) {
    const orbitIndex = orbits.findIndex((orbit) => orbit.id === planet.orbit);
    const planetLayout = layout.get(planet.id);
    assert.ok(planetLayout, `${planet.id} should have a computed layout`);
    assert.ok(orbitIndex >= 0, `${planet.id} should reference a known orbit`);
    assert.equal(planetLayout.radius, planetOrbitRadius(orbitIndex));
    assert.equal(planetLayout.inclination, planetOrbitInclination(orbitIndex));
    assert.equal(planetLayout.speed, 0.62 / (ORBIT_RADII[orbitIndex] ?? 1));
  }
});

test("planet and moon envelopes remain inside the scene layout boundary", () => {
  const layout = createPlanetLayout(planets);
  const maximumGroupScale = PLANET_OVERVIEW_SCALE * (1 + (SEMANTIC_SCALE_MAX - 1) * 0.55);

  for (const planet of planets) {
    const planetLayout = layout.get(planet.id);
    assert.ok(planetLayout, `${planet.id} should have a computed layout`);
    const outerMoonIndex = Math.max(0, planet.moons.length - 1);
    const outerMoonDistance = planetLayout.size * (2.2 + outerMoonIndex * 0.9);
    const moonVerticalTravel = planetLayout.size * 0.5;
    const moonRadius = Math.max(planetLayout.size * 0.3, 0.22);
    const moonEnvelope = Math.hypot(outerMoonDistance, moonVerticalTravel) + moonRadius;
    const fullEnvelope = Math.max(planetLayout.size, moonEnvelope) * maximumGroupScale;

    assert.ok(
      planetLayout.radius + fullEnvelope < CONSTELLATION_RADIUS,
      `${planet.id} and its moons should remain within the scene layout boundary`,
    );
  }
});
