import { lazy, Suspense, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { galaxies, orbits, planets } from "@/data/index";
import { useUniverseStore } from "@/hooks/useUniverse";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy-load all panels — only fetched when the user actually focuses
// the corresponding celestial body, keeping the initial bundle lean.
const IdentityPanel = lazy(() =>
  import("./panels/IdentityPanel").then((m) => ({ default: m.IdentityPanel })),
);
const OrbitPanel = lazy(() =>
  import("./panels/OrbitPanel").then((m) => ({ default: m.OrbitPanel })),
);
const PlanetPanel = lazy(() =>
  import("./panels/PlanetPanel").then((m) => ({ default: m.PlanetPanel })),
);
const GalaxyPanel = lazy(() =>
  import("./panels/GalaxyPanel").then((m) => ({ default: m.GalaxyPanel })),
);
const BlackHolePanel = lazy(() =>
  import("./panels/BlackHolePanel").then((m) => ({ default: m.BlackHolePanel })),
);
const ContactPanel = lazy(() =>
  import("./panels/ContactPanel").then((m) => ({ default: m.ContactPanel })),
);

// Lightweight fallback while a panel's JS chunk streams in.
function PanelFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex items-center justify-center gap-3 py-8"
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
      />
      <span className="text-sm text-muted-foreground">Loading destination details…</span>
    </div>
  );
}

// Fallback if a panel chunk fails to load or crashes at runtime.
function PanelErrorFallback() {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-lg border border-border/70 bg-secondary/30 p-4 text-center"
    >
      <p className="text-sm text-muted-foreground">
        This section couldn't load right now. Please try another.
      </p>
    </div>
  );
}

export function DetailPanel() {
  const focus = useUniverseStore((state) => state.focus);
  const clearFocus = useUniverseStore((state) => state.clearFocus);
  const mode = useUniverseStore((state) => state.mode);
  const panelRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  // This panel is deliberately non-modal: navigation and the universe remain usable.
  // Preserve the invoking DOM focus target so closing the disclosure never strands focus.
  useEffect(() => {
    const isOpen = Boolean(focus);
    if (isOpen && !wasOpenRef.current) {
      const active = document.activeElement;
      returnFocusRef.current =
        active instanceof HTMLElement && active !== document.body ? active : null;
      // Opening details is a meaningful context change, except during the
      // guided story: there, focus must remain on the previous/next controls.
      if (mode !== "story") panelRef.current?.focus();
    } else if (!isOpen && wasOpenRef.current) {
      const target = returnFocusRef.current;
      if (target?.isConnected && !target.closest("[inert]")) {
        target.focus();
      } else {
        document.querySelector<HTMLElement>("[data-dialog-return-focus]")?.focus();
      }
      returnFocusRef.current = null;
    }
    wasOpenRef.current = isOpen;
  }, [focus, mode]);

  useEffect(() => {
    if (!focus) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        document.querySelector('[role="dialog"][aria-modal="true"]') !== null
      )
        return;
      event.preventDefault();
      clearFocus();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focus, clearFocus]);

  let PanelComponent: React.ComponentType<{ id: string }> | null = null;

  switch (focus?.kind) {
    case "sun":
      PanelComponent = IdentityPanel;
      break;
    case "orbits":
      PanelComponent = OrbitPanel;
      break;
    case "planet":
      PanelComponent = PlanetPanel;
      break;
    case "galaxy":
      PanelComponent = GalaxyPanel;
      break;
    case "blackhole":
      PanelComponent = BlackHolePanel;
      break;
    case "station":
      PanelComponent = ContactPanel;
      break;
    default:
      break;
  }

  const getPanelContent = () => {
    if (!focus) return null;

    switch (focus.kind) {
      case "sun":
        return {
          eyebrow: "Identity Core",
          title: "Omran Khaled",
          subtitle: "MERN Stack Developer · Damascus, Syria",
        };
      case "orbits":
        return {
          eyebrow: "Skill orbits",
          title: `${orbits.length} systems of practice`,
          subtitle:
            "Every planet belongs to an orbit; every orbit answers a different kind of question.",
        };
      case "planet": {
        const planet = planets.find((p) => p.id === focus.id);
        if (!planet) return null;
        const orbit = orbits.find((o) => o.id === planet.orbit);
        if (!orbit) return null;
        return {
          eyebrow: orbit.name,
          title: planet.name,
          subtitle: planet.summary,
        };
      }
      case "galaxy": {
        const galaxy = galaxies.find((g) => g.id === focus.id);
        if (!galaxy) return null;
        return {
          eyebrow: `Project Galaxy · ${galaxy.year}`,
          title: galaxy.name,
          subtitle: galaxy.tagline,
        };
      }
      case "blackhole":
        return {
          eyebrow: "Singularity",
          title: "AI Engineering",
          subtitle: "The loop of engineering with AI assistance",
        };
      case "station":
        return {
          eyebrow: "Uplink",
          title: "Contact",
          subtitle: "Signal open for MERN Stack and AI-assisted engineering work.",
        };
      default:
        return null;
    }
  };

  const content = focus ? getPanelContent() : null;

  return (
    <AnimatePresence mode="wait">
      {focus && content && PanelComponent ? (
        <motion.aside
          ref={panelRef}
          role="region"
          aria-labelledby="detail-panel-title"
          tabIndex={-1}
          key={`${focus.kind}:${focus.id}`}
          initial={{ opacity: 0, x: 48, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: 48, filter: "blur(6px)" }}
          transition={{ type: "spring", stiffness: 240, damping: 30 }}
          className="glass-panel pointer-events-auto absolute right-3 top-16 z-20 max-h-[calc(100dvh-5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-[min(92vw,27rem)] overflow-y-auto overscroll-contain rounded-2xl p-4 md:right-6 md:top-20 md:max-h-[calc(100dvh-6rem)] md:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="label-mono text-primary">{content.eyebrow}</p>
              <h2
                id="detail-panel-title"
                className="mt-1 font-display text-2xl font-semibold text-starlight"
              >
                {content.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={clearFocus}
              aria-label="Close destination details"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.subtitle}</p>
          <div className="mt-5">
            <ErrorBoundary fallback={<PanelErrorFallback />}>
              <Suspense fallback={<PanelFallback />}>
                <PanelComponent id={focus.id} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
