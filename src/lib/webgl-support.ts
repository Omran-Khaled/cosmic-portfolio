export type WebGLSupport = {
  available: boolean;
  version: 1 | 2 | null;
};

export function detectWebGLSupport(): WebGLSupport {
  if (typeof document === "undefined") return { available: false, version: null };

  const canvas = document.createElement("canvas");
  const attributes: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true };
  if (canvas.getContext("webgl2", attributes)) return { available: true, version: 2 };
  if (
    canvas.getContext("webgl", attributes) ||
    canvas.getContext("experimental-webgl", attributes)
  ) {
    return { available: true, version: 1 };
  }
  return { available: false, version: null };
}

export function shouldUseMobileUniverse(
  viewportWidth: number,
  support = detectWebGLSupport(),
): boolean {
  if (viewportWidth < 768 || !support.available) return true;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return true;

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const hardwareConcurrency = navigator.hardwareConcurrency;
  return (deviceMemory !== undefined && deviceMemory <= 2) || hardwareConcurrency <= 2;
}
