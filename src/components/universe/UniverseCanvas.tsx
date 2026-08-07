import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, AdaptiveDpr, Preload } from "@react-three/drei";
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
import { useUniverse } from "@/hooks/useUniverse";
import {
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  CAMERA_POSITION,
  DPR_MIN,
  DPR_MAX,
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

type OrbitControlsLike = { target: THREE.Vector3; update: () => void };

/**
 * Handles WebGL context loss/restoration gracefully. When the context is lost,
 * we prevent the default (which would show a black canvas) and pause rendering.
 * When it's restored, we resume the render loop.
 */
function WebGLContextGuard() {
  const gl = useThree((s) => s.gl);
  const setFrameloop = useThree((s) => s.setFrameloop);

  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      // Pause the render loop to avoid errors while the context is gone.
      setFrameloop("never");
      console.warn("[WebGL] Context lost — pausing render loop.");
    };

    const handleContextRestored = () => {
      // Resume the render loop once the context is back.
      setFrameloop("always");
      console.info("[WebGL] Context restored — resuming render loop.");
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl, setFrameloop]);

  return null;
}

export default function UniverseCanvas() {
  const controls = useRef<OrbitControlsLike | null>(null);
  const { clearFocus, autoOrbit } = useUniverse();
  const { ref: containerRef, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={[DPR_MIN, DPR_MAX]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        // Pause rendering when the canvas is off-screen — saves GPU cycles.
        frameloop={inView ? "always" : "never"}
        camera={{
          position: CAMERA_POSITION.toArray() as [number, number, number],
          fov: CAMERA_FOV,
          near: CAMERA_NEAR,
          far: CAMERA_FAR,
        }}
        onPointerMissed={() => clearFocus()}
      >
        <WebGLContextGuard />
        <color attach="background" args={[BACKGROUND_COLOR]} />
        <fog attach="fog" args={[FOG_COLOR, FOG_NEAR, FOG_FAR]} />
        <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
        <hemisphereLight
          intensity={HEMISPHERE_LIGHT_INTENSITY}
          color={HEMISPHERE_LIGHT_COLOR}
          groundColor={HEMISPHERE_LIGHT_GROUND_COLOR}
        />

        <Suspense fallback={null}>
          <Starfield />
          <Sun />
          <PlanetSystem />
          <Galaxies />
          <BlackHole />
          <SpaceStation />
          <Constellation />
          <Preload all />
        </Suspense>

        <CameraRig controls={controls} />
        <OrbitControls
          ref={controls as never}
          makeDefault
          enablePan={!autoOrbit}
          screenSpacePanning
          enableDamping
          dampingFactor={DAMPING_FACTOR}
          rotateSpeed={ROTATE_SPEED}
          zoomSpeed={ZOOM_SPEED}
          panSpeed={PAN_SPEED}
          minDistance={MIN_DISTANCE}
          maxDistance={MAX_DISTANCE}
        />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
