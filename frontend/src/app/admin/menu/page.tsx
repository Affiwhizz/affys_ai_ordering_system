import { ImageIcon, Plus, Pencil, GripVertical } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import { MENU_ITEMS, formatCurrency } from "@/components/admin/mock-data";

const CATEGORY_ORDER = [
  "Mains",
  "Soups & swallow",
  "Small chops",
  "Sides",
  "Drinks",
  "Festival bowls",
] as const;

export default function MenuManagerPage() {
  return (
    <>
      <Topbar
        title="Menu manager"
        subtitle="Dishes, size variants, prices, allergens, and availability."
      />

      <main className="px-6 py-8 md:px-8 md:py-10">
        {/* Top actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-foreground-muted">
            {MENU_ITEMS.length} dishes · {MENU_ITEMS.filter((m) => m.isAvailable).length} available
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-espresso hover:border-espresso transition-colors"
            >
              Import CSV
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-espresso px-4 text-sm font-semibold text-ivory hover:bg-gold hover:text-espresso transition-colors"
            >
              <Plus size={14} />
              New dish
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-6 space-y-6">
          {CATEGORY_ORDER.map((category) => {
            const items = MENU_ITEMS.filter((m) => m.category === category);
            if (items.length === 0) return null;
            return (
              <section
                key={category}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                <header className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-display text-base font-semibold text-espresso">{category}</h2>
                    <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[10px] font-semibold text-foreground-muted">
                      {items.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-foreground-muted hover:text-espresso"
                  >
                    + Add to {category.toLowerCase()}
                  </button>
                </header>
                <ul className="divide-y divide-border">
                  {items.map((m) => (
                    <li
                      key={m.id}
                      className="group flex items-start gap-4 px-5 py-4 hover:bg-cream/40 transition-colors"
                    >
                      {/* Drag handle */}
                      <span className="mt-2 cursor-grab text-foreground-subtle opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={14} />
                      </span>

                      {/* Image slot */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-cream-deep text-foreground-subtle">
                        {m.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.imageUrl}
                            alt={m.name}
                            className="h-full w-full rounded-xl object-cover"
                          />
                        ) : (
                          <ImageIcon size={20} />
                        )}
                      </div>

                      {/* Main */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-display text-base font-semibold text-espresso">{m.name}</p>
                          <span className="text-xs font-mono text-foreground-subtle">{m.id}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-foreground-muted line-clamp-1">{m.description}</p>

                        {/* Variants */}
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {m.variants.map((v, i) => (
                            <li
                              key={i}
                              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-cream px-2.5 py-1 text-[11px]"
                            >
                              <span className="text-foreground-muted">{v.size}</span>
                              <span className="font-semibold text-espresso">{formatCurrency(v.price)}</span>
                            </li>
                          ))}
                        </ul>

                        {m.allergens.length > 0 && (
                          <p className="mt-2 text-[10px] uppercase tracking-wider text-red">
                            Contains: {m.allergens.join(", ")}
                          </p>
                        )}
                      </div>

                      {/* Availability + actions */}
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full bg-forest">
                          <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm ${m.isAvailable ? "ml-5" : "ml-0.5"}`} />
                        </label>
                        <button
                          type="button"
                          aria-label={`Edit ${m.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-espresso hover:border-espresso transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}
