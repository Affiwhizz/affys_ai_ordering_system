import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  MENU_ITEMS as BUNDLED_MENU,
  type MenuItem,
  type MenuCategory,
} from "@/components/menu/menu-data";

/**
 * Server-side menu reads from Supabase.
 *
 *  - getPublicMenu(): read-only, available items only. Uses the same SSR
 *    client as the admin (proven to work with the publishable key); an
 *    anonymous visitor has no session, so RLS naturally returns only public
 *    rows, and we additionally filter to is_available items.
 *    Falls back to the bundled menu if Supabase is unreachable / empty, so the
 *    public storefront can never break.
 *  - getAdminMenu(): authenticated staff read (via the request's session
 *    cookies) returning ALL items, including unavailable ones, plus the raw
 *    item id so the admin can edit them.
 */

// Shape of a menu_items row joined with its menu_variants.
interface ItemRow {
  id: string;
  slug: string;
  name: string;
  name_pt: string | null;
  description: string | null;
  category: string;
  monogram: string | null;
  gradient: string | null;
  allergens: string[] | null;
  is_available: boolean;
  sort_order: number;
  image_url: string | null;
  menu_variants: VariantRow[] | null;
}

interface VariantRow {
  id: string;
  size_label: string;
  serves_label: string | null;
  price: number | string;
  sort_order: number;
  is_available: boolean;
}

/** A variant with its db id, for admin editing. */
export interface AdminVariant {
  id: string;
  size: string;
  serves?: string;
  price: number;
}

/** A menu item enriched with the fields the admin needs to manage it. */
export interface AdminMenuItem extends MenuItem {
  dbId: string;
  isAvailable: boolean;
  allergens: string[];
  imageUrl: string | null;
  variantRows: AdminVariant[];
}

const SELECT =
  "id, slug, name, name_pt, description, category, monogram, gradient, allergens, is_available, sort_order, image_url, " +
  "menu_variants ( id, size_label, serves_label, price, sort_order, is_available )";

function mapRow(row: ItemRow, opts: { availableVariantsOnly: boolean }): AdminMenuItem {
  const sortedVariants = (row.menu_variants ?? [])
    .filter((v) => (opts.availableVariantsOnly ? v.is_available : true))
    .sort((a, b) => a.sort_order - b.sort_order);

  const toPrice = (p: number | string) =>
    typeof p === "string" ? parseFloat(p) : p;

  const variants = sortedVariants.map((v) => ({
    size: v.size_label,
    serves: v.serves_label ?? undefined,
    price: toPrice(v.price),
  }));

  const variantRows = sortedVariants.map((v) => ({
    id: v.id,
    size: v.size_label,
    serves: v.serves_label ?? undefined,
    price: toPrice(v.price),
  }));

  return {
    id: row.slug,
    dbId: row.id,
    name: row.name,
    namePt: row.name_pt ?? undefined,
    description: row.description ?? "",
    category: row.category as MenuCategory,
    variants,
    variantRows,
    monogram: row.monogram ?? row.name.charAt(0).toUpperCase(),
    gradient: row.gradient ?? "from-espresso to-espresso",
    isAvailable: row.is_available,
    allergens: row.allergens ?? [],
    imageUrl: row.image_url ?? null,
  };
}

/**
 * Public, available-only menu. Uses the anon key with no cookies so the read
 * is cacheable and never depends on a signed-in session. Falls back to the
 * bundled menu on any failure.
 */
export async function getPublicMenu(): Promise<MenuItem[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("menu_items")
      .select(SELECT)
      .eq("is_available", true)
      .order("sort_order", { ascending: true })
      // Stable tiebreaker so editing a row never reshuffles the list.
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) return BUNDLED_MENU;

    return (data as unknown as ItemRow[]).map((r) =>
      mapRow(r, { availableVariantsOnly: true }),
    );
  } catch {
    return BUNDLED_MENU;
  }
}

/**
 * Full menu for the admin manager — ALL items (incl. unavailable), with the
 * db id and management fields. Uses the staff session so RLS allows it.
 * Returns an empty array on failure (the admin page shows an empty state
 * rather than the public storefront's bundled fallback).
 */
export async function getAdminMenu(): Promise<AdminMenuItem[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("menu_items")
      .select(SELECT)
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true })
      // Stable tiebreaker so toggling a dish never reshuffles the list.
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    return (data as unknown as ItemRow[]).map((r) =>
      mapRow(r, { availableVariantsOnly: false }),
    );
  } catch {
    return [];
  }
}
