"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

function revalidate() {
  revalidatePath("/"); // anything reading availability
}

/** Close (block) or reopen a specific date. */
export async function setBlockedDate(
  date: string,
  blocked: boolean,
): Promise<{ ok: boolean; error?: string }> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: "Invalid date." };
  }
  try {
    const supabase = await createServerSupabase();
    if (blocked) {
      const { error } = await supabase
        .from("blocked_dates")
        .upsert({ slot_date: date } as never, { onConflict: "slot_date" });
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await supabase
        .from("blocked_dates")
        .delete()
        .eq("slot_date", date);
      if (error) return { ok: false, error: error.message };
    }
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Update lead-time (days' notice) and which weekdays are open. */
export async function setAvailabilitySettings(
  leadDays: number,
  openWeekdays: number[],
): Promise<{ ok: boolean; error?: string }> {
  const lead = Math.max(0, Math.floor(leadDays));
  const days = Array.from(new Set(openWeekdays.filter((d) => d >= 0 && d <= 6))).sort();
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("store_settings")
      .update({ daily_lead_days: lead, open_weekdays: days } as never)
      .eq("id", true);
    if (error) return { ok: false, error: error.message };
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
