import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { identity } from "@/data/index";
import { useUniverse } from "@/hooks/useUniverse";
import { cn } from "@/lib/utils";
import { StoryControls, WarpPalette, NavigationMap, DESTINATIONS } from "./HUD.parts";
import type { Destination } from "./HUD.parts";

export function HUD() {
  const {
    focus,
    setFocus,
    mode,
    storyIndex,
    startStory,
    nextStop,
    prevStop,
    exitStory,
    clearFocus,
    autoOrbit,
    toggleAutoOrbit,
  } = useUniverse();
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
    },
    [setFocus, closeJump],
  );

  // Keyboard flight controls — the universe is navigable without a mouse.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (e.key === "Escape") {
        if (jump) setJump(false);
        else clearFocus();
        return;
      }
      if (typing) return;
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setJump(true);
        return;
      }
      if (e.key === "j" || e.key === "/") {
        e.preventDefault();
        setJump(true);
      } else if (e.key === "ArrowRight" || e.key === "n") {
        nextStop();
      } else if (e.key === "ArrowLeft" || e.key === "p") {
        prevStop();
      } else if (e.key === " ") {
        e.preventDefault();
        if (mode === "story") {
          exitStory();
        } else {
          startStory();
        }
      } else if (e.key === "f") {
        toggleAutoOrbit();
      } else if (e.key === "r") {
        const random = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
        if (random) setFocus({ kind: random.kind, id: random.id });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    jump,
    clearFocus,
    nextStop,
    prevStop,
    mode,
    exitStory,
    startStory,
    toggleAutoOrbit,
    setFocus,
  ]);

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
            onClick={() => setJump(true)}
            className="rounded-full border border-border bg-void/60 px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground md:px-3"
            aria-label="Warp to destination"
          >
            <span className="hidden sm:inline">⌖ Warp to…</span>
            <span className="sm:hidden">⌖</span>
            <span className="ml-1 hidden opacity-60 md:inline">J</span>
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
              onClick={startStory}
              className="rounded-full border border-primary/50 bg-primary/15 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/25 md:px-4"
            >
              <span className="hidden sm:inline">▶ Story mode</span>
              <span className="sm:hidden">▶</span>
            </button>
          )}
          <button
            onClick={toggleAutoOrbit}
            aria-pressed={!autoOrbit}
            className={cn(
              "rounded-full border px-3 py-2 text-xs transition-colors md:px-4",
              autoOrbit
                ? "border-border text-muted-foreground hover:text-foreground"
                : "border-signal/60 bg-signal/15 text-signal",
            )}
          >
            <span className="hidden sm:inline">{autoOrbit ? "🛰 Auto drift" : "🕹 Free flight"}</span>
            <span className="sm:hidden">{autoOrbit ? "🛰" : "🕹"}</span>
          </button>
          <button
            onClick={clearFocus}
            className="rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground md:px-4"
          >
            <span className="hidden sm:inline">Reset view</span>
            <span className="sm:hidden">↺</span>
          </button>
        </div>
      </motion.header>

      <NavigationMap focus={focus} setFocus={setFocus} />

      <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
        <p className="label-mono hidden rounded-full border border-border/70 bg-void/70 px-4 py-1.5 text-center text-[10px] md:block">
          drag · rotate &nbsp;/&nbsp; scroll · zoom &nbsp;/&nbsp; J · warp &nbsp;/&nbsp; ← → ·
          travel &nbsp;/&nbsp; F · free flight &nbsp;/&nbsp; R · random
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
