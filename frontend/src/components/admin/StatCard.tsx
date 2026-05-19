import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
  accent?: "gold" | "red" | "forest" | "espresso";
  icon?: ReactNode;
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, string> = {
  gold: "bg-gold/15 text-gold-deep",
  red: "bg-red/10 text-red",
  forest: "bg-forest/15 text-forest",
  espresso: "bg-espresso text-ivory",
};

export default function StatCard({
  label,
  value,
  hint,
  trend,
  trendLabel,
  accent = "espresso",
  icon,
}: StatCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.22em] text-foreground-subtle">
          {label}
        </p>
        {icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentStyles[accent]}`}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-medium leading-tight text-espresso">
        {value}
      </p>
      {(hint || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs text-foreground-muted">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                trend === "up"
                  ? "bg-forest/10 text-forest"
                  : trend === "down"
                  ? "bg-red/10 text-red"
                  : "bg-foreground-subtle/15 text-foreground-muted"
              }`}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendLabel}
            </span>
          )}
          {hint && <span>{hint}</span>}
        </div>
      )}
    </article>
  );
}
