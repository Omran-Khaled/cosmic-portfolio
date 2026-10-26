import assert from "node:assert/strict";
import test from "node:test";
import { planets } from "../data/planets.ts";
import {
  getPlanetVisualProfile,
  hasPlanetVisualProfile,
  type PlanetSurfaceKind,
} from "./planet-visual-profile.ts";

const VALID_SURFACES = new Set<PlanetSurfaceKind>([
  "banded",
  "cratered",
  "oceanic",
  "icy",
  "crystalline",
  "volcanic",
]);

test("every existing planet has an explicit visual profile", () => {
  for (const planet of planets) {
    assert.equal(hasPlanetVisualProfile(planet.id), true, `${planet.id} needs a visual profile`);
    const profile = getPlanetVisualProfile(planet.id);
    assert.ok(VALID_SURFACES.has(profile.surface), `${planet.id} has an unknown surface style`);
    assert.ok(profile.roughness >= 0 && profile.roughness <= 1);
    assert.ok(profile.metalness >= 0 && profile.metalness <= 1);
    assert.ok(profile.bumpStrength >= 0 && profile.bumpStrength <= 0.06);
    assert.ok(profile.atmosphereOpacity >= 0 && profile.atmosphereOpacity <= 0.18);
  }
});

test("surface styles are visibly varied rather than a single color treatment", () => {
  const styles = new Set(planets.map((planet) => getPlanetVisualProfile(planet.id).surface));
  assert.equal(styles.size, 6);
});

test("expensive secondary silhouettes remain limited to protect the draw-call budget", () => {
  const ringed = planets.filter((planet) => getPlanetVisualProfile(planet.id).rings);
  const atmospheric = planets.filter((planet) => getPlanetVisualProfile(planet.id).atmosphere);
  assert.equal(ringed.length, 2);
  assert.ok(atmospheric.length <= 6);
});

test("unknown planet ids fall back to a conservative, effect-free profile", () => {
  const profile = getPlanetVisualProfile("unknown-legacy-id");
  assert.equal(profile.surface, "cratered");
  assert.equal(profile.atmosphere, false);
  assert.equal(profile.rings, false);
});
