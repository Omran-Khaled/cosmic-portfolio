import React from "react";
import { orbits, planets } from "@/data/index";

export const OrbitPanel = React.memo(() => {
  return (
    <div className="space-y-3 opacity-90">
      {orbits.map((orbit) => (
        <div
          key={orbit.id}
          className="rounded-lg border border-border/40 bg-secondary/20 p-2.5 transition-all hover:bg-secondary/30 hover:border-border/60"
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-wide opacity-80"
            style={{ color: orbit.color }}
          >
            {orbit.name}
          </p>
          <div className="mt-1.5 space-y-1">
            {planets
              .filter((p) => p.orbit === orbit.id)
              .map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-foreground/90">{p.name}</span>
                    <span className="font-mono text-muted-foreground/70">{p.level}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
});

OrbitPanel.displayName = "OrbitPanel";
