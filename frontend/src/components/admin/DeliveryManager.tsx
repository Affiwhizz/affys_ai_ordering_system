"use client";

import { useState, useTransition } from "react";
import { setZoneFee, setDeliverySettings } from "@/app/admin/delivery/actions";
import type {
  DeliverySettings,
  DeliveryGlobals,
  PaymentInfo,
} from "@/lib/delivery/get-delivery-settings";

const GLOBAL_FIELDS: { key: keyof DeliveryGlobals; label: string; hint?: string }[] = [
  { key: "freeDeliveryThreshold", label: "Free delivery over (€)" },
  { key: "outsideAmlFee", label: "Rest of Portugal base fee (€)" },
  { key: "weightThreshold", label: "Weight surcharge kicks in over (€ order)", hint: "Heavier out-of-Lisbon orders" },
  { key: "weightSurcharge", label: "Weight surcharge amount (€)" },
  { key: "tier1Threshold", label: "Tier 1 over (€)" },
  { key: "tier1Fee", label: "Tier 1 flat fee (€)" },
  { key: "tier2Threshold", label: "Tier 2 over (€)" },
  { key: "tier2Fee", label: "Tier 2 flat fee (€)" },
  { key: "whatsappThreshold", label: "Switch to WhatsApp over (€)" },
];

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-espresso focus:border-espresso focus:outline-none";

export default function DeliveryManager({ initial }: { initial: DeliverySettings }) {
  const [zones, setZones] = useState(
    initial.zones.map((z) => ({ ...z, feeStr: String(z.fee) })),
  );
  const [g, setG] = useState<Record<keyof DeliveryGlobals, string>>(() => {
    const obj = {} as Record<keyof DeliveryGlobals, string>;
    (Object.keys(initial.globals) as (keyof DeliveryGlobals)[]).forEach((k) => {
      obj[k] = String(initial.globals[k]);
    });
    return obj;
  });
  const [p, setP] = useState<PaymentInfo>(initial.payment);
  const [isPending, start] = useTransition();
  const [saved, setSaved] = useState<string | null>(null);

  const flash = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(null), 1500);
  };

  const commitZone = (key: string, feeStr: string) => {
    const fee = parseFloat(feeStr) || 0;
    start(async () => {
      await setZoneFee(key, fee);
      flash("Fee saved");
    });
  };

  const saveSettings = () => {
    const globals = {} as DeliveryGlobals;
    (Object.keys(g) as (keyof DeliveryGlobals)[]).forEach((k) => {
      globals[k] = parseFloat(g[k]) || 0;
    });
    start(async () => {
      const res = await setDeliverySettings(globals, p);
      flash(res.ok ? "Saved" : res.error ?? "Couldn't save");
    });
  };

  return (
    <div className="space-y-6">
      {/* Save feedback is now rendered INLINE next to the Save button at
          the bottom of the page so it's visible after a click without
          having to scroll back up. */}

      {/* Per-municipality fees */}
      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <header className="border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-semibold text-espresso">
            Municipality delivery fees
          </h2>
          <p className="mt-0.5 text-xs text-foreground-muted">
            Lisbon metro area. Edit a fee and click away to save it.
          </p>
        </header>
        <div className="grid gap-x-6 gap-y-1 p-4 sm:grid-cols-2">
          {zones.length === 0 ? (
            <p className="p-2 text-sm text-foreground-muted">
              No delivery zones found, make sure the seed ran in Supabase.
            </p>
          ) : (
            zones.map((z, i) => (
              <div key={z.key} className="flex items-center gap-3 py-1.5">
                <span className="flex-1 text-sm text-espresso">{z.name}</span>
                <div className="flex items-center gap-1 rounded-lg border border-border bg-cream px-2.5 py-1.5 focus-within:border-espresso">
                  <span className="text-sm text-foreground-subtle">€</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={z.feeStr}
                    onChange={(e) =>
                      setZones((cur) =>
                        cur.map((x, idx) =>
                          idx === i ? { ...x, feeStr: e.target.value } : x,
                        ),
                      )
                    }
                    onBlur={(e) => commitZone(z.key, e.target.value)}
                    className="w-16 bg-transparent text-right text-sm text-espresso focus:outline-none"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Globals */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="font-display text-base font-semibold text-espresso">
          Fees, tiers &amp; weight surcharge
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GLOBAL_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                {f.label}
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={g[f.key]}
                onChange={(e) => setG((cur) => ({ ...cur, [f.key]: e.target.value }))}
                className={inputCls}
              />
              {f.hint && (
                <p className="mt-0.5 text-[11px] text-foreground-subtle">{f.hint}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Payment details */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="font-display text-base font-semibold text-espresso">
          Payment details (shown at checkout)
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              Account name
            </label>
            <input
              value={p.accountName}
              onChange={(e) => setP({ ...p, accountName: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              IBAN
            </label>
            <input
              value={p.iban}
              onChange={(e) => setP({ ...p, iban: e.target.value })}
              placeholder="PT50 …"
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              MB Way / phone
            </label>
            <input
              value={p.mbway}
              onChange={(e) => setP({ ...p, mbway: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
              Payment note
            </label>
            <textarea
              value={p.note}
              onChange={(e) => setP({ ...p, note: e.target.value })}
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        {/* Inline feedback next to the button so the operator always sees
            what happened, no matter how far down the page they scrolled. */}
        {saved && (
          <span className="text-sm font-semibold text-forest">{saved}</span>
        )}
        <button
          type="button"
          onClick={saveSettings}
          disabled={isPending}
          className="inline-flex h-10 items-center rounded-full bg-espresso px-6 text-sm font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save settings & payment details"}
        </button>
      </div>
    </div>
  );
}
