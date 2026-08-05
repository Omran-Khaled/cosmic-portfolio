export interface Identity {
  name: string;
  role: string;
  location: string;
  headline: string;
  bio: string;
  fragments: string[];
  stats: { label: string; value: string }[];
  principles: string[];
}

export const identity: Identity = {
  name: "Omran Khaled",
  role: "Front-end Developer",
  location: "Damascus, Syria",
  headline: "I build interfaces as systems — typed, tokenized, accessible, and fast.",
  bio: "Front-end developer focused on component architecture, design systems and AI-assisted engineering. I work from constraints: define the contract, model the states, then build the smallest interface that satisfies both. Arabic-first products, RTL parity, and measurable performance budgets are part of the definition of done — not a later pass.",
  fragments: [
    "Builds interfaces as systems, not screens",
    "Component-driven thinking end to end",
    "Ships accessible, performant React",
    "Designs with constraints, codes with intent",
    "Collaborates with AI as an engineering tool",
  ],
  stats: [
    { label: "Years building", value: "2+" },
    { label: "Core stack", value: "React · TS" },
    { label: "Directions", value: "RTL + LTR" },
    { label: "Focus", value: "Systems · AI" },
  ],
  principles: [
    "A component is a contract: props in, behaviour out, nothing hidden.",
    "Tokens before values — a colour typed by hand is a future bug.",
    "Accessibility is a requirement in the ticket, not a review comment.",
    "Performance is budgeted before it is optimised.",
  ],
};
