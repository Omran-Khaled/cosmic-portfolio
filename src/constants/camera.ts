import * as THREE from "three";

export const DEFAULT_POS = new THREE.Vector3(0, 22, 62);
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

export const TRANSITION_SPEED_BASE = 1.6;
export const TRANSITION_SPEED_FACTOR = 0.06;
export const TRANSITION_SPEED_MAX = 6;

export const TARGET_LERP_SPEED = 3.5;

export const MIN_DIRECTION_LENGTH_SQ = 0.001;
export const DEFAULT_DIRECTION = new THREE.Vector3(0, 0, 1);
