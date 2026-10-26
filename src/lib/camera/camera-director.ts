/**
 * Stateful cinematic camera director.
 *
 * The director owns scripted camera motion. OrbitControls owns the camera only
 * while the user is actively driving it, which prevents the two systems from
 * fighting over the same transform.
 */
import * as THREE from "three";
import { clamp, easeInOutCubic, easeOutExpo } from "./easing.ts";
import { sampleQuadraticBezier } from "./bezier.ts";
import { smoothDamp as smoothDampVector } from "./smooth-damp.ts";
import type {
  CameraPose,
  CameraState,
  DirectorConfig,
  DirectorInput,
  DirectorOutput,
  FocusKind,
  FramingProfile,
  TransitionSegment,
} from "./types.ts";

export type { DirectorInput };
export { smoothDampVector as smoothDamp };

export const FRAMING_PROFILES: Record<FocusKind, FramingProfile> = {
  sun: {
    distanceMultiplier: 22 / 6,
    elevationDegrees: 16,
    azimuthDegrees: 0,
    ruleOfThirdsOffset: 0.18,
  },
  planet: {
    distanceMultiplier: 1,
    elevationDegrees: 14,
    azimuthDegrees: 0,
    ruleOfThirdsOffset: 0.14,
  },
  galaxy: {
    distanceMultiplier: 5,
    elevationDegrees: 10,
    azimuthDegrees: 0,
    ruleOfThirdsOffset: 0.2,
  },
  blackhole: {
    distanceMultiplier: 32 / 6,
    elevationDegrees: 8,
    azimuthDegrees: 0,
    ruleOfThirdsOffset: 0.22,
  },
  station: {
    distanceMultiplier: 2,
    elevationDegrees: 14,
    azimuthDegrees: 0,
    ruleOfThirdsOffset: 0.16,
  },
  orbits: {
    distanceMultiplier: 52 / 6,
    elevationDegrees: 12,
    azimuthDegrees: 0,
    ruleOfThirdsOffset: 0,
  },
  comet: {
    distanceMultiplier: 2,
    elevationDegrees: 12,
    azimuthDegrees: 0,
    ruleOfThirdsOffset: 0.14,
  },
};

export const DEFAULT_CONFIG: DirectorConfig = {
  minDuration: 1.25,
  distanceSecondsPerUnit: 0.005,
  maxDuration: 2.8,
  arcLiftRatio: 0.16,
  arcSwerveRatio: 0.08,
  leadRatio: 0.15,
  holdDamping: 0.18,
  autoDriftIdleSeconds: 4,
  interruptBlendSeconds: 0.25,
};

export const DEFAULT_FOV = 55;
export const HOME_ELEVATION_DEGREES = 12;
export const HOME_RADIUS = 62;
const INTRO_DURATION = 3.5;
const INTRO_FOV_BOOST = 6;

const origin = new THREE.Vector3();
const liveTarget = new THREE.Vector3();
const focusEnd = new THREE.Vector3();
const sampledPosition = new THREE.Vector3();
const startTarget = new THREE.Vector3();
const endTarget = new THREE.Vector3();

interface PendingFocus {
  kind: FocusKind;
  id: string;
  panelOpen: boolean;
  time: number;
}

export function computeDuration(distance: number, config: DirectorConfig): number {
  return clamp(
    config.minDuration + distance * config.distanceSecondsPerUnit,
    config.minDuration,
    config.maxDuration,
  );
}

function resolveInto(id: string, nodes: Map<string, THREE.Vector3>, out: THREE.Vector3): boolean {
  const node = nodes.get(id);
  if (node) {
    out.copy(node);
    return true;
  }
  out.copy(origin);
  return false;
}

export function panelAwareOffset(
  profile: FramingProfile,
  panelOpen: boolean,
  distance: number,
): number {
  return panelOpen ? -profile.ruleOfThirdsOffset * distance : 0;
}

export function computeFocusEnd(
  kind: FocusKind,
  target: THREE.Vector3,
  panelOpen: boolean,
  out: THREE.Vector3,
): THREE.Vector3 {
  const profile = FRAMING_PROFILES[kind];
  const distance = profile.distanceMultiplier * 6;
  const elevation = THREE.MathUtils.degToRad(profile.elevationDegrees);
  const azimuth = THREE.MathUtils.degToRad(profile.azimuthDegrees);

  out.copy(target);
  out.x += Math.sin(azimuth) * Math.cos(elevation) * distance;
  out.y += Math.sin(elevation) * distance;
  out.z += Math.cos(azimuth) * Math.cos(elevation) * distance;
  out.x += panelAwareOffset(profile, panelOpen, distance);
  return out;
}

export function buildArc(
  start: THREE.Vector3,
  end: THREE.Vector3,
  config: DirectorConfig,
): TransitionSegment {
  const distance = start.distanceTo(end);
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const horizontalLength = Math.hypot(dx, dz) || 1;
  const swerve = distance * config.arcSwerveRatio;
  const control = new THREE.Vector3(
    (start.x + end.x) / 2 - (dz / horizontalLength) * swerve,
    (start.y + end.y) / 2 + distance * config.arcLiftRatio,
    (start.z + end.z) / 2 + (dx / horizontalLength) * swerve,
  );

  return {
    start: start.clone(),
    end: end.clone(),
    control,
    duration: computeDuration(distance, config),
    startTime: 0,
  };
}

export function easedPositionProgress(progress: number): number {
  const value = clamp(progress, 0, 1);
  const cubic = easeInOutCubic(value);
  if (value <= 0.7) return cubic;
  const blend = (value - 0.7) / 0.3;
  return cubic + (easeOutExpo(value) - cubic) * blend * 0.5;
}

function clonePose(pose: CameraPose): CameraPose {
  return {
    position: pose.position.clone(),
    target: pose.target.clone(),
    fov: pose.fov,
  };
}

export function dampVectorToward(
  current: THREE.Vector3,
  velocity: THREE.Vector3,
  target: THREE.Vector3,
  smoothTime: number,
  delta: number,
): void {
  const time = Math.max(0.0001, smoothTime);
  const omega = 2 / time;
  const x = omega * delta;
  const exponential = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const changeX = target.x - current.x;
  const changeY = target.y - current.y;
  const changeZ = target.z - current.z;
  const tempX = (velocity.x + omega * changeX) * delta;
  const tempY = (velocity.y + omega * changeY) * delta;
  const tempZ = (velocity.z + omega * changeZ) * delta;

  velocity.x = (velocity.x - omega * tempX) * exponential;
  velocity.y = (velocity.y - omega * tempY) * exponential;
  velocity.z = (velocity.z - omega * tempZ) * exponential;
  current.x += (changeX + tempX) * exponential;
  current.y += (changeY + tempY) * exponential;
  current.z += (changeZ + tempZ) * exponential;
}

export class CameraDirector {
  private state: CameraState = "idle";
  private segment: TransitionSegment | null = null;
  private segmentStart: CameraPose;
  private pose: CameraPose;
  private readonly home: CameraPose;
  private readonly config: DirectorConfig;
  private readonly holdOffset = new THREE.Vector3();
  private readonly holdVelocity = new THREE.Vector3();
  private driftTimer = 0;
  private interruptBlend = 0;
  private pendingFocus: PendingFocus | null = null;

  constructor(config: DirectorConfig = DEFAULT_CONFIG) {
    this.config = config;
    const elevation = THREE.MathUtils.degToRad(HOME_ELEVATION_DEGREES);
    this.home = {
      position: new THREE.Vector3(
        0,
        Math.sin(elevation) * HOME_RADIUS,
        Math.cos(elevation) * HOME_RADIUS,
      ),
      target: new THREE.Vector3(),
      fov: DEFAULT_FOV,
    };
    this.pose = clonePose(this.home);
    this.segmentStart = clonePose(this.home);
  }

  getState(): CameraState {
    return this.state;
  }

  getPose(): CameraPose {
    return this.pose;
  }

  getHomePose(): CameraPose {
    return this.home;
  }

  syncExternal(position: THREE.Vector3, target: THREE.Vector3, fov: number): void {
    this.pose.position.copy(position);
    this.pose.target.copy(target);
    this.pose.fov = fov;
  }

  setFocus(
    focus: { kind: FocusKind; id: string },
    nodes: Map<string, THREE.Vector3>,
    panelOpen: boolean,
    time: number,
  ): void {
    const resolved = resolveInto(focus.id, nodes, liveTarget);
    if (resolved) {
      computeFocusEnd(focus.kind, liveTarget, panelOpen, focusEnd);
      this.segment = buildArc(this.pose.position, focusEnd, this.config);
      this.segment.startTime = time;
      this.segmentStart = clonePose(this.pose);
      this.state = "transition";
      this.pendingFocus = null;
    } else {
      // Node not yet registered (registry was cleared by setFocus in store).
      // Defer arc building until the node appears in update().
      this.pendingFocus = { kind: focus.kind, id: focus.id, panelOpen, time };
      this.state = "transition";
    }
    this.driftTimer = 0;
    this.interruptBlend = 0;
  }

  returnHome(time: number): void {
    this.segment = buildArc(this.pose.position, this.home.position, this.config);
    this.segment.startTime = time;
    this.segmentStart = clonePose(this.pose);
    this.state = "returning";
    this.driftTimer = 0;
    this.interruptBlend = 0;
  }

  startIntro(time: number): void {
    const start = new THREE.Vector3(0, 120, 220);
    this.segment = buildArc(start, this.home.position, this.config);
    this.segment.duration = INTRO_DURATION;
    this.segment.startTime = time;
    this.pose.position.copy(start);
    this.pose.target.copy(this.home.target);
    this.pose.fov = DEFAULT_FOV + INTRO_FOV_BOOST;
    this.segmentStart = clonePose(this.pose);
    this.state = "intro-flyin";
    this.driftTimer = 0;
  }

  interrupt(): void {
    // An interaction supersedes even a focus request whose node has not been
    // registered yet. Otherwise update() keeps servicing the stale request
    // before it can process user control.
    this.pendingFocus = null;
    if (this.state === "transition" || this.state === "returning" || this.state === "intro-flyin") {
      this.state = "user";
      this.segment = null;
      this.interruptBlend = this.config.interruptBlendSeconds;
    } else if (this.state !== "hold") {
      this.state = "user";
    }
    this.driftTimer = 0;
  }

  setUserDriving(driving: boolean): void {
    if (driving) this.interrupt();
    else if (this.state === "user") this.interruptBlend = this.config.interruptBlendSeconds;
  }

  skipToHome(): void {
    this.state = "idle";
    this.segment = null;
    this.pose.position.copy(this.home.position);
    this.pose.target.copy(this.home.target);
    this.pose.fov = DEFAULT_FOV;
    this.driftTimer = 0;
    this.interruptBlend = 0;
  }

  private enterHold(): void {
    this.state = "hold";
    this.segment = null;
    this.holdOffset.copy(this.pose.position).sub(this.pose.target);
    this.holdVelocity.set(0, 0, 0);
    this.driftTimer = 0;
  }

  update(input: DirectorInput): DirectorOutput {
    const { focus, nodes, panelOpen, userDriving, autoDrift, time, reducedMotion } = input;
    const delta = clamp(input.delta, 0, 0.1);

    // Resolve pending focus if node has been registered.
    if (this.pendingFocus && focus && focus.id === this.pendingFocus.id) {
      const resolved = resolveInto(this.pendingFocus.id, nodes, liveTarget);
      if (resolved) {
        computeFocusEnd(this.pendingFocus.kind, liveTarget, this.pendingFocus.panelOpen, focusEnd);
        this.segment = buildArc(this.pose.position, focusEnd, this.config);
        this.segment.startTime = this.pendingFocus.time;
        this.segmentStart = clonePose(this.pose);
        this.pendingFocus = null;
      }
    }

    // If focus was cleared while we had a pending focus, cancel it and return home.
    if (this.pendingFocus && !focus) {
      this.pendingFocus = null;
      this.returnHome(time);
    }

    // If we have a pending focus but node not yet registered, stay in transition
    // and wait for the node to appear. Don't fall through to idle logic.
    if (this.pendingFocus) {
      return { pose: this.pose, state: this.state, active: true };
    }

    if (userDriving) {
      this.state = "user";
      this.segment = null;
      this.driftTimer = 0;
      return { pose: this.pose, state: this.state, active: false };
    }

    if (this.state === "user") {
      if (this.interruptBlend > 0) {
        this.interruptBlend = Math.max(0, this.interruptBlend - delta);
        return { pose: this.pose, state: this.state, active: false };
      }
      if (!autoDrift) {
        return { pose: this.pose, state: this.state, active: false };
      }
      this.state = "idle";
    }

    if (this.state === "intro-flyin" || this.state === "transition" || this.state === "returning") {
      const segment = this.segment;
      if (!segment) {
        this.state = "idle";
        return { pose: this.pose, state: this.state, active: false };
      }

      if (reducedMotion) {
        if (this.state === "transition" && focus) {
          if (!resolveInto(focus.id, nodes, liveTarget)) {
            segment.startTime += delta;
            return { pose: this.pose, state: this.state, active: true };
          }
          computeFocusEnd(focus.kind, liveTarget, panelOpen, focusEnd);
          this.pose.position.copy(focusEnd);
          this.pose.target.copy(liveTarget);
          this.enterHold();
        } else {
          this.skipToHome();
        }
        return { pose: this.pose, state: this.state, active: true };
      }

      if (this.state === "transition" && focus) {
        // A focused node can be temporarily absent while the registry is
        // cleared/repopulated. Never reinterpret that gap as the world origin.
        if (!resolveInto(focus.id, nodes, liveTarget)) {
          segment.startTime += delta;
          return { pose: this.pose, state: this.state, active: true };
        }
        computeFocusEnd(focus.kind, liveTarget, panelOpen, focusEnd);
        segment.end.copy(focusEnd);
        endTarget.copy(liveTarget);
      } else {
        endTarget.copy(this.home.target);
      }

      const progress = clamp((time - segment.startTime) / Math.max(segment.duration, 0.0001), 0, 1);
      const eased = easedPositionProgress(progress);
      sampleQuadraticBezier(segment.start, segment.control, segment.end, eased, sampledPosition);
      this.pose.position.copy(sampledPosition);
      startTarget.copy(this.segmentStart.target);
      const leadProgress = clamp(progress * (1 + this.config.leadRatio), 0, 1);
      this.pose.target.copy(startTarget).lerp(endTarget, easedPositionProgress(leadProgress));
      this.pose.fov =
        this.state === "intro-flyin" ? DEFAULT_FOV + INTRO_FOV_BOOST * (1 - eased) : DEFAULT_FOV;

      if (progress >= 1) {
        if (this.state === "transition") this.enterHold();
        else this.skipToHome();
      }
      return { pose: this.pose, state: this.state, active: true };
    }

    if (this.state === "hold" && focus) {
      // Keep the last valid framing until the focused node is available again.
      // Clear stale follow velocity so it cannot move the camera during the gap.
      if (!resolveInto(focus.id, nodes, liveTarget)) {
        this.holdVelocity.set(0, 0, 0);
        return { pose: this.pose, state: this.state, active: true };
      }
      focusEnd.copy(liveTarget).add(this.holdOffset);
      if (autoDrift && !reducedMotion) {
        const swing = Math.sin(time * 0.12) * 0.35;
        const cosine = Math.cos(swing);
        const sine = Math.sin(swing);
        const offsetX = this.holdOffset.x;
        const offsetZ = this.holdOffset.z;
        focusEnd.x = liveTarget.x + offsetX * cosine - offsetZ * sine;
        focusEnd.z = liveTarget.z + offsetX * sine + offsetZ * cosine;
      }
      if (!reducedMotion) {
        const amplitude = Math.min(this.pose.position.distanceTo(liveTarget) * 0.004, 0.35);
        focusEnd.x += Math.sin(time * 0.7) * amplitude * 0.4;
        focusEnd.y += Math.sin(time * 0.53 + 1.7) * amplitude * 0.4;
      }
      dampVectorToward(
        this.pose.position,
        this.holdVelocity,
        focusEnd,
        this.config.holdDamping,
        delta,
      );
      this.pose.target.copy(liveTarget);
      this.pose.fov = DEFAULT_FOV;
      return { pose: this.pose, state: this.state, active: true };
    }

    if (this.state === "hold") this.state = "idle";
    this.pose.target.copy(this.home.target);
    this.pose.fov = DEFAULT_FOV;

    if (autoDrift && !reducedMotion) {
      this.driftTimer += delta;
      if (this.driftTimer >= this.config.autoDriftIdleSeconds) {
        const blend = clamp((this.driftTimer - this.config.autoDriftIdleSeconds) / 2, 0, 1);
        const angle = time * 0.045;
        const radius = HOME_RADIUS + Math.sin(time * 0.18) * 4;
        const elevation = THREE.MathUtils.degToRad(HOME_ELEVATION_DEGREES);
        focusEnd.set(
          Math.sin(angle) * radius,
          HOME_RADIUS * Math.sin(elevation) + Math.sin(time * 0.22) * 3,
          Math.cos(angle) * radius,
        );
        this.pose.position.copy(this.home.position).lerp(focusEnd, blend);
        return { pose: this.pose, state: "idle", active: true };
      }
    } else {
      this.driftTimer = 0;
    }

    this.pose.position.copy(this.home.position);
    return { pose: this.pose, state: "idle", active: false };
  }
}
