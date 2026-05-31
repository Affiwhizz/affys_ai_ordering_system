"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Plus } from "lucide-react";
import AdminMenuCategory from "./AdminMenuCategory";
import NewDishModal from "./NewDishModal";
import { createCategory, reorderCategories } from "@/app/admin/menu/actions";
import type { AdminMenuItem, MenuCategoryRecord } from "@/lib/menu/get-menu";

function signature(items: AdminMenuItem[]): string {
  return items
    .map(
      (m) =>
        `${m.dbId}:${m.name}:${m.isAvailable}:${m.isWeeklySpecial}:${m.isFeatured}:${m.variantRows
          .map((v) => v.price)
          .join("/")}:imgs${m.imageRows.length}:vid${m.videoUrl ? 1 : 0}:pair${(m.pairingIds ?? []).join(",")}`,
    )
    .join("|");
}

/**
 * Top-level admin menu manager. Provides "Add category" and "Add dish",
 * renders each category as a draggable section (drag the header grip to
 * reorder categories, saved to menu_categories), and delegates the dish list
 * + dish drag to AdminMenuCategory.
 */
export default function AdminMenuManager({
  categories,
  items,
}: {
  categories: MenuCategoryRecord[];
  items: AdminMenuItem[];
}) {
  const router = useRouter();
  const [cats, setCats] = useState(categories);
  const [catDragId, setCatDragId] = useState<string | null>(null);
  const [newCat, setNewCat] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const byCategory = (name: string) => items.filter((m) => m.category === name);
  const categoryNames = cats.map((c) => c.name);
  const allDishes = items.map((m) => ({ dbId: m.dbId, name: m.name }));

  const handleCatDragOver = (overId: string) => {
    if (!catDragId || catDragId === overId) return;
    setCats((cur) => {
      const from = cur.findIndex((c) => c.id === catDragId);
      const to = cur.findIndex((c) => c.id === overId);
      if (from < 0 || to < 0) return cur;
      const next = cur.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const handleCatDrop = () => {
    if (!catDragId) return;
    const ordered = cats;
    setCatDragId(null);
    start(async () => {
      await reorderCategories(ordered.map((c) => c.id));
    });
  };

  const addCategory = () => {
    const name = newCat.trim();
    if (!name) return;
    setErr(null);
    start(async () => {
      const res = await createCategory(name);
      if (!res.ok) {
        setErr(res.error ?? "Couldn't add the category.");
        return;
      }
      setNewCat("");
      router.refresh();
    });
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-white p-3">
        <div className="flex items-center gap-2">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="New category name…"
            className="h-9 w-44 rounded-full border border-border bg-cream px-3.5 text-sm text-espresso focus:border-espresso focus:outline-none"
          />
          <button
            type="button"
            onClick={addCategory}
            disabled={pending || newCat.trim().length === 0}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-white px-3.5 text-sm font-semibold text-espresso transition-colors hover:border-espresso ${
              pending || newCat.trim().length === 0 ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            <Plus size={14} /> Add category
          </button>
        </div>
        <div className="ml-auto">
          <NewDishModal categories={categoryNames} />
        </div>
      </div>
      {err && <p className="mt-2 text-xs text-red">{err}</p>}

      {/* Category sections */}
      <div className="mt-6 space-y-6">
        {cats.map((cat) => {
          const catItems = byCategory(cat.name);
          return (
            <section
              key={cat.id}
              onDragEnter={() => handleCatDragOver(cat.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleCatDrop}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${
                catDragId === cat.id ? "border-gold" : "border-border"
              }`}
            >
              <header
                draggable
                onDragStart={() => setCatDragId(cat.id)}
                onDragEnd={() => setCatDragId(null)}
                className="flex cursor-grab items-center gap-2.5 border-b border-border px-5 py-4 active:cursor-grabbing"
              >
                <GripVertical size={16} className="text-foreground-subtle" />
                <h2 className="font-display text-base font-semibold text-espresso">
                  {cat.name}
                </h2>
                <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[10px] font-semibold text-foreground-muted">
                  {catItems.length}
                </span>
                <span className="ml-auto text-[11px] text-foreground-subtle">
                  Drag header to reorder categories
                </span>
              </header>

              <AdminMenuCategory
                key={signature(catItems)}
                items={catItems}
                allDishes={allDishes}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
