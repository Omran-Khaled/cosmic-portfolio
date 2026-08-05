import React, { useState } from "react";
import { LinkButton, Block, Bullets } from "@/components/shared/InfoRow";
import { VideoPortal } from "@/components/overlay/VideoPortal";
import { galaxies } from "@/data/index";

export const GalaxyPanel = React.memo(({ id }: { id: string }) => {
  const galaxy = galaxies.find((g) => g.id === id);
  const [demoOpen, setDemoOpen] = useState(false);
  if (!galaxy) return null;

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button
          onClick={() => setDemoOpen(true)}
          className="flex-1 rounded-xl border border-primary/50 bg-primary/15 px-3 py-2 text-center text-xs font-medium text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/25"
        >
          ▶ Watch demo
        </button>
        <LinkButton href={galaxy.links.github}>⌥ GitHub</LinkButton>
      </div>
      <VideoPortal
        open={demoOpen}
        src={galaxy.links.demo}
        title={galaxy.name}
        onClose={() => setDemoOpen(false)}
      />

      <div className="grid grid-cols-2 gap-2">
        {[
          ["Role", galaxy.role],
          ["Duration", galaxy.duration],
          ["Type", galaxy.type],
          ["Status", galaxy.status],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border/70 bg-secondary/30 p-2.5">
            <p className="label-mono">{label}</p>
            <p className="mt-0.5 text-xs text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {galaxy.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        {galaxy.metrics.map((m) => (
          <div
            key={m.label}
            className="flex-1 rounded-xl border border-border/70 bg-void/40 p-2.5 text-center"
          >
            <p className="font-display text-sm font-semibold text-starlight">{m.value}</p>
            <p className="label-mono mt-0.5 text-[10px]">{m.label}</p>
          </div>
        ))}
      </div>

      <Block label="Problem">
        <p>{galaxy.layers.problem}</p>
      </Block>
      <Block label="Solution">
        <p>{galaxy.layers.solution}</p>
      </Block>
      <Block label="Feature set">
        <Bullets items={galaxy.features} dot="bg-primary" />
      </Block>
      <Block label="Engineering decisions">
        <Bullets items={galaxy.layers.decisions} />
      </Block>
      <div className="space-y-3">
        <p className="label-mono">Hard problems</p>
        {galaxy.challenges.map((c) => (
          <div key={c.title} className="rounded-xl border border-nebula/40 bg-nebula/10 p-3">
            <p className="font-display text-sm font-semibold text-nebula-foreground">{c.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-signal/40 bg-signal/10 p-3">
        <p className="label-mono text-signal">Impact</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground">{galaxy.layers.impact}</p>
      </div>
    </div>
  );
});

GalaxyPanel.displayName = "GalaxyPanel";
