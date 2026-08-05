import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { identity, manifesto } from "@/data/index";
import { useUniverse } from "@/hooks/useUniverse";

export function Intro() {
  const [open, setOpen] = useState(true);
  const { startStory } = useUniverse();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-void/80 px-6 backdrop-blur-md"
        >
          <div className="max-w-xl text-center">
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
              <span className="text-cosmic">{identity.name}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-3 text-sm text-muted-foreground md:text-base"
            >
              {identity.role} · {identity.location}
            </motion.p>
            <div className="mt-8 space-y-2">
              {manifesto.slice(0, 3).map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.45, duration: 1.1 }}
                  className="text-sm italic text-muted-foreground"
                >
                  {line}
                </motion.p>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-primary/60 bg-primary/15 px-6 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/25 hover:shadow-[var(--shadow-glow)]"
              >
                Enter the universe
              </button>
              <button
                onClick={() => {
                  startStory();
                  setOpen(false);
                }}
                className="rounded-full border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Take the guided journey
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
