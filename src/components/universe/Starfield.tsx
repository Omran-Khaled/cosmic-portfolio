import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { disposeObject3D } from "@/lib/three-dispose";
import { createSeededRandom } from "@/lib/seeded-random";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  STAR_BRIGHT_MAX,
  STAR_BRIGHT_MIN,
  STAR_POINT_SIZE_MAX,
  STAR_POINT_SIZE_MIN,
} from "@/constants/camera";

const STAR_PALETTE = [
  new THREE.Color("#ffffff"),
  new THREE.Color("#bae6fd"),
  new THREE.Color("#f5d0fe"),
  new THREE.Color("#fde68a"),
];

const STAR_PALETTE_WEIGHTS = [0.84, 0.07, 0.05, 0.04];

function pickStarColor(random: () => number): THREE.Color {
  const roll = random();
  let acc = 0;
  for (let i = 0; i < STAR_PALETTE.length; i += 1) {
    acc += STAR_PALETTE_WEIGHTS[i] ?? 0;
    const c = STAR_PALETTE[i];
    if (c && roll < acc) return c;
  }
  return STAR_PALETTE[0]!;
}

function createStarfieldGeometry(
  count: number,
  random: () => number,
  innerRadius: number,
  spread: number,
  flattening: number,
  sizeMin: number,
  sizeMax: number,
): THREE.BufferGeometry {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const brightness = new Float32Array(count);
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const r = innerRadius + Math.pow(random(), 0.72) * spread;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) * flattening;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const c = pickStarColor(random);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = sizeMin + Math.pow(random(), 2.4) * (sizeMax - sizeMin);
    brightness[i] = STAR_BRIGHT_MIN + Math.pow(random(), 2.8) * (STAR_BRIGHT_MAX - STAR_BRIGHT_MIN);
    phases[i] = random() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute("brightness", new THREE.BufferAttribute(brightness, 1));
  geo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
  return geo;
}

const STAR_VERTEX_SHADER = `
  attribute vec3 color;
  attribute float size;
  attribute float brightness;
  attribute float phase;
  uniform float pixelRatio;
  uniform float cameraDistance;
  varying vec3 vColor;
  varying float vBrightness;
  varying float vPhase;
  varying float vStarDistance;

  void main() {
    vColor = color;
    vBrightness = brightness;
    vPhase = phase;
    vStarDistance = length(position);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float perspectiveSize = size * pixelRatio * (300.0 / max(-mvPosition.z, 1.0));
    gl_PointSize = clamp(perspectiveSize, 4.0, 14.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAGMENT_SHADER = `
  uniform float time;
  uniform float opacity;
  uniform float cameraDistance;
  varying vec3 vColor;
  varying float vBrightness;
  varying float vPhase;
  varying float vStarDistance;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float core = 1.0 - smoothstep(0.0, 0.38, d);
    float edge = 1.0 - smoothstep(0.38, 0.50, d);
    float twinkle = 0.95 + 0.06 * sin(time * 0.22 + vPhase);
    float intensity = vBrightness * core * twinkle;
    float depthHaze = 1.0 - smoothstep(420.0, 1500.0, vStarDistance + cameraDistance * 0.55);
    float cameraHaze = 1.0 - smoothstep(700.0, 1400.0, cameraDistance) * 0.3;
    gl_FragColor = vec4(vColor * intensity, edge * opacity * twinkle * depthHaze * cameraHaze);
  }
`;

export function Starfield({ count = 2600 }: { count?: number }) {
  const ref = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();
  const materials = useRef<THREE.ShaderMaterial[]>([]);
  const pixelRatio = useThree((state) => state.viewport.dpr);
  const layers = useMemo(
    () => [
      {
        // Distant layer — numerous, small, faint, wide spread.
        geometry: createStarfieldGeometry(
          Math.round(count * 0.58),
          createSeededRandom(count),
          700,
          1400,
          0.6,
          STAR_POINT_SIZE_MIN,
          STAR_POINT_SIZE_MIN + 0.8,
        ),
        opacity: 0.76,
      },
      {
        // Mid layer — clearer, medium size.
        geometry: createStarfieldGeometry(
          Math.round(count * 0.18),
          createSeededRandom(count + 17),
          480,
          700,
          0.42,
          STAR_POINT_SIZE_MIN + 0.5,
          STAR_POINT_SIZE_MIN + 1.4,
        ),
        opacity: 0.86,
      },
      {
        // Bright layer — few, larger, gentle halos.
        geometry: createStarfieldGeometry(
          Math.round(count * 0.04),
          createSeededRandom(count + 31),
          320,
          400,
          0.3,
          STAR_POINT_SIZE_MIN + 1.0,
          STAR_POINT_SIZE_MAX,
        ),
        opacity: 0.98,
      },
    ],
    [count],
  );
  const layerUniforms = useMemo(
    () =>
      layers.map((layer) => ({
        opacity: { value: layer.opacity },
        time: { value: 0 },
        pixelRatio: { value: pixelRatio },
        cameraDistance: { value: 62 },
      })),
    [layers, pixelRatio],
  );

  // Dispose starfield geometry/material on unmount.
  useEffect(() => {
    const refObj = ref.current;
    return () => disposeObject3D(refObj);
  }, [layers]);

  useFrame(({ camera }, delta) => {
    if (ref.current && !reducedMotion) ref.current.rotation.y += delta * 0.007;
    const cameraDistance = camera.position.length();
    for (const material of materials.current) {
      const timeUniform = material.uniforms["time"];
      if (timeUniform && !reducedMotion) timeUniform.value += delta;
      const prUniform = material.uniforms["pixelRatio"];
      if (prUniform) prUniform.value = pixelRatio;
      const distanceUniform = material.uniforms["cameraDistance"];
      if (distanceUniform) distanceUniform.value = cameraDistance;
    }
  });

  return (
    <group ref={ref}>
      {layers.map((layer, index) => {
        const uniforms = layerUniforms[index];
        if (!uniforms) return null;
        return (
          <points key={index} geometry={layer.geometry}>
            <shaderMaterial
              ref={(material) => {
                if (material) materials.current[index] = material;
              }}
              transparent
              uniforms={uniforms}
              vertexShader={STAR_VERTEX_SHADER}
              fragmentShader={STAR_FRAGMENT_SHADER}
              depthWrite={false}
              blending={THREE.NormalBlending}
            />
          </points>
        );
      })}
    </group>
  );
}
