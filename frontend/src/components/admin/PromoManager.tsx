"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Power, Check } from "lucide-react";
import {
  createPromo,
  updatePromo,
  setPromoActive,
  deletePromo,
  type PromoInput,
} from "@/app/admin/promos/actions";
import {
  promoRewardLabel,
  type PromoCode,
  type PromoKind,
} from "@/lib/promo/types";

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-cream px-3 py-2 text-sm text-espresso focus:border-espresso focus:outline-none";
const labelCls =
  "text-[10px] uppercase tracking-wider text-foreground-subtle";

const KIND_OPTIONS: { value: PromoKind; label: string }[] = [
  { value: "percent", label: "Percentage off" },
  { value: "fixed", label: "Fixed € off" },
  { value: "free_delivery", label: "Free delivery" },
];

const EMPTY: PromoInput = {
  code: "",
  kind: "percent",
  value: 10,
  description: "",
  minOrder: null,
  maxUses: null,
  perCustomerLimit: 1,
  firstOrderOnly: false,
  validFrom: null,
  validUntil: null,
  isActive: true,
};

const toForm = (p: PromoCode): PromoInput => ({
  code: p.code,
  kind: p.kind,
  value: p.value,
  description: p.description ?? "",
  minOrder: p.minOrder,
  maxUses: p.maxUses,
  perCustomerLimit: p.perCustomerLimit,
  firstOrderOnly: p.firstOrderOnly,
  validFrom: p.validFrom ? p.validFrom.slice(0-10) : null,
  validUntil: p.validUntil ? p.validUntil.slice(0-10) : null,
  isActive: p.isActive,
});

const numOrNull = (s: string): number | null => {
  const t = s.trim();
  if (t === "") return null;
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
};

const dateToIso = (d: string | null): string | null =>
  d ? new Date(`${d}T00:00:00`).toISOString() : null;

export default function PromoManager({ initial }: { initial: PromoCode[] }) {
  const router = useRouter();
  const [promos, setPromos] = useState<PromoCode[]>(initial);
  // Re-sync local list when fresh server data arrives (after router.refresh()).
  // React-recommended "adjust state during render" pattern, no effect needed.
  const [prevInitial, setPrevInitial] = useState(initial);
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setPromos(initial);
  }

  // editingId: null = form closed, "new" = creating, otherwise the promo id
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PromoInput>(EMPTY);
  const [, start] = useTransition();
  const [flash, setFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ping = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(null), 1800);
  };

  const openNew = () => {
    setForm(EMPTY);
    setEditingId("new");
    setError(null);
  };
  const openEdit = (p: PromoCode) => {
    setForm(toForm(p));
    setEditingId(p.id);
    setError(null);
  };
  const close = () => {
    setEditingId(null);
    setError(null);
  };

  const set = <K extends keyof PromoInput>(key: K, val: PromoInput[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const save = () => {
    if (!form.code.trim()) {
      setError("Code is required.");
      return;
    }
    const payload: PromoInput = {
      ...form,
      code: form.code.trim().toUpperCase(),
      validFrom: dateToIso(form.validFrom),
      validUntil: dateToIso(form.validUntil),
    };
    start(async () => {
      const res =
        editingId === "new"
          ? await createPromo(payload)
          : await updatePromo(editingId as string, payload);
      if (res.ok) {
        ping(editingId === "new" ? "Code created" : "Code saved");
        close();
        router.refresh();
      } else {
        setError(res.error ?? "Couldn't save.");
      }
    });
  };

  const toggle = (p: PromoCode) => {
    setPromos((cur) =>
      cur.map((x) => (x.id === p.id ? { ...x, isActive: !x.isActive } : x)),
    );
    start(async () => {
      await setPromoActive(p.id, !p.isActive);
      router.refresh();
    });
  };

  const remove = (p: PromoCode) => {
    if (!window.confirm(`Delete the code "${p.code}"? This can't be undone.`)) return;
    setPromos((cur) => cur.filter((x) => x.id !== p.id));
    start(async () => {
      await deletePromo(p.id);
      ping("Code deleted");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {flash && <p className="text-sm font-semibold text-forest">{flash}</p>}
        </div>
        {editingId === null && (
          <button
            type="button"
            onClick={openNew}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-espresso px-5 text-sm font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso"
          >
            <Plus size={16} /> New code
          </button>
        )}
      </div>

      {/* Editor */}
      {editingId !== null && (
        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <h2 className="font-display text-base font-semibold text-espresso">
            {editingId === "new" ? "New promo code" : "Edit promo code"}
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelCls}>Code</label>
              <input
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                placeholder="WELCOME10"
                className={`${inputCls} uppercase`}
              />
            </div>
            <div>
              <label className={labelCls}>Reward type</label>
              <select
                value={form.kind}
                onChange={(e) => set("kind", e.target.value as PromoKind)}
                className={inputCls}
              >
                {KIND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            {form.kind !== "free_delivery" && (
              <div>
                <label className={labelCls}>
                  {form.kind === "percent" ? "Percent off (%)" : "Amount off (€)"}
                </label>
                <input
                  type="number"
                  min="0"
                  step={form.kind === "percent" ? "1" : "0.5"}
                  value={form.value}
                  onChange={(e) => set("value", parseFloat(e.target.value) || 0)}
                  className={inputCls}
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <label className={labelCls}>Description (internal)</label>
              <input
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Instagram launch offer"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Minimum order (€), optional</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.minOrder ?? ""}
                onChange={(e) => set("minOrder", numOrNull(e.target.value))}
                placeholder="No minimum"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Total uses cap, optional</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.maxUses ?? ""}
                onChange={(e) => set("maxUses", numOrNull(e.target.value))}
                placeholder="Unlimited"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Uses per customer, optional</label>
              <input
                type="number"
                min="1"
                step="1"
                value={form.perCustomerLimit ?? ""}
                onChange={(e) => set("perCustomerLimit", numOrNull(e.target.value))}
                placeholder="Unlimited"
                className={inputCls}
              />
              <p className="mt-0.5 text-[11px] text-foreground-subtle">
                Set to 1 for single-use (blocked by phone, email &amp; device).
              </p>
            </div>
            <div>
              <label className={labelCls}>Valid from, optional</label>
              <input
                type="date"
                value={form.validFrom ?? ""}
                onChange={(e) => set("validFrom", e.target.value || null)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Valid until, optional</label>
              <input
                type="date"
                value={form.validUntil ?? ""}
                onChange={(e) => set("validUntil", e.target.value || null)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm text-espresso">
              <input
                type="checkbox"
                checked={form.firstOrderOnly}
                onChange={(e) => set("firstOrderOnly", e.target.checked)}
                className="h-4 w-4 rounded border-border accent-forest"
              />
              First-time customers only
            </label>
            <label className="flex items-center gap-2 text-sm text-espresso">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-border accent-forest"
              />
              Active
            </label>
          </div>

          {error && <p className="mt-3 text-sm font-semibold text-red">{error}</p>}

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-semibold text-espresso hover:border-espresso"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="inline-flex h-10 items-center rounded-full bg-espresso px-6 text-sm font-semibold text-ivory transition-colors hover:bg-gold hover:text-espresso"
            >
              {editingId === "new" ? "Create code" : "Save changes"}
            </button>
          </div>
        </section>
      )}

      {/* List */}
      <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <header className="border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-semibold text-espresso">
            Your codes
          </h2>
        </header>
        {promos.length === 0 ? (
          <p className="p-6 text-sm text-foreground-muted">
            No codes yet. Click <strong>New code</strong> to create your first one.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {promos.map((p) => {
              const conditions: string[] = [];
              if (p.minOrder) conditions.push(`min €${p.minOrder}`);
              if (p.maxUses != null)
                conditions.push(`${p.usedCount}/${p.maxUses} used`);
              else conditions.push(`${p.usedCount} used`);
              if (p.perCustomerLimit != null)
                conditions.push(
                  p.perCustomerLimit === 1
                    ? "single-use"
                    : `${p.perCustomerLimit}× per customer`,
                );
              if (p.firstOrderOnly) conditions.push("first order only");
              if (p.validUntil)
                conditions.push(`until ${p.validUntil.slice(0-10)}`);

              return (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center gap-3 px-5 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold tracking-wide text-espresso">
                        {p.code}
                      </span>
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold text-espresso">
                        {promoRewardLabel(p.kind, p.value)}
                      </span>
                      {p.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2 py-0.5 text-[11px] font-semibold text-forest">
                          <Check size={11} /> Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-foreground-subtle/15 px-2 py-0.5 text-[11px] font-semibold text-foreground-muted">
                          Paused
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-foreground-muted">
                      {[p.description, conditions.join(" · ")]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggle(p)}
                      title={p.isActive ? "Pause" : "Activate"}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:bg-cream hover:text-espresso"
                    >
                      <Power size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      title="Edit"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:bg-cream hover:text-espresso"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(p)}
                      title="Delete"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:bg-red/10 hover:text-red"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
