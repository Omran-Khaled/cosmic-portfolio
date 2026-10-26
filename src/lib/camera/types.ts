/**
 * Pure camera math types for the CameraDirector state machine.
 * Zero dependencies beyond three.js types. Keep this file free of React/R3F imports
 * so every type can be unit-tested in plain Node.
 */
import * as THREE from "three";

export type FocusKind = "sun" | "planet" | "galaxy" | "blackhole" | "station" | "orbits" | "comet";

export type CameraState = "intro-flyin" | "idle" | "transition" | "hold" | "user" | "returning";

export interface CameraPose {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

export interface FramingProfile {
  /** Multiplier applied to the bounding radius to compute focus distance. */
  distanceMultiplier: number;
  /** Elevation angle in degrees above the horizon plane. */
  elevationDegrees: number;
  /** Default azimuth in degrees (0 = behind body looking at origin). */
  azimuthDegrees: number;
  /** Rule-of-thirds lateral offset as fraction of distance (0 = centered). */
  ruleOfThirdsOffset: number;
}

export interface DirectorConfig {
  /** Minimum transition duration in seconds. */
  minDuration: number;
  /** Maximum transition duration in seconds. */
  maxDuration: number;
  /** Seconds per unit of distance added to the base duration. */
  distanceSecondsPerUnit: number;
  /** Altitude lift as fraction of distance for the arc. */
  arcLiftRatio: number;
  /** Lateral swerve as fraction of distance to avoid flying through bodies. */
  arcSwerveRatio: number;
  /** How far the eye leads the body during a move (0 = no lead). */
  leadRatio: number;
  /** Critically-damped smoothDamp frequency for holding on moving targets. */
  holdDamping: number;
  /** Seconds after idle before auto-drift eases in. */
  autoDriftIdleSeconds: number;
  /** Seconds to blend damping back in after user interruption. */
  interruptBlendSeconds: number;
}

export interface DirectorInput {
  /** Desired focus target (null = home). */
  focus: { kind: FocusKind; id: string } | null;
  /** Live registry of focus node positions (updated by celestial components). */
  nodes: Map<string, THREE.Vector3>;
  /** Whether the detail panel is open on desktop (for panel-aware framing). */
  panelOpen: boolean;
  /** Whether the user is currently driving the camera (pointer/wheel/key). */
  userDriving: boolean;
  /** Opt-in slow drift (autoOrbit store flag, already gated on reduced-motion). */
  autoDrift: boolean;
  /** Elapsed time in seconds. */
  time: number;
  /** Delta time in seconds. */
  delta: number;
  /** Whether prefers-reduced-motion is active. */
  reducedMotion: boolean;
}

export interface DirectorOutput {
  pose: CameraPose;
  state: CameraState;
  /** True if the director is still driving the camera this frame. */
  active: boolean;
}

export interface TransitionSegment {
  start: THREE.Vector3;
  end: THREE.Vector3;
  control: THREE.Vector3; // quadratic Bézier control point
  duration: number;
  startTime: number;
}
