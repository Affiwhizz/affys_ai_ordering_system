import { ImageIcon } from "lucide-react";
import Topbar from "@/components/admin/Topbar";
import AvailabilityToggle from "@/components/admin/AvailabilityToggle";
import MenuItemEditor from "@/components/admin/MenuItemEditor";
import { getAdminMenu, type AdminMenuItem } from "@/lib/menu/get-menu";
import { MENU_CATEGORIES } from "@/components/menu/menu-data";

// Always read the latest from Supabase — this is a staff tool, not cached.
export const dynamic = "force-dynamic";

function formatCurrency(n: number): string {
  return `€${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}

/** Order categories by the canonical menu order, then any extras after. */
function orderedCategories(items: AdminMenuItem[]): string[] {
  const present: string[] = Array.from(new Set(items.map((i) => String(i.category))));
  const canonical = (MENU_CATEGORIES as readonly string[]).filter((c) =>
    present.includes(c),
  );
  const extras = present.filter((c) => !canonical.includes(c));
  return [...canonical, ...extras];
}

export default async function MenuManagerPage() {
  const items = await getAdminMenu();
  const availableCount = items.filter((m) => m.isAvailable).length;
  const categories = orderedCategories(items);

  return (
    <>
      <Topbar
        title="Menu manager"
        subtitle="Dishes, size variants, prices, allergens, and availability."
      />

      <main className="px-6 py-8 md:px-8 md:py-10">
        {/* Top summary */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-foreground-muted">
            {items.length} dishes · {availableCount} available · live from your database
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-border bg-white p-10 text-center">
            <p className="font-display text-lg font-semibold text-espresso">
              No dishes found
            </p>
            <p className="mt-1 text-sm text-foreground-muted">
              Your menu is empty, or the database couldn&rsquo;t be reached. If you
              just set things up, make sure the seed data ran in Supabase.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {categories.map((category) => {
              const catItems = items.filter((m) => m.category === category);
              if (catItems.length === 0) return null;
              return (
                <section
                  key={category}
                  className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                >
                  <header className="flex items-center justify-between border-b border-border px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <h2 className="font-display text-base font-semibold text-espresso">
                        {category}
                      </h2>
                      <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[10px] font-semibold text-foreground-muted">
                        {catItems.length}
                      </span>
                    </div>
                  </header>
                  <ul className="divide-y divide-border">
                    {catItems.map((m) => (
                      <li
                        key={m.dbId}
                        className={`group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-cream/40 ${
                          m.isAvailable ? "" : "opacity-55"
                        }`}
                      >
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
                            <p className="font-display text-base font-semibold text-espresso">
                              {m.name}
                            </p>
                            <span className="font-mono text-xs text-foreground-subtle">
                              {m.id}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-sm text-foreground-muted">
                            {m.description}
                          </p>

                          {/* Variants */}
                          <ul className="mt-2 flex flex-wrap gap-1.5">
                            {m.variants.map((v, i) => (
                              <li
                                key={i}
                                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-cream px-2.5 py-1 text-[11px]"
                              >
                                <span className="text-foreground-muted">{v.size}</span>
                                <span className="font-semibold text-espresso">
                                  {formatCurrency(v.price)}
                                </span>
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
                          <AvailabilityToggle
                            dbId={m.dbId}
                            initial={m.isAvailable}
                            label={m.name}
                          />
                          <MenuItemEditor
                            dbId={m.dbId}
                            name={m.name}
                            description={m.description}
                            variants={m.variantRows}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
