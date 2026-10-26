import * as THREE from "three";

// Camera settings — matches the wider establishing composition from main.
export const CAMERA_FOV = 55;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 8000;
export const CAMERA_POSITION = new THREE.Vector3(0, 60, 160);
export const DEFAULT_POS = CAMERA_POSITION;
export const SUN_RADIUS = 5.8;
export const SUN_CORONA_RADIUS = 7.6;

// DPR settings
export const DPR_MIN = 1;
export const DPR_MAX = 1.75;

// Material properties
export const DAMPING_FACTOR = 0.16;
export const ROTATE_SPEED = 0.58;
export const ZOOM_SPEED = 0.36;
export const PAN_SPEED = 0.72;

// Orbit controls limits
export const MIN_DISTANCE = 4;
export const MAX_DISTANCE = 900;

// Scene settings
export const BACKGROUND_COLOR = "#050512";
export const FOG_COLOR = "#050512";
export const FOG_NEAR = 520;
export const FOG_FAR = 1900;

// Lighting
export const AMBIENT_LIGHT_INTENSITY = 0.11;
export const HEMISPHERE_LIGHT_INTENSITY = 0.16;
export const HEMISPHERE_LIGHT_COLOR = "#67e8f9";
export const HEMISPHERE_LIGHT_GROUND_COLOR = "#101126";
export const SUN_LIGHT_INTENSITY = 220;
export const SUN_LIGHT_DISTANCE = 520;
export const SUN_LIGHT_DECAY = 1.45;

// Geometry segments
export const DISC_SEGMENTS = 3;
export const SPHERE_SEGMENTS = 32;
