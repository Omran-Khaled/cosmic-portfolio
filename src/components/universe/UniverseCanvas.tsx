import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { useInView } from "@/hooks/useInView";
import { Starfield } from "./Starfield";
import { CameraRig } from "./CameraRig";
import { Sun } from "@/components/celestial/Sun";
import { PlanetSystem } from "@/components/celestial/PlanetSystem";
import { Galaxies } from "@/components/celestial/Galaxies";
import { BlackHole } from "@/components/celestial/BlackHole";
import { SpaceStation } from "@/components/celestial/SpaceStation";
import { Constellation } from "@/components/celestial/Constellation";
import { useUniverseStore } from "@/hooks/useUniverse";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { bindWebGLContextLifecycle } from "@/lib/webgl-context";
import {
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  CAMERA_POSITION,
  DAMPING_FACTOR,
  ROTATE_SPEED,
  ZOOM_SPEED,
  PAN_SPEED,
  MIN_DISTANCE,
  MAX_DISTANCE,
  BACKGROUND_COLOR,
  FOG_COLOR,
  FOG_NEAR,
  FOG_FAR,
  AMBIENT_LIGHT_INTENSITY,
  HEMISPHERE_LIGHT_INTENSITY,
  HEMISPHERE_LIGHT_COLOR,
  HEMISPHERE_LIGHT_GROUND_COLOR,
} from "@/constants/universe";
import { Comet } from "../celestial/comet";
import { QUALITY_SETTINGS, RENDER_BUDGET, type QualityTier } from "@/constants/cinematic";

type OrbitControlsLike = { target: THREE.Vector3; update: () => void };

function getInitialQuality(): QualityTier {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "medium";

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 0;
  const pixelRatio = window.devicePixelRatio;

  if (deviceMemory !== undefined && deviceMemory <= 4) return "low";
  if (cores <= 4) return "low";
  // High-DPR screens can multiply fragment work even when the CPU is fast.
  if (pixelRatio >= 2 || (deviceMemory !== undefined && deviceMemory <= 6)) return "medium";
  // Be conservative when memory telemetry is unavailable; PerformanceMonitor
  // can still promote the scene after it measures sustained headroom.
  if (deviceMemory === undefined || cores < 8 || deviceMemory < 8) return "medium";
  return "high";
}

/**
 * Handles WebGL context loss/restoration gracefully. When the context is lost,
 * we prevent the default (which would show a black canvas) and pause rendering.
 * When it's restored, we resume the render loop.
 */
function WebGLContextGuard({
  inView,
  onContextLost,
  onContextRestored,
}: {
  inView: boolean;
  onContextLost: () => void;
  onContextRestored: () => void;
}) {
  const gl = useThree((s) => s.gl);
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    return bindWebGLContextLifecycle(canvas, {
      onLost: () => {
        // Pause rendering while the context is unavailable. The visible 2D
        // fallback is available immediately from UniverseExperience.
        setFrameloop("never");
        onContextLost();
        console.warn("[WebGL] Context lost — pausing render loop.");
      },
      onRestored: () => {
        setFrameloop(inView ? "always" : "never");
        onContextRestored();
        console.info("[WebGL] Context restored — resuming render loop.");
      },
    });
  }, [gl, inView, onContextLost, onContextRestored, setFrameloop]);

  return null;
}

function RendererBudgetReporter({ quality }: { quality: QualityTier }) {
  const { gl } = useThree();

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const report = window.setTimeout(() => {
      const { calls, triangles } = gl.info.render;
      console.info("[renderer-budget]", {
        quality,
        calls,
        triangles,
        budget: RENDER_BUDGET,
        withinBudget: calls <= RENDER_BUDGET.drawCalls && triangles <= RENDER_BUDGET.triangles,
      });
    }, 1500);
    return () => window.clearTimeout(report);
  }, [gl, quality]);

  return null;
}

export default function UniverseCanvas({
  onContextLost,
  onContextRestored,
}: {
  onContextLost: () => void;
  onContextRestored: () => void;
}) {
  const [quality, setQuality] = useState<QualityTier>(getInitialQuality);
  const [contextLost, setContextLost] = useState(false);
  const qualityChangedAt = useRef(0);
  const controls = useRef<OrbitControlsLike | null>(null);
  const clearFocus = useUniverseStore((state) => state.clearFocus);
  const focus = useUniverseStore((state) => state.focus);
  const autoOrbit = useUniverseStore((state) => state.autoOrbit);
  const setUserDriving = useUniverseStore((state) => state.setUserDriving);
  const reducedMotion = useReducedMotion();
  const handleContextLost = useCallback(() => {
    setContextLost(true);
    onContextLost();
  }, [onContextLost]);
  const handleContextRestored = useCallback(() => {
    setContextLost(false);
    onContextRestored();
  }, [onContextRestored]);
  const autoOrbitEnabled = autoOrbit && !reducedMotion;
  const { ref: containerRef, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (reducedMotion) setQuality("low");
  }, [reducedMotion]);

  // A cooldown prevents GPU measurements near a threshold from rebuilding
  // expensive scene geometries in rapid quality-tier flip-flops.
  const adjustQuality = useCallback(
    (direction: "up" | "down") => {
      if (direction === "up" && reducedMotion) return;
      const now = performance.now();
      if (now - qualityChangedAt.current < 5000) return;
      qualityChangedAt.current = now;
      setQuality((current) => {
        if (direction === "up") return current === "low" ? "medium" : "high";
        return current === "high" ? "medium" : "low";
      });
    },
    [reducedMotion],
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      role="img"
      aria-label="Interactive three-dimensional portfolio universe"
      aria-describedby="universe-canvas-accessibility-help"
    >
      <p id="universe-canvas-accessibility-help" className="sr-only">
        This scene is a visual way to explore the portfolio. Every destination and its details are
        also available through the Navigation map and Warp to destination controls.
      </p>
      <Canvas
        dpr={[1, QUALITY_SETTINGS[quality].dpr]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        // Pause rendering when the canvas is off-screen — saves GPU cycles.
        frameloop={contextLost ? "never" : inView ? "always" : "never"}
        camera={{
          position: CAMERA_POSITION.toArray() as [number, number, number],
          fov: CAMERA_FOV,
          near: CAMERA_NEAR,
          far: CAMERA_FAR,
        }}
        onPointerMissed={() => clearFocus()}
      >
        <WebGLContextGuard
          inView={inView}
          onContextLost={handleContextLost}
          onContextRestored={handleContextRestored}
        />
        <RendererBudgetReporter quality={quality} />
        <color attach="background" args={[BACKGROUND_COLOR]} />
        <fog attach="fog" args={[FOG_COLOR, FOG_NEAR, FOG_FAR]} />
        <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
        <hemisphereLight
          intensity={HEMISPHERE_LIGHT_INTENSITY}
          color={HEMISPHERE_LIGHT_COLOR}
          groundColor={HEMISPHERE_LIGHT_GROUND_COLOR}
        />
        <Suspense fallback={null}>
          <Starfield count={QUALITY_SETTINGS[quality].starCount} />
          <Sun />
          <PlanetSystem reducedMotion={reducedMotion} quality={quality} />
          <Galaxies
            starCount={QUALITY_SETTINGS[quality].galaxyStars}
            reducedMotion={reducedMotion}
          />
          <BlackHole />
          <SpaceStation />
          <Constellation />
        </Suspense>

        <CameraRig controls={controls} autoDrift={autoOrbitEnabled} />
        <OrbitControls
          ref={controls as never}
          makeDefault
          enablePan={!autoOrbitEnabled}
          screenSpacePanning
          enableDamping={!focus}
          dampingFactor={DAMPING_FACTOR}
          rotateSpeed={ROTATE_SPEED}
          zoomSpeed={ZOOM_SPEED}
          panSpeed={PAN_SPEED}
          minDistance={MIN_DISTANCE}
          maxDistance={MAX_DISTANCE}
          onStart={() => setUserDriving(true)}
          onEnd={() => setUserDriving(false)}
        />
        <PerformanceMonitor
          onIncline={() => adjustQuality("up")}
          onDecline={() => adjustQuality("down")}
          flipflops={5}
        />
        <Comet />
      </Canvas>
    </div>
  );
}
