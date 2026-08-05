import type { FocusKind } from "./useUniverse.types";

export const FIXED_FOCUS_KINDS: Record<string, FocusKind> = {
  sun: "sun",
  orbits: "orbits",
  blackhole: "blackhole",
  station: "station",
};

export const resolveFocusKind = (id: string): FocusKind => FIXED_FOCUS_KINDS[id] ?? "galaxy";
