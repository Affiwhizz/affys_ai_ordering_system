import Topbar from "@/components/admin/Topbar";
import AdminMenuManager from "@/components/admin/AdminMenuManager";
import {
  getAdminMenu,
  getCategories,
  type MenuCategoryRecord,
} from "@/lib/menu/get-menu";
import { MENU_CATEGORIES } from "@/components/menu/menu-data";

// Always read the latest from Supabase — this is a staff tool, not cached.
export const dynamic = "force-dynamic";

export default async function MenuManagerPage() {
  const [items, categories] = await Promise.all([getAdminMenu(), getCategories()]);
  const availableCount = items.filter((m) => m.isAvailable).length;

  // Fall back to the canonical list if the categories table couldn't be read.
  let cats: MenuCategoryRecord[] = categories;
  if (cats.length === 0) {
    cats = (MENU_CATEGORIES as readonly string[]).map((name, i) => ({
      id: name,
      name,
      sortOrder: i,
    }));
  }
  // Make sure any category present on dishes but missing from the table still
  // shows (so nothing is ever hidden).
  const known = new Set(cats.map((c) => c.name));
  const extras = Array.from(new Set(items.map((m) => m.category))).filter(
    (name) => !known.has(name),
  );
  for (const name of extras) {
    cats.push({ id: name, name, sortOrder: cats.length });
  }

  return (
    <>
      <Topbar
        title="Menu manager"
        subtitle="Add dishes and categories, reorder by dragging, edit prices and details."
      />

      <main className="px-6 py-8 md:px-8 md:py-10">
        <div className="mb-4 text-xs text-foreground-muted">
          {items.length} dishes · {availableCount} available · live from your database
        </div>

        <AdminMenuManager categories={cats} items={items} />
      </main>
    </>
  );
}
