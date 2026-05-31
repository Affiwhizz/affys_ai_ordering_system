"use server";

import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Count notify-me signups created in the last N days (default 7). Used by the
 * admin Topbar notifications bell.
 */
export async function getRecentNotifyCount(days: number = 7): Promise<number> {
  try {
    const supabase = await createServerSupabase();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("notify_signups")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since);
    return count ?? 0;
  } catch {
    return 0;
  }
}
