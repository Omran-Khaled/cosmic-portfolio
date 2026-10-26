import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { setInclinedOrbitPosition } from "./orbit-geometry.ts";

test("planet center follows the same inclined XZ plane as its orbit ring", () => {
  const radius = 12;
  const phase = Math.PI / 2;
  const inclination = 0.2;
  const position = new THREE.Vector3();
  setInclinedOrbitPosition(position, radius, phase, inclination);

  const expectedY = -radius * Math.sin(inclination);
  const expectedZ = radius * Math.cos(inclination);
  assert.ok(Math.abs(position.x) < 1e-10);
  assert.ok(Math.abs(position.y - expectedY) < 1e-10);
  assert.ok(Math.abs(position.z - expectedZ) < 1e-10);
  assert.ok(Math.abs(position.length() - radius) < 1e-10);
});
