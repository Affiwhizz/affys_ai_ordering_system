interface StatusPillProps {
  label: string;
  tone?: "neutral" | "amber" | "green" | "red" | "gold";
  size?: "sm" | "md";
}

const tones: Record<NonNullable<StatusPillProps["tone"]>, string> = {
  neutral: "bg-cream-deep text-foreground-muted border border-border-strong",
  amber: "bg-gold/15 text-gold-deep border border-gold/30",
  green: "bg-forest/10 text-forest border border-forest/30",
  red: "bg-red/10 text-red border border-red/30",
  gold: "bg-gold text-espresso border border-gold-deep",
};

export default function StatusPill({ label, tone = "neutral", size = "sm" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium uppercase tracking-wider whitespace-nowrap ${
        tones[tone]
      } ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === "gold"
            ? "bg-espresso"
            : tone === "green"
            ? "bg-forest"
            : tone === "amber"
            ? "bg-gold"
            : tone === "red"
            ? "bg-red"
            : "bg-foreground-muted"
        }`}
      />
      {label}
    </span>
  );
}
