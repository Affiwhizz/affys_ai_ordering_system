"use client";

import { useState, useTransition } from "react";
import { GripVertical, ImageIcon } from "lucide-react";
import AvailabilityToggle from "./AvailabilityToggle";
import MenuItemEditor from "./MenuItemEditor";
import { reorderMenuItems } from "@/app/admin/menu/actions";
import type { AdminMenuItem } from "@/lib/menu/get-menu";

function fmtCurrency(n: number): string {
  return `€${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}

/**
 * The draggable list of dishes within one category. Drag a dish by its grip
 * to reorder; the new order saves (sort_order) and reflects on the public
 * menu. The parent remounts this (via a key on the data signature) when the
 * underlying dishes change, so edits stay in sync.
 */
export default function AdminMenuCategory({
  items: initial,
  allDishes,
}: {
  items: AdminMenuItem[];
  allDishes: { dbId: string; name: string }[];
}) {
  const [items, setItems] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [, startSave] = useTransition();

  if (items.length === 0) {
    return (
      <p className="px-5 py-6 text-sm text-foreground-muted">
        No dishes here yet, use <strong>Add dish</strong> above to add one.
      </p>
    );
  }

  const handleDragOver = (overId: string) => {
    if (!dragId || dragId === overId) return;
    setItems((cur) => {
      const from = cur.findIndex((x) => x.dbId === dragId);
      const to = cur.findIndex((x) => x.dbId === overId);
      if (from < 0 || to < 0) return cur;
      const next = cur.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleDrop = () => {
    const ordered = items;
    setDragId(null);
    startSave(async () => {
      await reorderMenuItems(ordered.map((i) => i.dbId));
    });
  };

  return (
    <ul className="divide-y divide-border">
      {items.map((m) => (
        <li
          key={m.dbId}
          draggable
          onDragStart={() => setDragId(m.dbId)}
          onDragEnter={() => handleDragOver(m.dbId)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onDragEnd={() => setDragId(null)}
          className={`group flex items-start gap-4 px-5 py-4 transition-colors ${
            dragId === m.dbId ? "bg-cream opacity-60" : "hover:bg-cream/40"
          } ${m.isAvailable ? "" : "opacity-55"}`}
        >
          <span
            className="mt-2 cursor-grab text-foreground-subtle active:cursor-grabbing"
            aria-label="Drag to reorder dish"
          >
            <GripVertical size={16} />
          </span>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-cream-deep text-foreground-subtle">
            {m.images?.[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.images[0].url}
                alt={m.name}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <ImageIcon size={20} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="flex items-center gap-2 font-display text-base font-semibold text-espresso">
                {m.name}
                {m.isWeeklySpecial && (
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-espresso">
                    ★ This week
                  </span>
                )}
              </p>
              <span className="font-mono text-xs text-foreground-subtle">{m.id}</span>
            </div>
            <p className="mt-0.5 line-clamp-1 text-sm text-foreground-muted">
              {m.description}
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {m.variantRows.map((v) => (
                <li
                  key={v.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-cream px-2.5 py-1 text-[11px]"
                >
                  <span className="text-foreground-muted">{v.size}</span>
                  <span className="font-semibold text-espresso">{fmtCurrency(v.price)}</span>
                </li>
              ))}
            </ul>
            {m.allergens.length > 0 && (
              <p className="mt-2 text-[10px] uppercase tracking-wider text-red">
                Contains: {m.allergens.join(", ")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <AvailabilityToggle dbId={m.dbId} initial={m.isAvailable} label={m.name} />
            <MenuItemEditor
              dbId={m.dbId}
              name={m.name}
              description={m.description}
              longDescription={m.longDescription ?? ""}
              ingredients={m.ingredients ?? []}
              spiceLevels={m.spiceLevels ?? []}
              isWeeklySpecial={m.isWeeklySpecial ?? false}
              isFeatured={m.isFeatured ?? false}
              variants={m.variantRows}
              images={m.imageRows}
              videoUrl={m.videoUrl}
              pairings={m.pairingIds ?? []}
              allDishes={allDishes}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
