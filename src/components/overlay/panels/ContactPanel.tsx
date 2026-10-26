import React, { useState } from "react";
import { InfoRow, Meter } from "@/components/shared/InfoRow";
import { contact, languages, manifesto } from "@/data/index";

export const ContactPanel = React.memo(() => {
  const [phoneVisible, setPhoneVisible] = useState(false);
  return (
    <div className="space-y-5">
      <div>
        {contact.lines.map((l) => (
          <InfoRow key={l.label} label={l.label} value={l.value} />
        ))}
      </div>
      <div className="space-y-2">
        <p className="label-mono">Channels</p>
        {contact.channels.map((c) =>
          c.label === "Phone" && !phoneVisible ? (
            <button
              key={c.label}
              type="button"
              onClick={() => setPhoneVisible(true)}
              className="flex min-h-[44px] items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 active:scale-[0.98]"
            >
              <span className="label-mono">{c.label}</span>
              <span className="text-foreground">Reveal number</span>
            </button>
          ) : (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noreferrer noopener" : undefined}
              className="flex min-h-[44px] items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 active:scale-[0.98]"
            >
              <span className="label-mono">{c.label}</span>
              <span className="truncate text-foreground">{c.obfuscated ?? c.value} ↗</span>
            </a>
          ),
        )}
      </div>
      <div>
        <p className="label-mono">Language signals</p>
        <div className="mt-3 space-y-3">
          {languages.map((lang) => (
            <div key={lang.name}>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="text-foreground">{lang.name}</span>
                <span>{lang.level}</span>
              </div>
              <div className="mt-1.5">
                <Meter value={lang.strength} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="label-mono">Cosmic manifesto</p>
        <ul className="mt-2 space-y-1.5">
          {manifesto.map((m) => (
            <li key={m} className="text-sm italic text-muted-foreground">
              "{m}"
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

ContactPanel.displayName = "ContactPanel";
