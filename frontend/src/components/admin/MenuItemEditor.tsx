"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, Star } from "lucide-react";
import { updateMenuItem } from "@/app/admin/menu/actions";
import type { AdminVariant, AdminImage } from "@/lib/menu/get-menu";
import { SPICE_LEVELS } from "@/components/menu/menu-data";
import DishMediaManager from "./DishMediaManager";

/**
 * Pencil button + edit modal for a single dish. Edits name, description,
 * longer description, ingredients, spice levels, weekly-special flag, each
 * variant's price, and the dish's photos + video. Text changes save via the
 * updateMenuItem action; media saves immediately as it's uploaded.
 */
export default function MenuItemEditor({
  dbId,
  name,
  description,
  longDescription,
  ingredients,
  spiceLevels,
  isWeeklySpecial,
  variants,
  images,
  videoUrl,
}: {
  dbId: string;
  name: string;
  description: string;
  longDescription: string;
  ingredients: string[];
  spiceLevels: string[];
  isWeeklySpecial: boolean;
  variants: AdminVariant[];
  images: AdminImage[];
  videoUrl?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mediaChanged, setMediaChanged] = useState(false);
  const [n, setN] = useState(name);
  const [d, setD] = useState(description);
  const [ld, setLd] = useState(longDescription);
  const [ing, setIng] = useState(ingredients.join(", "));
  const [spice, setSpice] = useState<string[]>(spiceLevels);
  const [weekly, setWeekly] = useState(isWeeklySpecial);
  const [prices, setPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(variants.map((v) => [v.id, String(v.price)])),
  );
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const openModal = () => {
    setN(name);
    setD(description);
    setLd(longDescription);
    setIng(ingredients.join(", "));
    setSpice(spiceLevels);
    setWeekly(isWeeklySpecial);
    setPrices(Object.fromEntries(variants.map((v) => [v.id, String(v.price)])));
    setErr(null);
    setMediaChanged(false);
    setOpen(true);
  };

  // Close the modal; if photos/video changed, refresh so the list reflects it.
  const closeModal = () => {
    if (pending) return;
    setOpen(false);
    if (mediaChanged) router.refresh();
  };

  const toggleSpice = (lvl: string) =>
    setSpice((cur) =>
      cur.includes(lvl) ? cur.filter((x) => x !== lvl) : [...cur, lvl],
    );

  const save = () => {
    setErr(null);
    start(async () => {
      const res = await updateMenuItem({
        dbId,
        name: n,
        description: d,
        longDescription: ld,
        ingredients: ing.split(/[,\n]/).map((s) => s.trim()).filter(Boolean),
        spiceLevels: spice,
        isWeeklySpecial: weekly,
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
          <button
            type="button"
            aria-label="Close"
            onClick={closeModal}
            className="absolute inset-0 bg-espresso/40 backdrop-blur-sm"
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-luxe">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-base font-semibold text-espresso">
                Edit dish
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={closeModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted hover:bg-cream"
              >
                <X size={16} />
              </button>
            </header>

            <div className="space-y-4 overflow-y-auto px-5 py-5">
              <Field label="Name">
                <input
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-espresso focus:border-espresso focus:outline-none"
                />
              </Field>

              <Field label="Short description (shown on the card)">
                <textarea
                  value={d}
                  onChange={(e) => setD(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-espresso focus:border-espresso focus:outline-none resize-none"
                />
              </Field>

              <Field label="Longer description (shown in the detail popup)">
                <textarea
                  value={ld}
                  onChange={(e) => setLd(e.target.value)}
                  rows={3}
                  placeholder="A richer description for the dish detail view…"
                  className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-espresso focus:border-espresso focus:outline-none resize-none"
                />
              </Field>

              <Field label="Ingredients (separate with commas)">
                <textarea
                  value={ing}
                  onChange={(e) => setIng(e.target.value)}
                  rows={2}
                  placeholder="e.g. rice, tomato, pepper, onion, chicken stock"
                  className="mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-espresso focus:border-espresso focus:outline-none resize-none"
                />
              </Field>

              {/* Photos & video upload (saves immediately) */}
              <div className="rounded-xl border border-border bg-cream/40 p-3">
                <DishMediaManager
                  dishId={dbId}
                  initialImages={images}
                  initialVideoUrl={videoUrl}
                  onChange={() => setMediaChanged(true)}
                />
              </div>

              <Field label="Spice levels offered">
                <div className="mt-1 flex flex-wrap gap-2">
                  {SPICE_LEVELS.map((lvl) => {
                    const on = spice.includes(lvl);
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => toggleSpice(lvl)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                          on
                            ? "border-red bg-red text-ivory"
                            : "border-border bg-white text-espresso hover:border-red"
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1 text-[11px] text-foreground-subtle">
                  Pick the levels that apply. None selected = no spice picker for
                  this dish.
                </p>
              </Field>

              {variants.length > 0 && (
                <Field label="Prices (€)">
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
                </Field>
              )}

              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-cream/50 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={weekly}
                  onChange={(e) => setWeekly(e.target.checked)}
                  className="h-4 w-4 accent-gold"
                />
                <span className="flex items-center gap-1.5 text-sm font-medium text-espresso">
                  <Star size={14} className="text-gold" />
                  Feature in this week&rsquo;s specials
                </span>
              </label>

              {err && <p className="text-xs text-red">{err}</p>}
            </div>

            <footer className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              <button
                type="button"
                onClick={closeModal}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
        {label}
      </label>
      {children}
    </div>
  );
}
