export * from "./types";

import { identity } from "./identity";
import { contact } from "./contact";
import { orbits } from "./orbits";
import { planets } from "./planets";
import { galaxies, storyStops } from "./galaxies";
import { blackHole } from "./blackhole";
import { timeline } from "./timeline";
import { languages } from "./languages";
import { manifesto } from "./manifesto";

export {
  identity,
  contact,
  orbits,
  planets,
  galaxies,
  blackHole,
  timeline,
  languages,
  manifesto,
  storyStops,
};

// Runtime validation — Zod schemas ensure data integrity before any component renders.
import { validateData, isIdentity, isPlanet, isGalaxy, isBlackHole } from "./validation";

if (import.meta.env.DEV) {
  // Full-bundle check: throws with a per-field error report on any mismatch.
  validateData({
    identity,
    contact,
    orbits,
    planets,
    galaxies,
    blackHole,
    timeline,
    languages,
    manifesto,
  });

  // Backwards-compatible guard drift check (cheap, whole-bundle catch above is authoritative).
  if (
    !isIdentity(identity) ||
    !planets.every(isPlanet) ||
    !galaxies.every(isGalaxy) ||
    !isBlackHole(blackHole) ||
    !isIdentity(identity)
  ) {
    console.error("[validation] Data integrity violation detected");
  }
}
