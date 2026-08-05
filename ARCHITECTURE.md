# Architecture Overview

**Designed and Engineered by Omran Khaled**

## System Design Philosophy

Cosmic Portfolio embodies a **feature-sliced architecture** with unwavering commitment to separation of concerns, type safety, and performance budgets. Every architectural decision serves the core mission: interfaces as systems, not decorations.

### Foundational Principles

1. **Data-Driven Rendering**: All content flows from typed data structures — planets, galaxies, timelines are rendered, not hardcoded
2. **Progressive Enhancement**: 3D universe as the primary experience; 2D fallback ensures universal access
3. **Type Safety at Every Layer**: TypeScript strict mode + Zod validation at network boundaries
4. **Performance as Requirement**: Budgets defined before implementation, measured continuously

---

## Architecture Layers

```
┌──────────────────────────────────────────────────┐
│            Presentation Layer                    │
│   Components | Overlays | HUD | Panels          │
│   Ownership: UI contracts, accessibility         │
├──────────────────────────────────────────────────┤
│            Feature Layer                         │
│   Universe Logic | Navigation | Story Mode       │
│   Ownership: Interaction patterns, state machine │
├──────────────────────────────────────────────────┤
│            Data Layer                            │
│   Typed Content | Validation | Schemas           │
│   Ownership: Content model, runtime safety       │
├──────────────────────────────────────────────────┤
│            Infrastructure Layer                  │
│   Hooks | Utils | Server Functions | Error Handlers│
│   Ownership: Cross-cutting concerns              │
└──────────────────────────────────────────────────┘
```

### State Management Strategy

| State Type       | Solution            | Scope            | Justification                               |
| ---------------- | ------------------- | ---------------- | ------------------------------------------- |
| **Global UI**    | Zustand             | Application-wide | Zero boilerplate, selector-based re-renders |
| **Server State** | TanStack Query      | Data fetching    | Caching, background refetch, devtools       |
| **Local UI**     | useState/useReducer | Component-level  | Keep state as local as possible             |
| **URL State**    | TanStack Router     | Navigation       | Type-safe search params and path params     |

### Routing Architecture

- **File-based routing**: Convention over configuration
- **Code splitting**: Automatic route-level lazy loading
- **Server functions**: Type-safe data loading with validation
- **SEO optimization**: SSR with proper meta tags

---

## Directory Structure

```
src/
├── components/                     # Reusable presentation layer
│   ├── celestial/                  # 3D scene objects
│   │   ├── BlackHole.tsx          # AI Engineering representation
│   │   ├── Constellation.tsx      # Skill constellations
│   │   ├── Galaxies.tsx           # Project clusters
│   │   ├── PlanetSystem.tsx       # Skill orbits and planets
│   │   ├── SpaceStation.tsx       # Contact interface
│   │   └── Sun.tsx                # Central identity marker
│   │
│   ├── overlay/                    # UI layer (2D on 3D)
│   │   ├── DetailPanel.tsx        # Content detail views
│   │   ├── HUD.tsx               # Heads-up display
│   │   ├── HUD.parts.tsx         # HUD subcomponents
│   │   ├── Intro.tsx             # Entry experience
│   │   ├── MobileUniverse.tsx    # 2D mobile fallback
│   │   ├── VideoPortal.tsx       # Video showcase
│   │   └── panels/               # Panel variants
│   │
│   ├── shared/                     # Primitive components
│   │   └── InfoRow.tsx           # Reusable info display
│   │
│   └── universe/                   # 3D scene infrastructure
│       ├── CameraRig.tsx         # Camera system
│       ├── Starfield.tsx         # Background stars
│       └── UniverseCanvas.tsx    # Main 3D canvas
│
├── constants/                      # Immutable configuration
│   ├── camera.ts                  # Camera constraints
│   └── universe.ts                # Scene dimensions
│
├── data/                           # Content layer (typed)
│   ├── identity.ts                # Personal brand
│   ├── planets.ts                 # Skill planets (11 objects)
│   ├── galaxies.ts                # Project galaxies (3 objects)
│   ├── blackhole.ts               # AI Engineering pillar
│   ├── contact.ts                 # Contact channels
│   ├── timeline.ts                # Career progression
│   ├── orbits.ts                  # Orbit definitions
│   ├── languages.ts               # Language proficiencies
│   ├── manifesto.ts               # Design philosophy
│   ├── universe.ts                # Core types and data
│   ├── types.ts                   # Shared TypeScript types
│   └── validation.ts              # Zod schemas
│
├── features/                       # Feature modules
│   └── universe/                  # Universe feature logic
│
├── hooks/                          # Custom hooks
│   ├── use-mobile.tsx             # Device detection
│   └── useUniverse.tsx            # Universe state machine
│
├── lib/                            # Infrastructure
│   ├── utils.ts                   # Helper functions
│   ├── error-capture.ts           # Error tracking
│   └── error-page.ts              # Error page renderer
│
├── routes/                         # Page components
│   ├── __root.tsx                 # Root layout
│   └── index.tsx                  # Home page
│
├── router.tsx                      # Router definition
├── server.ts                       # Server entry point
├── start.ts                        # Client entry point
└── styles.css                      # Global styles
```

---

## Component Hierarchy

```
App
└── RouterProvider
    └── Routes
        └── RootLayout
            └── UniversePage
                ├── UniverseCanvas (3D Scene)
                │   ├── Starfield
                │   ├── Sun
                │   ├── PlanetSystem
                │   │   └── Planet[] (11 skill planets)
                │   ├── Galaxies
                │   │   └── Galaxy[] (3 projects)
                │   ├── BlackHole
                │   ├── SpaceStation
                │   └── CameraRig
                │
                └── Overlay (2D UI Layer)
                    ├── Intro
                    ├── HUD
                    │   ├── Navigation
                    │   ├── StoryProgress
                    │   └── WarpPalette
                    ├── DetailPanel
                    ├── VideoPortal
                    └── MobileUniverse (fallback)
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Data Layer                        │
│  (data/*.ts - Typed, validated, immutable)          │
└─────────────────┬───────────────────────────────────┘
                  │ import
                  ▼
┌─────────────────────────────────────────────────────┐
│               Component Layer                       │
│   (Consume data, render UI, dispatch actions)       │
└─────────────────┬───────────────────────────────────┘
                  │ useUniverse store
                  ▼
┌─────────────────────────────────────────────────────┐
│               State Layer                           │
│   (Zustand - Focus, navigation, mobile state)       │
└─────────────────┬───────────────────────────────────┘
                  │ state changes
                  ▼
┌─────────────────────────────────────────────────────┐
│               Scene Layer                           │
│   (Camera transitions, object highlights)           │
└─────────────────────────────────────────────────────┘
```

---

## 3D Scene Architecture

### Scene Graph

```
Scene
├── Starfield (background)
├── Sun (central identity)
├── Orbit Groups
│   ├── Frontend Engineering Orbit
│   │   └── Planet[]
│   ├── UX Orbit
│   │   └── Planet[]
│   ├── Engineering Orbit
│   │   └── Planet[]
│   └── AI Orbit
│       └── Planet[]
├── Galaxies Group
│   └── Galaxy[]
├── BlackHole (AI Engineering)
└── SpaceStation (Contact)
```

### Rendering Strategy

- **Adaptive DPR**: Scales pixel ratio based on device capability
- **LOD (Level of Detail)**: Reduced complexity on mobile
- **Frustum Culling**: Three.js handles automatically
- **Instance Rendering**: Where applicable for performance
- **Memoization**: Buffer geometries reused across renders

### Camera System

- **OrbitControls**: Restricted to valid angles
- **Smooth Transitions**: GSAP-like easing for focus changes
- **Story Mode**: Cinematic camera path
- **Warp Navigation**: Instant position interpolation

---

## Styling Architecture

### Token System

```
Primitive Tokens (oklch)
    ↓
Semantic Tokens (roles)
    ↓
Component Tokens (slots)
```

- **No raw values** in components
- **Dark/Light parity** through token swapping
- **RTL support** via logical properties

### Responsive Strategy

| Breakpoint              | Strategy                   |
| ----------------------- | -------------------------- |
| Mobile (< 768px)        | 2D fallback, simplified UI |
| Tablet (768px - 1024px) | 3D with reduced effects    |
| Desktop (> 1024px)      | Full 3D experience         |

---

## Performance Budgets

| Asset        | Budget         | Current |
| ------------ | -------------- | ------- |
| Initial JS   | < 200KB (gzip) | ~180KB  |
| 3D Bundle    | < 150KB (gzip) | ~130KB  |
| Total Bundle | < 400KB (gzip) | ~350KB  |
| FCP          | < 1.5s         | ~1.2s   |
| TTI          | < 3.5s         | ~3.0s   |
| 3D FPS       | 60fps          | 60fps   |

---

## Security Considerations

- **No secrets in client code**: All sensitive data in server functions
- **CSRF protection**: TanStack Start middleware
- **Input validation**: Zod schemas at network boundary
- **XSS prevention**: React's built-in escaping + DOMPurify
- **CSP headers**: Configured in production

---

## Monitoring and Observability

- **Error Boundaries**: Catch and report React errors
- **Performance Marks**: Track FCP, LCP, TTI
- **User Timing**: Monitor 3D scene initialization
- **Error Tracking**: Integration point for Sentry/LogRocket

---

## Scalability Path

### Current Scale (Portfolio)

- Single page application
- Static content with typed data
- Client-side routing

### Future Scale (Potential)

- Multi-page with CMS integration
- Dynamic content loading
- Internationalization (i18n)
- Authentication and personalization

The architecture supports both scales without refactoring core patterns.

---

_Engineered by Omran Khaled with precision and purpose._
