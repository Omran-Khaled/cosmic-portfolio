import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Focus } from "@/hooks/useUniverse";
import { cn } from "@/lib/utils";
import { galaxies, orbits, planets, storyStops } from "@/data/index";

const STOP_LABELS: Record<string, string> = {
  sun: "Identity",
  orbits: "Skill orbits",
  blackhole: "AI singularity",
  station: "Contact",
  ...Object.fromEntries(galaxies.map((g) => [g.id, g.name])),
};

type Destination = {
  id: string;
  label: string;
  kind: "sun" | "planet" | "galaxy" | "blackhole" | "station" | "orbits";
};

const DESTINATIONS: Destination[] = [
  { id: "sun", label: "Identity core", kind: "sun" },
  { id: "orbits", label: "Skill orbits", kind: "orbits" },
  ...planets.map((p) => ({ id: p.id, label: p.name, kind: "planet" as const })),
  ...galaxies.map((g) => ({ id: g.id, label: g.name, kind: "galaxy" as const })),
  { id: "blackhole", label: "AI engineering", kind: "blackhole" },
  { id: "station", label: "Contact station", kind: "station" },
];

export { DESTINATIONS };
export type { Destination };

interface StoryControlsProps {
  storyIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
}

export const StoryControls = React.memo(
  ({ storyIndex, onPrev, onNext, onExit }: StoryControlsProps) => {
    return (
      <div className="glass-panel flex items-center gap-2 rounded-full px-2 py-1.5">
        <button
          onClick={onPrev}
          className="rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          aria-label="Previous stop"
        >
          ←
        </button>
        <span className="min-w-28 text-center text-xs text-foreground">
          {STOP_LABELS[storyStops[storyIndex]!] ?? "Journey"}
        </span>
        <button
          onClick={onNext}
          className="rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          aria-label="Next stop"
        >
          →
        </button>
        <button
          onClick={onExit}
          className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
        >
          Exit
        </button>
      </div>
    );
  },
);

StoryControls.displayName = "StoryControls";

interface WarpPaletteProps {
  open: boolean;
  query: string;
  results: Destination[];
  onQueryChange: (query: string) => void;
  onClose: () => void;
  onWarp: (destination: Destination) => void;
}

export const WarpPalette = React.memo(
  ({ open, query, results, onQueryChange, onClose, onWarp }: WarpPaletteProps) => {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="pointer-events-auto absolute inset-0 z-40 flex items-start justify-center bg-void/70 px-4 pt-28 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel w-[min(92vw,30rem)] overflow-hidden rounded-2xl p-3"
              role="dialog"
              aria-modal="true"
              aria-label="Warp destination selector"
            >
              <input
                autoFocus
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results[0]) {
                    onWarp(results[0]);
                  }
                }}
                placeholder="Warp to a planet, galaxy or station…"
                aria-label="Search destinations"
                className="w-full rounded-xl border border-border bg-void/60 px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
              />
              <div className="mt-2 max-h-64 overflow-y-auto">
                {results.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => onWarp(d)}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
                  >
                    {d.label}
                  </button>
                ))}
                {results.length === 0 && (
                  <p className="px-3 py-4 text-xs text-muted-foreground">
                    No destination matches that signal.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

WarpPalette.displayName = "WarpPalette";

interface NavigationMapProps {
  focus: Focus;
  setFocus: (focus: Focus) => void;
}

export const NavigationMap = React.memo(({ focus, setFocus }: NavigationMapProps) => {
  if (!focus) return null;
  return (
    <motion.nav
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel pointer-events-auto absolute bottom-16 left-4 z-20 hidden max-h-[58vh] w-64 overflow-y-auto rounded-2xl p-4 md:block md:left-6"
      aria-label="Navigation map"
    >
      <p className="label-mono">Navigation map</p>
      <button
        onClick={() => setFocus({ kind: "sun", id: "sun" })}
        className={cn(
          "mt-3 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary/60",
          focus?.id === "sun" && "bg-secondary text-foreground",
        )}
      >
        ☀️ Identity core
      </button>
      <button
        onClick={() => setFocus({ kind: "orbits", id: "orbits" })}
        className={cn(
          "mt-1 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary/60",
          focus?.id === "orbits" && "bg-secondary text-foreground",
        )}
      >
        🌀 All skill orbits
      </button>
      {orbits.map((orbit) => (
        <div key={orbit.id} className="mt-3">
          <p
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider"
            style={{ color: orbit.color }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: orbit.color }} />
            {orbit.name}
          </p>
          <div className="mt-1 space-y-0.5">
            {planets
              .filter((p) => p.orbit === orbit.id)
              .map((planet) => (
                <button
                  key={planet.id}
                  onClick={() => setFocus({ kind: "planet", id: planet.id })}
                  className={cn(
                    "w-full rounded-md px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground",
                    focus?.id === planet.id && "bg-secondary text-foreground",
                  )}
                >
                  {planet.name}
                </button>
              ))}
          </div>
        </div>
      ))}
      <div className="mt-4 space-y-0.5 border-t border-border pt-3">
        {galaxies.map((g) => (
          <button
            key={g.id}
            onClick={() => setFocus({ kind: "galaxy", id: g.id })}
            className={cn(
              "w-full rounded-md px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              focus?.id === g.id && "bg-secondary text-foreground",
            )}
          >
            🌌 {g.name}
          </button>
        ))}
        <button
          onClick={() => setFocus({ kind: "blackhole", id: "blackhole" })}
          className="w-full rounded-md px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
        >
          🕳 AI engineering
        </button>
        <button
          onClick={() => setFocus({ kind: "station", id: "station" })}
          className="w-full rounded-md px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
        >
          🛰 Contact station
        </button>
      </div>
    </motion.nav>
  );
});

NavigationMap.displayName = "NavigationMap";
