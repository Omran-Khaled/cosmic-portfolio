export type WebGLContextLifecycleCallbacks = {
  onLost: () => void;
  onRestored: () => void;
};

/** Bind and cleanly release the browser events used by the WebGL recovery path. */
export function bindWebGLContextLifecycle(
  target: Pick<EventTarget, "addEventListener" | "removeEventListener">,
  callbacks: WebGLContextLifecycleCallbacks,
): () => void {
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    callbacks.onLost();
  };
  const handleContextRestored = () => callbacks.onRestored();

  target.addEventListener("webglcontextlost", handleContextLost);
  target.addEventListener("webglcontextrestored", handleContextRestored);

  return () => {
    target.removeEventListener("webglcontextlost", handleContextLost);
    target.removeEventListener("webglcontextrestored", handleContextRestored);
  };
}
