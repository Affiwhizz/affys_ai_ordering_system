"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Avail {
  leadDays: number;
  openWeekdays: number[];
  blockedDates: string[];
}
const DEFAULT_AVAIL: Avail = {
  leadDays: 1,
  openWeekdays: [1-2, 3-4, 5-6],
  blockedDates: [],
};

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Customer date picker, only allows valid order dates: at least the lead-time
 * days away, on an open weekday, and not a blocked date. Reads availability
 * from Supabase (public read) and validates the choice with a clear message.
 */
export default function OrderDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [avail, setAvail] = useState<Avail>(DEFAULT_AVAIL);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const [settingsRes, blockedRes] = await Promise.all([
          supabase
            .from("store_settings")
            .select("daily_lead_days, open_weekdays")
            .eq("id", true)
            .maybeSingle(),
          supabase.from("blocked_dates").select("slot_date"),
        ]);
        if (cancelled) return;
        const s = settingsRes.data as
          | { daily_lead_days: number; open_weekdays: number[] }
          | null;
        const b = (blockedRes.data as { slot_date: string }[] | null) ?? [];
        setAvail({
          leadDays: s?.daily_lead_days ?? DEFAULT_AVAIL.leadDays,
          openWeekdays: s?.open_weekdays ?? DEFAULT_AVAIL.openWeekdays,
          blockedDates: b.map((r) => r.slot_date),
        });
      } catch {
        // keep defaults
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + avail.leadDays);
  const minISO = toISO(minDate);

  const handleChange = (iso: string) => {
    if (!iso) {
      setError(null);
      onChange("");
      return;
    }
    const d = new Date(`${iso}T00:00:00`);
    if (iso < minISO) {
      setError(
        avail.leadDays === 1
          ? "We need at least 1 day's notice, please pick a later date."
          : `We need at least ${avail.leadDays} days' notice, please pick a later date.`,
      );
      onChange("");
      return;
    }
    if (!avail.openWeekdays.includes(d.getDay())) {
      setError("We're closed that day, please pick another date.");
      onChange("");
      return;
    }
    if (avail.blockedDates.includes(iso)) {
      setError("We're closed on that date, please pick another.");
      onChange("");
      return;
    }
    setError(null);
    onChange(iso);
  };

  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-foreground-subtle">
        Preferred date
      </label>
      <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-cream px-3 py-2.5 focus-within:border-espresso">
        <CalendarDays size={15} className="text-foreground-muted" />
        <input
          type="date"
          min={minISO}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-espresso focus:outline-none"
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red">{error}</p>
      ) : (
        <p className="mt-1 text-[11px] text-foreground-subtle">
          We need at least {avail.leadDays} day{avail.leadDays === 1 ? "" : "s"} notice.
        </p>
      )}
    </div>
  );
}
