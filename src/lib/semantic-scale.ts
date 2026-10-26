import * as THREE from "three";
import {
  SEMANTIC_SCALE_DAMPING,
  SEMANTIC_SCALE_EXPONENT,
  SEMANTIC_SCALE_MAX,
  SEMANTIC_SCALE_REFERENCE_DISTANCE,
} from "@/constants/cinematic";

export function getSemanticScale(distance: number): number {
  const compensation = Math.pow(
    Math.max(distance, SEMANTIC_SCALE_REFERENCE_DISTANCE) / SEMANTIC_SCALE_REFERENCE_DISTANCE,
    SEMANTIC_SCALE_EXPONENT,
  );
  return THREE.MathUtils.clamp(compensation, 1, SEMANTIC_SCALE_MAX);
}

export function dampSemanticScale(current: number, distance: number, delta: number): number {
  return THREE.MathUtils.damp(current, getSemanticScale(distance), SEMANTIC_SCALE_DAMPING, delta);
}
