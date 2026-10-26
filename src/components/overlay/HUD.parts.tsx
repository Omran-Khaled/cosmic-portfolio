import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Focus } from "@/hooks/useUniverse";
import { cn } from "@/lib/utils";
import { galaxies, orbits, planets, storyStops } from "@/data/index";
import { useDialogFocus } from "@/hooks/useInteractionGuards";

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
      <div
        className="glass-panel flex items-center gap-2 rounded-full px-2 py-1.5"
        role="group"
        aria-label="Guided story controls"
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={storyIndex <= 0}
          className="min-h-11 min-w-11 rounded-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={storyIndex <= 0 ? "Previous stop (first destination)" : "Previous stop"}
        >
          ←
        </button>
        <span
          className="min-w-28 text-center text-xs text-foreground"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {STOP_LABELS[storyStops[storyIndex]!] ?? "Journey"}
        </span>
        <button
          type="button"
          onClick={onNext}
          data-story-next
          disabled={storyIndex >= storyStops.length - 1}
          className="min-h-11 min-w-11 rounded-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={
            storyIndex >= storyStops.length - 1 ? "Next stop (last destination)" : "Next stop"
          }
        >
          →
        </button>
        <button
          type="button"
          onClick={onExit}
          className="min-h-11 rounded-full bg-secondary px-3 py-2 text-xs text-secondary-foreground hover:bg-secondary/80"
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
    const dialogRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    useDialogFocus(open, dialogRef, onClose);
    useEffect(() => {
      setActiveIndex((index) => Math.min(index, Math.max(results.length - 1, 0)));
    }, [results.length]);

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="pointer-events-auto absolute inset-0 z-40 flex items-start justify-center overflow-y-auto overscroll-contain bg-void/75 px-3 py-[calc(0.75rem+env(safe-area-inset-top)+env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-4 sm:pt-[calc(1.5rem+env(safe-area-inset-top))]"
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel my-auto flex max-h-[calc(100dvh-1.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-[min(94vw,30rem)] flex-col overflow-y-auto overscroll-contain rounded-2xl p-3"
              role="dialog"
              aria-modal="true"
              aria-label="Warp destination selector"
              ref={dialogRef}
              tabIndex={-1}
            >
              <input
                data-dialog-initial-focus
                id="warp-search-destinations"
                role="combobox"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIndex((index) => Math.min(index + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIndex((index) => Math.max(index - 1, 0));
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    setActiveIndex(0);
                  } else if (e.key === "End") {
                    e.preventDefault();
                    setActiveIndex(Math.max(results.length - 1, 0));
                  } else if (e.key === "Enter" && results[activeIndex]) {
                    onWarp(results[activeIndex]);
                  }
                }}
                placeholder="Warp to a planet, galaxy or station…"
                aria-label="Search destinations"
                aria-autocomplete="list"
                aria-controls="warp-destination-list"
                aria-describedby="warp-search-help"
                aria-expanded={open}
                aria-activedescendant={
                  results[activeIndex] ? `warp-${results[activeIndex].id}` : undefined
                }
                className="min-h-11 w-full shrink-0 rounded-xl border border-border bg-void/60 px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
              />
              <p id="warp-search-help" className="sr-only">
                Use the up and down arrow keys to choose a destination, Enter to open it, or Escape
                to close search.
              </p>
              <div
                id="warp-destination-list"
                role="listbox"
                aria-labelledby="warp-search-destinations"
                className="mt-2 max-h-[min(48dvh,20rem)] overflow-y-auto overscroll-contain"
              >
                {results.map((d) => (
                  <div
                    key={d.id}
                    id={`warp-${d.id}`}
                    role="option"
                    aria-selected={results[activeIndex]?.id === d.id}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => onWarp(d)}
                    className={cn(
                      "min-h-[44px] w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground active:bg-secondary/60",
                      results[activeIndex]?.id === d.id && "bg-secondary/60 text-foreground",
                    )}
                  >
                    {d.label}
                  </div>
                ))}
              </div>
              {results.length === 0 && (
                <p
                  role="status"
                  aria-live="polite"
                  className="px-3 py-4 text-xs text-muted-foreground"
                >
                  No destination matches that signal.
                </p>
              )}
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
  const [expanded, setExpanded] = useState(Boolean(focus));
  const isSelected = (kind: NonNullable<Focus>["kind"], id: string) =>
    focus?.kind === kind && focus.id === id;

  return (
    <motion.nav
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className={cn(
        "glass-panel pointer-events-auto absolute bottom-16 left-3 z-20 rounded-2xl p-3 md:left-6",
        expanded
          ? "max-h-[42vh] w-[min(82vw,16rem)] overflow-y-auto md:max-h-[58vh] md:w-64"
          : "w-auto",
      )}
      aria-label="Navigation map"
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex min-h-11 min-w-11 items-center gap-2 px-1 text-left"
        aria-expanded={expanded}
      >
        <span
          aria-hidden="true"
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-primary/50 text-xs text-primary"
        >
          +
        </span>
        <span className="label-mono">Navigation map</span>
      </button>
      {expanded && (
        <ul aria-label="Portfolio destinations" className="mt-3 space-y-1">
          <li>
            <button
              type="button"
              onClick={() => setFocus({ kind: "sun", id: "sun" })}
              aria-pressed={isSelected("sun", "sun")}
              className={cn(
                "min-h-11 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary/60",
                isSelected("sun", "sun") && "bg-secondary text-foreground",
              )}
            >
              Identity core
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setFocus({ kind: "orbits", id: "orbits" })}
              aria-pressed={isSelected("orbits", "orbits")}
              className={cn(
                "min-h-11 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary/60",
                isSelected("orbits", "orbits") && "bg-secondary text-foreground",
              )}
            >
              All skill orbits
            </button>
          </li>
          {orbits.map((orbit) => (
            <li key={orbit.id} className="mt-3">
              <p
                className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider"
                style={{ color: orbit.color }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: orbit.color }} />
                {orbit.name}
              </p>
              <ul aria-label={`${orbit.name} planets`} className="mt-1 space-y-0.5">
                {planets
                  .filter((planet) => planet.orbit === orbit.id)
                  .map((planet) => (
                    <li key={planet.id}>
                      <button
                        type="button"
                        onClick={() => setFocus({ kind: "planet", id: planet.id })}
                        aria-pressed={isSelected("planet", planet.id)}
                        className={cn(
                          "min-h-11 w-full rounded-md px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground",
                          isSelected("planet", planet.id) && "bg-secondary text-foreground",
                        )}
                      >
                        {planet.name}
                      </button>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
          <li className="mt-4 border-t border-border pt-3">
            <ul aria-label="Project and system destinations" className="space-y-0.5">
              {galaxies.map((galaxy) => (
                <li key={galaxy.id}>
                  <button
                    type="button"
                    onClick={() => setFocus({ kind: "galaxy", id: galaxy.id })}
                    aria-pressed={isSelected("galaxy", galaxy.id)}
                    className={cn(
                      "min-h-11 w-full rounded-md px-3 py-2 text-left text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                      isSelected("galaxy", galaxy.id) && "bg-secondary text-foreground",
                    )}
                  >
                    {galaxy.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => setFocus({ kind: "blackhole", id: "blackhole" })}
                  aria-pressed={isSelected("blackhole", "blackhole")}
                  className={cn(
                    "min-h-11 w-full rounded-md px-3 py-2 text-left text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    isSelected("blackhole", "blackhole") && "bg-secondary text-foreground",
                  )}
                >
                  AI engineering
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setFocus({ kind: "station", id: "station" })}
                  aria-pressed={isSelected("station", "station")}
                  className={cn(
                    "min-h-11 w-full rounded-md px-3 py-2 text-left text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    isSelected("station", "station") && "bg-secondary text-foreground",
                  )}
                >
                  Contact station
                </button>
              </li>
            </ul>
          </li>
        </ul>
      )}
    </motion.nav>
  );
});

NavigationMap.displayName = "NavigationMap";
