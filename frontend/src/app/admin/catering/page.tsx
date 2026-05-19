import { Calendar, MapPin, Users } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import {
  CATERING,
  formatCurrency,
  formatShortDate,
  type CateringStatus,
} from "@/components/admin/mock-data";

const COLUMNS: { status: CateringStatus; label: string; accent: string }[] = [
  { status: "new", label: "New", accent: "border-gold" },
  { status: "reviewing", label: "Reviewing", accent: "border-foreground-muted" },
  { status: "quoted", label: "Quoted", accent: "border-red" },
  { status: "confirmed", label: "Confirmed", accent: "border-forest" },
  { status: "declined", label: "Declined", accent: "border-border-strong" },
];

export default function CateringPage() {
  return (
    <>
      <Topbar
        title="Catering inquiries"
        subtitle="Pipeline of catering and event requests across the channels."
      />

      <main className="px-6 py-8 md:px-8 md:py-10">
        <div className="grid auto-rows-fr gap-4 lg:grid-cols-5">
          {COLUMNS.map((col) => {
            const items = CATERING.filter((c) => c.status === col.status);
            return (
              <section
                key={col.status}
                className={`flex flex-col rounded-2xl border bg-white shadow-sm ${col.accent}`}
              >
                <header className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-espresso">
                      {col.label}
                    </h2>
                    <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[10px] font-semibold text-foreground-muted">
                      {items.length}
                    </span>
                  </div>
                </header>
                <ul className="flex flex-1 flex-col gap-3 p-3">
                  {items.length === 0 && (
                    <li className="rounded-xl border border-dashed border-border-strong bg-cream/40 px-4 py-6 text-center text-xs text-foreground-subtle">
                      Nothing in this stage
                    </li>
                  )}
                  {items.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-xl border border-border bg-white p-4 shadow-sm transition-all hover:border-gold/60 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display text-sm font-semibold text-espresso">
                          {c.eventType}
                        </p>
                        <span className="font-mono text-[10px] text-foreground-subtle">{c.id}</span>
                      </div>

                      <p className="mt-1 text-xs text-foreground-muted">{c.customer.name}</p>

                      <ul className="mt-3 space-y-1.5 text-[11px] text-foreground-muted">
                        <li className="flex items-center gap-2">
                          <Calendar size={12} className="text-gold-deep" />
                          {formatShortDate(c.date)}
                        </li>
                        <li className="flex items-center gap-2">
                          <Users size={12} className="text-gold-deep" />
                          {c.guestCount} guests
                        </li>
                        <li className="flex items-center gap-2">
                          <MapPin size={12} className="text-gold-deep" />
                          {c.location}
                        </li>
                      </ul>

                      {(c.budget || c.quote) && (
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-cream/60 px-2.5 py-1.5 text-[11px]">
                          <span className="text-foreground-muted">
                            {c.quote ? "Quoted" : "Budget"}
                          </span>
                          <span className="font-semibold text-espresso">
                            {c.quote ? formatCurrency(c.quote) : c.budget}
                          </span>
                        </div>
                      )}

                      {c.notes && (
                        <p className="mt-2 text-[11px] italic text-foreground-subtle line-clamp-2">
                          &ldquo;{c.notes}&rdquo;
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                        <button
                          type="button"
                          className="flex-1 rounded-full bg-espresso px-3 py-1.5 text-[11px] font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="flex-1 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold text-espresso transition-colors hover:border-espresso"
                        >
                          Move
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}
