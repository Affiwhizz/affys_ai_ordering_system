import Topbar from "@/components/admin/Topbar";
import AdminMenuCategory from "@/components/admin/AdminMenuCategory";
import { getAdminMenu, type AdminMenuItem } from "@/lib/menu/get-menu";
import { MENU_CATEGORIES } from "@/components/menu/menu-data";

// Always read the latest from Supabase — this is a staff tool, not cached.
export const dynamic = "force-dynamic";

/** Order categories by the canonical menu order, then any extras after. */
function orderedCategories(items: AdminMenuItem[]): string[] {
  const present: string[] = Array.from(new Set(items.map((i) => String(i.category))));
  const canonical = (MENU_CATEGORIES as readonly string[]).filter((c) =>
    present.includes(c),
  );
  const extras = present.filter((c) => !canonical.includes(c));
  return [...canonical, ...extras];
}

/** Signature of a category's dishes so the client component remounts (and
 *  re-syncs its local order) whenever the underlying data changes. */
function signature(items: AdminMenuItem[]): string {
  return items
    .map(
      (m) =>
        `${m.dbId}:${m.name}:${m.isAvailable}:${m.isWeeklySpecial}:${m.variantRows
          .map((v) => v.price)
          .join("/")}`,
    )
    .join("|");
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
        <div className="text-xs text-foreground-muted">
          {items.length} dishes · {availableCount} available · live from your database
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
                <AdminMenuCategory
                  key={`${category}::${signature(catItems)}`}
                  category={category}
                  items={catItems}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
