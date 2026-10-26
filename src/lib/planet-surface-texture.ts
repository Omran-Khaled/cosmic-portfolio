import * as THREE from "three";
import type { PlanetSurfaceKind } from "./planet-visual-profile.ts";

const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 128;

function seededRandom(seedText: string): () => number {
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    seed = Math.imul(seed ^ seedText.charCodeAt(index), 16777619);
  }
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function colorStyle(color: THREE.Color): string {
  return `#${color.getHexString()}`;
}

function softenHorizontalSeam(context: CanvasRenderingContext2D) {
  // UV x=0 and x=1 meet on the sphere. Blend a narrow edge band so the
  // procedural styles do not create a conspicuous vertical texture seam.
  const imageData = context.getImageData(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  const { data, width, height } = imageData;
  const blendWidth = 12;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < blendWidth; x += 1) {
      const left = (y * width + x) * 4;
      const right = (y * width + (width - 1 - x)) * 4;
      const blend = x / (blendWidth - 1);
      for (let channel = 0; channel < 3; channel += 1) {
        const average = ((data[left + channel] ?? 0) + (data[right + channel] ?? 0)) / 2;
        data[left + channel] = Math.round(
          average * (1 - blend) + (data[left + channel] ?? 0) * blend,
        );
        data[right + channel] = Math.round(
          average * (1 - blend) + (data[right + channel] ?? 0) * blend,
        );
      }
    }
  }
  context.putImageData(imageData, 0, 0);
}

function drawBase(context: CanvasRenderingContext2D, base: THREE.Color, dark: THREE.Color) {
  const gradient = context.createLinearGradient(0, 0, 0, TEXTURE_HEIGHT);
  gradient.addColorStop(0, colorStyle(dark));
  gradient.addColorStop(0.2, colorStyle(base.clone().lerp(dark, 0.18)));
  gradient.addColorStop(0.52, colorStyle(base));
  gradient.addColorStop(0.8, colorStyle(base.clone().lerp(dark, 0.24)));
  gradient.addColorStop(1, colorStyle(dark));
  context.fillStyle = gradient;
  context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
}

function drawBands(
  context: CanvasRenderingContext2D,
  random: () => number,
  light: string,
  dark: string,
) {
  for (let index = 0; index < 14; index += 1) {
    const y = random() * TEXTURE_HEIGHT;
    const height = 2 + random() * 9;
    const amplitude = 2 + random() * 9;
    const bend = (random() - 0.5) * 18;
    context.globalAlpha = 0.2 + random() * 0.3;
    context.fillStyle = index % 2 === 0 ? light : dark;
    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(
      TEXTURE_WIDTH * 0.26,
      y + amplitude + bend,
      TEXTURE_WIDTH * 0.66,
      y - amplitude + bend,
      TEXTURE_WIDTH,
      y + (random() - 0.5) * 5,
    );
    context.lineTo(TEXTURE_WIDTH, y + height);
    context.bezierCurveTo(
      TEXTURE_WIDTH * 0.66,
      y + height - amplitude + bend,
      TEXTURE_WIDTH * 0.26,
      y + height + amplitude + bend,
      0,
      y + height,
    );
    context.closePath();
    context.fill();
  }

  // A single restrained storm oval gives banded worlds a recognizable silhouette.
  const x = TEXTURE_WIDTH * (0.25 + random() * 0.5);
  const y = TEXTURE_HEIGHT * (0.28 + random() * 0.44);
  context.globalAlpha = 0.55;
  context.fillStyle = dark;
  context.beginPath();
  context.ellipse(x, y, 14 + random() * 7, 5 + random() * 3, -0.12, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 0.55;
  context.strokeStyle = light;
  context.lineWidth = 1.25;
  context.beginPath();
  context.ellipse(x - 1, y - 1, 12, 3.5, -0.12, Math.PI * 1.05, Math.PI * 1.92);
  context.stroke();
}

function drawCraters(
  context: CanvasRenderingContext2D,
  random: () => number,
  light: string,
  dark: string,
) {
  for (let index = 0; index < 24; index += 1) {
    const x = random() * TEXTURE_WIDTH;
    const y = random() * TEXTURE_HEIGHT;
    const rx = 2 + random() * 7;
    const ry = rx * (0.42 + random() * 0.42);
    const rotation = (random() - 0.5) * 0.7;

    context.globalAlpha = 0.5;
    context.fillStyle = dark;
    context.beginPath();
    context.ellipse(x + 1, y + 1.2, rx, ry, rotation, 0, Math.PI * 2);
    context.fill();

    context.globalAlpha = 0.56;
    context.strokeStyle = light;
    context.lineWidth = 1 + random() * 1.2;
    context.beginPath();
    context.ellipse(x, y, rx, ry, rotation, Math.PI * 1.02, Math.PI * 1.92);
    context.stroke();

    context.globalAlpha = 0.44;
    context.fillStyle = dark;
    context.beginPath();
    context.ellipse(x, y, rx * 0.72, ry * 0.68, rotation, 0, Math.PI * 2);
    context.fill();
  }
}

function drawOceanicSurface(
  context: CanvasRenderingContext2D,
  random: () => number,
  base: THREE.Color,
  light: string,
  dark: string,
) {
  context.globalAlpha = 0.92;
  context.fillStyle = dark;
  context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

  const land = colorStyle(base.clone().lerp(new THREE.Color(light), 0.3));
  const landShadow = colorStyle(base.clone().lerp(new THREE.Color(dark), 0.2));
  for (let index = 0; index < 9; index += 1) {
    const centerX = random() * TEXTURE_WIDTH;
    const centerY = random() * TEXTURE_HEIGHT;
    const rx = 8 + random() * 23;
    const ry = 4 + random() * 12;
    const pointCount = 7 + Math.floor(random() * 5);
    const points = Array.from({ length: pointCount }, (_, pointIndex) => {
      const angle = (pointIndex / pointCount) * Math.PI * 2;
      const jitter = 0.66 + random() * 0.55;
      return [
        centerX + Math.cos(angle) * rx * jitter,
        centerY + Math.sin(angle) * ry * jitter,
      ] as const;
    });

    // Quadratic midpoints soften polygon corners into continent-like coastlines.
    const midpoint = (a: readonly number[], b: readonly number[]) => [
      ((a[0] ?? 0) + (b[0] ?? 0)) / 2,
      ((a[1] ?? 0) + (b[1] ?? 0)) / 2,
    ];
    context.globalAlpha = 0.72;
    context.fillStyle = index % 3 === 0 ? landShadow : land;
    context.beginPath();
    const start = midpoint(points[points.length - 1] ?? [0, 0], points[0] ?? [0, 0]);
    context.moveTo(start[0] ?? 0, start[1] ?? 0);
    points.forEach((point, pointIndex) => {
      const next = points[(pointIndex + 1) % points.length] ?? point;
      const mid = midpoint(point, next);
      context.quadraticCurveTo(point[0] ?? 0, point[1] ?? 0, mid[0] ?? 0, mid[1] ?? 0);
    });
    context.closePath();
    context.fill();

    context.globalAlpha = 0.45;
    context.strokeStyle = light;
    context.lineWidth = 1.2;
    context.stroke();
  }

  // Thin cloud wisps, not a separate mesh or a screen-space effect.
  for (let index = 0; index < 9; index += 1) {
    const x = random() * TEXTURE_WIDTH;
    const y = random() * TEXTURE_HEIGHT;
    context.globalAlpha = 0.17 + random() * 0.12;
    context.strokeStyle = light;
    context.lineWidth = 1 + random() * 2;
    context.beginPath();
    context.moveTo(x - 16, y);
    context.bezierCurveTo(x - 5, y - 4, x + 7, y + 4, x + 20, y - 1);
    context.stroke();
  }
}

function drawIcyFaults(
  context: CanvasRenderingContext2D,
  random: () => number,
  light: string,
  dark: string,
) {
  for (let index = 0; index < 18; index += 1) {
    let x = random() * TEXTURE_WIDTH;
    let y = random() * TEXTURE_HEIGHT;
    const segments = 3 + Math.floor(random() * 5);
    context.globalAlpha = 0.24;
    context.strokeStyle = dark;
    context.lineWidth = 3 + random() * 2;
    context.beginPath();
    context.moveTo(x, y);
    for (let segment = 0; segment < segments; segment += 1) {
      x += (random() - 0.5) * 36;
      y += (random() - 0.5) * 25;
      context.lineTo(x, y);
    }
    context.stroke();

    context.globalAlpha = 0.78;
    context.strokeStyle = light;
    context.lineWidth = 0.7 + random() * 0.9;
    context.stroke();
  }
}

function drawCrystallineFacets(
  context: CanvasRenderingContext2D,
  random: () => number,
  light: string,
  dark: string,
) {
  for (let index = 0; index < 38; index += 1) {
    const x = random() * TEXTURE_WIDTH;
    const y = random() * TEXTURE_HEIGHT;
    const width = 5 + random() * 26;
    const height = 3 + random() * 15;
    context.globalAlpha = 0.09 + random() * 0.22;
    context.fillStyle = random() > 0.5 ? light : dark;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + width, y + height * (random() - 0.2));
    context.lineTo(x + width * (0.25 + random() * 0.5), y + height);
    context.closePath();
    context.fill();
    context.globalAlpha = 0.15;
    context.strokeStyle = light;
    context.lineWidth = 0.5;
    context.stroke();
  }
}

function drawVolcanicFaults(
  context: CanvasRenderingContext2D,
  random: () => number,
  light: string,
  dark: string,
  ember: string,
) {
  for (let index = 0; index < 13; index += 1) {
    let x = random() * TEXTURE_WIDTH;
    let y = random() * TEXTURE_HEIGHT;
    const segments = 3 + Math.floor(random() * 5);
    context.globalAlpha = 0.28;
    context.strokeStyle = ember;
    context.lineWidth = 3 + random() * 2.2;
    context.beginPath();
    context.moveTo(x, y);
    for (let segment = 0; segment < segments; segment += 1) {
      x += (random() - 0.5) * 33;
      y += (random() - 0.5) * 22;
      context.lineTo(x, y);
    }
    context.stroke();
    context.globalAlpha = 0.84;
    context.strokeStyle = index % 2 ? light : ember;
    context.lineWidth = 0.8 + random() * 1.1;
    context.stroke();
  }

  for (let index = 0; index < 5; index += 1) {
    const x = random() * TEXTURE_WIDTH;
    const y = random() * TEXTURE_HEIGHT;
    context.globalAlpha = 0.65;
    context.fillStyle = dark;
    context.beginPath();
    context.ellipse(x, y, 5 + random() * 5, 2 + random() * 4, random(), 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 0.7;
    context.strokeStyle = ember;
    context.lineWidth = 1.1;
    context.stroke();
  }
}

/**
 * Builds one deterministic low-resolution surface map on the CPU, only for
 * all quality tiers. The same GPU texture is reused as a subtle bump map on
 * medium/high quality; no texture generation or allocation happens in the render loop.
 */
export function createPlanetSurfaceTexture(
  id: string,
  color: string,
  surface: PlanetSurfaceKind,
): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return null;

  const random = seededRandom(id);
  const base = new THREE.Color(color);
  const bright = base.clone().lerp(new THREE.Color("#ffffff"), 0.43);
  const dark = base.clone().lerp(new THREE.Color("#03040b"), 0.58);
  const lightStyle = colorStyle(bright);
  const darkStyle = colorStyle(dark);
  const emberStyle = colorStyle(base.clone().lerp(new THREE.Color("#ff572d"), 0.62));

  const crustBase =
    surface === "volcanic" ? base.clone().lerp(new THREE.Color("#090b12"), 0.48) : base;
  drawBase(context, crustBase, dark);
  switch (surface) {
    case "banded":
      drawBands(context, random, lightStyle, darkStyle);
      break;
    case "cratered":
      drawCraters(context, random, lightStyle, darkStyle);
      break;
    case "oceanic":
      drawOceanicSurface(context, random, base, lightStyle, darkStyle);
      break;
    case "icy":
      drawIcyFaults(context, random, lightStyle, darkStyle);
      break;
    case "crystalline":
      drawCrystallineFacets(context, random, lightStyle, darkStyle);
      break;
    case "volcanic":
      drawVolcanicFaults(context, random, lightStyle, darkStyle, emberStyle);
      break;
  }

  context.globalAlpha = 1;
  softenHorizontalSeam(context);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 1;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}
