import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";

export interface Availability {
  /** Minimum days' notice required before an order date. */
  leadDays: number;
  /** Open weekdays, 0 = Sunday … 6 = Saturday. */
  openWeekdays: number[];
  /** Specific closed dates, ISO "YYYY-MM-DD". */
  blockedDates: string[];
}

export const DEFAULT_AVAILABILITY: Availability = {
  leadDays: 1,
  openWeekdays: [1, 2, 3, 4, 5, 6], // Mon–Sat
  blockedDates: [],
};

/**
 * Reads daily availability — lead time, open weekdays, and blocked dates.
 * Falls back to sensible defaults if the tables aren't set up or unreachable,
 * so the date picker always works.
 */
export async function getAvailability(): Promise<Availability> {
  try {
    const supabase = await createServerSupabase();

    const [{ data: settings }, { data: blocked }] = await Promise.all([
      supabase
        .from("store_settings")
        .select("daily_lead_days, open_weekdays")
        .eq("id", true)
        .maybeSingle(),
      supabase.from("blocked_dates").select("slot_date"),
    ]);

    const s = settings as
      | { daily_lead_days: number; open_weekdays: number[] }
      | null;

    return {
      leadDays: s?.daily_lead_days ?? DEFAULT_AVAILABILITY.leadDays,
      openWeekdays: s?.open_weekdays ?? DEFAULT_AVAILABILITY.openWeekdays,
      blockedDates: ((blocked as { slot_date: string }[] | null) ?? []).map(
        (r) => r.slot_date,
      ),
    };
  } catch {
    return DEFAULT_AVAILABILITY;
  }
}
