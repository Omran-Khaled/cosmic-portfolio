import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { HUD } from "@/components/overlay/HUD";
import { DetailPanel } from "@/components/overlay/DetailPanel";
import { Intro } from "@/components/overlay/Intro";
import { MobileUniverse } from "@/components/overlay/MobileUniverse";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UniverseProvider } from "@/hooks/useUniverse";
import { MotionConfig } from "framer-motion";
import { detectWebGLSupport, shouldUseMobileUniverse } from "@/lib/webgl-support";

// A context that does not recover promptly switches to the 2D experience.
const WEBGL_RECOVERY_TIMEOUT_MS = 8_000;

// 3D layer is loaded lazily and only in the browser.
const UniverseCanvas = lazy(() => import("@/components/universe/UniverseCanvas"));

function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="absolute inset-0 flex items-center justify-center bg-[image:var(--gradient-cosmos)]"
    >
      <div className="text-center">
        <div
          aria-hidden="true"
          className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
        />
        <p className="label-mono mt-4">Charting the universe…</p>
      </div>
    </div>
  );
}

function MobileFallback() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <>
      <MobileUniverse />
      {!dismissed && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-void/90 px-4 py-2 text-xs text-muted-foreground shadow-lg"
        >
          <span>3D mode is unavailable on this device.</span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-full px-2 py-1 text-foreground hover:bg-secondary"
            aria-label="Dismiss 3D unavailable notice"
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}

export function UniverseExperience() {
  const [mounted, setMounted] = useState(false);
  const [mobileMode, setMobileMode] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const handleContextLost = useCallback(() => setContextLost(true), []);
  const handleContextRestored = useCallback(() => setContextLost(false), []);

  useEffect(() => {
    if (!contextLost) return;

    // Do not leave users indefinitely on a frozen canvas. Browser restoration
    // gets a short window; the existing 2D experience is the bounded fallback.
    const recoveryTimeout = window.setTimeout(() => {
      setWebglUnavailable(true);
      setMobileMode(true);
      setContextLost(false);
    }, WEBGL_RECOVERY_TIMEOUT_MS);

    return () => window.clearTimeout(recoveryTimeout);
  }, [contextLost]);

  useEffect(() => {
    setMounted(true);
    const support = detectWebGLSupport();
    let resizeTimer: number | undefined;
    const updateMode = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setMobileMode(webglUnavailable || shouldUseMobileUniverse(window.innerWidth, support));
      }, 150);
    };
    updateMode();
    window.addEventListener("resize", updateMode);
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", updateMode);
    };
  }, [webglUnavailable]);

  return (
    <MotionConfig reducedMotion="user">
      {!mounted ? (
        <Loading />
      ) : mobileMode ? (
        <MobileUniverse />
      ) : (
        <UniverseProvider>
          <main className="relative h-screen w-full overflow-hidden bg-void">
            <ErrorBoundary fallback={<MobileFallback />}>
              <Suspense fallback={<Loading />}>
                <UniverseCanvas
                  onContextLost={handleContextLost}
                  onContextRestored={handleContextRestored}
                />
              </Suspense>
            </ErrorBoundary>
            {contextLost && (
              <div
                role="alert"
                aria-live="assertive"
                className="glass-panel absolute inset-x-4 bottom-4 z-50 mx-auto max-w-lg rounded-2xl p-4 text-center"
              >
                <p className="text-sm text-foreground">
                  The 3D graphics context was lost. You can wait for browser recovery or switch to
                  the accessible 2D portfolio.
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-full border border-primary/60 bg-primary/15 px-4 py-2 text-sm text-primary"
                  onClick={() => setMobileMode(true)}
                >
                  Switch to 2D portfolio
                </button>
              </div>
            )}
            <HUD />
            <DetailPanel />
            <Intro />
          </main>
        </UniverseProvider>
      )}
    </MotionConfig>
  );
}
