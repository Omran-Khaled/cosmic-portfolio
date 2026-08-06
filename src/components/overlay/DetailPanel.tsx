import { lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { galaxies, orbits, planets } from "@/data/index";
import { useUniverse } from "@/hooks/useUniverse";
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
    <div className="flex items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  );
}

// Fallback if a panel chunk fails to load or crashes at runtime.
function PanelErrorFallback() {
  return (
    <div className="rounded-lg border border-border/70 bg-secondary/30 p-4 text-center">
      <p className="text-sm text-muted-foreground">
        This section couldn't load right now. Please try another.
      </p>
    </div>
  );
}

export function DetailPanel() {
  const { focus, clearFocus } = useUniverse();

  if (!focus) return null;

  let PanelComponent: React.ComponentType<{ id: string }> | null = null;

  switch (focus.kind) {
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
      return null;
  }

  const getPanelContent = () => {
    switch (focus.kind) {
      case "sun":
        return {
          eyebrow: "Identity Core",
          title: "Omran Khaled",
          subtitle: "Front-end Developer · Damascus, Syria",
        };
      case "orbits":
        return {
          eyebrow: "Skill orbits",
          title: "Four systems of practice",
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
          subtitle: "Signal open for front-end and AI-assisted engineering work.",
        };
      default:
        return null;
    }
  };

  const content = getPanelContent();
  if (!content || !PanelComponent) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={focus.id}
        initial={{ opacity: 0, x: 48, filter: "blur(6px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: 48, filter: "blur(6px)" }}
        transition={{ type: "spring", stiffness: 240, damping: 30 }}
        className="glass-panel pointer-events-auto absolute right-3 top-16 z-20 max-h-[70vh] w-[min(92vw,27rem)] overflow-y-auto rounded-2xl p-4 md:right-6 md:top-20 md:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="label-mono text-primary">{content.eyebrow}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-starlight">
              {content.title}
            </h2>
          </div>
          <button
            onClick={clearFocus}
            aria-label="Close panel"
            className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
    </AnimatePresence>
  );
}
