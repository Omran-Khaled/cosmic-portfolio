/**
 * Skill Planets Configuration - Enhanced Edition
 *
 * Expanded from 12 to 20 planets based on comprehensive CV data.
 * Organized into 6 orbits for improved visual hierarchy and user experience.
 *
 * Data sources:
 * - Original planets.ts (preserved core skills)
 * - cv-professional.ts (Technical Expertise categories)
 * - Professional experience and training
 *
 * Visual Design:
 * - Six centrally scaled display orbits preserve clear gaps around the sun
 *   and between orbital tracks. Planet size and identity remain data-driven.
 * - Compact local surface maps stay active at every tier; bump relief is adaptive.
 */

import type { Planet } from "./types";

export const planets: Planet[] = [
  {
    id: "react-ecosystem",
    name: "React Ecosystem",
    orbit: "frontend",
    size: 0.75,
    color: "#22d3ee",
    summary:
      "React as a rendering model — hooks, data flow, routing and caching used deliberately.",
    level: "Proficient",
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
    id: "mern-stack",
    name: "MERN Stack",
    orbit: "fullstack",
    size: 0.85,
    color: "#4ade80",
    summary:
      "MongoDB, Express.js, React, Node.js — building full-stack applications with consistency.",
    level: "Proficient",
    depth: [
      "Consistent JavaScript/TypeScript across the entire stack",
      "RESTful API design with Express.js and Node.js",
      "MongoDB/Mongoose for schema design and data persistence",
      "Authentication and authorization patterns with JWT",
    ],
    evidence:
      "Library & Inventory Management System: full-stack CRUD operations with role-based access control.",
    moons: [
      {
        name: "Node.js",
        tags: ["Express", "REST API"],
        note: "Backend services and middleware patterns.",
      },
      {
        name: "MongoDB",
        tags: ["Mongoose", "Schema"],
        note: "Database design and data modeling.",
      },
    ],
  },
  {
    id: "typescript",
    name: "TypeScript",
    orbit: "frontend",
    size: 0.68,
    color: "#60a5fa",
    summary: "Type-safe development with comprehensive tooling and IDE support.",
    level: "Proficient",
    depth: [
      "Type-first development: interfaces before implementations",
      "Generics for reusable, type-safe components",
      "Mapped types and conditional types for advanced patterns",
      "Zod integration for runtime validation",
    ],
    evidence: "All projects use TypeScript with strict mode enabled.",
    moons: [
      {
        name: "Interfaces",
        tags: ["Types", "Generics"],
        note: "Comprehensive type definitions for all data structures.",
      },
      {
        name: "Tooling",
        tags: ["ESLint", "Prettier"],
        note: "Type-safe linting and formatting.",
      },
    ],
  },
  {
    id: "next-js",
    name: "Next.js",
    orbit: "frontend",
    size: 0.72,
    color: "#ffffff",
    summary: "React framework for the web — SSR, SSG, dynamic routing, and file-based routing.",
    level: "Proficient",
    depth: [
      "App Router with server components and client components",
      "Static and dynamic rendering strategies",
      "Optimized routing with route groups and parallel routes",
      "Metadata API for SEO optimization",
    ],
    evidence: "Wandr: a premium tourism platform built with Next.js 15.",
    moons: [
      {
        name: "App Router",
        tags: ["Server Components", "Streaming"],
        note: "Modern React rendering patterns.",
      },
      {
        name: "Routing",
        tags: ["Metadata", "Layouts"],
        note: "File-based routing with advanced patterns.",
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BACK-END ENGINEERING ORBIT (New planets based on CV)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "node-express",
    name: "Node.js & Express",
    orbit: "backend",
    size: 0.88,
    color: "#68a063",
    summary: "Server-side JavaScript runtime and web framework for RESTful APIs.",
    level: "Proficient",
    depth: [
      "Express.js middleware patterns for authentication, validation, and error handling.",
      "Async/await patterns for non-blocking I/O operations.",
      "Environment-based configuration for multiple deployment targets.",
    ],
    evidence:
      "Library System: Complete REST API with authentication, CRUD, and middleware pipeline.",
    moons: [
      {
        name: "Middleware",
        tags: ["Auth", "Validation", "Logging"],
        note: "Request pipeline architecture",
      },
      {
        name: "REST API",
        tags: ["CRUD", "Pagination", "Filtering"],
        note: "Resource-oriented design",
      },
    ],
  },
  {
    id: "mongodb-backend",
    name: "MongoDB & Mongoose",
    orbit: "backend",
    size: 0.82,
    color: "#00ed64",
    summary: "NoSQL database with ODM for flexible, scalable data persistence.",
    level: "Proficient",
    depth: [
      "Schema design with Mongoose for validation and relationships.",
      "Aggregation pipelines for complex queries and transformations.",
      "Indexing strategies for query performance.",
    ],
    evidence:
      "Library System: Complete data model with books, members, loans, and inventory tracking.",
    moons: [
      {
        name: "Mongoose ODM",
        tags: ["Schema", "Validation", "Hooks"],
        note: "Structured NoSQL development",
      },
      {
        name: "Aggregation",
        tags: ["Pipeline", "Operators", "Performance"],
        note: "Complex data operations",
      },
    ],
  },
  {
    id: "nestjs",
    name: "NestJS",
    orbit: "backend",
    size: 0.75,
    color: "#e0234e",
    summary: "Enterprise Node.js framework with TypeScript and dependency injection.",
    level: "Working",
    depth: [
      "Modular architecture with controllers, services, and modules.",
      "Dependency injection for testable code.",
      "Decorators for routing, validation, and metadata.",
    ],
    evidence: "B4F Training: Production-grade APIs with NestJS architecture.",
    moons: [
      {
        name: "Architecture",
        tags: ["Modules", "Providers", "Guards"],
        note: "Enterprise app structure",
      },
      {
        name: "TypeORM",
        tags: ["Entities", "Relations", "Migrations"],
        note: "Database abstraction",
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FULL-STACK ORBIT (MERN specialization - closer orbit for importance)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "fullstack-integration",
    name: "Full-Stack Integration",
    orbit: "fullstack",
    size: 0.78,
    color: "#f59e0b",
    summary: "End-to-end application development connecting frontend and backend seamlessly.",
    level: "Proficient",
    depth: [
      "RESTful API integration connecting React frontend with Express/Node backend.",
      "Authentication and authorization flows with JWT.",
      "State synchronization between client and server.",
    ],
    evidence: "Library System: Complete full-stack flow from UI to database with authentication.",
    moons: [
      {
        name: "API Integration",
        tags: ["Fetch", "Axios", "TanStack Query"],
        note: "Frontend-backend communication",
      },
      {
        name: "Auth Patterns",
        tags: ["JWT", "Sessions", "OAuth"],
        note: "Secure authentication flows",
      },
    ],
  },

  // Continue with existing planets in their new orbits...
  {
    id: "tailwind-css",
    name: "Tailwind CSS",
    orbit: "ux",
    size: 0.65,
    color: "#38bdf8",
    summary: "Utility-first CSS framework for rapid UI development.",
    level: "Proficient",
    depth: [
      "Design tokens for consistent styling",
      "Dark mode as a token swap",
      "Responsive design with arbitrary values",
      "Plugin system for custom utilities",
    ],
    evidence: "All projects use Tailwind CSS with custom configurations.",
    moons: [
      {
        name: "Custom Config",
        tags: ["Plugins", "Themes"],
        note: "Tailwind with custom color palette and spacing.",
      },
      {
        name: "Dark Mode",
        tags: ["Class", "Media"],
        note: "Automatic theme switching.",
      },
    ],
  },
  {
    id: "design-systems",
    name: "Design Systems",
    orbit: "ux",
    size: 0.7,
    color: "#a78bfa",
    summary: "Reusable components, tokens, and documentation for consistent products.",
    level: "Proficient",
    depth: [
      "Three-tier token architecture: primitive → semantic → component",
      "CVA for typed component variants",
      "Accessibility as a first-class concern",
      "Documentation-driven development",
    ],
    evidence: "Wandr: a glassmorphic system with dark/light parity.",
    moons: [
      {
        name: "Tokens",
        tags: ["oklch", "Theming"],
        note: "Perceptually uniform color space.",
      },
      {
        name: "CVA",
        tags: ["Class Variance"],
        note: "Typed variant maps instead of conditionals.",
      },
    ],
  },
  {
    id: "state-management",
    name: "State Management",
    orbit: "tools",
    size: 0.58,
    color: "#f472b6",
    summary: "Managing application state with the right tool for the job.",
    level: "Proficient",
    depth: [
      "Local state for component-specific data",
      "Context API for global state with minimal boilerplate",
      "TanStack Query for server state caching",
      "Zustand for complex client-side state",
    ],
    evidence: "Khuta: complex trip planning state with TanStack Query.",
    moons: [
      {
        name: "Context API",
        tags: ["Provider", "Consumer"],
        note: "Simple global state without external dependencies.",
      },
      {
        name: "TanStack Query",
        tags: ["Caching", "Sync"],
        note: "Server state management and data fetching.",
      },
    ],
  },
  {
    id: "rest-apis",
    name: "REST APIs",
    orbit: "fullstack",
    size: 0.62,
    color: "#fbbf24",
    summary: "Designing and consuming RESTful APIs for data exchange.",
    level: "Proficient",
    depth: [
      "Resource-oriented architecture",
      "HTTP methods as verbs (GET, POST, PUT, DELETE)",
      "Status codes and error handling",
      "HATEOAS principles where applicable",
    ],
    evidence: "Library System: comprehensive REST API for book management and loans.",
    moons: [
      {
        name: "Express.js",
        tags: ["Routing", "Middleware"],
        note: "Node.js web framework.",
      },
      {
        name: "Validation",
        tags: ["Zod", "Joi"],
        note: "Request/response validation.",
      },
    ],
  },
  {
    id: "git-workflows",
    name: "Git Workflows",
    orbit: "tools",
    size: 0.55,
    color: "#f87171",
    summary: "Version control with Git for collaborative development.",
    level: "Proficient",
    depth: [
      "Feature branch workflow",
      "Pull request reviews",
      "Conventional commits for changelogs",
      "CI/CD integration",
    ],
    evidence: "All projects use GitHub with standardized workflows.",
    moons: [
      {
        name: "Branching",
        tags: ["GitFlow", "Trunk"],
        note: "Branching strategies for team collaboration.",
      },
      {
        name: "GitHub",
        tags: ["Actions", "Projects"],
        note: "CI/CD and project management.",
      },
    ],
  },
  {
    id: "accessibility",
    name: "Accessibility",
    orbit: "ux",
    size: 0.52,
    color: "#22c55e",
    summary: "Building inclusive web applications for all users.",
    level: "Proficient",
    depth: [
      "Semantic HTML as the foundation",
      "ARIA attributes where native elements fall short",
      "Keyboard navigation support",
      "Contrast and focus management",
    ],
    evidence: "All projects pass accessibility audits and keyboard navigation testing.",
    moons: [
      {
        name: "Semantics",
        tags: ["ARIA", "Landmarks"],
        note: "Native elements first, ARIA as needed.",
      },
      {
        name: "Testing",
        tags: ["axe", "Linting"],
        note: "Automated accessibility testing.",
      },
    ],
  },
  {
    id: "performance",
    name: "Performance",
    orbit: "tools",
    size: 0.5,
    color: "#eab308",
    summary: "Optimizing for speed and efficiency across the stack.",
    level: "Working",
    depth: [
      "Core Web Vitals as performance targets",
      "Code splitting and lazy loading",
      "Image optimization and format selection",
      "Bundle size budgets",
    ],
    evidence:
      "Selected projects include performance checks during development; verify project-specific results.",
    moons: [
      {
        name: "Loading",
        tags: ["Suspense", "Lazy"],
        note: "Progressive loading strategies.",
      },
      {
        name: "Optimization",
        tags: ["Bundle", "Assets"],
        note: "Bundle size and asset optimization.",
      },
    ],
  },
  {
    id: "python-fundamentals",
    name: "Python",
    orbit: "ai",
    size: 0.48,
    color: "#facc15",
    summary: "Python fundamentals for scripting and automation.",
    level: "Working",
    depth: [
      "Scripting and automation",
      "Data manipulation and analysis",
      "API development with Flask/FastAPI",
      "Integration with web applications",
    ],
    evidence: "Automation scripts and data processing tools.",
    moons: [
      {
        name: "Scripting",
        tags: ["Automation", "CLI"],
        note: "Automating repetitive tasks.",
      },
      {
        name: "Web Integration",
        tags: ["Flask", "FastAPI"],
        note: "Building lightweight APIs.",
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NEW: Specialized Skills from CV
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "three-js-webgl",
    name: "Three.js & WebGL",
    orbit: "ai",
    size: 0.72,
    color: "#67e8f9",
    summary: "3D graphics and WebGL for immersive web experiences.",
    level: "Working",
    depth: [
      "Three.js fundamentals: scenes, cameras, lights, geometries, materials.",
      "React Three Fiber for declarative 3D with React paradigms.",
      "Performance: frustum culling, LOD, instance rendering, GPU cleanup.",
      "Interactive 3D UIs with raycasting and smooth camera transitions.",
    ],
    evidence: "This cosmic portfolio: 60fps 3D universe with adaptive DPR and memory management.",
    moons: [
      {
        name: "R3F Ecosystem",
        tags: ["React Three Fiber", "Drei", "Postprocessing"],
        note: "React patterns for 3D graphics",
      },
      {
        name: "WebGL",
        tags: ["GLSL", "Shaders", "Custom Materials"],
        note: "Low-level graphics programming",
      },
    ],
  },
  {
    id: "react-native-mobile",
    name: "React Native",
    orbit: "ai",
    size: 0.65,
    color: "#818cf8",
    summary: "Cross-platform mobile development with React.",
    level: "Working",
    depth: [
      "Shared codebase for iOS and Android with platform-specific optimizations.",
      "React patterns adapted for mobile: navigation, gestures, APIs.",
      "Expo for rapid prototyping and OTA updates.",
    ],
    evidence: "B4F Training: Mobile apps with React Native, Expo, and native integrations.",
    moons: [
      {
        name: "Navigation",
        tags: ["React Navigation", "Stack", "Tab"],
        note: "Mobile navigation patterns",
      },
      {
        name: "Expo",
        tags: ["EAS", "OTA", "Managed Workflow"],
        note: "Simplified mobile development",
      },
    ],
  },
  {
    id: "vite-modern-tooling",
    name: "Vite & Build Tools",
    orbit: "tools",
    size: 0.68,
    color: "#646cff",
    summary: "Next-gen frontend tooling for instant dev server and optimized builds.",
    level: "Proficient",
    depth: [
      "Lightning-fast HMR for instant feedback during development.",
      "Rollup-based production builds with automatic code splitting.",
      "Plugin ecosystem for TypeScript, React, and CSS.",
    ],
    evidence: "This portfolio: Vite 8 with manual chunks, CSS splitting, sub-second builds.",
    moons: [
      {
        name: "Performance",
        tags: ["HMR", "ESBuild", "Rolldown"],
        note: "Instant development feedback",
      },
      {
        name: "Plugins",
        tags: ["React", "TypeScript", "PWA"],
        note: "Extensible build pipeline",
      },
    ],
  },
];
