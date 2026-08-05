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
        className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between gap-4 p-4 md:p-6"
      >
        <div className="pointer-events-auto">
          <p className="label-mono text-primary">Explorable Universe</p>
          <h1 className="font-display text-xl font-bold tracking-tight text-starlight md:text-2xl">
            {identity.name}
          </h1>
          <p className="text-xs text-muted-foreground md:text-sm">
            {identity.role} · {identity.location}
          </p>
        </div>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => setJump(true)}
            className="rounded-full border border-border bg-void/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ⌖ Warp to… <span className="ml-1 opacity-60">J</span>
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
              className="rounded-full border border-primary/50 bg-primary/15 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/25"
            >
              ▶ Story mode
            </button>
          )}
          <button
            onClick={toggleAutoOrbit}
            aria-pressed={!autoOrbit}
            className={cn(
              "rounded-full border px-4 py-2 text-xs transition-colors",
              autoOrbit
                ? "border-border text-muted-foreground hover:text-foreground"
                : "border-signal/60 bg-signal/15 text-signal",
            )}
          >
            {autoOrbit ? "🛰 Auto drift" : "🕹 Free flight"}
          </button>
          <button
            onClick={clearFocus}
            className="rounded-full border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Reset view
          </button>
        </div>
      </motion.header>

      <NavigationMap focus={focus} setFocus={setFocus} />

      <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
        <p className="label-mono rounded-full border border-border/70 bg-void/70 px-4 py-1.5 text-center text-[10px]">
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
