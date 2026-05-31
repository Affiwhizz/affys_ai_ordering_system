import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";

export interface NotifySignup {
  id: string;
  email: string | null;
  phone: string | null;
  source: string;
  createdAt: string;
}

interface Row {
  id: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  created_at: string;
}

const SOURCE_LABELS: Record<string, { label: string; tone: string }> = {
  "portimao-offseason": { label: "Portimão pop-up alerts", tone: "bg-red/10 text-red border-red" },
  "portimao-waitlist":  { label: "Portimão sold-out waitlist", tone: "bg-gold/10 text-espresso border-gold" },
  "daily-pause":        { label: "Daily ordering resume", tone: "bg-forest/10 text-forest border-forest" },
  general:              { label: "General", tone: "bg-cream-deep text-foreground-muted border-foreground-muted" },
};

export function labelForSource(source: string): string {
  return SOURCE_LABELS[source]?.label ?? source;
}

export function toneForSource(source: string): string {
  return SOURCE_LABELS[source]?.tone ?? SOURCE_LABELS.general.tone;
}

/**
 * Reads notify-me signups for the admin page, newest first. Uses the SSR
 * client so staff RLS gates access.
 */
export async function getNotifySignups(): Promise<NotifySignup[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("notify_signups")
      .select("id, email, phone, source, created_at")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as unknown as Row[]).map((r) => ({
      id: r.id,
      email: r.email,
      phone: r.phone,
      source: r.source ?? "general",
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}
