"use client";

import { useState, useTransition } from "react";
import { Power, CalendarDays, PauseCircle } from "lucide-react";
import {
  setPortimaoSettings,
  setDailyOrdering,
} from "@/app/admin/portimao/actions";
import type { PortimaoMode, StoreFlags } from "@/lib/store/types";

const MODES: { id: PortimaoMode; label: string; description: string; accent: string }[] = [
  {
    id: "auto",
    label: "Automatic (by date)",
    description: "Opens on the start date, closes after the end date below.",
    accent: "border-forest bg-forest/5",
  },
  {
    id: "open",
    label: "Force open",
    description: "Live now, ignoring the dates. Use to open early or extend.",
    accent: "border-forest bg-forest/5",
  },
  {
    id: "sold_out",
    label: "Sold out",
    description: "Shows the sold-out / waitlist state with Uber Eats fallback.",
    accent: "border-red bg-red/5",
  },
  {
    id: "closed",
    label: "Force closed",
    description: "Off-season page regardless of dates.",
    accent: "border-border-strong bg-cream",
  },
];

const inputCls =
  "mt-1.5 w-full rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-espresso focus:border-espresso focus:outline-none";

export default function PortimaoControl({ initial }: { initial: StoreFlags }) {
  const [mode, setMode] = useState<PortimaoMode>(initial.portimaoMode);
  const [start, setStart] = useState(initial.portimaoStart ?? "");
  const [end, setEnd] = useState(initial.portimaoEnd ?? "");

  const [paused, setPaused] = useState(initial.dailyOrderingPaused);
  const [resumeDate, setResumeDate] = useState(initial.dailyResumeDate ?? "");

  const [, startTransition] = useTransition();
  const [flash, setFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ping = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(null), 1800);
  };

  const saveWindow = () => {
    setError(null);
    startTransition(async () => {
      const res = await setPortimaoSettings(mode, start || null, end || null);
      if (res.ok) ping("Portimão settings saved");
      else setError(res.error ?? "Couldn't save.");
    });
  };

  const savePause = (nextPaused: boolean, nextResume: string) => {
    startTransition(async () => {
      const res = await setDailyOrdering(nextPaused, nextResume || null);
      if (res.ok) ping(nextPaused ? "Daily ordering paused" : "Daily ordering resumed");
      else setError(res.error ?? "Couldn't save.");
    });
  };

  const effective =
    mode === "open"
      ? "Live"
      : mode === "closed"
        ? "Off-season"
        : mode === "sold_out"
          ? "Sold out"
          : "Follows dates";

  return (
    <div className="space-y-6">
      {flash && <p className="text-sm font-semibold text-forest">{flash}</p>}
      {error && <p className="text-sm font-semibold text-red">{error}</p>}

      {/* Daily ordering pause */}
      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <header className="flex items-center gap-2 border-b border-border px-5 py-4">
          <PauseCircle size={18} className="text-gold-deep" />
          <div>
            <h2 className="font-display text-base font-semibold text-espresso">
              Pause regular (Lisbon) ordering
            </h2>
            <p className="text-xs text-foreground-subtle">
              Turn this on while you&rsquo;re away (e.g. at Afro Nation). Customers can
              still browse the menu, but can&rsquo;t order — they see a note with your
              resume date. Portimão preorders are unaffected.
            </p>
          </div>
        </header>
        <div className="flex flex-wrap items-end justify-between gap-4 p-5">
          <label className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const next = !paused;
                setPaused(next);
                savePause(next, resumeDate);
              }}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                paused ? "bg-red" : "bg-forest"
              }`}
              aria-pressed={paused}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                  paused ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-sm font-semibold text-espresso">
              {paused ? "Ordering is PAUSED" : "Ordering is live"}
            </span>
          </label>
          <div className="min-w-[200px]">
            <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
              Resume date (shown to customers)
            </label>
            <input
              type="date"
              value={resumeDate}
              onChange={(e) => setResumeDate(e.target.value)}
              onBlur={() => savePause(paused, resumeDate)}
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* Portimão campaign mode */}
      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <header className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Power size={18} className="text-gold-deep" />
          <div>
            <h2 className="font-display text-base font-semibold text-espresso">
              Portimão campaign mode
            </h2>
            <p className="text-xs text-foreground-subtle">
              Currently: <strong>{effective}</strong>. Automatic follows the window below.
            </p>
          </div>
        </header>
        <ul className="grid gap-3 p-5 lg:grid-cols-2">
          {MODES.map((m) => {
            const active = mode === m.id;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? `${m.accent} ring-2 ring-offset-2 ring-gold`
                      : "border-border bg-white hover:border-foreground-muted"
                  }`}
                >
                  <p className="font-display text-sm font-semibold text-espresso">
                    {m.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-foreground-muted">
                    {m.description}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Portimão window dates */}
      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <header className="flex items-center gap-2 border-b border-border px-5 py-4">
          <CalendarDays size={18} className="text-gold-deep" />
          <h2 className="font-display text-base font-semibold text-espresso">
            Preorder window
          </h2>
        </header>
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div>
            <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
              Preorders open (start)
            </label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
              Preorders close after (end)
            </label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <footer className="flex justify-end border-t border-border bg-cream/40 px-5 py-3">
          <button
            type="button"
            onClick={saveWindow}
            className="inline-flex h-10 items-center rounded-full bg-espresso px-6 text-sm font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso"
          >
            Save Portimão settings
          </button>
        </footer>
      </section>
    </div>
  );
}
