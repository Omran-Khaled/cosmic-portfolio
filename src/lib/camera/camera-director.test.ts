import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import {
  DEFAULT_CONFIG,
  CameraDirector,
  buildArc,
  computeDuration,
  dampVectorToward,
  easedPositionProgress,
  panelAwareOffset,
} from "./camera-director.ts";

test("computeDuration clamps cinematic travel time", () => {
  assert.equal(computeDuration(0, DEFAULT_CONFIG), DEFAULT_CONFIG.minDuration);
  assert.equal(computeDuration(10_000, DEFAULT_CONFIG), DEFAULT_CONFIG.maxDuration);

  // Mid-range distances must scale with the configured rate and stay clamped.
  const distance = 100;
  const expected = Math.min(
    Math.max(
      DEFAULT_CONFIG.minDuration + distance * DEFAULT_CONFIG.distanceSecondsPerUnit,
      DEFAULT_CONFIG.minDuration,
    ),
    DEFAULT_CONFIG.maxDuration,
  );
  assert.equal(computeDuration(distance, DEFAULT_CONFIG), expected);
  assert.ok(computeDuration(distance, DEFAULT_CONFIG) >= DEFAULT_CONFIG.minDuration);
  assert.ok(computeDuration(distance, DEFAULT_CONFIG) <= DEFAULT_CONFIG.maxDuration);
});

test("easedPositionProgress stays bounded and reaches both endpoints", () => {
  assert.equal(easedPositionProgress(-1), 0);
  assert.equal(easedPositionProgress(0), 0);
  assert.equal(easedPositionProgress(1), 1);
  assert.equal(easedPositionProgress(2), 1);
});

test("buildArc creates a lifted transition with the configured duration", () => {
  const start = new THREE.Vector3(0, 0, 0);
  const end = new THREE.Vector3(10, 0, 0);
  const arc = buildArc(start, end, DEFAULT_CONFIG);

  assert.equal(arc.start.x, 0);
  assert.equal(arc.end.x, 10);
  assert.ok(arc.control.y > 0);
  assert.equal(arc.duration, computeDuration(10, DEFAULT_CONFIG));
});

test("panelAwareOffset only shifts framing when a panel is open", () => {
  const profile = {
    distanceMultiplier: 2,
    elevationDegrees: 10,
    azimuthDegrees: 0,
    ruleOfThirdsOffset: 0.2,
  };

  assert.equal(panelAwareOffset(profile, false, 10), 0);
  assert.equal(panelAwareOffset(profile, true, 10), -2);
});

test("dampVectorToward moves toward its target without overshooting", () => {
  const current = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  const target = new THREE.Vector3(10, 0, 0);

  dampVectorToward(current, velocity, target, 0.2, 1 / 60);

  assert.ok(current.x > 0);
  assert.ok(current.x < target.x);
});

test("CameraDirector enters transition and reaches focus hold", () => {
  const director = new CameraDirector();
  const nodes = new Map<string, THREE.Vector3>([["planet-1", new THREE.Vector3(20, 0, 0)]]);
  director.setFocus({ kind: "planet", id: "planet-1" }, nodes, true, 0);

  assert.equal(director.getState(), "transition");
  const first = director.update({
    focus: { kind: "planet", id: "planet-1" },
    nodes,
    panelOpen: true,
    userDriving: false,
    autoDrift: false,
    time: 0,
    delta: 1 / 60,
    reducedMotion: false,
  });
  assert.equal(first.state, "transition");

  const final = director.update({
    focus: { kind: "planet", id: "planet-1" },
    nodes,
    panelOpen: true,
    userDriving: false,
    autoDrift: false,
    time: 10,
    delta: 1 / 60,
    reducedMotion: false,
  });
  assert.equal(final.state, "hold");
});

test("CameraDirector does not redirect to origin when a transition target is missing", () => {
  const director = new CameraDirector();
  const focus = { kind: "planet" as const, id: "planet-1" };
  const nodes = new Map<string, THREE.Vector3>([[focus.id, new THREE.Vector3(20, 0, 0)]]);
  director.setFocus(focus, nodes, true, 0);
  director.update({
    focus,
    nodes,
    panelOpen: true,
    userDriving: false,
    autoDrift: false,
    time: 0.1,
    delta: 1 / 60,
    reducedMotion: false,
  });

  const beforeMissingTarget = {
    position: director.getPose().position.clone(),
    target: director.getPose().target.clone(),
  };
  const missing = director.update({
    focus,
    nodes: new Map(),
    panelOpen: true,
    userDriving: false,
    autoDrift: false,
    time: 0.2,
    delta: 1 / 60,
    reducedMotion: false,
  });

  assert.equal(missing.state, "transition");
  assert.ok(director.getPose().position.equals(beforeMissingTarget.position));
  assert.ok(director.getPose().target.equals(beforeMissingTarget.target));

  const missingWithReducedMotion = director.update({
    focus,
    nodes: new Map(),
    panelOpen: true,
    userDriving: false,
    autoDrift: false,
    time: 0.21,
    delta: 1 / 60,
    reducedMotion: true,
  });
  assert.equal(missingWithReducedMotion.state, "transition");
  assert.ok(director.getPose().position.equals(beforeMissingTarget.position));
  assert.ok(director.getPose().target.equals(beforeMissingTarget.target));
});

test("CameraDirector preserves held framing while a focused target is temporarily missing", () => {
  const director = new CameraDirector();
  const focus = { kind: "planet" as const, id: "planet-1" };
  const nodes = new Map<string, THREE.Vector3>([[focus.id, new THREE.Vector3(20, 0, 0)]]);
  director.setFocus(focus, nodes, true, 0);
  director.update({
    focus,
    nodes,
    panelOpen: true,
    userDriving: false,
    autoDrift: false,
    time: 10,
    delta: 1 / 60,
    reducedMotion: false,
  });
  assert.equal(director.getState(), "hold");

  const beforeMissingTarget = {
    position: director.getPose().position.clone(),
    target: director.getPose().target.clone(),
  };
  const missing = director.update({
    focus,
    nodes: new Map(),
    panelOpen: true,
    userDriving: false,
    autoDrift: false,
    time: 10.1,
    delta: 0.1,
    reducedMotion: false,
  });

  assert.equal(missing.state, "hold");
  assert.ok(director.getPose().position.equals(beforeMissingTarget.position));
  assert.ok(director.getPose().target.equals(beforeMissingTarget.target));
});

test("CameraDirector lets user interruption cancel a pending focus request", () => {
  const director = new CameraDirector();
  const focus = { kind: "planet" as const, id: "planet-1" };
  const nodes = new Map<string, THREE.Vector3>();
  director.setFocus(focus, nodes, true, 0);
  director.interrupt();

  const result = director.update({
    focus,
    nodes,
    panelOpen: true,
    userDriving: true,
    autoDrift: false,
    time: 0.02,
    delta: 1 / 60,
    reducedMotion: false,
  });

  assert.equal(result.state, "user");
  assert.equal(result.active, false);
  assert.equal(director.getState(), "user");
});

test("CameraDirector defers arc build when node not yet registered (pending focus)", () => {
  const director = new CameraDirector();
  const emptyNodes = new Map<string, THREE.Vector3>();
  // Set focus with empty registry - should defer arc building
  director.setFocus({ kind: "planet", id: "planet-1" }, emptyNodes, true, 0);

  assert.equal(director.getState(), "transition");

  // First update with empty nodes - should still be transition, no arc built yet
  const first = director.update({
    focus: { kind: "planet", id: "planet-1" },
    nodes: emptyNodes,
    panelOpen: true,
    userDriving: false,
    autoDrift: false,
    time: 0,
    delta: 1 / 60,
    reducedMotion: false,
  });
  assert.equal(first.state, "transition");

  // Second update with node now registered - arc should be built from correct position
  const nodesWithTarget = new Map<string, THREE.Vector3>([
    ["planet-1", new THREE.Vector3(20, 0, 0)],
  ]);
  const second = director.update({
    focus: { kind: "planet", id: "planet-1" },
    nodes: nodesWithTarget,
    panelOpen: true,
    userDriving: false,
    autoDrift: false,
    time: 1 / 60,
    delta: 1 / 60,
    reducedMotion: false,
  });
  assert.equal(second.state, "transition");

  // Verify the arc was built with the correct target distance (not origin)
  // The segment should exist and have a non-zero distance from camera position to target
  // Since we can't directly access private segment, we verify by advancing time
  // and checking that the camera moves toward the target, not origin
  const third = director.update({
    focus: { kind: "planet", id: "planet-1" },
    nodes: nodesWithTarget,
    panelOpen: true,
    userDriving: false,
    autoDrift: false,
    time: 10,
    delta: 1 / 60,
    reducedMotion: false,
  });
  assert.equal(third.state, "hold");
  // Camera should be near the planet position (20, 0, 0), not origin (0, 0, 0)
  assert.ok(third.pose.target.x > 10, "Camera target should be near planet, not origin");
});
