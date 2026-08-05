import React from "react";
import { Block, Bullets, Meter } from "@/components/shared/InfoRow";
import { planets, orbits } from "@/data/index";

export const PlanetPanel = React.memo(({ id }: { id: string }) => {
  const planet = planets.find((p) => p.id === id);
  if (!planet) return null;
  const orbit = orbits.find((o) => o.id === planet.orbit);
  if (!orbit) return null;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="label-mono">Depth signal</span>
          <span>{Math.round(planet.level * 100)}%</span>
        </div>
        <div className="mt-2">
          <Meter value={planet.level} color={planet.color} />
        </div>
      </div>
      <Block label="How I work here">
        <Bullets items={planet.depth} dot="bg-primary" />
      </Block>
      <div className="rounded-xl border border-signal/40 bg-signal/10 p-3">
        <p className="label-mono text-signal">In practice</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground">{planet.evidence}</p>
      </div>
      <div className="space-y-3">
        <p className="label-mono">Moons · sub-skills</p>
        {planet.moons.map((moon) => (
          <div key={moon.name} className="rounded-xl border border-border/70 bg-secondary/30 p-3">
            <p className="text-sm font-medium text-foreground">{moon.name}</p>
            {moon.note && (
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{moon.note}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {moon.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

PlanetPanel.displayName = "PlanetPanel";
