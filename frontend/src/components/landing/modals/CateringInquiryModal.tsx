"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { submitCateringInquiry } from "@/lib/catering/actions";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Pre-fills the "Event" field if the user clicked from a specific occasion card. */
  defaultEventType?: string;
}

const EVENT_TYPES = [
  "Wedding",
  "Birthday / naming",
  "Corporate / office",
  "Pop-up / collaboration",
  "Other",
];

export default function CateringInquiryModal({ open, onClose, defaultEventType }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState(defaultEventType ?? "");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  // Sync prefill when the modal reopens with a different default. setState
  // here is the legit "sync prop change into form state" pattern.
  useEffect(() => {
    if (!open || !defaultEventType) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEventType(defaultEventType);
  }, [open, defaultEventType]);

  // Reset on close (after the modal animates out)
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setReference(null);
      setErrorMsg(null);
      setSubmitting(false);
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const canSubmit =
    name.trim().length > 1 && phone.trim().length >= 6 && !submitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMsg(null);

    const guests = Number(guestCount);
    const res = await submitCateringInquiry({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim(),
      eventType: eventType.trim() || undefined,
      eventDate: eventDate || undefined,
      guestCount: Number.isFinite(guests) && guests > 0 ? guests : undefined,
      location: location.trim() || undefined,
      budget: budget.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setSubmitting(false);
    if (!res.ok) {
      setErrorMsg(res.error || "Could not submit your inquiry. Try again.");
      return;
    }
    setReference(res.reference ?? "CAT-NEW");
    // Clear the form fields so reopening starts clean
    setName("");
    setPhone("");
    setEmail("");
    setEventType(defaultEventType ?? "");
    setEventDate("");
    setGuestCount("");
    setLocation("");
    setBudget("");
    setNotes("");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.button
            type="button"
            aria-label="Close catering form"
            onClick={onClose}
            className="absolute inset-0 bg-espresso/55 backdrop-blur-sm cursor-default"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="catering-modal-title"
            className="relative w-full max-w-lg overflow-hidden bg-white shadow-luxe sm:rounded-[1.4rem] rounded-t-[1.4rem] max-h-[92vh] flex flex-col"
            variants={{
              hidden: { y: 40, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-border bg-espresso px-6 py-4 text-ivory">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-gold">Catering &amp; events</p>
                <h2 id="catering-modal-title" className="mt-1 font-display text-xl font-semibold leading-tight">
                  Request a catering quote
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors hover:bg-ivory/10"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {reference ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <CheckCircle2 size={44} className="text-forest" strokeWidth={1.6} />
                  <div>
                    <p className="font-display text-2xl font-semibold text-espresso">Thank you!</p>
                    <p className="mt-2 text-sm text-foreground-muted">
                      Your catering inquiry is in. Reference{" "}
                      <span className="font-mono font-semibold text-espresso">{reference}</span>.
                      We&rsquo;ll come back to you with a tailored menu and quote — usually within
                      one working day.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 inline-flex h-11 items-center rounded-full bg-gold px-6 text-sm font-semibold text-espresso transition-all hover:bg-gold-soft"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <p className="text-sm text-foreground-muted">
                    Tell us about your event. Name and phone are required — anything else helps us
                    prepare a sharper quote.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Your name *">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                        placeholder="e.g. Tomi A."
                      />
                    </Field>
                    <Field label="Phone *">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input"
                        placeholder="+351 9·· ··· ···"
                      />
                    </Field>
                  </div>

                  <Field label="Email (optional)">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input"
                      placeholder="you@email.com"
                    />
                  </Field>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Event type">
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="input"
                      >
                        <option value="">Pick one…</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Event date">
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="input"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Guests (approx.)">
                      <input
                        type="number"
                        min={1}
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="input"
                        placeholder="e.g. 80"
                      />
                    </Field>
                    <Field label="Location / area">
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="input"
                        placeholder="Lisboa · venue or municipality"
                      />
                    </Field>
                  </div>

                  <Field label="Budget (optional)">
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="input"
                      placeholder='e.g. "around €1500"'
                    />
                  </Field>

                  <Field label="Tell us about your event">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="input min-h-[96px] resize-y"
                      placeholder="Vibe, dietary notes, any must-have dishes…"
                    />
                  </Field>

                  {errorMsg && (
                    <p className="rounded-xl bg-red/10 px-4 py-3 text-sm text-red">
                      {errorMsg}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-sm font-semibold text-foreground-muted hover:text-espresso"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="inline-flex h-12 items-center rounded-full bg-gold px-6 text-sm font-semibold text-espresso shadow-luxe transition-all hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        "Send my request"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
