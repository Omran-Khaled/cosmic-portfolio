export const COMET_TRAIL_POINTS = 90;
export const COMET_LAP_SECONDS = 90;
export const COMET_TRAIL_SAMPLE_SECONDS = 1 / 30;
export const COMET_TAIL_OFFSET = -3;
export const COMET_TAIL_ROTATION = -Math.PI / 2;
export const COMET_HOVER_HEIGHT = 3;

export const FOCUS_VIEW_AZIMUTH_DEGREES = 96;
export const FOCUS_VIEW_ELEVATION_DEGREES = 20;
export const FOCUS_RESUME_SECONDS = 0.38;
export const CONSTELLATION_REVEAL_DISTANCE = 92;
export const LABEL_FADE_DISTANCE = 360;
export const SEMANTIC_SCALE_REFERENCE_DISTANCE = 120;
export const SEMANTIC_SCALE_EXPONENT = 0.28;
export const SEMANTIC_SCALE_MAX = 2.2;
export const SEMANTIC_SCALE_DAMPING = 8;

export type QualityTier = "low" | "medium" | "high";

export const QUALITY_SETTINGS: Record<
  QualityTier,
  { dpr: number; starCount: number; galaxyStars: number; bloom: boolean; grain: boolean }
> = {
  low: { dpr: 1, starCount: 3800, galaxyStars: 6000, bloom: false, grain: false },
  medium: { dpr: 1.25, starCount: 5600, galaxyStars: 8500, bloom: true, grain: false },
  high: { dpr: 1.5, starCount: 7600, galaxyStars: 12000, bloom: true, grain: true },
};

export const RENDER_BUDGET = {
  drawCalls: 80,
  triangles: 180_000,
};
