import assert from "node:assert/strict";
import test from "node:test";
import { validateData } from "./validation.ts";

function validBundle() {
  return {
    planets: [
      {
        id: "planet-one",
        name: "Planet One",
        orbit: "orbit-one",
        size: 1,
        color: "#fff",
        summary: "A valid test planet",
        level: "Learning",
        depth: [],
        evidence: "Test fixture only",
        moons: [],
      },
    ],
    galaxies: [
      {
        id: "galaxy-one",
        name: "Galaxy One",
        tagline: "Test project",
        color: "#fff",
        position: [0, 0, 0],
        year: "2026",
        role: "Developer",
        duration: "1 month",
        type: "Test",
        status: "Complete",
        stack: [],
        links: { demo: "/demo.mp4", github: "https://example.com/project" },
        metrics: [],
        features: [],
        challenges: [],
        layers: { problem: "Test", solution: "Test", decisions: [], impact: "Test" },
      },
    ],
    blackHole: { title: "Test", position: [0, 0, 0], intro: "Test", pillars: [], loop: [] },
    identity: {
      name: "Test Owner",
      role: "Developer",
      location: "Earth",
      headline: "Test identity",
      bio: "Test bio",
      fragments: [],
      stats: [],
      principles: [],
    },
    orbits: [{ id: "orbit-one", name: "Orbit One", color: "#fff" }],
    timeline: [{ id: "timeline-one", year: "2026", title: "Test", body: "Test", detail: "Test" }],
    languages: [{ name: "English", level: "Intermediate", strength: 0.5 }],
    contact: { title: "Contact", position: [0, 0, 0], lines: [], channels: [] },
    manifesto: [],
    comet: {
      id: "comet-one",
      name: "Test Comet",
      color: "#fff",
      message: "Test",
      ellipticalOrbit: { a: 3, b: 2, center: [0, 0, 0], rotation: 0 },
    },
  };
}

test("valid portfolio data passes all schemas and orbit references", () => {
  assert.doesNotThrow(() => validateData(validBundle()));
});

test("unknown planet orbit IDs fail before the portfolio can render", () => {
  const data = validBundle();
  data.planets[0]!.orbit = "missing-orbit";
  assert.throws(() => validateData(data), /Unknown orbit IDs: planet-one:missing-orbit/);
});

test("duplicate IDs within a collection fail validation", () => {
  const data = validBundle();
  data.planets.push({ ...data.planets[0]!, id: data.planets[0]!.id });
  assert.throws(() => validateData(data), /planets contains duplicate IDs: planet-one/);
});

test("invalid enum values fail schema validation", () => {
  const data = validBundle();
  data.planets[0]!.level = "Expert";
  assert.throws(() => validateData(data), /planets failed/);
});

test("missing required fields fail schema validation", () => {
  const data = validBundle();
  delete (data.identity as Partial<typeof data.identity>).headline;
  assert.throws(() => validateData(data), /identity failed/);
});
