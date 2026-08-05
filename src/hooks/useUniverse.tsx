import { useUniverseStore } from "./useUniverseStore";

export type FocusKind = "sun" | "planet" | "galaxy" | "blackhole" | "station" | "orbits";
export type Focus = { kind: FocusKind; id: string } | null;
export type CameraMode = "explore" | "focus" | "story";
 *
    const id = storyStops[0];
    if (!id) return;
    set({
      storyIndex: 0,
      mode: "story",
      focus: { kind: resolveFocusKind(id), id },
      warpAt: Date.now(),
    });
  },
    const { storyIndex, mode } = get();
    if (mode !== "story") return;
    const clamped = Math.min(storyStops.length - 1, storyIndex + 1);
    const id = storyStops[clamped];
    if (!id) return;
    set({ storyIndex: clamped, focus: { kind: resolveFocusKind(id), id }, warpAt: Date.now() });
  },
    const { storyIndex, mode } = get();
    if (mode !== "story") return;
    const clamped = Math.max(0, storyIndex - 1);
    const id = storyStops[clamped];
    if (!id) return;
    set({ storyIndex: clamped, focus: { kind: resolveFocusKind(id), id }, warpAt: Date.now() });
  },
    // Only the focused body's live position matters for camera transitions.
    const { focus, nodes } = get();
    if (!focus || focus.id !== id) return;
    nodes.set(id, position);
  },
}));
 * Backwards-compatible hook: returns the whole state (re-renders on any change).
 * Consumers that need maximum render isolation should use `useUniverseStore`
 * with a narrow selector instead (e.g. a boolean for hover/focus activity).
export function useUniverse() {
  return useUniverseStore();
}
export function UniverseProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
