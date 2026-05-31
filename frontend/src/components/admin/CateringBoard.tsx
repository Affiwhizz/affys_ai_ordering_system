"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Mail, Phone, Loader2 } from "lucide-react";
import {
  CATERING_STATUSES,
  CATERING_STATUS_TONE,
  type AdminCateringInquiry,
  type CateringStatus,
} from "@/lib/catering/types";
import { setCateringStatus, setCateringQuote } from "@/app/admin/catering/actions";

interface Props {
  inquiries: AdminCateringInquiry[];
}

const COLUMNS: { status: CateringStatus; label: string }[] = [
  { status: "new",       label: "New" },
  { status: "reviewing", label: "Reviewing" },
  { status: "quoted",    label: "Quoted" },
  { status: "confirmed", label: "Confirmed" },
  { status: "declined",  label: "Declined" },
];

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : ", ";

const fmtCurrency = (n: number | null) =>
  n != null
    ? new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: n % 1 === 0 ? 0 : 2,
      }).format(n)
    : "";

export default function CateringBoard({ inquiries }: Props) {
  const [selected, setSelected] = useState<AdminCateringInquiry | null>(null);

  const byStatus = useMemo(() => {
    const map: Record<CateringStatus, AdminCateringInquiry[]> = {
      new: [], reviewing: [], quoted: [], confirmed: [], declined: [],
    };
    for (const inq of inquiries) map[inq.status].push(inq);
    return map;
  }, [inquiries]);

  return (
    <>
      <div className="grid auto-rows-fr gap-4 lg:grid-cols-5">
        {COLUMNS.map((col) => {
          const items = byStatus[col.status];
          const tone = CATERING_STATUS_TONE[col.status];
          return (
            <section
              key={col.status}
              className={`flex flex-col rounded-2xl border bg-white shadow-sm ${tone.border}`}
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
                    className="rounded-xl border border-border bg-white p-4 shadow-sm transition-all hover:border-gold/60 hover:shadow-md cursor-pointer"
                    onClick={() => setSelected(c)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-sm font-semibold text-espresso">
                        {c.eventType || "Inquiry"}
                      </p>
                      <span className="font-mono text-[10px] text-foreground-subtle">
                        {c.id.slice(0-4).toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-foreground-muted">{c.name}</p>
                    <ul className="mt-3 space-y-1.5 text-[11px] text-foreground-muted">
                      {c.eventDate && (
                        <li className="flex items-center gap-2">
                          <Calendar size={12} className="text-gold-deep" />
                          {fmtDate(c.eventDate)}
                        </li>
                      )}
                      {c.guestCount != null && (
                        <li className="flex items-center gap-2">
                          <Users size={12} className="text-gold-deep" />
                          {c.guestCount} guests
                        </li>
                      )}
                      {c.location && (
                        <li className="flex items-center gap-2">
                          <MapPin size={12} className="text-gold-deep" />
                          {c.location}
                        </li>
                      )}
                    </ul>
                    {(c.quoteAmount != null || c.budget) && (
                      <div className="mt-3 flex items-center justify-between rounded-lg bg-cream/60 px-2.5 py-1.5 text-[11px]">
                        <span className="text-foreground-muted">
                          {c.quoteAmount != null ? "Quoted" : "Budget"}
                        </span>
                        <span className="font-semibold text-espresso">
                          {c.quoteAmount != null ? fmtCurrency(c.quoteAmount) : c.budget}
                        </span>
                      </div>
                    )}
                    {c.notes && (
                      <p className="mt-2 text-[11px] italic text-foreground-subtle line-clamp-2">
                        &ldquo;{c.notes}&rdquo;
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <InquiryDrawer inquiry={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function InquiryDrawer({
  inquiry,
  onClose,
}: {
  inquiry: AdminCateringInquiry | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [quoteInput, setQuoteInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

  // Sync edit fields whenever a new inquiry opens. setState-in-effect is the
  // correct pattern here, we're syncing UI state from a prop change (the
  // selected inquiry switching), same idea as hydrate-from-storage.
  useEffect(() => {
    if (!inquiry) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuoteInput(inquiry.quoteAmount != null ? String(inquiry.quoteAmount) : "");
    setNotesInput(inquiry.staffNotes ?? "");
    setError(null);
  }, [inquiry]);

  if (!inquiry) return null;

  const onStatus = (next: CateringStatus) => {
    setError(null);
    startTransition(async () => {
      const res = await setCateringStatus(inquiry.id, next);
      if (!res.ok) setError(res.error ?? "Could not update status.");
      else router.refresh();
    });
  };

  const onSaveQuote = () => {
    setError(null);
    const n = parseFloat(quoteInput);
    const amount = Number.isFinite(n) && n >= 0 ? n : null;
    startTransition(async () => {
      const res = await setCateringQuote(inquiry.id, amount, notesInput.trim() || null);
      if (!res.ok) setError(res.error ?? "Could not save quote.");
      else router.refresh();
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-end sm:items-stretch"
    >
      <button
        type="button"
        aria-label="Close inquiry"
        onClick={onClose}
        className="absolute inset-0 bg-espresso/55 backdrop-blur-sm cursor-default"
      />
      <aside className="relative ml-auto h-full w-full max-w-lg overflow-y-auto bg-white shadow-luxe">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-espresso px-6 py-4 text-ivory">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold">Catering inquiry</p>
            <h2 className="mt-1 font-display text-xl font-semibold leading-tight">
              {inquiry.eventType || "Inquiry"}
            </h2>
            <p className="mt-1 text-xs text-ivory/70">
              Ref CAT-{inquiry.id.slice(0-4).toUpperCase()} ·{" "}
              {new Date(inquiry.createdAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ivory/30 text-ivory hover:bg-ivory/10"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="space-y-6 px-6 py-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Customer</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <DetailRow label="Name" value={inquiry.name} />
              <DetailRow
                label="Phone"
                value={
                  <a href={`tel:${inquiry.phone}`} className="inline-flex items-center gap-1.5 text-espresso underline decoration-gold underline-offset-4">
                    <Phone size={12} /> {inquiry.phone}
                  </a>
                }
              />
              {inquiry.email && (
                <DetailRow
                  label="Email"
                  value={
                    <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-1.5 text-espresso underline decoration-gold underline-offset-4">
                      <Mail size={12} /> {inquiry.email}
                    </a>
                  }
                />
              )}
            </dl>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Event</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <DetailRow label="Type" value={inquiry.eventType ?? ", "} />
              <DetailRow label="Date" value={fmtDate(inquiry.eventDate)} />
              <DetailRow label="Guests" value={inquiry.guestCount != null ? String(inquiry.guestCount) : ", "} />
              <DetailRow label="Location" value={inquiry.location ?? ", "} />
              <DetailRow label="Budget" value={inquiry.budget ?? ", "} />
            </dl>
          </section>

          {inquiry.notes && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Customer notes</h3>
              <p className="mt-3 rounded-xl border border-border bg-cream/40 px-4 py-3 text-sm italic text-foreground-muted">
                &ldquo;{inquiry.notes}&rdquo;
              </p>
            </section>
          )}

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Quote &amp; internal notes</h3>
            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">Quote (EUR)</span>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={quoteInput}
                  onChange={(e) => setQuoteInput(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                  placeholder="e.g. 1450"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">Staff notes (internal)</span>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                  placeholder="Vendor notes, follow-up reminders…"
                />
              </label>
              <button
                type="button"
                onClick={onSaveQuote}
                disabled={pending}
                className="inline-flex h-10 items-center rounded-full bg-espresso px-5 text-xs font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso disabled:opacity-50"
              >
                {pending ? <Loader2 size={14} className="mr-2 animate-spin" /> : null}
                Save quote &amp; notes
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Status</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATERING_STATUSES.map((s) => {
                const tone = CATERING_STATUS_TONE[s];
                const isCurrent = s === inquiry.status;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onStatus(s)}
                    disabled={pending || isCurrent}
                    className={`inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold transition-all ${
                      isCurrent
                        ? `${tone.bg} ${tone.text} border ${tone.border}`
                        : "border border-border bg-white text-foreground-muted hover:border-espresso hover:text-espresso"
                    } disabled:cursor-not-allowed`}
                  >
                    {tone.label}
                    {isCurrent && <span className="ml-1.5">·</span>}
                  </button>
                );
              })}
            </div>
            {error && <p className="mt-3 text-xs text-red">{error}</p>}
          </section>

          <section className="flex gap-2 pt-2">
            <a
              href={`https://wa.me/${inquiry.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                `Hi ${inquiry.name.split(" ")[0] || inquiry.name}, this is Affy's, thanks for your catering inquiry (Ref CAT-${inquiry.id.slice(0-4).toUpperCase()}). Happy to help, can I ask a couple of quick questions?`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex h-11 items-center justify-center rounded-full bg-forest px-4 text-xs font-semibold text-ivory transition-colors hover:bg-forest-deep"
            >
              WhatsApp
            </a>
            {inquiry.email && (
              <a
                href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Your catering inquiry, Affy's · CAT-${inquiry.id.slice(0-4).toUpperCase()}`)}`}
                className="flex-1 inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-4 text-xs font-semibold text-espresso transition-colors hover:border-espresso"
              >
                Email
              </a>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="w-20 shrink-0 text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
        {label}
      </dt>
      <dd className="text-sm text-espresso">{value}</dd>
    </div>
  );
}
