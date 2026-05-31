"use server";

import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Count notify-me signups created after `since` (ISO timestamp). When `since`
 * is omitted, defaults to the last 7 days so the bell shows recent activity.
 * Used by the admin Topbar notifications bell.
 */
export async function getRecentNotifyCount(since?: string): Promise<number> {
  try {
    const supabase = await createServerSupabase();
    const cutoff =
      since ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("notify_signups")
      .select("id", { count: "exact", head: true })
      .gte("created_at", cutoff);
    return count ?? 0;
  } catch {
    return 0;
  }
}
