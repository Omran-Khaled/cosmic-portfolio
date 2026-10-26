import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { identity } from "@/data/index";
import { useUniverseStore } from "@/hooks/useUniverse";
import { cn } from "@/lib/utils";
import { StoryControls, WarpPalette, NavigationMap, DESTINATIONS } from "./HUD.parts";
import type { Destination } from "./HUD.parts";

export function HUD() {
  const focus = useUniverseStore((state) => state.focus);
  const setFocus = useUniverseStore((state) => state.setFocus);
  const mode = useUniverseStore((state) => state.mode);
  const storyIndex = useUniverseStore((state) => state.storyIndex);
  const startStory = useUniverseStore((state) => state.startStory);
  const nextStop = useUniverseStore((state) => state.nextStop);
  const prevStop = useUniverseStore((state) => state.prevStop);
  const exitStory = useUniverseStore((state) => state.exitStory);
  const clearFocus = useUniverseStore((state) => state.clearFocus);
  const autoOrbit = useUniverseStore((state) => state.autoOrbit);
  const toggleAutoOrbit = useUniverseStore((state) => state.toggleAutoOrbit);
  const [jump, setJump] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(
    () =>
      DESTINATIONS.filter((d) => d.label.toLowerCase().includes(query.trim().toLowerCase())).slice(
        0,
        8,
      ),
    [query],
  );

  const closeJump = useCallback(() => {
    setJump(false);
    setQuery("");
  }, []);

  const warpTo = useCallback(
    (destination: Destination) => {
      setFocus({ kind: destination.kind, id: destination.id });
      closeJump();
      // The destination picker closes and the detail region becomes the next
      // context. Move focus there after the modal's trigger restoration runs.
      window.requestAnimationFrame(() =>
        document
          .querySelector<HTMLElement>('[role="region"][aria-labelledby="detail-panel-title"]')
          ?.focus(),
      );
    },
    [setFocus, closeJump],
  );

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between gap-3 p-3 md:p-6"
      >
        <div className="pointer-events-auto min-w-0">
          <p className="label-mono text-primary">Explorable Universe</p>
          <h1 className="truncate font-display text-lg font-bold tracking-tight text-starlight md:text-2xl">
            {identity.name}
          </h1>
          <p className="truncate text-xs text-muted-foreground md:text-sm">
            {identity.role} · {identity.location}
          </p>
        </div>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={() => setJump(true)}
            className="min-h-11 min-w-11 rounded-full border border-border bg-void/60 px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground md:px-3"
            aria-label="Warp to destination"
            data-dialog-return-focus
          >
            <span className="hidden sm:inline">⌖ Warp to…</span>
            <span className="sm:hidden">⌖</span>
          </button>
          {mode === "story" ? (
            <StoryControls
              storyIndex={storyIndex}
              onPrev={prevStop}
              onNext={nextStop}
              onExit={exitStory}
            />
          ) : (
            <button
              type="button"
              onClick={(event) => {
                const keyboardActivated = event.detail === 0;
                startStory();
                if (keyboardActivated) {
                  window.requestAnimationFrame(() =>
                    document.querySelector<HTMLElement>("[data-story-next]")?.focus(),
                  );
                }
              }}
              aria-label="Start guided story mode"
              className="min-h-11 min-w-11 rounded-full border border-primary/50 bg-primary/15 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/25 md:px-4"
            >
              <span className="hidden sm:inline">▶ Story mode</span>
              <span className="sm:hidden">▶</span>
            </button>
          )}
          <button
            type="button"
            onClick={toggleAutoOrbit}
            aria-label="Automatic camera drift"
            aria-pressed={autoOrbit}
            className={cn(
              "min-h-11 min-w-11 rounded-full border px-3 py-2 text-xs transition-colors md:px-4",
              autoOrbit
                ? "border-border text-muted-foreground hover:text-foreground"
                : "border-signal/60 bg-signal/15 text-signal",
            )}
          >
            <span className="hidden sm:inline">{autoOrbit ? "🛰 Auto drift" : "🕹 Free flight"}</span>
            <span className="sm:hidden">{autoOrbit ? "🛰" : "🕹"}</span>
          </button>
          <button
            type="button"
            onClick={clearFocus}
            aria-label="Reset camera view"
            className="min-h-11 min-w-11 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground md:px-4"
          >
            <span className="hidden sm:inline">Reset view</span>
            <span className="sm:hidden">↺</span>
          </button>
        </div>
      </motion.header>

      <NavigationMap focus={focus} setFocus={setFocus} />

      <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
        <p className="label-mono hidden rounded-full border border-border/70 bg-void/70 px-4 py-1.5 text-center text-[10px] md:block">
          Use the navigation map or Warp to choose a destination · Story controls guide the journey
        </p>
      </div>

      <WarpPalette
        open={jump}
        query={query}
        results={results}
        onQueryChange={setQuery}
        onClose={closeJump}
        onWarp={warpTo}
      />
    </>
  );
}
