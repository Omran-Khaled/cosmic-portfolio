import { z } from "zod";

/**
 * Zod schemas — the single source of truth for data integrity.
 * `src/data/index.ts` validates the complete authored bundle at the data boundary.
 * The same schemas are reused in tests and other runtime boundaries.
 */

export const Vec3Schema = z.tuple([z.number(), z.number(), z.number()]);

export const SubSkillSchema = z.object({
  name: z.string(),
  tags: z.array(z.string()),
  note: z.string().optional(),
});

export const PlanetSchema = z.object({
  id: z.string(),
  name: z.string(),
  orbit: z.string(),
  size: z.number(),
  color: z.string(),
  summary: z.string(),
  level: z.enum(["Learning", "Working", "Proficient"]),
  /** Detailed, opinionated bullets — the "how I actually work" layer. */
  depth: z.array(z.string()),
  /** Concrete evidence of the skill in shipped work. */
  evidence: z.string(),
  moons: z.array(SubSkillSchema),
});

export const GalaxySchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  color: z.string(),
  position: Vec3Schema,
  year: z.string(),
  role: z.string(),
  duration: z.string(),
  type: z.string(),
  status: z.string(),
  stack: z.array(z.string()),
  links: z.object({
    demo: z.string(),
    github: z.string(),
  }),
  metrics: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  features: z.array(z.string()),
  challenges: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
    }),
  ),
  layers: z.object({
    problem: z.string(),
    solution: z.string(),
    decisions: z.array(z.string()),
    impact: z.string(),
  }),
});

export const BlackHolePillarSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const BlackHoleLoopStepSchema = z.object({
  step: z.string(),
  body: z.string(),
});

export const BlackHoleSchema = z.object({
  title: z.string(),
  position: Vec3Schema,
  intro: z.string(),
  pillars: z.array(BlackHolePillarSchema),
  loop: z.array(BlackHoleLoopStepSchema),
});

export const IdentitySchema = z.object({
  name: z.string(),
  role: z.string(),
  location: z.string(),
  headline: z.string(),
  bio: z.string(),
  fragments: z.array(z.string()),
  stats: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  principles: z.array(z.string()),
});

export const OrbitSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

export const TimelineEntrySchema = z.object({
  id: z.string(),
  year: z.string(),
  title: z.string(),
  body: z.string(),
  detail: z.string(),
});

export const LanguageEntrySchema = z.object({
  name: z.string(),
  level: z.string(),
  strength: z.number().min(0).max(1),
});

export const ContactLineSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const ContactChannelSchema = z.object({
  label: z.string(),
  value: z.string(),
  href: z.string(),
  obfuscated: z.string().optional(),
});

export const ContactSchema = z.object({
  title: z.string(),
  position: Vec3Schema,
  lines: z.array(ContactLineSchema),
  channels: z.array(ContactChannelSchema),
});

export const ManifestoSchema = z.array(z.string());

export const CometSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  message: z.string(),
  ellipticalOrbit: z.object({
    a: z.number(),
    b: z.number(),
    center: Vec3Schema,
    rotation: z.number(),
  }),
});

// ---- Canonical domain types are inferred from these schemas. ----
export type Vec3 = z.infer<typeof Vec3Schema>;
export type SubSkill = z.infer<typeof SubSkillSchema>;
export type Planet = z.infer<typeof PlanetSchema>;
export type Galaxy = z.infer<typeof GalaxySchema>;
export type BlackHole = z.infer<typeof BlackHoleSchema>;
export type BlackHolePillar = z.infer<typeof BlackHolePillarSchema>;
export type BlackHoleLoopStep = z.infer<typeof BlackHoleLoopStepSchema>;
export type Identity = z.infer<typeof IdentitySchema>;
export type Orbit = z.infer<typeof OrbitSchema>;
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
export type LanguageEntry = z.infer<typeof LanguageEntrySchema>;
export type ContactLine = z.infer<typeof ContactLineSchema>;
export type ContactChannel = z.infer<typeof ContactChannelSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Comet = z.infer<typeof CometSchema>;
export type Manifesto = z.infer<typeof ManifestoSchema>;

/**
 * Validate a single entity, returning a human-readable error report.
 * Throws with a detailed message when the data does not match.
 */
type ParseResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } };

function report<T>(
  label: string,
  result: ParseResult<T>,
): asserts result is { success: true; data: T } {
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`[validation] ${label} failed:\n${issues}`);
  }
}

function assertUniqueIds(label: string, records: readonly { id: string }[]): void {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const record of records) {
    if (seen.has(record.id)) duplicates.add(record.id);
    seen.add(record.id);
  }
  if (duplicates.size > 0) {
    throw new Error(`[validation] ${label} contains duplicate IDs: ${[...duplicates].join(", ")}`);
  }
}

/** Validate the complete portfolio bundle before any consumer can render it. */
export const validateData = (data: unknown): void => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("[validation] Invalid data structure: expected an object");
  }
  const obj = data as Record<string, unknown>;

  const planetsResult = PlanetSchema.array().safeParse(obj["planets"]);
  const galaxiesResult = GalaxySchema.array().safeParse(obj["galaxies"]);
  const orbitsResult = OrbitSchema.array().safeParse(obj["orbits"]);
  const timelineResult = TimelineEntrySchema.array().safeParse(obj["timeline"]);

  report("planets", planetsResult);
  report("galaxies", galaxiesResult);
  report("blackHole", BlackHoleSchema.safeParse(obj["blackHole"]));
  report("identity", IdentitySchema.safeParse(obj["identity"]));
  report("orbits", orbitsResult);
  report("timeline", timelineResult);
  report("languages", LanguageEntrySchema.array().safeParse(obj["languages"]));
  report("contact", ContactSchema.safeParse(obj["contact"]));
  report("manifesto", ManifestoSchema.safeParse(obj["manifesto"]));
  report("comet", CometSchema.safeParse(obj["comet"]));

  // Each ID namespace is unique within its own collection. Cross-collection
  // IDs may intentionally match, so they are not combined into one namespace.
  assertUniqueIds("planets", planetsResult.data);
  assertUniqueIds("galaxies", galaxiesResult.data);
  assertUniqueIds("orbits", orbitsResult.data);
  assertUniqueIds("timeline", timelineResult.data);
  assertPlanetOrbitReferences(planetsResult.data, orbitsResult.data);
};

export function assertPlanetOrbitReferences(
  planets: readonly Pick<Planet, "id" | "orbit">[],
  orbits: readonly Pick<Orbit, "id">[],
): void {
  const orbitIds = new Set(orbits.map((orbit) => orbit.id));
  const orphanPlanets = planets.filter((planet) => !orbitIds.has(planet.orbit));
  if (orphanPlanets.length > 0) {
    throw new Error(
      `Unknown orbit IDs: ${orphanPlanets
        .map((planet) => `${planet.id}:${planet.orbit}`)
        .join(", ")}`,
    );
  }
}

// ---- Backwards-compatible type guards (thin wrappers over Zod) ----
export const isSubSkill = (obj: unknown): obj is z.infer<typeof SubSkillSchema> =>
  SubSkillSchema.safeParse(obj).success;
export const isPlanet = (obj: unknown): obj is Planet => PlanetSchema.safeParse(obj).success;
export const isGalaxy = (obj: unknown): obj is Galaxy => GalaxySchema.safeParse(obj).success;
export const isBlackHole = (obj: unknown): obj is BlackHole =>
  BlackHoleSchema.safeParse(obj).success;
export const isIdentity = (obj: unknown): obj is Identity => IdentitySchema.safeParse(obj).success;
export const isComet = (obj: unknown): obj is z.infer<typeof CometSchema> =>
  CometSchema.safeParse(obj).success;
