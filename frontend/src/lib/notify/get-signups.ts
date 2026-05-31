import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { NotifySignup } from "./types";

// Re-export the client-safe pieces from here too, so callers don't have to
// know which file to import from, but client components should still pull
// from "./types" directly (importing this file pulls in supabase/server).
export type { NotifySignup } from "./types";
export { labelForSource, toneForSource } from "./types";

interface Row {
  id: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  created_at: string;
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
