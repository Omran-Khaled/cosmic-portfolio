import * as THREE from "three";

/**
 * Recursively disposes all geometries, materials, and textures from a
 * THREE.Object3D subtree. Call this in component `useEffect` cleanup to
 * prevent GPU memory leaks when the scene unmounts or re-renders.
 */
export function disposeObject3D(object: THREE.Object3D | null | undefined): void {
  if (!object) return;

  // A scene subtree can intentionally reuse one geometry/material across
  // several meshes (Constellation shares its line geometry). Dispose each
  // owned resource once per subtree instead of issuing duplicate dispose calls.
  const disposedGeometries = new Set<THREE.BufferGeometry>();
  const disposedMaterials = new Set<THREE.Material>();
  const disposedTextures = new Set<THREE.Texture>();

  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry && !disposedGeometries.has(mesh.geometry)) {
      disposedGeometries.add(mesh.geometry);
      mesh.geometry.dispose();
    }
    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach((item) => disposeMaterial(item, disposedMaterials, disposedTextures));
    } else if (material) {
      disposeMaterial(material, disposedMaterials, disposedTextures);
    }
  });
}

function disposeMaterial(
  material: THREE.Material,
  disposedMaterials: Set<THREE.Material>,
  disposedTextures: Set<THREE.Texture>,
): void {
  if (disposedMaterials.has(material)) return;
  disposedMaterials.add(material);
  material.dispose();

  // Dispose maps owned by this subtree, while deduplicating shared textures.
  const std = material as unknown as Record<string, unknown>;
  for (const key of [
    "map",
    "emissiveMap",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "alphaMap",
    "aoMap",
    "bumpMap",
    "displacementMap",
    "lightMap",
    "specularMap",
    "envMap",
  ]) {
    const texture = std[key];
    if (texture instanceof THREE.Texture && !disposedTextures.has(texture)) {
      disposedTextures.add(texture);
      texture.dispose();
    }
  }
}

/**
 * Disposes a WebGLRenderer instance completely, including its DOM element,
 * render targets, and any attached state. Call this when the canvas unmounts
 * to free all GPU resources and prevent "Context Lost" warnings.
 */
export function disposeRenderer(renderer: THREE.WebGLRenderer | null | undefined): void {
  if (!renderer) return;
  renderer.dispose();
  renderer.forceContextLoss();
  const dom = renderer.domElement;
  if (dom && dom.parentElement) {
    dom.parentElement.removeChild(dom);
  }
}

/**
 * Cancels a requestAnimationFrame loop safely. Pass the id returned by
 * `requestAnimationFrame` and this will cancel it if it's still valid.
 */
export function cancelAnimationLoop(rafId: number | null | undefined): void {
  if (rafId !== null && rafId !== undefined) {
    cancelAnimationFrame(rafId);
  }
}
