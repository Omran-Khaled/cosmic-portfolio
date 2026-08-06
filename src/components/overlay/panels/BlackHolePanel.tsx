import React from "react";
import { blackHole, timeline } from "@/data/index";

export const BlackHolePanel = React.memo(() => {
  return (
    <div className="space-y-5">
      {blackHole.pillars.map((p) => (
        <div key={p.title} className="rounded-xl border border-nebula/40 bg-nebula/10 p-3">
          <p className="font-display text-sm font-semibold text-nebula-foreground">{p.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
        </div>
      ))}
      <div>
        <p className="label-mono">The loop</p>
        <ol className="mt-2 space-y-2 border-l border-border pl-4">
          {blackHole.loop.map((l, i) => (
            <li key={l.step} className="relative">
              <span className="absolute -left-[21px] mt-1.5 h-2 w-2 rounded-full bg-primary" />
              <p className="text-sm font-medium text-foreground">
                {i + 1}. {l.step}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">{l.body}</p>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p className="label-mono">Constellation · learning path</p>
        <ol className="mt-2 space-y-3">
          {timeline.map((t) => (
            <li key={t.id} className="rounded-xl border border-border/70 bg-secondary/30 p-3">
              <p className="label-mono text-primary">{t.year}</p>
              <p className="text-sm font-medium text-foreground">{t.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
});

BlackHolePanel.displayName = "BlackHolePanel";
