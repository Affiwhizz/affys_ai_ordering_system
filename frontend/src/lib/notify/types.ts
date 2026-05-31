/**
 * Client-safe notify-me / waitlist helpers + types.
 *
 * Anything imported into a client component MUST live here, not in
 * get-signups.ts (which has `import "server-only"`). Convention matches
 * lib/catering/types.ts and lib/store/types.ts.
 */

export interface NotifySignup {
  id: string;
  email: string | null;
  phone: string | null;
  source: string;
  createdAt: string;
}

const SOURCE_LABELS: Record<string, { label: string; tone: string }> = {
  "portimao-offseason": { label: "Portimão pop-up alerts",       tone: "bg-red/10 text-red border-red" },
  "portimao-waitlist":  { label: "Portimão sold-out waitlist",   tone: "bg-gold/10 text-espresso border-gold" },
  "daily-pause":        { label: "Daily ordering resume",        tone: "bg-forest/10 text-forest border-forest" },
  general:              { label: "General",                      tone: "bg-cream-deep text-foreground-muted border-foreground-muted" },
};

export function labelForSource(source: string): string {
  return SOURCE_LABELS[source]?.label ?? source;
}

export function toneForSource(source: string): string {
  return SOURCE_LABELS[source]?.tone ?? SOURCE_LABELS.general.tone;
}
