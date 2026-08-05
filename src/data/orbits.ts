export interface Orbit {
  id: string;
  name: string;
  color: string;
}

export const orbits: Orbit[] = [
  { id: "frontend", name: "Front-end Engineering Orbit", color: "#67e8f9" },
  { id: "ux", name: "UX Orbit", color: "#f0abfc" },
  { id: "engineering", name: "Engineering Orbit", color: "#fbbf24" },
  { id: "ai", name: "AI Orbit", color: "#7dd3fc" },
];
