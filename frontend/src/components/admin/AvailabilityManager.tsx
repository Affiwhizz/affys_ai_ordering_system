"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { setBlockedDate, setAvailabilitySettings } from "@/app/admin/availability/actions";
import type { Availability } from "@/lib/availability/get-availability";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function startOfToday(): Date {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

export default function AvailabilityManager({ initial }: { initial: Availability }) {
  const [blocked, setBlocked] = useState<Set<string>>(new Set(initial.blockedDates));
  const [leadDays, setLeadDays] = useState(initial.leadDays);
  const [openDays, setOpenDays] = useState<number[]>(initial.openWeekdays);
  const [view, setView] = useState(() => {
    const t = startOfToday();
    return { year: t.getFullYear(), month: t.getMonth() };
  });
  const [, start] = useTransition();
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const today = startOfToday();

  const toggleDate = (iso: string) => {
    const willBlock = !blocked.has(iso);
    setBlocked((cur) => {
      const next = new Set(cur);
      if (willBlock) next.add(iso);
      else next.delete(iso);
      return next;
    });
    start(async () => {
      await setBlockedDate(iso, willBlock);
    });
  };

  const toggleWeekday = (d: number) => {
    const next = openDays.includes(d)
      ? openDays.filter((x) => x !== d)
      : [...openDays, d].sort();
    setOpenDays(next);
    start(async () => {
      await setAvailabilitySettings(leadDays, next);
      flashSaved();
    });
  };

  const commitLead = (val: number) => {
    const v = Math.max(0, Math.floor(val) || 0);
    setLeadDays(v);
    start(async () => {
      await setAvailabilitySettings(v, openDays);
      flashSaved();
    });
  };

  const flashSaved = () => {
    setSavedNote("Saved");
    setTimeout(() => setSavedNote(null), 1500);
  };

  // Build the month grid
  const monthStart = new Date(view.year, view.month, 1);
  const leading = monthStart.getDay(); // 0..6
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.year, view.month, d));

  const monthLabel = monthStart.toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const goMonth = (delta: number) =>
    setView((v) => {
      const m = v.month + delta;
      return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Calendar */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-espresso">{monthLabel}</h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => goMonth(-1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border hover:border-espresso"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => goMonth(1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border hover:border-espresso"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-1">{w}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={`b${i}`} />;
            const iso = toISO(date);
            const isPast = date < today;
            const closedWeekday = !openDays.includes(date.getDay());
            const isBlocked = blocked.has(iso);
            const disabled = isPast;
            return (
              <button
                key={iso}
                type="button"
                disabled={disabled}
                onClick={() => toggleDate(iso)}
                title={
                  isBlocked
                    ? "Closed — click to reopen"
                    : closedWeekday
                      ? "Weekday is off (set on the right) — click to also block this date"
                      : "Open — click to close this date"
                }
                className={`flex h-11 items-center justify-center rounded-lg text-sm transition-colors ${
                  disabled
                    ? "cursor-not-allowed text-foreground-subtle/40"
                    : isBlocked
                      ? "bg-red text-ivory"
                      : closedWeekday
                        ? "bg-cream-deep text-foreground-subtle"
                        : "bg-cream text-espresso hover:bg-forest hover:text-ivory"
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-foreground-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-cream" /> Open
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-red" /> Closed (blocked)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-cream-deep" /> Weekday off
          </span>
        </div>
      </section>

      {/* Settings */}
      <section className="space-y-5 rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-espresso">Rules</h2>
          {savedNote && <span className="text-xs font-semibold text-forest">{savedNote}</span>}
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
            Minimum notice (days)
          </label>
          <input
            type="number"
            min="0"
            value={leadDays}
            onChange={(e) => setLeadDays(parseInt(e.target.value || "0", 10))}
            onBlur={(e) => commitLead(parseInt(e.target.value || "0", 10))}
            className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-espresso focus:border-espresso focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-foreground-subtle">
            Customers can&rsquo;t order for a date sooner than this many days away.
          </p>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
            Open weekdays
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {WEEKDAYS.map((w, d) => {
              const on = openDays.includes(d);
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => toggleWeekday(d)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    on
                      ? "border-forest bg-forest text-ivory"
                      : "border-border bg-white text-foreground-muted hover:border-espresso"
                  }`}
                >
                  {w}
                </button>
              );
            })}
          </div>
          <p className="mt-1 text-[11px] text-foreground-subtle">
            Days you don&rsquo;t cook are off for everyone. Block one-off dates
            (holidays) on the calendar.
          </p>
        </div>
      </section>
    </div>
  );
}
