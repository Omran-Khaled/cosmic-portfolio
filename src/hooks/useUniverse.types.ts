export type FocusKind = "sun" | "planet" | "galaxy" | "blackhole" | "station" | "orbits";
export type Focus = { kind: FocusKind; id: string } | null;
export type CameraMode = "explore" | "focus" | "story";
