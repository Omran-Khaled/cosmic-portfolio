import assert from "node:assert/strict";
import test from "node:test";
import { bindWebGLContextLifecycle } from "./webgl-context.ts";

test("WebGL context lifecycle pauses on loss, resumes on restoration, and cleans up listeners", () => {
  const target = new EventTarget();
  const calls: string[] = [];
  const unbind = bindWebGLContextLifecycle(target, {
    onLost: () => calls.push("pause-and-fallback"),
    onRestored: () => calls.push("resume"),
  });

  const lost = new Event("webglcontextlost", { cancelable: true });
  target.dispatchEvent(lost);
  assert.equal(lost.defaultPrevented, true);
  assert.deepEqual(calls, ["pause-and-fallback"]);

  target.dispatchEvent(new Event("webglcontextrestored"));
  assert.deepEqual(calls, ["pause-and-fallback", "resume"]);

  unbind();
  target.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
  target.dispatchEvent(new Event("webglcontextrestored"));
  assert.deepEqual(calls, ["pause-and-fallback", "resume"]);
});
