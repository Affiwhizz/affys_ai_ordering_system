"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Trash2 } from "lucide-react";
import { createMenuItem } from "@/app/admin/menu/actions";

interface PortionDraft {
  size: string;
  price: string;
}

/**
 * "Add dish" button + modal. Collects a name, category, short description and
 * one or more portions (size + price), then creates the dish via the
 * createMenuItem server action. Photos, ingredients, spice etc. can be added
 * afterwards via the edit pencil.
 */
export default function NewDishModal({
  categories,
  defaultCategory,
}: {
  categories: string[];
  defaultCategory?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(defaultCategory ?? categories[0] ?? "");
  const [description, setDescription] = useState("");
  const [portions, setPortions] = useState<PortionDraft[]>([{ size: "", price: "" }]);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const openModal = () => {
    setName("");
    setCategory(defaultCategory ?? categories[0] ?? "");
    setDescription("");
    setPortions([{ size: "", price: "" }]);
    setErr(null);
    setOpen(true);
  };

  const updatePortion = (i: number, key: keyof PortionDraft, val: string) =>
    setPortions((cur) => cur.map((p, idx) => (idx === i ? { ...p, [key]: val } : p)));

  const addPortion = () => setPortions((cur) => [...cur, { size: "", price: "" }]);
  const removePortion = (i: number) =>
    setPortions((cur) => (cur.length > 1 ? cur.filter((_, idx) => idx !== i) : cur));

  const save = () => {
    setErr(null);
    start(async () => {
      const res = await createMenuItem({
        name,
        category,
        description,
        variants: portions.map((p) => ({
          size: p.size,
          price: parseFloat(p.price) || 0,
        })),
      });
      if (!res.ok) {
        setErr(res.error ?? "Couldn't create the dish.");
        return;
      }
      setOpen(false);
      router.refresh();
    });
  };

  const inputCls =
    "mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-espresso focus:border-espresso focus:outline-none";

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex h-9 items-center gap-2 rounded-full bg-espresso px-4 text-sm font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso"
      >
        <Plus size={14} />
        Add dish
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => !pending && setOpen(false)}
            className="absolute inset-0 bg-espresso/40 backdrop-blur-sm"
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-luxe">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-base font-semibold text-espresso">New dish</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => !pending && setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted hover:bg-cream"
              >
                <X size={16} />
              </button>
            </header>

            <div className="space-y-4 overflow-y-auto px-5 py-5">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jollof & Chicken Combo"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputCls}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                  Short description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground-subtle">
                  Portions &amp; prices
                </label>
                <div className="mt-1 space-y-2">
                  {portions.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={p.size}
                        onChange={(e) => updatePortion(i, "size", e.target.value)}
                        placeholder="e.g. 2 Litres"
                        className="flex-1 rounded-lg border border-border bg-cream px-3 py-2 text-sm text-espresso focus:border-espresso focus:outline-none"
                      />
                      <div className="flex items-center gap-1 rounded-lg border border-border bg-cream px-2.5 py-1.5 focus-within:border-espresso">
                        <span className="text-sm text-foreground-subtle">€</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          value={p.price}
                          onChange={(e) => updatePortion(i, "price", e.target.value)}
                          className="w-16 bg-transparent text-right text-sm text-espresso focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        aria-label="Remove portion"
                        onClick={() => removePortion(i)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground-subtle hover:bg-cream hover:text-red"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addPortion}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-espresso hover:text-red"
                >
                  <Plus size={12} /> Add another portion
                </button>
              </div>

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
                disabled={pending || name.trim().length === 0}
                className={`inline-flex h-9 items-center rounded-full bg-espresso px-4 text-sm font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso ${
                  pending || name.trim().length === 0 ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                {pending ? "Creating…" : "Create dish"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
