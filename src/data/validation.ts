import { z } from "zod";

/**
 * Zod schemas — the single source of truth for data integrity.
 * Every data module is validated against these at dev-time (and can be
 * reused at runtime boundaries, e.g. network edges).
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
  radius: z.number(),
  size: z.number(),
  speed: z.number(),
  color: z.string(),
  offset: z.number(),
  summary: z.string(),
  /** 0–1 mastery signal rendered as a bar. */
  level: z.number().min(0).max(1),
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
  demo: z.string().optional(),
});

export const BlackHoleSchema = z.object({
  title: z.string(),
  position: Vec3Schema,
  intro: z.string(),
  pillars: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
    }),
  ),
  loop: z.array(
    z.object({
      step: z.string(),
      body: z.string(),
    }),
  ),
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

export const ContactSchema = z.object({
  title: z.string(),
  position: Vec3Schema,
  lines: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  channels: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      href: z.string(),
    }),
  ),
});

export const ManifestoSchema = z.array(z.string());

// ---- Inferred types (kept in sync with the schemas) ----
export type Planet = z.infer<typeof PlanetSchema>;
export type Galaxy = z.infer<typeof GalaxySchema>;
export type BlackHole = z.infer<typeof BlackHoleSchema>;
export type Identity = z.infer<typeof IdentitySchema>;
export type Orbit = z.infer<typeof OrbitSchema>;
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
export type LanguageEntry = z.infer<typeof LanguageEntrySchema>;
export type Contact = z.infer<typeof ContactSchema>;

/**
 * Validate a single entity, returning a human-readable error report.
 * Throws with a detailed message when the data does not match.
 */
type ParseResult =
  | { success: true; data: unknown }
  | { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } };

function report(label: string, result: ParseResult): void {
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`[validation] ${label} failed:\n${issues}`);
  }
}

/** Validate the full data bundle. Throws on first failure with a clear report. */
export const validateData = (data: unknown): void => {
  if (!data || typeof data !== "object") {
    throw new Error("[validation] Invalid data structure: expected an object");
  }
  const obj = data as Record<string, unknown>;

  report("planets", PlanetSchema.array().safeParse(obj["planets"]));
  report("galaxies", GalaxySchema.array().safeParse(obj["galaxies"]));
  report("blackHole", BlackHoleSchema.safeParse(obj["blackHole"]));
  report("identity", IdentitySchema.safeParse(obj["identity"]));
  report("orbits", OrbitSchema.array().safeParse(obj["orbits"]));
  report("timeline", TimelineEntrySchema.array().safeParse(obj["timeline"]));
  report("languages", LanguageEntrySchema.array().safeParse(obj["languages"]));
  report("contact", ContactSchema.safeParse(obj["contact"]));
  report("manifesto", ManifestoSchema.safeParse(obj["manifesto"]));
};

// ---- Backwards-compatible type guards (thin wrappers over Zod) ----
export const isSubSkill = (obj: unknown): obj is z.infer<typeof SubSkillSchema> =>
  SubSkillSchema.safeParse(obj).success;
export const isPlanet = (obj: unknown): obj is Planet => PlanetSchema.safeParse(obj).success;
export const isGalaxy = (obj: unknown): obj is Galaxy => GalaxySchema.safeParse(obj).success;
export const isBlackHole = (obj: unknown): obj is BlackHole =>
  BlackHoleSchema.safeParse(obj).success;
export const isIdentity = (obj: unknown): obj is Identity => IdentitySchema.safeParse(obj).success;
