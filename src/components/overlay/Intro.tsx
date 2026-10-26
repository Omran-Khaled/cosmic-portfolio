import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { galaxies, identity, manifesto } from "@/data/index";
import { CVDisplay } from "@/components/overlay/CVDisplay";
import { useUniverseStore } from "@/hooks/useUniverse";
import { useDialogFocus } from "@/hooks/useInteractionGuards";

export function Intro() {
  const open = useUniverseStore((state) => state.introOpen);
  const dismissIntro = useUniverseStore((state) => state.dismissIntro);
  const startStory = useUniverseStore((state) => state.startStory);
  const setFocus = useUniverseStore((state) => state.setFocus);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(open, dialogRef, dismissIntro);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center overflow-y-auto overscroll-contain bg-void/85 px-4 py-[calc(0.75rem+env(safe-area-inset-top)+env(safe-area-inset-bottom))] backdrop-blur-md sm:px-6 max-[420px]:items-start max-[420px]:py-[calc(0.5rem+env(safe-area-inset-top)+env(safe-area-inset-bottom))]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-title"
          ref={dialogRef}
          tabIndex={-1}
        >
          <div className="my-auto w-full max-w-xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="label-mono text-primary"
            >
              System online · Portfolio as a universe
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-4 font-display text-4xl font-bold leading-tight text-starlight md:text-6xl"
            >
              <span id="intro-title" className="text-cosmic">
                {identity.name}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-3 text-sm text-muted-foreground md:text-base"
            >
              {identity.role} · {identity.location}
            </motion.p>
            <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-muted-foreground/90 sm:text-sm">
              Planets map skills · galaxies reveal projects · the singularity explores AI
              engineering.
            </p>
            <div className="mt-6 space-y-2">
              {manifesto.slice(0, 3).map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.25, duration: 0.65 }}
                  className="text-sm italic text-muted-foreground"
                >
                  {line}
                </motion.p>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8"
            >
              <button
                type="button"
                onClick={() => dismissIntro()}
                className="min-h-11 rounded-full border border-primary/60 bg-primary/15 px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/25 hover:shadow-[var(--shadow-glow)] active:scale-95"
              >
                Enter the universe
              </button>
              <button
                type="button"
                onClick={(event) => {
                  const keyboardActivated = event.detail === 0;
                  startStory();
                  dismissIntro();
                  if (keyboardActivated) {
                    window.requestAnimationFrame(() =>
                      document.querySelector<HTMLElement>("[data-story-next]")?.focus(),
                    );
                  }
                }}
                className="min-h-11 rounded-full border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground active:scale-95"
              >
                Take the guided journey
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.55, duration: 0.4 }}
              className="mx-auto mt-5 max-w-sm rounded-2xl border border-border/70 bg-void/35 p-3 sm:mt-6"
              role="group"
              aria-labelledby="intro-quick-access-title"
            >
              <p id="intro-quick-access-title" className="label-mono text-muted-foreground">
                Or go straight to
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const featuredProject = galaxies[0];
                    if (featuredProject) {
                      setFocus({ kind: "galaxy", id: featuredProject.id });
                    }
                    dismissIntro();
                  }}
                  className="min-h-11 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  View projects
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFocus({ kind: "blackhole", id: "blackhole" });
                    dismissIntro();
                  }}
                  className="min-h-11 rounded-full border border-nebula/40 bg-nebula/10 px-4 py-2 text-sm text-nebula-foreground transition-colors hover:bg-nebula/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  AI engineering
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFocus({ kind: "station", id: "station" });
                    dismissIntro();
                  }}
                  className="min-h-11 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Contact
                </button>
              </div>
              <div className="mx-auto mt-2.5 max-w-xs">
                <CVDisplay />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
