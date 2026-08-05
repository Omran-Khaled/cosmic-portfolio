import type { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="label-mono">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

interface BlockProps {
  label: string;
  children: ReactNode;
}

export function Block({ label, children }: BlockProps) {
  return (
    <div>
      <p className="label-mono">{label}</p>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

interface BulletsProps {
  items: string[];
  dot?: string;
}

export function Bullets({ items, dot = "bg-accent" }: BulletsProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${dot}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  primary?: boolean;
}

export function LinkButton({ href, children, primary }: LinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={
        primary
          ? "flex-1 rounded-xl border border-primary/50 bg-primary/15 px-3 py-2 text-center text-xs font-medium text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/25"
          : "flex-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-center text-xs font-medium text-foreground transition-all hover:-translate-y-0.5 hover:bg-secondary"
      }
    >
      {children}
    </a>
  );
}

interface MeterProps {
  value: number;
  color?: string;
}

export function Meter({ value, color }: MeterProps) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full"
        style={{
          width: `${value * 100}%`,
          background: color ?? "var(--color-primary, currentColor)",
        }}
      />
    </div>
  );
}
