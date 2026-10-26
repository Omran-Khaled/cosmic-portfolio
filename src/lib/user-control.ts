/**
 * User-control guard. Explicit navigation (setFocus, story, warp, reset) always
 * preempts user control — there is no grace period after a drag. A short
 * cooldown is kept only for auto-drift resume (handled by CameraDirector).
 */
export const beginUserControl = () => {
  // Hook for future use; explicit navigation wins regardless.
};

export const endUserControl = () => {
  // Hook for future use; auto-drift resume timing lives in CameraDirector.
};
