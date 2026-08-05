import React from "react";
import { Meter } from "@/components/shared/InfoRow";
import { orbits, planets } from "@/data/index";

export const OrbitPanel = React.memo(() => {
  return (
    <div className="space-y-4">
      {orbits.map((orbit) => (
        <div key={orbit.id} className="rounded-xl border border-border/70 bg-secondary/30 p-3">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: orbit.color }}
          >
            {orbit.name}
          </p>
          <div className="mt-2 space-y-1.5">
            {planets
              .filter((p) => p.orbit === orbit.id)
              .map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground">{p.name}</span>
                    <span className="text-muted-foreground">{Math.round(p.level * 100)}%</span>
                  </div>
                  <div className="mt-1">
                    <Meter value={p.level} color={orbit.color} />
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
