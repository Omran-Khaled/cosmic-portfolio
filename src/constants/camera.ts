import * as THREE from "three";

import { DEFAULT_POS as DEFAULT_UNIVERSE_POS } from "@/constants/universe";

export const DEFAULT_POS = DEFAULT_UNIVERSE_POS;
export const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
export const ORIGIN = new THREE.Vector3(0, 0, 0);
export const UP_AXIS = new THREE.Vector3(0, 1, 0);

export const FOCUS_DISTANCE: Record<string, number> = {
  sun: 14,
  planet: 6,
  galaxy: 30,
  blackhole: 32,
  station: 12,
  orbits: 52,
};

export const DRIFT_SPEED = 0.045;
export const DRIFT_RADIUS = 62;
export const DRIFT_BREATH_AMP = 4;
export const DRIFT_Y_BASE = 22;
export const DRIFT_Y_BREATH_AMP = 3;
export const DRIFT_Y_FREQ = 0.22;
export const DRIFT_FREQ = 0.18;

export const SWING_SPEED = 0.12;
export const SWING_AMPLITUDE = 0.35;

export const VERTICAL_OFFSET_RATIO = 0.35;
export const WARP_DISTANCE_MULTIPLIER = 0.35;
export const WARP_FOV_BOOST = 16;
export const WARP_DECAY_RATE = 3.2;

// Legacy transition-tuning values; the active director uses DEFAULT_CONFIG in
// lib/camera/camera-director.ts, so these values do not control focus duration.
export const TRANSITION_SPEED_BASE = 1.6;
export const TRANSITION_SPEED_FACTOR = 0.06;
export const TRANSITION_SPEED_MAX = 6;

export const TARGET_LERP_SPEED = 3.5;

export const MIN_DIRECTION_LENGTH_SQ = 0.001;
export const DEFAULT_DIRECTION = new THREE.Vector3(0, 0, 1);

export const DEEP_SPACE_DIMMING_START = 230;
export const DEEP_SPACE_DIMMING_END = 520;

// Starfield visual tuning — screen-space point sizes at reference distance.
// These are the *physical* point sizes before perspective division; the shader
// applies devicePixelRatio and screen-space clamping for consistent visibility.
export const STAR_POINT_SIZE_MIN = 8;
export const STAR_POINT_SIZE_MAX = 24;
export const STAR_BRIGHT_MIN = 0.68;
export const STAR_BRIGHT_MAX = 1.0;
export const STAR_TWINKLE_SPEED = 0.22;
export const STAR_TWINKLE_AMP = 0.06;

// Galaxy visual scale layer — kept separate from orbital position so distant
// galaxies stay readable without inflating geometry every frame.
export const GALAXY_VISUAL_SCALE = {
  khuta: 1.18,
  nexara: 1.08,
  finora: 0.96,
  "library-system": 1.05,
  wandr: 1.12,
} as const;
