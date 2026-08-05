import type { Planet } from "./types";

export const planets: Planet[] = [
  {
    id: "component-driven",
    name: "Component-Driven Development",
    orbit: "frontend",
    radius: 7,
    size: 0.62,
    speed: 0.16,
    color: "#67e8f9",
    offset: 0.2,
    summary: "Interfaces decomposed into contracts: props in, behaviour out, no hidden coupling.",
    level: 0.92,
    depth: [
      "Start from states, not screens: empty, loading, partial, error, success — each one designed before markup exists.",
      "Presentational components stay pure; data access lives in hooks so the same UI can be story-tested and reused.",
      "Compound components with slots instead of twenty boolean props that no one can read six months later.",
    ],
    evidence:
      "Wnadr's entire surface is assembled from ~30 primitives; new screens ship without new CSS.",
    moons: [
      {
        name: "Composition",
        tags: ["Slots", "Headless UI"],
        note: "Behaviour and markup separated so styling never forks logic.",
      },
      {
        name: "State boundaries",
        tags: ["Local vs global"],
        note: "State lives at the lowest node that still owns the truth.",
      },
    ],
  },
  {
    id: "react",
    name: "React Ecosystem",
    orbit: "frontend",
    radius: 9,
    size: 0.75,
    speed: 0.13,
    color: "#22d3ee",
    offset: 2.1,
    summary:
      "React as a rendering model — hooks, data flow, routing and caching used deliberately.",
    level: 0.9,
    depth: [
      "Server state and client state kept apart: React Query owns the cache, React owns the interaction.",
      "Suspense boundaries placed at meaningful UI seams so loading is a designed state, not a spinner blanket.",
      "Effects are a last resort; derived values are computed during render instead of synchronised after it.",
    ],
    evidence:
      "This universe: lazy 3D layer, context-driven focus state, zero effect-based data fetching.",
    moons: [
      {
        name: "Hooks",
        tags: ["React 19", "Suspense"],
        note: "Custom hooks as the unit of reusable behaviour.",
      },
      {
        name: "Routing & data",
        tags: ["TanStack", "Query"],
        note: "Loaders prefetch, components read from cache.",
      },
    ],
  },
  {
    id: "reusable-ui",
    name: "Reusable UI",
    orbit: "frontend",
    radius: 11,
    size: 0.55,
    speed: 0.1,
    color: "#a5f3fc",
    offset: 4.4,
    summary: "One primitive, many products. Variants over forks, tokens over hardcoded values.",
    level: 0.88,
    depth: [
      "Every variant is declared with CVA so the type system enumerates what a component can look like.",
      "No raw colour in components — only semantic tokens, which makes theming a data change.",
      "A primitive earns extension only after a third real use case; before that, it stays local.",
    ],
    evidence:
      "Glass surfaces, elevation and focus rings encoded once and consumed across every Wnadr screen.",
    moons: [
      {
        name: "Variants",
        tags: ["CVA", "Tailwind"],
        note: "Typed variant maps instead of conditional class soup.",
      },
      {
        name: "Primitives",
        tags: ["Radix", "shadcn"],
        note: "Accessible behaviour inherited, visuals owned.",
      },
    ],
  },
  {
    id: "a11y",
    name: "Accessibility",
    orbit: "ux",
    radius: 13.5,
    size: 0.6,
    speed: 0.085,
    color: "#f0abfc",
    offset: 1.1,
    summary: "Keyboard paths, semantics and contrast treated as requirements, not polish.",
    level: 0.84,
    depth: [
      "Every interactive flow is walked with the keyboard before it is called done — tab order, escape, focus return.",
      "Landmarks and headings form a readable document outline for screen readers, not just a visual hierarchy.",
      "Contrast checked at token level, so a theme cannot ship an unreadable pairing.",
    ],
    evidence:
      "Modal, menu and drawer patterns with managed focus traps and restored focus on close.",
    moons: [
      {
        name: "Semantics",
        tags: ["ARIA", "Landmarks"],
        note: "Native elements first; ARIA only to fill real gaps.",
      },
      {
        name: "Focus",
        tags: ["Traps", "Order"],
        note: "Focus is explicitly moved and explicitly returned.",
      },
    ],
  },
  {
    id: "responsive",
    name: "Responsive Design",
    orbit: "ux",
    radius: 15.5,
    size: 0.66,
    speed: 0.07,
    color: "#e879f9",
    offset: 3.3,
    summary: "Layouts that survive any viewport, any direction — including full RTL mirroring.",
    level: 0.9,
    depth: [
      "Logical properties (inline/block) everywhere, so Arabic layouts mirror without a second stylesheet.",
      "Container queries where a component must adapt to its slot rather than the window.",
      "Fluid type and spacing scales instead of breakpoint-by-breakpoint overrides.",
    ],
    evidence:
      "Khuta runs Arabic RTL and English LTR from one layout tree with no duplicated screens.",
    moons: [
      {
        name: "Fluid layout",
        tags: ["Grid", "Container queries"],
        note: "Intrinsic sizing over fixed breakpoints.",
      },
      {
        name: "RTL / LTR",
        tags: ["Bidi", "Logical props"],
        note: "Direction is data, not a design variant.",
      },
    ],
  },
  {
    id: "design-systems",
    name: "Design Systems",
    orbit: "ux",
    radius: 17.5,
    size: 0.7,
    speed: 0.06,
    color: "#c084fc",
    offset: 5.6,
    summary:
      "Semantic tokens, documented components, and a shared language between design and code.",
    level: 0.87,
    depth: [
      "Three token tiers: primitive palette → semantic role → component slot. Components only touch the last two.",
      "Dark mode is a token swap; no component branches on theme.",
      "Usage rules documented next to the component: when to use it, and when not to.",
    ],
    evidence: "Wnadr: a glassmorphic system with dark/light parity guaranteed by construction.",
    moons: [
      {
        name: "Tokens",
        tags: ["oklch", "Theming"],
        note: "oklch keeps perceived lightness stable across hues.",
      },
      {
        name: "Docs",
        tags: ["Usage rules"],
        note: "A component without guidance is a future inconsistency.",
      },
    ],
  },
  {
    id: "clean-code",
    name: "Clean Code",
    orbit: "engineering",
    radius: 20,
    size: 0.58,
    speed: 0.05,
    color: "#fbbf24",
    offset: 0.8,
    summary: "Readable over clever. Naming, small units, and predictable data flow.",
    level: 0.86,
    depth: [
      "Names carry intent; a comment explaining what code does is a signal the code should be rewritten.",
      "Functions do one thing at one level of abstraction — mixing orchestration and detail is the usual smell.",
      "Tests cover the paths that would cost real users, not a coverage percentage.",
    ],
    evidence:
      "Feature-sliced repos where a newcomer can locate any behaviour from the folder name alone.",
    moons: [
      {
        name: "Naming",
        tags: ["Intent-first"],
        note: "Domain vocabulary, not framework vocabulary.",
      },
      {
        name: "Testing",
        tags: ["Critical paths"],
        note: "Behaviour-level tests that survive refactors.",
      },
    ],
  },
  {
    id: "architecture",
    name: "Architecture",
    orbit: "engineering",
    radius: 22.5,
    size: 0.8,
    speed: 0.042,
    color: "#f59e0b",
    offset: 2.9,
    summary: "Feature-sliced structure, clear boundaries, and data-driven UI layers.",
    level: 0.83,
    depth: [
      "Features own their components, hooks and types; shared code must be promoted deliberately, never by accident.",
      "Boundaries enforced by types: Zod at the network edge means invalid data never reaches a component.",
      "UI is rendered from data structures, so adding content is editing a file, not writing markup.",
    ],
    evidence:
      "This portfolio renders every planet, galaxy and route from a single typed data module.",
    moons: [
      {
        name: "Layering",
        tags: ["Features", "Lib"],
        note: "Dependency direction only points inward.",
      },
      {
        name: "Contracts",
        tags: ["TypeScript", "Zod"],
        note: "Runtime validation mirrors the compile-time type.",
      },
    ],
  },
  {
    id: "performance",
    name: "Performance",
    orbit: "engineering",
    radius: 25,
    size: 0.64,
    speed: 0.035,
    color: "#fde68a",
    offset: 4.9,
    summary: "Budget-driven: lazy boundaries, memo where it pays, and measured render cost.",
    level: 0.82,
    depth: [
      "Heavy layers (3D, editors, charts) load behind lazy boundaries so first paint stays cheap.",
      "Memoisation applied after profiling, never as a reflex — most re-renders are cheaper than the comparison.",
      "Animation runs on transform and opacity only; geometry is generated once and reused.",
    ],
    evidence:
      "This scene: adaptive DPR, buffer geometries built in useMemo, and a browser-only 3D bundle.",
    moons: [
      {
        name: "Loading",
        tags: ["Code split", "Lazy 3D"],
        note: "Ship the interaction, defer the spectacle.",
      },
      {
        name: "Runtime",
        tags: ["Memo", "Virtualise"],
        note: "Long lists are windowed, not trimmed.",
      },
    ],
  },
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    orbit: "ai",
    radius: 28,
    size: 0.6,
    speed: 0.028,
    color: "#7dd3fc",
    offset: 1.7,
    summary: "Specification as an interface: constraints, examples, and explicit success criteria.",
    level: 0.85,
    depth: [
      "A prompt is written like an API: role, inputs, constraints, output shape, and refusal rules.",
      "Ambiguity is removed before generation — every unclear requirement becomes a wrong answer later.",
      "Iteration happens by diff: describe the delta, not the whole thing again.",
    ],
    evidence:
      "Structured prompt templates reused across UI generation, refactors and review passes.",
    moons: [
      {
        name: "Structure",
        tags: ["Roles", "Constraints"],
        note: "Explicit output contracts beat polite requests.",
      },
      {
        name: "Iteration",
        tags: ["Diff prompting"],
        note: "Small deltas keep context and quality stable.",
      },
    ],
  },
  {
    id: "ai-collaboration",
    name: "AI Collaboration",
    orbit: "ai",
    radius: 30.5,
    size: 0.55,
    speed: 0.024,
    color: "#38bdf8",
    offset: 3.9,
    summary: "AI as a pair, not an author — scoped tasks, reviewed diffs, owned decisions.",
    level: 0.88,
    depth: [
      "Tasks are scoped small enough that the generated diff can be read like a pull request.",
      "Types and tests act as guardrails: the model can move fast because the compiler pushes back.",
      "Architecture and UX decisions stay human; generation handles the execution surface.",
    ],
    evidence: "AI-assisted delivery on production features with every line reviewed before merge.",
    moons: [
      {
        name: "Workflow",
        tags: ["Scoping", "Review"],
        note: "Generate → review → correct, never generate → ship.",
      },
      {
        name: "Guardrails",
        tags: ["Types", "Tests"],
        note: "The type system is the cheapest reviewer.",
      },
    ],
  },
  {
    id: "evaluation",
    name: "Evaluation",
    orbit: "ai",
    radius: 33,
    size: 0.5,
    speed: 0.02,
    color: "#0ea5e9",
    offset: 5.9,
    summary: "Output judged against criteria: correctness, maintainability, and user impact.",
    level: 0.78,
    depth: [
      "Criteria written before the output exists, so judgement isn't rationalised after the fact.",
      "Two candidates compared side by side beats one candidate judged alone.",
      "Regressions tracked: what worked last time becomes the baseline for this time.",
    ],
    evidence:
      "Rubric-based review of generated components covering a11y, tokens and state coverage.",
    moons: [
      {
        name: "Criteria",
        tags: ["Rubrics"],
        note: "Correct, readable, accessible, tokenised — in that order.",
      },
      {
        name: "Regression",
        tags: ["Compare runs"],
        note: "Keep the better run as the new baseline.",
      },
    ],
  },
];
