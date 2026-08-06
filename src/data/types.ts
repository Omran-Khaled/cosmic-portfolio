export type Vec3 = [number, number, number];

export type SubSkill = {
  name: string;
  tags: string[];
  note?: string;
};

export type Planet = {
  id: string;
  name: string;
  orbit: string;
  radius: number;
  size: number;
  speed: number;
  color: string;
  offset: number;
  summary: string;
  /** 0–1 mastery signal rendered as a bar. */
  level: number;
  /** Detailed, opinionated bullets — the "how I actually work" layer. */
  depth: string[];
  /** Concrete evidence of the skill in shipped work. */
  evidence: string;
  moons: SubSkill[];
};

export type Galaxy = {
  id: string;
  name: string;
  tagline: string;
  color: string;
  position: Vec3;
  year: string;
  role: string;
  duration: string;
  type: string;
  status: string;
  stack: string[];
  links: { demo: string; github: string };
  metrics: { label: string; value: string }[];
  features: string[];
  challenges: { title: string; body: string }[];
  layers: {
    problem: string;
    solution: string;
    decisions: string[];
    impact: string;
  };
  demo?: string;
};

export type TimelineEntry = {
  id: string;
  year: string;
  title: string;
  body: string;
  detail: string;
};

export type LanguageEntry = {
  name: string;
  level: string;
  strength: number;
};

export type ContactLine = {
  label: string;
  value: string;
};

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
};

export type BlackHolePillar = {
  title: string;
  body: string;
};

export type BlackHoleLoopStep = {
  step: string;
  body: string;
};
