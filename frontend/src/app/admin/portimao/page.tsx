"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, AlertCircle, Power } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import StatCard from "@/components/admin/StatCard";
import { PORTIMAO, FESTIVAL_MENU, type PortimaoStatus } from "@/components/portimao/config";

const STATUSES: { id: PortimaoStatus; label: string; description: string; accent: string }[] = [
  {
    id: "live",
    label: "Live — accepting preorders",
    description: "Customers can preorder slots and bowls. Banner + page show campaign content.",
    accent: "border-forest bg-forest/5",
  },
  {
    id: "sold-out",
    label: "Sold out — waitlist only",
    description: "Page shows sold-out state with Uber Eats fallback + waitlist form.",
    accent: "border-red bg-red/5",
  },
  {
    id: "off-season",
    label: "Off-season — campaign closed",
    description: "Quiet 'see you next year' page with notify-me capture.",
    accent: "border-border-strong bg-cream",
  },
];

export default function AdminPortimaoPage() {
  const [status, setStatus] = useState<PortimaoStatus>("live");
  const [slotsPerDay, setSlotsPerDay] = useState(PORTIMAO.slotsPerDay);
  const [slotsLeft, setSlotsLeft] = useState(PORTIMAO.slotsLeftToday);

  return (
    <>
      <Topbar
        title="Portimão control"
        subtitle="Toggle campaign mode, manage capacity, and edit the festival menu."
      />

      <main className="px-6 py-8 md:px-8 md:py-10">
        {/* Status snapshot */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Campaign mode"
            value={status === "live" ? "Live" : status === "sold-out" ? "Sold out" : "Off-season"}
            hint={status === "live" ? "Bookings open" : status === "sold-out" ? "Waitlist active" : "Banner hidden"}
            icon={<Power size={16} strokeWidth={1.8} />}
            accent={status === "live" ? "forest" : status === "sold-out" ? "red" : "espresso"}
          />
          <StatCard
            label="Slots remaining today"
            value={`${slotsLeft}/${slotsPerDay}`}
            hint="Direct preorders only — Uber Eats tracked separately"
            icon={<MapPin size={16} strokeWidth={1.8} />}
            accent="gold"
          />
          <StatCard
            label="Festival window"
            value={PORTIMAO.campaignWindow.split(",")[0]}
            hint={PORTIMAO.pickupLocation}
            icon={<Calendar size={16} strokeWidth={1.8} />}
            accent="forest"
          />
        </div>

        {/* Mode toggle */}
        <section className="mt-10 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <header className="border-b border-border px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-espresso">Campaign mode</h2>
            <p className="text-xs text-foreground-subtle">
              Switch how the homepage block and /portimao page render. Currently a
              UI-only toggle — wire to backend/admin auth before going live.
            </p>
          </header>
          <ul className="grid gap-3 p-5 lg:grid-cols-3">
            {STATUSES.map((s) => {
              const active = status === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setStatus(s.id)}
                    className={`relative w-full rounded-2xl border p-5 text-left transition-all ${
                      active
                        ? `${s.accent} ring-2 ring-offset-2 ring-gold`
                        : "border-border bg-white hover:border-foreground-muted"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-sm font-semibold uppercase tracking-wider text-espresso">
                          {s.label}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-foreground-muted">
                          {s.description}
                        </p>
                      </div>
                      {active && (
                        <motion.span
                          layoutId="portimao-mode-check"
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-espresso"
                        >
                          ✓
                        </motion.span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Capacity */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <header className="border-b border-border px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-espresso">Daily capacity</h2>
            <p className="text-xs text-foreground-subtle">
              Set how many direct preorder slots open per day. Uber Eats orders
              don&rsquo;t count against this total.
            </p>
          </header>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                Slots per day
              </label>
              <input
                type="number"
                value={slotsPerDay}
                onChange={(e) => setSlotsPerDay(Number(e.target.value))}
                className="mt-1.5 w-full rounded-lg border border-border bg-cream px-3 py-2.5 font-display text-2xl font-medium text-espresso focus:border-espresso focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                Slots remaining today
              </label>
              <input
                type="number"
                value={slotsLeft}
                onChange={(e) => setSlotsLeft(Number(e.target.value))}
                className="mt-1.5 w-full rounded-lg border border-border bg-cream px-3 py-2.5 font-display text-2xl font-medium text-espresso focus:border-espresso focus:outline-none"
              />
            </div>
          </div>
          <footer className="flex items-center justify-between gap-3 border-t border-border bg-cream/40 px-5 py-3">
            <p className="flex items-center gap-2 text-[11px] text-foreground-muted">
              <AlertCircle size={12} className="text-gold-deep" />
              Mock UI — values won&rsquo;t persist until a backend is wired.
            </p>
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-full bg-espresso px-5 text-sm font-semibold text-ivory hover:bg-gold hover:text-espresso transition-colors"
            >
              Save changes
            </button>
          </footer>
        </section>

        {/* Pickup window */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <header className="border-b border-border px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-espresso">Pickup window</h2>
          </header>
          <div className="grid gap-5 p-5 sm:grid-cols-3">
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                Pickup days
              </label>
              <input
                defaultValue={PORTIMAO.pickupWindow}
                className="mt-1.5 w-full rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-espresso focus:border-espresso focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                Delivery starts
              </label>
              <input
                defaultValue={PORTIMAO.preorderDeadline}
                className="mt-1.5 w-full rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-espresso focus:border-espresso focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                Pickup location
              </label>
              <input
                defaultValue={PORTIMAO.pickupLocation}
                className="mt-1.5 w-full rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-espresso focus:border-espresso focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Festival menu (read-only summary, link to full menu manager) */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-espresso">Festival menu</h2>
              <p className="text-xs text-foreground-subtle">
                Categories visible during the campaign. Manage prices and availability in the Menu manager.
              </p>
            </div>
            <Clock size={16} className="text-gold-deep" />
          </header>
          <ul className="divide-y divide-border">
            {FESTIVAL_MENU.map((m) => (
              <li key={m.name} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-espresso">{m.name}</p>
                  <p className="text-[11px] text-foreground-subtle">
                    {m.category} · {m.description}
                  </p>
                </div>
                <span className="font-display text-sm font-semibold text-red whitespace-nowrap">
                  {m.priceFrom}
                </span>
                <label className="relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full bg-forest">
                  <span className="ml-5 inline-block h-5 w-5 rounded-full bg-white shadow-sm" />
                </label>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
