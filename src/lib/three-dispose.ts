import * as THREE from "three";

/**
 * Recursively disposes all geometries, materials, and textures from a
 * THREE.Object3D subtree. Call this in component `useEffect` cleanup to
 * prevent GPU memory leaks when the scene unmounts or re-renders.
 */
export function disposeObject3D(object: THREE.Object3D | null | undefined): void {
  if (!object) return;
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach((m) => disposeMaterial(m));
    } else if (material) {
      disposeMaterial(material);
    }
  });
}

function disposeMaterial(material: THREE.Material): void {
  material.dispose();
  // Dispose any maps attached to the material to avoid texture leaks.
  const std = material as unknown as Record<string, unknown>;
  for (const key of [
    "map",
    "emissiveMap",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "alphaMap",
  ]) {
    const texture = std[key];
    if (texture instanceof THREE.Texture) texture.dispose();
  }
}
