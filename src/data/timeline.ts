export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  detail: string;
}

export const timeline: TimelineEntry[] = [
  {
    year: "2021",
    title: "Foundations",
    body: "HTML, CSS and JavaScript fundamentals — layout, the box model, and the DOM.",
    detail:
      "Rebuilt real interfaces from screenshots to learn spacing, hierarchy and the cascade the hard way.",
  },
  {
    year: "2025",
    title: "React Training",
    body: "Component architecture, state management, and building real multi-screen interfaces.",
    detail:
      "Moved from page-thinking to component-thinking: props as contracts, state at the lowest owning node.",
  },
  {
    year: "2024",
    title: "Design Systems",
    body: "Tokens, accessibility standards, and reusable component libraries in production work.",
    detail:
      "Learned that a system is documentation plus constraints — the components are only the visible part.",
  },
  {
    year: "2026",
    title: "Full-stack Practice",
    body: "APIs, MongoDB, and connecting interfaces to real data lifecycles.",
    detail:
      "Modelling data around events rather than states changed how I design front-end flows too.",
  },
  {
    year: "2025",
    title: "AI Engineering",
    body: "Prompt engineering, AI-assisted workflows, and evaluation of generated output.",
    detail:
      "Specification became the real skill: the clearer the contract, the better the generated code.",
  },
];
