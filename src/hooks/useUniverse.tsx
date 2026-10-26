import { create } from "zustand";
import type * as THREE from "three";
import { storyStops } from "@/data/index";

export type FocusKind = "sun" | "planet" | "galaxy" | "blackhole" | "station" | "orbits" | "comet";
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
  userDriving: boolean;
  introOpen: boolean;
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
  setUserDriving: (v: boolean, time?: number) => void;
  dismissIntro: () => void;
  registerNode: (id: string, position: THREE.Vector3) => void;
};

/**
 * Zustand selector-based store. Components subscribe only to the slices they
 * need, so a hover change re-renders just the affected (and previously active)
 * celestial bodies — not every planet and galaxy in the scene.
 *
 * `registerNode` is also cheap: positions are only recorded for the currently
 * focused object, since that is the only node the camera transition consumes.
 *
 * Node cleanup: The registry is cleared when focus changes to prevent unbounded
 * memory growth as the user explores the universe.
 */
// Note: ESLint disable for react-refresh/only-export-components is required here because
// this file exports both the Zustand store (useUniverseStore) and a convenience hook (useUniverse).
// Zustand stores don't need to follow React Refresh rules as they're not components.
// eslint-disable-next-line react-refresh/only-export-components
export const useUniverseStore = create<UniverseState>((set, get) => ({
  focus: null,
  hovered: null,
  mode: "explore",
  storyIndex: 0,
  autoOrbit: false,
  introOpen: true,
  warpAt: 0,
  nodes: new Map(),

  setFocus: (focus) => {
    // Clear the node registry when focus changes to prevent memory leaks
    const nodes = get().nodes;
    nodes.clear();
    set({ mode: focus ? "focus" : "explore", focus, warpAt: get().warpAt + 1 });
  },

  clearFocus: () => {
    // Clear the node registry when focus is cleared
    const nodes = get().nodes;
    nodes.clear();
    set({ mode: "explore", focus: null, warpAt: get().warpAt + 1 });
  },

  setHovered: (id) => set({ hovered: id }),

  startStory: () => {
    const id = storyStops[0];
    if (!id) return;
    // Clear nodes when starting story mode
    const nodes = get().nodes;
    nodes.clear();
    set({
      storyIndex: 0,
      mode: "story",
      focus: { kind: resolveFocusKind(id), id },
      warpAt: get().warpAt + 1,
    });
  },

  nextStop: () => {
    const { storyIndex, mode } = get();
    if (mode !== "story") return;
    const clamped = Math.min(storyStops.length - 1, storyIndex + 1);
    const id = storyStops[clamped];
    if (!id) return;
    // Clear nodes when moving to next story stop
    const nodes = get().nodes;
    nodes.clear();
    set({
      storyIndex: clamped,
      focus: { kind: resolveFocusKind(id), id },
      warpAt: get().warpAt + 1,
    });
  },

  prevStop: () => {
    const { storyIndex, mode } = get();
    if (mode !== "story") return;
    const clamped = Math.max(0, storyIndex - 1);
    const id = storyStops[clamped];
    if (!id) return;
    // Clear nodes when moving to previous story stop
    const nodes = get().nodes;
    nodes.clear();
    set({
      storyIndex: clamped,
      focus: { kind: resolveFocusKind(id), id },
      warpAt: get().warpAt + 1,
    });
  },

  exitStory: () => {
    // Clear nodes when exiting story mode
    const nodes = get().nodes;
    nodes.clear();
    set({ mode: "explore", focus: null, storyIndex: 0, warpAt: get().warpAt + 1 });
  },

  toggleAutoOrbit: () => set({ autoOrbit: !get().autoOrbit }),
  dismissIntro: () => set({ introOpen: false }),
  userDriving: false,
  setUserDriving: (v: boolean) => set({ userDriving: v }),

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
// Note: ESLint disable required here for backward compatibility with existing consumer code.
// The useUniverse function is exported alongside the store for convenience.
// eslint-disable-next-line react-refresh/only-export-components
export function useUniverse() {
  return useUniverseStore();
}

/** Provider kept for API compatibility — Zustand needs no provider. */
export function UniverseProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
