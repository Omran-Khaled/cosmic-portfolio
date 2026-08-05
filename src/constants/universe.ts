import * as THREE from "three";

// Camera settings
export const CAMERA_FOV = 55;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 600;
export const CAMERA_POSITION = new THREE.Vector3(0, 22, 62);

// DPR settings
export const DPR_MIN = 1;
export const DPR_MAX = 1.75;

// Material properties
export const DAMPING_FACTOR = 0.06;
export const ROTATE_SPEED = 0.5;
export const ZOOM_SPEED = 0.8;
export const PAN_SPEED = 0.6;

// Orbit controls limits
export const MIN_DISTANCE = 4;
export const MAX_DISTANCE = 220;

// Scene settings
export const BACKGROUND_COLOR = "#050512";
export const FOG_COLOR = "#050512";
export const FOG_NEAR = 90;
export const FOG_FAR = 260;

// Lighting
export const AMBIENT_LIGHT_INTENSITY = 0.35;
export const HEMISPHERE_LIGHT_INTENSITY = 0.25;
export const HEMISPHERE_LIGHT_COLOR = "#67e8f9";
export const HEMISPHERE_LIGHT_GROUND_COLOR = "#1e1b4b";

// Geometry segments
export const DISC_SEGMENTS = 3;
export const SPHERE_SEGMENTS = 32;
