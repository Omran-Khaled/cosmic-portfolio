# Cosmic Portfolio

> **Crafted by Omran Khaled** | Front-end Developer & Systems Architect

An explorable 3D universe portfolio where skills become planets, projects become galaxies, and AI engineering manifests as a black hole. Built with precision, typed with purpose, and designed for performance.

---

## Overview

Cosmic Portfolio is a production-grade, interactive 3D web experience that transforms traditional portfolio presentation into an explorable universe. Every element — from planet orbits to galaxy clusters — represents professional capabilities, engineered with the same rigor applied to production systems.

**Philosophy**: Interfaces are systems, not decorations. Every element earns its place through constraint, type safety, and measurable performance.

---

## Core Features

### 🪐 Interactive 3D Universe

- Fully interactive Three.js scene with orbital mechanics
- Skill planets with detailed depth and evidence
- Project galaxies with metrics and case studies
- AI Engineering black hole with methodology breakdown

### 🎬 Story Mode

- Cinematic guided tour through professional narrative
- Keyboard-first navigation with full ARIA compliance
- Smooth camera transitions between celestial objects

### ⚡ Performance Engineered

- Adaptive DPR for low-power devices
- Code splitting with manual chunk optimization
- Lazy-loaded 3D layers and video content
- Buffer geometry reuse and memoization

### 📱 Responsive by Design

- 2D fallback for mobile devices
- RTL/LTR parity with logical CSS properties
- Touch-optimized controls
- Progressive enhancement architecture

### ♿ Accessible

- Keyboard navigation with focus management
- Screen reader support with semantic landmarks
- Contrast-checked tokens for readability
- Focus traps in modals and panels

---

## Technology Stack

| Layer          | Technology                       | Purpose                               |
| -------------- | -------------------------------- | ------------------------------------- |
| **Framework**  | React 19 + TypeScript 5.8        | Type-safe UI with strict mode         |
| **3D Engine**  | Three.js 0.185 + R3F + Drei      | Declarative 3D scene management       |
| **Styling**    | Tailwind CSS 4.2 + Framer Motion | Utility-first styling + animations    |
| **Routing**    | TanStack Router + Start          | Type-safe file-based routing          |
| **State**      | Zustand + TanStack Query         | Global UI state + server caching      |
| **Build**      | Vite 8.1                         | Optimized bundling with manual chunks |
| **Validation** | Zod                              | Runtime type safety at boundaries     |

---

## Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0 (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Omran-Khaled/cosmic-portfolio.git
cd cosmic-portfolio

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to explore the universe.

---

## Development Scripts

| Command          | Action                              |
| ---------------- | ----------------------------------- |
| `pnpm dev`       | Start development server with HMR   |
| `pnpm build`     | Production build with optimizations |
| `pnpm build:dev` | Development build with source maps  |
| `pnpm preview`   | Preview production build locally    |
| `pnpm lint`      | Run ESLint with TypeScript rules    |
| `pnpm format`    | Format code with Prettier           |
| `pnpm start`     | Start production server             |

---

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── celestial/        # 3D objects (planets, galaxies, black hole)
│   ├── overlay/          # UI panels, HUD, modals, mobile fallback
│   ├── shared/           # Primitive components
│   └── universe/         # 3D scene infrastructure
├── constants/            # Camera and universe constants
├── data/                 # Typed portfolio content
│   ├── identity.ts       # Personal brand and bio
│   ├── planets.ts        # Skill planets with depth
│   ├── galaxies.ts       # Project galaxies with metrics
│   ├── blackhole.ts      # AI Engineering methodology
│   ├── contact.ts        # Contact information
│   ├── timeline.ts       # Career progression
│   └── validation.ts     # Zod schemas
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and error handling
├── routes/               # Page components
├── router.tsx            # Router configuration
└── start.ts              # Application entry
```

---

## Key Technical Decisions

| Decision                        | Rationale                                    |
| ------------------------------- | -------------------------------------------- |
| **Data-driven content**         | Update portfolio without touching components |
| **Zustand over Redux**          | Minimal boilerplate, built-in selectors      |
| **Manual chunking**             | Optimal caching for Three.js, React, Framer  |
| **Adaptive DPR**                | Maintain 60fps on integrated graphics        |
| **Zod validation**              | Runtime safety mirrors TypeScript types      |
| **Feature-sliced architecture** | Clear ownership, promotion over duplication  |

---

## Performance Targets

| Metric                 | Target          | Measurement             |
| ---------------------- | --------------- | ----------------------- |
| First Contentful Paint | < 1.5s          | Lighthouse              |
| Time to Interactive    | < 3.5s          | Lighthouse              |
| 3D Frame Rate          | 60fps           | React DevTools Profiler |
| Bundle Size (gzip)     | < 200KB initial | Rollup visualizer       |
| Lighthouse Score       | 90+             | All categories          |

---

## Contributing

This is a personal portfolio project by **Omran Khaled**. Contributions, issues, and feedback are welcome.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

---

## License

Copyright © 2026 **Omran Khaled**. All rights reserved.

See [OWNERSHIP.md](OWNERSHIP.md) for complete intellectual property terms.

---

## Connect

- **GitHub**: [@Omran-Khaled](https://github.com/Omran-Khaled)
- **LinkedIn**: [in/omran-khaled](https://www.linkedin.com/in/omran-khaled-334726426)
- **Email**: omranhk815@gmail.com

---

_Built with discipline. Shipped with intent._
