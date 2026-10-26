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
import { comet } from "./comet";
import { validateData } from "./validation";

const portfolioData = {
  identity,
  contact,
  orbits,
  planets,
  galaxies,
  blackHole,
  timeline,
  languages,
  manifesto,
  comet,
};

// Fail at the data boundary instead of rendering an invalid destination graph.
validateData(portfolioData);

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
  comet,
};
