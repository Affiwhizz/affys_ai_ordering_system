"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";
import { updateMenuItem } from "@/app/admin/menu/actions";
import type { AdminVariant } from "@/lib/menu/get-menu";

/**
 * Pencil button + edit modal for a single dish. Lets staff change the name,
 * description, and each variant's price, then saves via the updateMenuItem
 * server action and refreshes so the change shows on the public menu.
 */
export default function MenuItemEditor({
  dbId,
  name,
  description,
  variants,
}: {
  dbId: string;
  name: string;
  description: string;
  variants: AdminVariant[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [n, setN] = useState(name);
  const [d, setD] = useState(description);
  const [prices, setPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(variants.map((v) => [v.id, String(v.price)])),
  );
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const openModal = () => {
    setN(name);
    setD(description);
    setPrices(Object.fromEntries(variants.map((v) => [v.id, String(v.price)])));
    setErr(null);
    setOpen(true);
  };

  const save = () => {
    setErr(null);
    start(async () => {
      const res = await updateMenuItem({
        dbId,
        name: n,
        description: d,
        variants: variants.map((v) => ({
          id: v.id,
          price: parseFloat(prices[v.id] ?? "0") || 0,
        })),
      });
      if (!res.ok) {
        setErr(res.error ?? "Couldn't save — please try again.");
        return;
      }
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        aria-label={`Edit ${name}`}
        onClick={openModal}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-espresso transition-colors hover:border-espresso"
      >
        <Pencil size={14} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => !pending && setOpen(false)}
            className="absolute inset-0 bg-espresso/40 backdrop-blur-sm"
          />
          {/* Panel */}
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-luxe">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-base font-semibold text-espresso">
                Edit dish
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => !pending && setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted hover:bg-cream"
              >
                <X size={16} />
              </button>
            </header>

            <div className="space-y-4 px-5 py-5">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                  Name
                </label>
                <input
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-espresso focus:border-espresso focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                  Description
                </label>
                <textarea
                  value={d}
                  onChange={(e) => setD(e.target.value)}
                  rows={3}
                  className="mt-1 w-full resize-none rounded-lg border border-border bg-cream px-3 py-2 text-sm text-espresso focus:border-espresso focus:outline-none"
                />
              </div>

              {variants.length > 0 && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                    Prices (€)
                  </label>
                  <div className="mt-1 space-y-2">
                    {variants.map((v) => (
                      <div key={v.id} className="flex items-center gap-3">
                        <span className="flex-1 text-sm text-foreground-muted">
                          {v.size}
                          {v.serves ? ` · ${v.serves}` : ""}
                        </span>
                        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-cream px-2.5 py-1.5 focus-within:border-espresso">
                          <span className="text-sm text-foreground-subtle">€</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={prices[v.id] ?? ""}
                            onChange={(e) =>
                              setPrices((p) => ({ ...p, [v.id]: e.target.value }))
                            }
                            className="w-20 bg-transparent text-right text-sm text-espresso focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {err && <p className="text-xs text-red">{err}</p>}
            </div>

            <footer className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              <button
                type="button"
                onClick={() => !pending && setOpen(false)}
                className="inline-flex h-9 items-center rounded-full border border-border bg-white px-4 text-sm font-semibold text-espresso hover:border-espresso"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={pending || n.trim().length === 0}
                className={`inline-flex h-9 items-center rounded-full bg-espresso px-4 text-sm font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso ${
                  pending || n.trim().length === 0 ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                {pending ? "Saving…" : "Save changes"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
