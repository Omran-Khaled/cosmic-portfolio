/**
 * Lightweight visual identities for the existing portfolio planets.
 * These affect rendering only; ids, data, selection and navigation stay unchanged.
 */
export type PlanetSurfaceKind =
  "banded" | "cratered" | "oceanic" | "icy" | "crystalline" | "volcanic";

export type PlanetVisualProfile = {
  surface: PlanetSurfaceKind;
  roughness: number;
  metalness: number;
  bumpStrength: number;
  atmosphere: boolean;
  atmosphereOpacity: number;
  rings: boolean;
};

const DEFAULT_PROFILE: PlanetVisualProfile = {
  surface: "cratered",
  roughness: 0.82,
  metalness: 0.025,
  bumpStrength: 0.035,
  atmosphere: false,
  atmosphereOpacity: 0,
  rings: false,
};

const PROFILES: Record<string, PlanetVisualProfile> = {
  "react-ecosystem": {
    surface: "oceanic",
    roughness: 0.68,
    metalness: 0.025,
    bumpStrength: 0.024,
    atmosphere: true,
    atmosphereOpacity: 0.115,
    rings: false,
  },
  "mern-stack": {
    surface: "banded",
    roughness: 0.74,
    metalness: 0.02,
    bumpStrength: 0.032,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: true,
  },
  typescript: {
    surface: "cratered",
    roughness: 0.9,
    metalness: 0.015,
    bumpStrength: 0.052,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: false,
  },
  "next-js": {
    surface: "icy",
    roughness: 0.43,
    metalness: 0.055,
    bumpStrength: 0.026,
    atmosphere: true,
    atmosphereOpacity: 0.105,
    rings: false,
  },
  "node-express": {
    surface: "banded",
    roughness: 0.78,
    metalness: 0.02,
    bumpStrength: 0.03,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: true,
  },
  "mongodb-backend": {
    surface: "cratered",
    roughness: 0.86,
    metalness: 0.025,
    bumpStrength: 0.05,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: false,
  },
  nestjs: {
    surface: "volcanic",
    roughness: 0.84,
    metalness: 0.025,
    bumpStrength: 0.043,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: false,
  },
  "fullstack-integration": {
    surface: "oceanic",
    roughness: 0.64,
    metalness: 0.035,
    bumpStrength: 0.024,
    atmosphere: true,
    atmosphereOpacity: 0.12,
    rings: false,
  },
  "tailwind-css": {
    surface: "crystalline",
    roughness: 0.38,
    metalness: 0.1,
    bumpStrength: 0.027,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: false,
  },
  "design-systems": {
    surface: "oceanic",
    roughness: 0.6,
    metalness: 0.04,
    bumpStrength: 0.022,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: false,
  },
  "state-management": {
    surface: "volcanic",
    roughness: 0.86,
    metalness: 0.015,
    bumpStrength: 0.048,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: false,
  },
  "rest-apis": {
    surface: "banded",
    roughness: 0.76,
    metalness: 0.02,
    bumpStrength: 0.028,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: false,
  },
  "git-workflows": {
    surface: "cratered",
    roughness: 0.9,
    metalness: 0.02,
    bumpStrength: 0.05,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: false,
  },
  accessibility: {
    surface: "icy",
    roughness: 0.46,
    metalness: 0.045,
    bumpStrength: 0.024,
    atmosphere: true,
    atmosphereOpacity: 0.115,
    rings: false,
  },
  performance: {
    surface: "cratered",
    roughness: 0.88,
    metalness: 0.025,
    bumpStrength: 0.046,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: false,
  },
  "python-fundamentals": {
    surface: "crystalline",
    roughness: 0.42,
    metalness: 0.075,
    bumpStrength: 0.026,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: false,
  },
  "three-js-webgl": {
    surface: "volcanic",
    roughness: 0.78,
    metalness: 0.045,
    bumpStrength: 0.04,
    atmosphere: true,
    atmosphereOpacity: 0.105,
    rings: false,
  },
  "react-native-mobile": {
    surface: "oceanic",
    roughness: 0.64,
    metalness: 0.035,
    bumpStrength: 0.022,
    atmosphere: true,
    atmosphereOpacity: 0.12,
    rings: false,
  },
  "vite-modern-tooling": {
    surface: "icy",
    roughness: 0.47,
    metalness: 0.035,
    bumpStrength: 0.025,
    atmosphere: false,
    atmosphereOpacity: 0,
    rings: false,
  },
};

export function getPlanetVisualProfile(id: string): PlanetVisualProfile {
  return PROFILES[id] ?? DEFAULT_PROFILE;
}

export function hasPlanetVisualProfile(id: string): boolean {
  return Object.hasOwn(PROFILES, id);
}
