import type { Comet } from "./types";

/** The ellipse is the only trajectory definition consumed by the renderer. */
export const comet: Comet = {
  id: "halley",
  name: "Omran's Comet",
  color: "#00ffff",
  message: "Explore the cosmic portfolio — hover to pause, click to visit GitHub!",
  ellipticalOrbit: {
    a: 250,
    b: 205,
    center: [0, 30, 0],
    rotation: Math.PI / 6,
  },
};
