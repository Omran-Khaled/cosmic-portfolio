import { create } from "zustand";
import * as THREE from "three";
import { storyStops } from "@/data/index";

export type FocusKind = "sun" | "planet" | "galaxy" | "blackhole" | "station" | "orbits";
export type Focus = { kind: FocusKind; id: string } | null;
export type CameraMode = "explore" | "focus" | "story";

type NodeRegistry = Map<string, THREE.Vector3>;

const FIXED_FOCUS_KINDS: Record<string, FocusKind> = {
  sun: "sun",
  orbits: "orbits",
  blackhole: "blackhole",
  station: "station",
};

const resolveFocusKind = (id: string): FocusKind => FIXED_FOCUS_KINDS[id] ?? "galaxy";

type UniverseState = {
  focus: Focus;
  hovered: string | null;
  mode: CameraMode;
  storyIndex: number;
  autoOrbit: boolean;
  warpAt: number;
  nodes: NodeRegistry;
  setFocus: (focus: Focus) => void;
  clearFocus: () => void;
  setHovered: (id: string | null) => void;
  startStory: () => void;
  nextStop: () => void;
  prevStop: () => void;
  exitStory: () => void;
  toggleAutoOrbit: () => void;
  registerNode: (id: string, position: THREE.Vector3) => void;
};

/**
 * Zustand selector-based store. Components subscribe only to the slices they
 * need, so a hover change re-renders just the affected (and previously active)
 * celestial bodies — not every planet and galaxy in the scene.
 *
 * `registerNode` is also cheap: positions are only recorded for the currently
 * focused object, since that is the only node the camera transition consumes.
 */
export const useUniverseStore = create<UniverseState>((set, get) => ({
  focus: null,
  hovered: null,
  mode: "explore",
  storyIndex: 0,
  autoOrbit: true,
  warpAt: 0,
  nodes: new Map(),

  setFocus: (focus) => set({ mode: focus ? "focus" : "explore", focus, warpAt: Date.now() }),

  clearFocus: () => set({ mode: "explore", focus: null, warpAt: Date.now() }),

  setHovered: (id) => set({ hovered: id }),

  startStory: () => {
    const id = storyStops[0];
    if (!id) return;
    set({
      storyIndex: 0,
      mode: "story",
      focus: { kind: resolveFocusKind(id), id },
      warpAt: Date.now(),
    });
  },

  nextStop: () => {
    const { storyIndex, mode } = get();
    if (mode !== "story") return;
    const clamped = Math.min(storyStops.length - 1, storyIndex + 1);
    const id = storyStops[clamped];
    if (!id) return;
    set({ storyIndex: clamped, focus: { kind: resolveFocusKind(id), id }, warpAt: Date.now() });
  },

  prevStop: () => {
    const { storyIndex, mode } = get();
    if (mode !== "story") return;
    const clamped = Math.max(0, storyIndex - 1);
    const id = storyStops[clamped];
    if (!id) return;
    set({ storyIndex: clamped, focus: { kind: resolveFocusKind(id), id }, warpAt: Date.now() });
  },

  exitStory: () => set({ mode: "explore", focus: null, storyIndex: 0, warpAt: Date.now() }),

  toggleAutoOrbit: () => set({ autoOrbit: !get().autoOrbit }),

  registerNode: (id, position) => {
    // Only the focused body's live position matters for camera transitions.
    const { focus, nodes } = get();
    if (!focus || focus.id !== id) return;
    nodes.set(id, position);
  },
}));

/**
 * Backwards-compatible hook: returns the whole state (re-renders on any change).
 * Consumers that need maximum render isolation should use `useUniverseStore`
 * with a narrow selector instead (e.g. a boolean for hover/focus activity).
 */
export function useUniverse() {
  return useUniverseStore();
}

/** Provider kept for API compatibility — Zustand needs no provider. */
export function UniverseProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
