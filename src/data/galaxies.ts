import type { Galaxy } from "./types";

/**
 * Resolve a static asset URL against Vite's configured base path.
 * Vite injects `import.meta.env.BASE_URL` at build time — on GitHub Pages
 * this is "/cosmic-portfolio/", in local dev it's "/". Using it here ensures
 * videos (and any other public/ assets) always resolve to the correct path
 * regardless of where the site is hosted.
 */
const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

export const galaxies: Galaxy[] = [
  {
    id: "khuta",
    name: "Khuta",
    tagline: "Multilingual trip planning, mapped",
    color: "#34d399",
    position: [-38, 8, -18],
    year: "2026",
    role: "Front-end Developer",
    duration: "3 months",
    type: "Product · Web app",
    status: "Live",
    stack: ["React", "TypeScript", "i18n", "RTL/LTR", "Maps", "Tailwind"],
    links: { demo: asset("khuta.mp4"), github: "https://github.com/Omran-Khaled/khuta" },
    metrics: [
      { label: "Languages", value: "AR + EN" },
      { label: "Layout forks", value: "0" },
      { label: "Screens", value: "18" },
    ],
    features: [
      "Interactive map that builds the itinerary as you drop stops",
      "Full RTL mirroring with a single layout tree",
      "Typed translation keys with build-time missing-string detection",
      "Day-by-day planner with drag reordering and travel-time hints",
      "Shareable trip links that restore full map state",
    ],
    challenges: [
      {
        title: "RTL without a second stylesheet",
        body: "Physical CSS properties made Arabic a fork. Migrating everything to logical properties and mirroring only directional icons turned direction into a single data flag.",
      },
      {
        title: "Map as the source of truth",
        body: "Itinerary list and map drifted out of sync. Making the map state canonical and rendering the list from it removed an entire class of bug.",
      },
    ],
    layers: {
      problem:
        "Travellers planning across Arabic and English needed one product that felt native in both directions, with real geography instead of static lists.",
      solution:
        "A trip planner with a fully mirrored RTL/LTR layer, localized content pipeline, and an interactive map that drives itinerary building.",
      decisions: [
        "Logical CSS properties everywhere so RTL is a data flip, not a second stylesheet",
        "Map state kept as the single source of truth for the itinerary",
        "Translation keys typed to prevent missing-string regressions",
      ],
      impact:
        "One codebase serving two language directions with no layout forks and no duplicated screens.",
    },
  },
  {
    id: "wnadr",
    name: "Wnadr",
    tagline: "A design system wearing glass",
    color: "#a78bfa",
    position: [42, -6, -12],
    year: "2026",
    role: "Design Systems Engineer",
    duration: "2 months",
    type: "Design system · Library",
    status: "Maintained",
    stack: ["Design System", "Tailwind", "CVA", "Radix", "Tokens", "Dark Mode"],
    links: { demo: asset("wandr.mp4"), github: "https://github.com/Omran-Khaled/wandr" },
    metrics: [
      { label: "Primitives", value: "30+" },
      { label: "Themes", value: "2 (token swap)" },
      { label: "Raw colours", value: "0" },
    ],
    features: [
      "Three-tier token architecture: palette → semantic role → component slot",
      "Glassmorphic surface variants with encoded blur and elevation",
      "Dark and light parity achieved through token swapping only",
      "Typed variant maps via CVA for every component state",
      "Accessible primitives built on Radix behaviour",
    ],
    challenges: [
      {
        title: "Glass that stays readable",
        body: "Blurred surfaces destroyed contrast on busy backgrounds. Encoding a scrim layer into the surface variant kept text legible on any background without per-screen tuning.",
      },
      {
        title: "Stopping variant sprawl",
        body: "Every new screen wanted a new variant. A rule — extend only after a third real use case — kept the system small and the components predictable.",
      },
    ],
    layers: {
      problem:
        "The product needed a visual identity that stayed coherent across dark and light surfaces while remaining fast to extend.",
      solution:
        "A token-first design system with glassmorphic surfaces, a strict semantic palette, and component variants covering every state.",
      decisions: [
        "Semantic tokens only — no raw colour values in components",
        "Dark mode as a token swap rather than conditional styling",
        "Blur and elevation encoded as reusable surface variants",
      ],
      impact:
        "New screens assembled from existing primitives, with theme parity guaranteed by construction.",
    },
  },
  {
    id: "library-system",
    name: "Library System",
    tagline: "Full-stack, end to end",
    color: "#fb7185",
    position: [-6, -16, 40],
    year: "2026",
    role: "Full-stack Developer",
    duration: "4 months",
    type: "Full-stack application",
    status: "Complete",
    stack: ["React", "Node.js", "Express", "MongoDB", "REST", "JWT Auth"],
    links: {
      demo: asset("library.mp4"),
      github: "https://github.com/Omran-Khaled/Library-Inventory-Management-System",
    },
    metrics: [
      { label: "Roles", value: "Admin · Member" },
      { label: "Entities", value: "Books · Members · Loans" },
      { label: "API surface", value: "REST" },
    ],
    features: [
      "Catalogue with search, filtering and availability state",
      "Borrow / return lifecycle modelled as events, not flags",
      "Role-aware access with JWT sessions and protected routes",
      "Optimistic lending actions reconciled against the server",
      "Admin dashboard for members, overdue loans and inventory",
    ],
    challenges: [
      {
        title: "Availability is derived, not stored",
        body: "A boolean 'available' column drifted from reality. Deriving availability from the loan event history made the data self-correcting.",
      },
      {
        title: "Honest optimistic UI",
        body: "Optimistic borrow actions could contradict the server. Reconciling against the response and rolling back visibly kept the interface trustworthy.",
      },
    ],
    layers: {
      problem:
        "Managing catalogue, members and lending required real persistence and role-aware access, not a front-end mock.",
      solution:
        "A full-stack application with REST APIs over MongoDB, modelled around borrowing lifecycles and availability.",
      decisions: [
        "Schema designed around lending events, not just book records",
        "API contracts validated on both ends to keep the client honest",
        "Optimistic UI for lending actions with server reconciliation",
      ],
      impact:
        "A working system covering the full loop: data model, API surface, and the interface people actually use.",
    },
  },
];

/** Story tour order: fixed celestial nodes + every project galaxy. */
export const storyStops = ["sun", "orbits", ...galaxies.map((g) => g.id), "blackhole", "station"];
