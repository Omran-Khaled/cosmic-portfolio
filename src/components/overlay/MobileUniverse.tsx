import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { VideoPortal } from "./VideoPortal";
import { CVDisplay } from "./CVDisplay";
import {
  blackHole,
  contact,
  galaxies,
  identity,
  languages,
  manifesto,
  orbits,
  planets,
  timeline,
} from "@/data/index";

function Section({
  eyebrow,
  title,
  children,
  id,
  reducedMotion,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  id?: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.section
      {...(!reducedMotion
        ? {
            initial: { opacity: 0, y: 22 },
            whileInView: { opacity: 1, y: 0 },
          }
        : {})}
      className="scroll-mt-24 px-5 py-10"
      id={id}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="label-mono text-primary">{eyebrow}</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-starlight">{title}</h2>
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

function ContactGlyph({ label }: { label: string }) {
  if (label === "GitHub") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.56 1.19 3.18.91.1-.71.38-1.2.69-1.48-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.06 1.15a10.6 10.6 0 0 1 5.58 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.29-2.62 5.23-5.11 5.51.4.35.74 1.03.74 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
      </svg>
    );
  }
  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M5.1 3.25a2.1 2.1 0 1 1-.02 4.2 2.1 2.1 0 0 1 .02-4.2ZM3.3 9h3.6v11.7H3.3V9Zm5.8 0h3.45v1.6h.05a3.78 3.78 0 0 1 3.4-1.87c3.64 0 4.31 2.4 4.31 5.53v6.44h-3.6v-5.71c0-1.36-.03-3.11-1.9-3.11-1.9 0-2.2 1.48-2.2 3.01v5.81H9.1V9Z" />
      </svg>
    );
  }
  if (label === "Phone") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 3.5h3l1.5 4-2 1.5a15 15 0 0 0 8 8l1.5-2 4 1.5v3c0 1-1 1.7-2 1.5C10.5 19.8 4.2 13.5 3 5.5c-.2-1 .5-2 1.5-2Z"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
    </svg>
  );
}

/**
 * Simplified 2D exploration for small screens and low-power devices.
 *
 * Mobile-first enhancements:
 * - Clickable contact channels (GitHub / LinkedIn / Email) with 44px+ touch targets
 * - Sticky bottom action bar with quick-contact shortcuts
 * - Safe-area padding for notched devices
 * - Visual tap feedback on every interactive element
 */
export function MobileUniverse() {
  const [demo, setDemo] = useState<{
    src: string;
    title: string;
    fallbackHref: string;
  } | null>(null);
  const reducedMotion = useReducedMotion();
  return (
    <main className="mobile-universe relative isolate min-h-screen overflow-x-clip bg-[image:var(--gradient-cosmos)] pb-24 [padding-bottom:calc(6rem+env(safe-area-inset-bottom))]">
      <VideoPortal
        open={demo !== null}
        src={demo?.src ?? ""}
        title={demo?.title ?? ""}
        fallbackHref={demo?.fallbackHref}
        onClose={() => setDemo(null)}
      />
      <motion.header
        {...(!reducedMotion
          ? {
              initial: { opacity: 0, y: 18 },
              animate: { opacity: 1, y: 0 },
            }
          : {})}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        id="identity"
        className="relative px-5 pb-6 pt-[calc(2rem+env(safe-area-inset-top))] text-center"
      >
        <p role="status" aria-live="polite" className="label-mono text-primary">
          Explorable universe · simplified 2D portfolio
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-cosmic sm:text-5xl">
          {identity.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {identity.role} · {identity.location}
        </p>
        {/* Centered social dock: clear hierarchy, generous touch targets, subtle staggered arrival. */}
        <motion.div
          {...(!reducedMotion
            ? {
                initial: { opacity: 0, y: 14, scale: 0.98 },
                animate: { opacity: 1, y: 0, scale: 1 },
              }
            : {})}
          className="mobile-contact-dock relative mx-auto mt-6 w-full max-w-sm rounded-3xl border border-primary/25 px-3 py-4 sm:px-4"
          transition={{ delay: 0.12, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mobile-contact-dock__glint" aria-hidden="true" />
          <p className="label-mono text-center text-primary/90">Find me beyond the stars</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {contact.channels.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.label === "Email" ? undefined : "_blank"}
                rel={c.label === "Email" ? undefined : "noreferrer noopener"}
                {...(!reducedMotion
                  ? {
                      initial: { opacity: 0, y: 8, scale: 0.92 },
                      animate: { opacity: 1, y: 0, scale: 1 },
                    }
                  : {})}
                transition={{
                  delay: 0.2 + i * 0.075,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex min-h-[72px] min-w-[68px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-primary/20 bg-void/35 px-3 py-2 text-center shadow-[0_8px_24px_-18px_rgba(103,232,249,0.9)] transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_12px_28px_-14px_rgba(103,232,249,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-void active:scale-95"
                aria-label={`${c.label}: ${c.value}`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-[background-color,transform] duration-300 group-hover:rotate-[-4deg] group-hover:bg-primary/20">
                  <ContactGlyph label={c.label} />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-primary/90">
                  {c.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
        <div className="mt-6 space-y-2">
          {identity.fragments.map((f, i) => (
            <motion.p
              key={f}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { delay: 0.22 + i * 0.1, duration: 0.48, ease: [0.22, 1, 0.36, 1] }
              }
              className="glass-panel rounded-full px-4 py-2 text-xs text-muted-foreground"
            >
              {f}
            </motion.p>
          ))}
        </div>
        <div id="cv-download" className="mx-auto mt-6 max-w-sm scroll-mt-24">
          <CVDisplay />
        </div>
      </motion.header>

      <nav
        aria-label="Quick section navigation"
        className="glass-panel sticky top-[calc(env(safe-area-inset-top)+0.5rem)] z-30 mx-3 mb-2 flex gap-1.5 overflow-x-auto overscroll-x-contain rounded-2xl p-1.5 shadow-lg"
      >
        {[
          ["Skills", "skills"],
          ["Projects", "projects"],
          ["AI", "ai-engineering"],
          ["CV", "cv-download"],
          ["Contact", "contact"],
        ].map(([label, target]) => (
          <a
            key={target}
            href={`#${target}`}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-transparent px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {label}
          </a>
        ))}
      </nav>

      <Section id="skills" eyebrow="Orbits" title="Skill systems" reducedMotion={reducedMotion}>
        <div className="space-y-6">
          {orbits.map((orbit) => (
            <div key={orbit.id}>
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: orbit.color }}
              >
                {orbit.name}
              </p>
              <div className="mt-2 space-y-2">
                {planets
                  .filter((p) => p.orbit === orbit.id)
                  .map((planet) => (
                    <div key={planet.id} className="glass-panel rounded-xl p-3">
                      <p className="text-sm font-medium text-foreground">🪐 {planet.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {planet.summary}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {planet.moons
                          .flatMap((m) => m.tags)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="projects" eyebrow="Galaxies" title="Projects" reducedMotion={reducedMotion}>
        <div className="space-y-4">
          {galaxies.map((g) => (
            <motion.article
              key={g.id}
              {...(!reducedMotion
                ? {
                    initial: { opacity: 0, y: 18 },
                    whileInView: { opacity: 1, y: 0 },
                  }
                : {})}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel rounded-2xl p-4"
            >
              <h3 className="font-display text-lg font-semibold" style={{ color: g.color }}>
                🌌 {g.name}
              </h3>
              <p className="text-xs text-muted-foreground">{g.tagline}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDemo({ src: g.links.demo, title: g.name, fallbackHref: g.links.github })
                  }
                  className="min-h-[44px] flex-1 rounded-xl border border-primary/50 bg-primary/15 px-3 py-2 text-center text-xs font-medium text-primary transition-all active:scale-95 active:bg-primary/25"
                >
                  ▶ Watch demo
                </button>
                <a
                  href={g.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="min-h-[44px] flex-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-center text-xs font-medium text-foreground transition-all active:scale-95 active:bg-secondary"
                >
                  ⌥ GitHub
                </a>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                {[
                  ["Role", g.role],
                  ["Year", g.year],
                  ["Duration", g.duration],
                  ["Status", g.status],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border/70 bg-secondary/30 p-2"
                  >
                    <p className="label-mono">{label}</p>
                    <p className="mt-0.5 text-foreground">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                {g.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>

              <dl className="mt-4 space-y-3 text-xs leading-relaxed">
                <div>
                  <dt className="label-mono">Problem</dt>
                  <dd className="mt-1 text-muted-foreground">{g.layers.problem}</dd>
                </div>
                <div>
                  <dt className="label-mono">Solution</dt>
                  <dd className="mt-1 text-muted-foreground">{g.layers.solution}</dd>
                </div>
                <div>
                  <dt className="label-mono">Decisions</dt>
                  <dd className="mt-1 space-y-1 text-muted-foreground">
                    {g.layers.decisions.map((d) => (
                      <p key={d}>· {d}</p>
                    ))}
                  </dd>
                </div>
                <div className="rounded-lg border border-signal/40 bg-signal/10 p-2">
                  <dt className="label-mono text-signal">Impact</dt>
                  <dd className="mt-1 text-foreground">{g.layers.impact}</dd>
                </div>
              </dl>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section
        id="ai-engineering"
        eyebrow="Singularity"
        title={blackHole.title}
        reducedMotion={reducedMotion}
      >
        <div className="space-y-3">
          {blackHole.pillars.map((p) => (
            <div key={p.title} className="rounded-xl border border-nebula/40 bg-nebula/10 p-3">
              <p className="font-display text-sm font-semibold text-nebula-foreground">{p.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="education"
        eyebrow="Constellation"
        title="Training & education"
        reducedMotion={reducedMotion}
      >
        <ol className="relative space-y-4 border-l border-primary/30 pl-6">
          {timeline.map((t) => (
            <li
              key={t.id}
              className="relative rounded-2xl border border-primary/15 bg-primary/[0.06] p-4 shadow-[0_12px_35px_-24px_rgba(103,232,249,0.8)]"
            >
              <span className="absolute -left-[31px] top-5 h-3 w-3 rounded-full border-2 border-void bg-primary shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
              <p className="label-mono text-primary">{t.year}</p>
              <p className="mt-1 font-display text-base font-semibold text-foreground">{t.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t.body}</p>
              <p className="mt-3 border-t border-border/50 pt-3 text-xs leading-relaxed text-muted-foreground/80">
                {t.detail}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="languages" eyebrow="Signals" title="Languages" reducedMotion={reducedMotion}>
        <div className="space-y-3">
          {languages.map((l) => (
            <div key={l.name}>
              <div className="flex justify-between text-xs">
                <span className="text-foreground">{l.name}</span>
                <span className="text-muted-foreground">{l.level}</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary animate-signal"
                  style={{ width: `${l.strength * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Uplink" title={contact.title} id="contact" reducedMotion={reducedMotion}>
        {/* Basic info */}
        <div className="glass-panel rounded-2xl p-4">
          {contact.lines.map((l) => (
            <div
              key={l.label}
              className="flex justify-between border-b border-border/60 py-2 last:border-0"
            >
              <span className="label-mono">{l.label}</span>
              <span className="text-sm text-foreground">{l.value}</span>
            </div>
          ))}
        </div>

        {/* Clickable channels — 44px+ targets */}
        <p className="label-mono mt-6">Channels</p>
        <div className="mt-2 space-y-2">
          {contact.channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.label === "Email" ? undefined : "_blank"}
              rel={c.label === "Email" ? undefined : "noreferrer noopener"}
              className="flex min-h-[48px] items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground transition-all active:scale-[0.98] active:border-primary/50 active:bg-primary/10"
            >
              <span className="label-mono">{c.label}</span>
              <span className="truncate text-right">{c.obfuscated ?? c.value} ↗</span>
            </a>
          ))}
        </div>

        <div className="mt-6 space-y-2 text-center">
          {manifesto.map((m) => (
            <p key={m} className="text-xs italic text-muted-foreground">
              “{m}”
            </p>
          ))}
        </div>
      </Section>

      {/* Sticky bottom action bar — quick access to contact while scrolling */}
      <nav
        aria-label="Quick contact"
        className="glass-panel fixed bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2 rounded-2xl px-3 py-2 [bottom:calc(0.75rem+env(safe-area-inset-bottom))] md:hidden"
      >
        <span className="label-mono hidden text-xs sm:inline">Open to work</span>
        <div className="flex flex-1 items-center justify-center gap-2">
          {contact.channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.label === "Email" ? undefined : "_blank"}
              rel={c.label === "Email" ? undefined : "noreferrer noopener"}
              className="flex min-h-[44px] min-w-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground transition-all active:scale-95 active:border-primary/50 active:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-void"
              aria-label={`${c.label} — ${c.value}`}
            >
              <span
                className="inline-flex items-center justify-center text-primary"
                aria-hidden="true"
              >
                <ContactGlyph label={c.label} />
              </span>
              <span className="hidden sm:inline">{c.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </main>
  );
}
