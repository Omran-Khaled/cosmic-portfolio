import { useState } from "react";
import { motion } from "framer-motion";
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
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section className="scroll-mt-8 px-5 py-10" id={id}>
      <p className="label-mono text-primary">{eyebrow}</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-starlight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
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
  const [demo, setDemo] = useState<{ src: string; title: string } | null>(null);
  return (
    <div className="min-h-screen bg-[image:var(--gradient-cosmos)] pb-24 [padding-bottom:calc(6rem+env(safe-area-inset-bottom))]">
      <VideoPortal
        open={demo !== null}
        src={demo?.src ?? ""}
        title={demo?.title ?? ""}
        onClose={() => setDemo(null)}
      />
      <header className="px-5 pb-6 pt-[calc(3.5rem+env(safe-area-inset-top))] text-center">
        <p className="label-mono text-primary">Explorable universe · simplified</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-cosmic">{identity.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {identity.role} · {identity.location}
        </p>
        {/* Quick contact chips under the name — visible without scrolling */}
        <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2">
          {contact.channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer noopener"
              className="flex min-h-[44px] flex-col items-center justify-center rounded-xl border border-primary/40 bg-primary/10 px-2 py-2 text-center transition-all active:scale-95 active:bg-primary/20"
              aria-label={`${c.label}: ${c.value}`}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {c.label === "GitHub" ? "⌥" : c.label === "LinkedIn" ? "in" : "✉"}
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-primary">
                {c.label}
              </span>
            </a>
          ))}
        </div>
        <div className="mt-6 space-y-2">
          {identity.fragments.map((f, i) => (
            <motion.p
              key={f}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="glass-panel rounded-full px-4 py-2 text-xs text-muted-foreground"
            >
              {f}
            </motion.p>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-sm">
          <CVDisplay />
        </div>
      </header>

      <Section eyebrow="Orbits" title="Skill systems">
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
                              className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground"
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

      <Section eyebrow="Galaxies" title="Projects">
        <div className="space-y-4">
          {galaxies.map((g) => (
            <article key={g.id} className="glass-panel rounded-2xl p-4">
              <h3 className="font-display text-lg font-semibold" style={{ color: g.color }}>
                🌌 {g.name}
              </h3>
              <p className="text-xs text-muted-foreground">{g.tagline}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setDemo({ src: g.links.demo, title: g.name })}
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
              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
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
                    className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-[10px] text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <ul className="mt-3 space-y-1 text-[11px] text-muted-foreground">
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
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Singularity" title={blackHole.title}>
        <div className="space-y-3">
          {blackHole.pillars.map((p) => (
            <div key={p.title} className="rounded-xl border border-nebula/40 bg-nebula/10 p-3">
              <p className="font-display text-sm font-semibold text-nebula-foreground">{p.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Constellation" title="Training & education">
        <ol className="relative space-y-5 border-l border-border pl-5">
          {timeline.map((t) => (
            <li key={t.id}>
              <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <p className="label-mono text-primary">{t.year}</p>
              <p className="font-display text-sm font-semibold text-foreground">{t.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Signals" title="Languages">
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

      <Section eyebrow="Uplink" title={contact.title} id="contact">
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
        <span className="label-mono hidden text-[10px] sm:inline">Open to work</span>
        <div className="flex flex-1 items-center justify-center gap-2">
          {contact.channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.label === "Email" ? undefined : "_blank"}
              rel={c.label === "Email" ? undefined : "noreferrer noopener"}
              className="flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground transition-all active:scale-95 active:border-primary/50 active:bg-primary/15"
              aria-label={`${c.label} — ${c.value}`}
            >
              <span aria-hidden="true">
                {c.label === "GitHub" ? "⌥" : c.label === "LinkedIn" ? "in" : "✉"}
              </span>
              <span className="hidden sm:inline">{c.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
