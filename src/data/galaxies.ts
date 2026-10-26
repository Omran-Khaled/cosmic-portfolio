import type { Galaxy } from "./types";
import { polarXZ } from "@/constants/layout";

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
    tagline: "Smart Tourism Platform for Syria",
    color: "#34d399",
    position: polarXZ(96, 205, 16),
    year: "2026",
    role: "MERN Stack Developer",
    duration: "3 months",
    type: "Product · Web App",
    status: "Live",
    stack: ["React", "TypeScript", "Tailwind CSS", "React Context", "TanStack Query", "Leaflet"],
    links: { demo: asset("khuta.mp4"), github: "https://github.com/Omran-Khaled/khuta" },
    metrics: [
      { label: "Languages", value: "AR + EN" },
      { label: "Screens", value: "18" },
      { label: "Features", value: "Interactive Map" },
    ],
    features: [
      "Multilingual platform enabling travelers to discover destinations, explore attractions, and plan personalized trips",
      "Interactive trip planner based on user preferences with location-based information",
      "Full RTL mirroring with automatic RTL/LTR switching for Arabic and English",
      "Responsive layouts optimized for all screen sizes (desktop, tablet, mobile)",
      "Structured for future backend integration using Mock APIs and TanStack Query",
    ],
    challenges: [
      {
        title: "Multilingual RTL/LTR Support",
        body: "Developed complete Arabic and English localization with automatic RTL/LTR switching using logical CSS properties and direction-aware layouts.",
      },
      {
        title: "Interactive Trip Planning",
        body: "Built an interactive trip planner based on user preferences, integrating interactive maps using Leaflet for location-based information.",
      },
    ],
    layers: {
      problem:
        "Travellers planning trips across Syria needed a modern, multilingual platform to discover destinations, explore attractions, and plan personalized experiences with location-based information.",
      solution:
        "A tourism platform with full Arabic/English support, interactive trip planning, and location-based information using Leaflet maps.",
      decisions: [
        "Logical CSS properties everywhere for RTL/LTR parity with single layout tree",
        "TanStack Query for managing trip planning state and Mock API integration",
        "Responsive design with mobile-first approach for all device sizes",
      ],
      impact:
        "One codebase serving Arabic and English users with full RTL support and interactive trip planning capabilities.",
    },
  },
  {
    id: "wandr",
    name: "Wandr",
    tagline: "Global Tourism Discovery Platform",
    color: "#a78bfa",
    position: polarXZ(116, 332, -14),
    year: "2026",
    role: "Design Systems Engineer",
    duration: "2 months",
    type: "Design System · Web App",
    status: "Maintained",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "CVA"],
    links: { demo: asset("wandr.mp4"), github: "https://github.com/Omran-Khaled/wandr" },
    metrics: [
      { label: "Primitives", value: "30+" },
      { label: "Themes", value: "2 (token swap)" },
      { label: "Raw colours", value: "0" },
    ],
    features: [
      "Premium tourism platform for discovering attractions, organizing trips, and exploring destinations",
      "Reusable design system with modular UI components using CVA (Class Variance Authority)",
      "Adaptive Light/Dark themes with system preference detection",
      "Glassmorphism-based UI with blurred surfaces and elevation",
      "Responsive layouts for desktop, tablet, and mobile with adaptive grid",
      "AI-inspired conversational interface for destination exploration",
    ],
    challenges: [
      {
        title: "Glassmorphism Readability",
        body: "Blurred surfaces destroyed contrast on busy backgrounds. Encoding a scrim layer into the surface variant kept text legible on any background.",
      },
      {
        title: "Consistent Theme Parity",
        body: "Every variant needed dark/light parity. Token-first approach ensured theme swapping worked across all components.",
      },
    ],
    layers: {
      problem:
        "The product needed a premium, cohesive visual identity for global tourism that stayed coherent across dark and light surfaces while remaining fast to extend.",
      solution:
        "A Next.js-based tourism platform with a glassmorphic design system, adaptive themes, and responsive layouts.",
      decisions: [
        "Token-first design system with semantic tokens for colors and spacing",
        "Dark mode as a token swap rather than conditional styling",
        "Glassmorphic surfaces with encoded blur and elevation variants",
      ],
      impact:
        "New screens assembled from existing primitives, with theme parity guaranteed by construction.",
    },
  },
  {
    id: "nexara",
    name: "Nexara",
    tagline: "A living forest for deep reading and discovery",
    color: "#84cc16",
    position: polarXZ(128, 108, 12),
    year: "2026",
    role: "Full-Stack Product Engineer",
    duration: "Ongoing",
    type: "Digital Library · Reading Platform",
    status: "Hardened release candidate",
    stack: ["TypeScript", "React", "Node.js", "PostgreSQL", "AI-assisted workflows"],
    links: { demo: asset("Nexara.mp4"), github: "https://github.com/Omran-Khaled/Nexara" },
    metrics: [
      { label: "Languages", value: "EN + AR" },
      { label: "Discovery", value: "Federated search" },
      { label: "Reading", value: "Immersive engine" },
    ],
    features: [
      "Bilingual digital library built around real book discovery and a calm, distraction-free reading ritual",
      "Federated search across Open Library, Project Gutenberg, Wikisource, and Arabic Collections Online",
      "Reading progress, history, bookmarks, highlights, collections, reviews, comments, and likes",
      "Checksum-verified content with a spatial forest metaphor instead of a conventional catalogue grid",
      "AI-assisted understanding layered onto a rights-conscious, security-hardened full-stack system",
    ],
    challenges: [
      {
        title: "Discovery without catalogue fatigue",
        body: "The experience turns multiple public literary sources into one deterministic discovery flow, then moves the reader into a focused reading space.",
      },
      {
        title: "Trustworthy reading state",
        body: "Content verification, progress tracking, and a deliberately calm reading engine keep the product useful beyond the first search.",
      },
    ],
    layers: {
      problem:
        "Readers needed one place to discover serious literature, build a personal library, and return to books without the noise of a conventional content feed.",
      solution:
        "A bilingual full-stack reading platform that combines federated discovery, personal collections, immersive reading, and AI-assisted understanding.",
      decisions: [
        "Treat external catalogues as discovery sources while keeping the reading flow coherent",
        "Make reading progress and annotations first-class product data",
        "Use security, content verification, and deterministic behaviour as product features",
      ],
      impact:
        "A focused literary workspace that connects discovery, reading, and reflection in one extensible experience.",
    },
  },
  {
    id: "finora",
    name: "Finora",
    tagline: "Personal finance with an API that keeps the books honest",
    color: "#f59e0b",
    position: polarXZ(106, 250, -8),
    year: "2026",
    role: "Full-Stack Systems Engineer",
    duration: "Ongoing",
    type: "Personal Finance · Monorepo",
    status: "Hardened release candidate",
    stack: ["Next.js", "Expo", "NestJS", "PostgreSQL", "Prisma", "TypeScript"],
    links: { demo: asset("Finora.mp4"), github: "https://github.com/Omran-Khaled/Finora" },
    metrics: [
      { label: "Clients", value: "Web + Mobile" },
      { label: "Authority", value: "API-first" },
      { label: "Money", value: "Minor units" },
    ],
    features: [
      "Accounts, categories, income, expenses, transfers, budgets, savings goals, and dashboard summaries",
      "API authority that validates ownership, enforces invariants, and derives balances from transaction history",
      "Atomic same-currency transfers with idempotency protection and two transfer legs",
      "Web and mobile clients sharing contracts, domain primitives, and mock or real API adapters",
      "In-memory and PostgreSQL persistence modes for a practical path from local development to deployment",
    ],
    challenges: [
      {
        title: "Financial correctness first",
        body: "Integer-based minor units and an API-owned domain keep precision and invariants out of the hands of individual clients.",
      },
      {
        title: "One model, multiple surfaces",
        body: "The monorepo aligns NestJS services, Next.js web, Expo mobile, shared contracts, and PostgreSQL persistence around one source of truth.",
      },
    ],
    layers: {
      problem:
        "Personal finance tools become unreliable when each client invents its own balance rules or treats money as imprecise floating-point data.",
      solution:
        "An API-first finance platform that centralizes financial authority while serving web and mobile clients through shared contracts.",
      decisions: [
        "Represent money in integer minor units for predictable arithmetic",
        "Make transfers atomic and idempotent at the API boundary",
        "Derive dashboard balances from authoritative transaction history",
      ],
      impact:
        "A disciplined foundation for personal finance where clients present state and the API protects its meaning.",
    },
  },
  {
    id: "library-system",
    name: "Library & Inventory System",
    tagline: "Full-Stack Library Management",
    color: "#fb7185",
    position: polarXZ(121, 42, 8),
    year: "2026",
    role: "Full-Stack Developer",
    duration: "4 months",
    type: "Full-Stack Application",
    status: "Complete",
    stack: ["Node.js", "Express.js", "MongoDB", "Mongoose", "TypeScript", "HTML/CSS"],
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
      "Inventory management supporting book cataloging, stock tracking, and sales management",
      "Borrowing operations with loan tracking, return management, and automated overdue-fee calculations",
      "Administrative dashboard for managing members, loans, and inventory",
      "RESTful backend services with comprehensive API endpoints",
      "Responsive administrative dashboard for data management",
      "Layered architecture using service and repository patterns",
    ],
    challenges: [
      {
        title: "Availability Tracking",
        body: "A boolean 'available' field drifted from reality. Deriving availability from the loan event history made the data self-correcting.",
      },
      {
        title: "Overdue Fee Automation",
        body: "Implemented automated overdue-fee calculations based on loan duration with configurable fine policies.",
      },
    ],
    layers: {
      problem:
        "Managing library catalogue, members, and lending operations required real persistence with role-based access control and automated workflows.",
      solution:
        "A full-stack application with Node.js, Express.js, MongoDB, and Mongoose for comprehensive library management.",
      decisions: [
        "Schema designed around lending events, not just book records",
        "Service and repository patterns for clean separation of concerns",
        "RESTful API with validation on both client and server",
      ],
      impact:
        "A working system covering the full loop: data model, API surface, and the interface for daily operations.",
    },
  },
];

/** Story tour order: fixed celestial nodes + every project galaxy. */
export const storyStops = ["sun", "orbits", ...galaxies.map((g) => g.id), "blackhole", "station"];
