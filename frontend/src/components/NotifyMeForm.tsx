"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { submitNotifySignup } from "@/lib/notify/actions";

interface NotifyMeFormProps {
  source: string;
  /** Which inputs to show. Default: both email + phone. */
  fields?: "both" | "email" | "phone";
  buttonLabel?: string;
  /** Compact single-row layout (for inline banners). */
  compact?: boolean;
  className?: string;
}

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2.5 text-sm text-espresso placeholder:text-foreground-subtle focus:border-espresso focus:outline-none";

export default function NotifyMeForm({
  source,
  fields = "both",
  buttonLabel = "Notify me",
  compact = false,
  className = "",
}: NotifyMeFormProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (pending) return;
    setPending(true);
    setError(null);
    const res = await submitNotifySignup({ email, phone, source });
    setPending(false);
    if (res.ok) setDone(true);
    else setError(res.error ?? "Couldn't sign you up — try again.");
  };

  if (done) {
    return (
      <p
        className={`flex items-center gap-2 text-sm font-semibold text-forest ${className}`}
      >
        <Check size={16} /> You&rsquo;re on the list — we&rsquo;ll be in touch.
      </p>
    );
  }

  return (
    <div className={className}>
      <div className={compact ? "flex flex-wrap items-end gap-2" : "grid gap-3 sm:grid-cols-2"}>
        {fields !== "phone" && (
          <div className={compact ? "min-w-[180px] flex-1" : ""}>
            {!compact && (
              <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                Email
              </label>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
          </div>
        )}
        {fields !== "email" && (
          <div className={compact ? "min-w-[160px] flex-1" : ""}>
            {!compact && (
              <label className="text-[11px] uppercase tracking-[0.18em] text-foreground-subtle">
                Phone
              </label>
            )}
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+351 9·· ··· ···"
              className={inputCls}
            />
          </div>
        )}
        {compact && (
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="h-[42px] shrink-0 rounded-lg bg-espresso px-5 text-sm font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso disabled:opacity-50"
          >
            {pending ? "…" : buttonLabel}
          </button>
        )}
      </div>
      {!compact && (
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="btn-gold mt-4 w-full sm:w-auto disabled:opacity-50"
        >
          {pending ? "Signing you up…" : buttonLabel}
        </button>
      )}
      {error && <p className="mt-2 text-xs font-semibold text-red">{error}</p>}
    </div>
  );
}
