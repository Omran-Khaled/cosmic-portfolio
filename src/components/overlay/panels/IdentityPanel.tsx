import React from "react";
import { Block, Bullets } from "@/components/shared/InfoRow";
import { identity } from "@/data/index";

export const IdentityPanel = React.memo(() => {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-foreground">{identity.headline}</p>
      <div className="grid grid-cols-2 gap-2">
        {identity.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border/70 bg-secondary/30 p-3">
            <p className="label-mono">{s.label}</p>
            <p className="mt-1 text-sm font-medium text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
      <Block label="Profile">
        <p>{identity.bio}</p>
      </Block>
      <Block label="Operating principles">
        <Bullets items={identity.principles} dot="bg-primary" />
      </Block>
      <Block label="Signal fragments">
        <Bullets items={identity.fragments} dot="bg-primary" />
      </Block>
    </div>
  );
});

IdentityPanel.displayName = "IdentityPanel";
