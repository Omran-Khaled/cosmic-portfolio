import { Suspense, lazy, useEffect, useState } from "react";
import { HUD } from "@/components/overlay/HUD";
import { DetailPanel } from "@/components/overlay/DetailPanel";
import { Intro } from "@/components/overlay/Intro";
import { MobileUniverse } from "@/components/overlay/MobileUniverse";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UniverseProvider } from "@/hooks/useUniverse";
import { useIsMobile } from "@/hooks/use-mobile";

// 3D layer is loaded lazily and only in the browser.
const UniverseCanvas = lazy(() => import("@/components/universe/UniverseCanvas"));

function Loading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[image:var(--gradient-cosmos)]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="label-mono mt-4">Charting the universe…</p>
      </div>
    </div>
  );
}

export function UniverseExperience() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Loading />;
  if (isMobile) return <MobileUniverse />;

  return (
    <UniverseProvider>
      <main className="relative h-screen w-full overflow-hidden bg-void">
        {/* Layer 1 — 3D universe */}
        <ErrorBoundary fallback={<Loading />}>
          <Suspense fallback={<Loading />}>
            <UniverseCanvas />
          </Suspense>
        </ErrorBoundary>
        {/* Layer 2 — UI overlay */}
        <HUD />
        <DetailPanel />
        <Intro />
      </main>
    </UniverseProvider>
  );
}
