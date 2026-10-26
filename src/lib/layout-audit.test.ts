import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { auditLayout } from "./layout-audit.ts";

const body = (id: string, x: number, radius: number) => ({
  id,
  position: new THREE.Vector3(x, 0, 0),
  radius,
});

test("outer-boundary audit allows a body well inside the boundary", () => {
  assert.deepEqual(auditLayout([body("inner", 5, 1)], 10, 0), []);
});

test("outer-boundary audit allows a body whose outer edge is exactly on the boundary", () => {
  assert.deepEqual(auditLayout([body("edge", 9, 1)], 10, 0), []);
});

test("outer-boundary audit warns when the body's outer edge crosses the boundary", () => {
  const warnings = auditLayout([body("outside", 9.01, 1)], 10, 0);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0] ?? "", /outside exceeds the outer orbit boundary/);
});

test("overlap checks stay independent of the outer-boundary test", () => {
  const warnings = auditLayout([body("first", 0, 1), body("second", 1, 1)], 100, 0);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0] ?? "", /first and second overlap/);
});
