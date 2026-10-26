export function gradePlanetColor(planetColor: string, orbitColor: string): string {
  const p = parseHex(planetColor);
  const o = parseHex(orbitColor);

  const r = Math.round(p.r * 0.72 + o.r * 0.28);
  const g = Math.round(p.g * 0.72 + o.g * 0.28);
  const b = Math.round(p.b * 0.72 + o.b * 0.28);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}
