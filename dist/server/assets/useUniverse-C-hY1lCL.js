import { Fragment, jsx } from "react/jsx-runtime";
import { create } from "zustand";
//#region src/data/identity.ts
var identity = {
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
		"Collaborates with AI as an engineering tool"
	],
	stats: [
		{
			label: "Years building",
			value: "2+"
		},
		{
			label: "Core stack",
			value: "React · TS"
		},
		{
			label: "Directions",
			value: "RTL + LTR"
		},
		{
			label: "Focus",
			value: "Systems · AI"
		}
	],
	principles: [
		"A component is a contract: props in, behaviour out, nothing hidden.",
		"Tokens before values — a colour typed by hand is a future bug.",
		"Accessibility is a requirement in the ticket, not a review comment.",
		"Performance is budgeted before it is optimised."
	]
};
//#endregion
//#region src/data/contact.ts
var contact = {
	title: "Space Station",
	position: [
		26,
		16,
		30
	],
	lines: [
		{
			label: "Name",
			value: "Omran Khaled"
		},
		{
			label: "Role",
			value: "Front-end Developer"
		},
		{
			label: "Location",
			value: "Damascus, Syria"
		},
		{
			label: "Availability",
			value: "Open to work"
		}
	],
	channels: [
		{
			label: "GitHub",
			value: "@Omran-Khaled",
			href: "https://github.com/Omran-Khaled"
		},
		{
			label: "LinkedIn",
			value: "in/omran-khaled",
			href: "https://www.linkedin.com/in/omran-khaled-334726426"
		},
		{
			label: "Email",
			value: "omranhk815@gmail.com",
			href: "mailto:omranhk815@gmail.com",
			obfuscated: "omranhk815 [at] gmail [dot] com"
		}
	]
};
//#endregion
//#region src/data/orbits.ts
var orbits = [
	{
		id: "frontend",
		name: "Front-end Engineering Orbit",
		color: "#67e8f9"
	},
	{
		id: "ux",
		name: "UX Orbit",
		color: "#f0abfc"
	},
	{
		id: "engineering",
		name: "Engineering Orbit",
		color: "#fbbf24"
	},
	{
		id: "ai",
		name: "AI Orbit",
		color: "#7dd3fc"
	}
];
//#endregion
//#region src/data/planets.ts
var planets = [
	{
		id: "component-driven",
		name: "Component-Driven Development",
		orbit: "frontend",
		radius: 7,
		size: .62,
		speed: .16,
		color: "#67e8f9",
		offset: .2,
		summary: "Interfaces decomposed into contracts: props in, behaviour out, no hidden coupling.",
		level: .92,
		depth: [
			"Start from states, not screens: empty, loading, partial, error, success — each one designed before markup exists.",
			"Presentational components stay pure; data access lives in hooks so the same UI can be story-tested and reused.",
			"Compound components with slots instead of twenty boolean props that no one can read six months later."
		],
		evidence: "Wnadr's entire surface is assembled from ~30 primitives; new screens ship without new CSS.",
		moons: [{
			name: "Composition",
			tags: ["Slots", "Headless UI"],
			note: "Behaviour and markup separated so styling never forks logic."
		}, {
			name: "State boundaries",
			tags: ["Local vs global"],
			note: "State lives at the lowest node that still owns the truth."
		}]
	},
	{
		id: "react",
		name: "React Ecosystem",
		orbit: "frontend",
		radius: 9,
		size: .75,
		speed: .13,
		color: "#22d3ee",
		offset: 2.1,
		summary: "React as a rendering model — hooks, data flow, routing and caching used deliberately.",
		level: .9,
		depth: [
			"Server state and client state kept apart: React Query owns the cache, React owns the interaction.",
			"Suspense boundaries placed at meaningful UI seams so loading is a designed state, not a spinner blanket.",
			"Effects are a last resort; derived values are computed during render instead of synchronised after it."
		],
		evidence: "This universe: lazy 3D layer, context-driven focus state, zero effect-based data fetching.",
		moons: [{
			name: "Hooks",
			tags: ["React 19", "Suspense"],
			note: "Custom hooks as the unit of reusable behaviour."
		}, {
			name: "Routing & data",
			tags: ["TanStack", "Query"],
			note: "Loaders prefetch, components read from cache."
		}]
	},
	{
		id: "reusable-ui",
		name: "Reusable UI",
		orbit: "frontend",
		radius: 11,
		size: .55,
		speed: .1,
		color: "#a5f3fc",
		offset: 4.4,
		summary: "One primitive, many products. Variants over forks, tokens over hardcoded values.",
		level: .88,
		depth: [
			"Every variant is declared with CVA so the type system enumerates what a component can look like.",
			"No raw colour in components — only semantic tokens, which makes theming a data change.",
			"A primitive earns extension only after a third real use case; before that, it stays local."
		],
		evidence: "Glass surfaces, elevation and focus rings encoded once and consumed across every Wnadr screen.",
		moons: [{
			name: "Variants",
			tags: ["CVA", "Tailwind"],
			note: "Typed variant maps instead of conditional class soup."
		}, {
			name: "Primitives",
			tags: ["Radix", "shadcn"],
			note: "Accessible behaviour inherited, visuals owned."
		}]
	},
	{
		id: "a11y",
		name: "Accessibility",
		orbit: "ux",
		radius: 13.5,
		size: .6,
		speed: .085,
		color: "#f0abfc",
		offset: 1.1,
		summary: "Keyboard paths, semantics and contrast treated as requirements, not polish.",
		level: .84,
		depth: [
			"Every interactive flow is walked with the keyboard before it is called done — tab order, escape, focus return.",
			"Landmarks and headings form a readable document outline for screen readers, not just a visual hierarchy.",
			"Contrast checked at token level, so a theme cannot ship an unreadable pairing."
		],
		evidence: "Modal, menu and drawer patterns with managed focus traps and restored focus on close.",
		moons: [{
			name: "Semantics",
			tags: ["ARIA", "Landmarks"],
			note: "Native elements first; ARIA only to fill real gaps."
		}, {
			name: "Focus",
			tags: ["Traps", "Order"],
			note: "Focus is explicitly moved and explicitly returned."
		}]
	},
	{
		id: "responsive",
		name: "Responsive Design",
		orbit: "ux",
		radius: 15.5,
		size: .66,
		speed: .07,
		color: "#e879f9",
		offset: 3.3,
		summary: "Layouts that survive any viewport, any direction — including full RTL mirroring.",
		level: .9,
		depth: [
			"Logical properties (inline/block) everywhere, so Arabic layouts mirror without a second stylesheet.",
			"Container queries where a component must adapt to its slot rather than the window.",
			"Fluid type and spacing scales instead of breakpoint-by-breakpoint overrides."
		],
		evidence: "Khuta runs Arabic RTL and English LTR from one layout tree with no duplicated screens.",
		moons: [{
			name: "Fluid layout",
			tags: ["Grid", "Container queries"],
			note: "Intrinsic sizing over fixed breakpoints."
		}, {
			name: "RTL / LTR",
			tags: ["Bidi", "Logical props"],
			note: "Direction is data, not a design variant."
		}]
	},
	{
		id: "design-systems",
		name: "Design Systems",
		orbit: "ux",
		radius: 17.5,
		size: .7,
		speed: .06,
		color: "#c084fc",
		offset: 5.6,
		summary: "Semantic tokens, documented components, and a shared language between design and code.",
		level: .87,
		depth: [
			"Three token tiers: primitive palette → semantic role → component slot. Components only touch the last two.",
			"Dark mode is a token swap; no component branches on theme.",
			"Usage rules documented next to the component: when to use it, and when not to."
		],
		evidence: "Wnadr: a glassmorphic system with dark/light parity guaranteed by construction.",
		moons: [{
			name: "Tokens",
			tags: ["oklch", "Theming"],
			note: "oklch keeps perceived lightness stable across hues."
		}, {
			name: "Docs",
			tags: ["Usage rules"],
			note: "A component without guidance is a future inconsistency."
		}]
	},
	{
		id: "clean-code",
		name: "Clean Code",
		orbit: "engineering",
		radius: 20,
		size: .58,
		speed: .05,
		color: "#fbbf24",
		offset: .8,
		summary: "Readable over clever. Naming, small units, and predictable data flow.",
		level: .86,
		depth: [
			"Names carry intent; a comment explaining what code does is a signal the code should be rewritten.",
			"Functions do one thing at one level of abstraction — mixing orchestration and detail is the usual smell.",
			"Tests cover the paths that would cost real users, not a coverage percentage."
		],
		evidence: "Feature-sliced repos where a newcomer can locate any behaviour from the folder name alone.",
		moons: [{
			name: "Naming",
			tags: ["Intent-first"],
			note: "Domain vocabulary, not framework vocabulary."
		}, {
			name: "Testing",
			tags: ["Critical paths"],
			note: "Behaviour-level tests that survive refactors."
		}]
	},
	{
		id: "architecture",
		name: "Architecture",
		orbit: "engineering",
		radius: 22.5,
		size: .8,
		speed: .042,
		color: "#f59e0b",
		offset: 2.9,
		summary: "Feature-sliced structure, clear boundaries, and data-driven UI layers.",
		level: .83,
		depth: [
			"Features own their components, hooks and types; shared code must be promoted deliberately, never by accident.",
			"Boundaries enforced by types: Zod at the network edge means invalid data never reaches a component.",
			"UI is rendered from data structures, so adding content is editing a file, not writing markup."
		],
		evidence: "This portfolio renders every planet, galaxy and route from a single typed data module.",
		moons: [{
			name: "Layering",
			tags: ["Features", "Lib"],
			note: "Dependency direction only points inward."
		}, {
			name: "Contracts",
			tags: ["TypeScript", "Zod"],
			note: "Runtime validation mirrors the compile-time type."
		}]
	},
	{
		id: "performance",
		name: "Performance",
		orbit: "engineering",
		radius: 25,
		size: .64,
		speed: .035,
		color: "#fde68a",
		offset: 4.9,
		summary: "Budget-driven: lazy boundaries, memo where it pays, and measured render cost.",
		level: .82,
		depth: [
			"Heavy layers (3D, editors, charts) load behind lazy boundaries so first paint stays cheap.",
			"Memoisation applied after profiling, never as a reflex — most re-renders are cheaper than the comparison.",
			"Animation runs on transform and opacity only; geometry is generated once and reused."
		],
		evidence: "This scene: adaptive DPR, buffer geometries built in useMemo, and a browser-only 3D bundle.",
		moons: [{
			name: "Loading",
			tags: ["Code split", "Lazy 3D"],
			note: "Ship the interaction, defer the spectacle."
		}, {
			name: "Runtime",
			tags: ["Memo", "Virtualise"],
			note: "Long lists are windowed, not trimmed."
		}]
	},
	{
		id: "prompt-engineering",
		name: "Prompt Engineering",
		orbit: "ai",
		radius: 28,
		size: .6,
		speed: .028,
		color: "#7dd3fc",
		offset: 1.7,
		summary: "Specification as an interface: constraints, examples, and explicit success criteria.",
		level: .85,
		depth: [
			"A prompt is written like an API: role, inputs, constraints, output shape, and refusal rules.",
			"Ambiguity is removed before generation — every unclear requirement becomes a wrong answer later.",
			"Iteration happens by diff: describe the delta, not the whole thing again."
		],
		evidence: "Structured prompt templates reused across UI generation, refactors and review passes.",
		moons: [{
			name: "Structure",
			tags: ["Roles", "Constraints"],
			note: "Explicit output contracts beat polite requests."
		}, {
			name: "Iteration",
			tags: ["Diff prompting"],
			note: "Small deltas keep context and quality stable."
		}]
	},
	{
		id: "ai-collaboration",
		name: "AI Collaboration",
		orbit: "ai",
		radius: 30.5,
		size: .55,
		speed: .024,
		color: "#38bdf8",
		offset: 3.9,
		summary: "AI as a pair, not an author — scoped tasks, reviewed diffs, owned decisions.",
		level: .88,
		depth: [
			"Tasks are scoped small enough that the generated diff can be read like a pull request.",
			"Types and tests act as guardrails: the model can move fast because the compiler pushes back.",
			"Architecture and UX decisions stay human; generation handles the execution surface."
		],
		evidence: "AI-assisted delivery on production features with every line reviewed before merge.",
		moons: [{
			name: "Workflow",
			tags: ["Scoping", "Review"],
			note: "Generate → review → correct, never generate → ship."
		}, {
			name: "Guardrails",
			tags: ["Types", "Tests"],
			note: "The type system is the cheapest reviewer."
		}]
	},
	{
		id: "evaluation",
		name: "Evaluation",
		orbit: "ai",
		radius: 33,
		size: .5,
		speed: .02,
		color: "#0ea5e9",
		offset: 5.9,
		summary: "Output judged against criteria: correctness, maintainability, and user impact.",
		level: .78,
		depth: [
			"Criteria written before the output exists, so judgement isn't rationalised after the fact.",
			"Two candidates compared side by side beats one candidate judged alone.",
			"Regressions tracked: what worked last time becomes the baseline for this time."
		],
		evidence: "Rubric-based review of generated components covering a11y, tokens and state coverage.",
		moons: [{
			name: "Criteria",
			tags: ["Rubrics"],
			note: "Correct, readable, accessible, tokenised — in that order."
		}, {
			name: "Regression",
			tags: ["Compare runs"],
			note: "Keep the better run as the new baseline."
		}]
	}
];
//#endregion
//#region src/data/galaxies.ts
var galaxies = [
	{
		id: "khuta",
		name: "Khuta",
		tagline: "Multilingual trip planning, mapped",
		color: "#34d399",
		position: [
			-38,
			8,
			-18
		],
		year: "2026",
		role: "Front-end Developer",
		duration: "3 months",
		type: "Product · Web app",
		status: "Live",
		stack: [
			"React",
			"TypeScript",
			"i18n",
			"RTL/LTR",
			"Maps",
			"Tailwind"
		],
		links: {
			demo: "/khuta.mp4",
			github: "https://github.com/Omran-Khaled/khuta"
		},
		metrics: [
			{
				label: "Languages",
				value: "AR + EN"
			},
			{
				label: "Layout forks",
				value: "0"
			},
			{
				label: "Screens",
				value: "18"
			}
		],
		features: [
			"Interactive map that builds the itinerary as you drop stops",
			"Full RTL mirroring with a single layout tree",
			"Typed translation keys with build-time missing-string detection",
			"Day-by-day planner with drag reordering and travel-time hints",
			"Shareable trip links that restore full map state"
		],
		challenges: [{
			title: "RTL without a second stylesheet",
			body: "Physical CSS properties made Arabic a fork. Migrating everything to logical properties and mirroring only directional icons turned direction into a single data flag."
		}, {
			title: "Map as the source of truth",
			body: "Itinerary list and map drifted out of sync. Making the map state canonical and rendering the list from it removed an entire class of bug."
		}],
		layers: {
			problem: "Travellers planning across Arabic and English needed one product that felt native in both directions, with real geography instead of static lists.",
			solution: "A trip planner with a fully mirrored RTL/LTR layer, localized content pipeline, and an interactive map that drives itinerary building.",
			decisions: [
				"Logical CSS properties everywhere so RTL is a data flip, not a second stylesheet",
				"Map state kept as the single source of truth for the itinerary",
				"Translation keys typed to prevent missing-string regressions"
			],
			impact: "One codebase serving two language directions with no layout forks and no duplicated screens."
		}
	},
	{
		id: "wnadr",
		name: "Wnadr",
		tagline: "A design system wearing glass",
		color: "#a78bfa",
		position: [
			42,
			-6,
			-12
		],
		year: "2026",
		role: "Design Systems Engineer",
		duration: "2 months",
		type: "Design system · Library",
		status: "Maintained",
		stack: [
			"Design System",
			"Tailwind",
			"CVA",
			"Radix",
			"Tokens",
			"Dark Mode"
		],
		links: {
			demo: "/wandr.mp4",
			github: "https://github.com/Omran-Khaled/wandr"
		},
		metrics: [
			{
				label: "Primitives",
				value: "30+"
			},
			{
				label: "Themes",
				value: "2 (token swap)"
			},
			{
				label: "Raw colours",
				value: "0"
			}
		],
		features: [
			"Three-tier token architecture: palette → semantic role → component slot",
			"Glassmorphic surface variants with encoded blur and elevation",
			"Dark and light parity achieved through token swapping only",
			"Typed variant maps via CVA for every component state",
			"Accessible primitives built on Radix behaviour"
		],
		challenges: [{
			title: "Glass that stays readable",
			body: "Blurred surfaces destroyed contrast on busy backgrounds. Encoding a scrim layer into the surface variant kept text legible on any background without per-screen tuning."
		}, {
			title: "Stopping variant sprawl",
			body: "Every new screen wanted a new variant. A rule — extend only after a third real use case — kept the system small and the components predictable."
		}],
		layers: {
			problem: "The product needed a visual identity that stayed coherent across dark and light surfaces while remaining fast to extend.",
			solution: "A token-first design system with glassmorphic surfaces, a strict semantic palette, and component variants covering every state.",
			decisions: [
				"Semantic tokens only — no raw colour values in components",
				"Dark mode as a token swap rather than conditional styling",
				"Blur and elevation encoded as reusable surface variants"
			],
			impact: "New screens assembled from existing primitives, with theme parity guaranteed by construction."
		}
	},
	{
		id: "library-system",
		name: "Library System",
		tagline: "Full-stack, end to end",
		color: "#fb7185",
		position: [
			-6,
			-16,
			40
		],
		year: "2026",
		role: "Full-stack Developer",
		duration: "4 months",
		type: "Full-stack application",
		status: "Complete",
		stack: [
			"React",
			"Node.js",
			"Express",
			"MongoDB",
			"REST",
			"JWT Auth"
		],
		links: {
			demo: "/library.mp4",
			github: "https://github.com/Omran-Khaled/Library-Inventory-Management-System"
		},
		metrics: [
			{
				label: "Roles",
				value: "Admin · Member"
			},
			{
				label: "Entities",
				value: "Books · Members · Loans"
			},
			{
				label: "API surface",
				value: "REST"
			}
		],
		features: [
			"Catalogue with search, filtering and availability state",
			"Borrow / return lifecycle modelled as events, not flags",
			"Role-aware access with JWT sessions and protected routes",
			"Optimistic lending actions reconciled against the server",
			"Admin dashboard for members, overdue loans and inventory"
		],
		challenges: [{
			title: "Availability is derived, not stored",
			body: "A boolean 'available' column drifted from reality. Deriving availability from the loan event history made the data self-correcting."
		}, {
			title: "Honest optimistic UI",
			body: "Optimistic borrow actions could contradict the server. Reconciling against the response and rolling back visibly kept the interface trustworthy."
		}],
		layers: {
			problem: "Managing catalogue, members and lending required real persistence and role-aware access, not a front-end mock.",
			solution: "A full-stack application with REST APIs over MongoDB, modelled around borrowing lifecycles and availability.",
			decisions: [
				"Schema designed around lending events, not just book records",
				"API contracts validated on both ends to keep the client honest",
				"Optimistic UI for lending actions with server reconciliation"
			],
			impact: "A working system covering the full loop: data model, API surface, and the interface people actually use."
		}
	}
];
/** Story tour order: fixed celestial nodes + every project galaxy. */
var storyStops = [
	"sun",
	"orbits",
	...galaxies.map((g) => g.id),
	"blackhole",
	"station"
];
//#endregion
//#region src/data/blackhole.ts
var blackHole = {
	title: "AI Engineering",
	position: [
		0,
		22,
		-46
	],
	intro: "Gravity well of the system — where specification becomes software.",
	pillars: [
		{
			title: "Prompt Engineering",
			body: "Prompts written like interfaces: role, constraints, inputs, expected output shape, and refusal rules. Ambiguity removed before generation starts."
		},
		{
			title: "AI Workflow",
			body: "Scope a task, generate a candidate, review the diff like a pull request, correct with targeted follow-ups. The engineer stays accountable for every line."
		},
		{
			title: "Thinking System",
			body: "Decompose → constrain → generate → evaluate → integrate. AI compresses execution time; judgment about architecture and UX stays human."
		}
	],
	loop: [
		{
			step: "Decompose",
			body: "Break the request into units small enough to verify in one read."
		},
		{
			step: "Constrain",
			body: "State the stack, the tokens, the states and the refusals up front."
		},
		{
			step: "Generate",
			body: "Produce a candidate — fast, disposable, never sacred."
		},
		{
			step: "Evaluate",
			body: "Score against criteria written before the output existed."
		},
		{
			step: "Integrate",
			body: "Merge only what a human would have been happy to write."
		}
	]
};
//#endregion
//#region src/data/timeline.ts
var timeline = [
	{
		year: "2021",
		title: "Foundations",
		body: "HTML, CSS and JavaScript fundamentals — layout, the box model, and the DOM.",
		detail: "Rebuilt real interfaces from screenshots to learn spacing, hierarchy and the cascade the hard way."
	},
	{
		year: "2025",
		title: "React Training",
		body: "Component architecture, state management, and building real multi-screen interfaces.",
		detail: "Moved from page-thinking to component-thinking: props as contracts, state at the lowest owning node."
	},
	{
		year: "2024",
		title: "Design Systems",
		body: "Tokens, accessibility standards, and reusable component libraries in production work.",
		detail: "Learned that a system is documentation plus constraints — the components are only the visible part."
	},
	{
		year: "2026",
		title: "Full-stack Practice",
		body: "APIs, MongoDB, and connecting interfaces to real data lifecycles.",
		detail: "Modelling data around events rather than states changed how I design front-end flows too."
	},
	{
		year: "2025",
		title: "AI Engineering",
		body: "Prompt engineering, AI-assisted workflows, and evaluation of generated output.",
		detail: "Specification became the real skill: the clearer the contract, the better the generated code."
	}
];
//#endregion
//#region src/hooks/useUniverse.tsx
var FIXED_FOCUS_KINDS = {
	sun: "sun",
	orbits: "orbits",
	blackhole: "blackhole",
	station: "station"
};
var resolveFocusKind = (id) => FIXED_FOCUS_KINDS[id] ?? "galaxy";
/**
* Zustand selector-based store. Components subscribe only to the slices they
* need, so a hover change re-renders just the affected (and previously active)
* celestial bodies — not every planet and galaxy in the scene.
*
* `registerNode` is also cheap: positions are only recorded for the currently
* focused object, since that is the only node the camera transition consumes.
*/
var useUniverseStore = create((set, get) => ({
	focus: null,
	hovered: null,
	mode: "explore",
	storyIndex: 0,
	autoOrbit: true,
	warpAt: 0,
	nodes: /* @__PURE__ */ new Map(),
	setFocus: (focus) => set({
		mode: focus ? "focus" : "explore",
		focus,
		warpAt: Date.now()
	}),
	clearFocus: () => set({
		mode: "explore",
		focus: null,
		warpAt: Date.now()
	}),
	setHovered: (id) => set({ hovered: id }),
	startStory: () => {
		const id = storyStops[0];
		if (!id) return;
		set({
			storyIndex: 0,
			mode: "story",
			focus: {
				kind: resolveFocusKind(id),
				id
			},
			warpAt: Date.now()
		});
	},
	nextStop: () => {
		const { storyIndex, mode } = get();
		if (mode !== "story") return;
		const clamped = Math.min(storyStops.length - 1, storyIndex + 1);
		const id = storyStops[clamped];
		if (!id) return;
		set({
			storyIndex: clamped,
			focus: {
				kind: resolveFocusKind(id),
				id
			},
			warpAt: Date.now()
		});
	},
	prevStop: () => {
		const { storyIndex, mode } = get();
		if (mode !== "story") return;
		const clamped = Math.max(0, storyIndex - 1);
		const id = storyStops[clamped];
		if (!id) return;
		set({
			storyIndex: clamped,
			focus: {
				kind: resolveFocusKind(id),
				id
			},
			warpAt: Date.now()
		});
	},
	exitStory: () => set({
		mode: "explore",
		focus: null,
		storyIndex: 0,
		warpAt: Date.now()
	}),
	toggleAutoOrbit: () => set({ autoOrbit: !get().autoOrbit }),
	registerNode: (id, position) => {
		const { focus, nodes } = get();
		if (!focus || focus.id !== id) return;
		nodes.set(id, position);
	}
}));
/**
* Backwards-compatible hook: returns the whole state (re-renders on any change).
* Consumers that need maximum render isolation should use `useUniverseStore`
* with a narrow selector instead (e.g. a boolean for hover/focus activity).
*/
function useUniverse() {
	return useUniverseStore();
}
/** Provider kept for API compatibility — Zustand needs no provider. */
function UniverseProvider({ children }) {
	return /* @__PURE__ */ jsx(Fragment, { children });
}
//#endregion
export { blackHole as a, planets as c, identity as d, timeline as i, orbits as l, useUniverse as n, galaxies as o, useUniverseStore as r, storyStops as s, UniverseProvider as t, contact as u };
