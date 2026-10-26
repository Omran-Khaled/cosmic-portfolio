/**
 * Compatibility re-export for existing feature modules.
 * `src/data/validation.ts` is the single source of truth for domain shapes;
 * its Zod schemas provide both runtime validation and compile-time types.
 */
export type {
  Vec3,
  SubSkill,
  Planet,
  Galaxy,
  TimelineEntry,
  LanguageEntry,
  ContactLine,
  ContactChannel,
  Contact,
  BlackHole,
  BlackHolePillar,
  BlackHoleLoopStep,
  Identity,
  Orbit,
  Comet,
  Manifesto,
} from "./validation";
