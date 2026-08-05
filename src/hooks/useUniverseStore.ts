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
    const { focus, nodes } = get();
    if (!focus || focus.id !== id) return;
    nodes.set(id, position);
  },
}));

export function useUniverse() {
  return useUniverseStore();
}
