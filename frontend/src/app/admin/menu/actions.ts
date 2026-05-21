"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "item"
  );
}

function revalidateMenu() {
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

/**
 * Toggle a dish on/off. Runs with the staff member's session, so the
 * menu_staff_write RLS policy authorises it. On success we revalidate both
 * the admin manager and the public menu so the change shows up right away.
 */
export async function setMenuItemAvailability(
  dbId: string,
  isAvailable: boolean,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("menu_items")
      // The Database type is a loose stub, so the update payload types as
      // `never`; cast to satisfy it. (Column is menu_items.is_available.)
      .update({ is_available: isAvailable } as never)
      .eq("id", dbId);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/**
 * Persist a new dish order within a category. `orderedIds` is the dish db ids
 * in their new top-to-bottom order; we write sort_order = position. Staff RLS
 * authorises it; revalidates the public menu so the order matches.
 */
export async function reorderMenuItems(
  orderedIds: string[],
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase();
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await supabase
        .from("menu_items")
        .update({ sort_order: i } as never)
        .eq("id", orderedIds[i]);
      if (error) return { ok: false, error: error.message };
    }
    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/**
 * Create a new category. Adds it to the end of the category order.
 */
export async function createCategory(
  name: string,
): Promise<{ ok: boolean; error?: string }> {
  const clean = name.trim();
  if (!clean) return { ok: false, error: "Category name can't be empty." };
  try {
    const supabase = await createServerSupabase();
    const { data: maxRow } = await supabase
      .from("menu_categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = ((maxRow as { sort_order: number } | null)?.sort_order ?? 0) + 1;

    const { error } = await supabase
      .from("menu_categories")
      .insert({ name: clean, sort_order: nextOrder } as never);
    if (error) {
      if (error.code === "23505") return { ok: false, error: "That category already exists." };
      return { ok: false, error: error.message };
    }
    revalidateMenu();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Persist a new category order (orderedIds top-to-bottom → sort_order). */
export async function reorderCategories(
  orderedIds: string[],
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase();
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await supabase
        .from("menu_categories")
        .update({ sort_order: i } as never)
        .eq("id", orderedIds[i]);
      if (error) return { ok: false, error: error.message };
    }
    revalidateMenu();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/**
 * Record an uploaded photo for a dish (the file itself is uploaded straight to
 * Storage from the browser; here we just save the public URL). Appends to the
 * end of the dish's gallery. Returns the new image id.
 */
export async function addDishImage(
  dishId: string,
  url: string,
  alt?: string,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!url) return { ok: false, error: "Missing image URL." };
  try {
    const supabase = await createServerSupabase();
    const { data: maxRow } = await supabase
      .from("menu_images")
      .select("sort_order")
      .eq("menu_item_id", dishId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = ((maxRow as { sort_order: number } | null)?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("menu_images")
      .insert({
        menu_item_id: dishId,
        url,
        alt: alt?.trim() || null,
        sort_order: nextOrder,
      } as never)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };

    revalidateMenu();
    return { ok: true, id: (data as { id: string }).id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Remove a dish photo (deletes the gallery row; the Storage file is harmless if left). */
export async function removeDishImage(
  imageId: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase.from("menu_images").delete().eq("id", imageId);
    if (error) return { ok: false, error: error.message };
    revalidateMenu();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Set or clear a dish's video URL (pass null to remove). */
export async function setDishVideo(
  dishId: string,
  url: string | null,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("menu_items")
      .update({ video_url: url } as never)
      .eq("id", dishId);
    if (error) return { ok: false, error: error.message };
    revalidateMenu();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export interface CreateMenuItemInput {
  name: string;
  category: string;
  description: string;
  variants: { size: string; price: number }[];
}

/**
 * Create a new dish in a category, with one or more portions. Slug is
 * auto-generated and de-duplicated. Goes to the end of its category.
 */
export async function createMenuItem(
  input: CreateMenuItemInput,
): Promise<{ ok: boolean; error?: string }> {
  const name = input.name.trim();
  const category = input.category.trim();
  if (!name) return { ok: false, error: "Dish name can't be empty." };
  if (!category) return { ok: false, error: "Pick a category." };
  const variants = input.variants
    .map((v) => ({ size: v.size.trim(), price: v.price }))
    .filter((v) => v.size.length > 0 && Number.isFinite(v.price) && v.price >= 0);
  if (variants.length === 0)
    return { ok: false, error: "Add at least one portion with a price." };

  try {
    const supabase = await createServerSupabase();

    // Unique slug
    const base = slugify(name);
    const { data: existingRows } = await supabase
      .from("menu_items")
      .select("slug")
      .like("slug", `${base}%`);
    const taken = new Set(
      ((existingRows as { slug: string }[] | null) ?? []).map((r) => r.slug),
    );
    let slug = base;
    if (taken.has(slug)) {
      let n = 2;
      while (taken.has(`${base}-${n}`)) n++;
      slug = `${base}-${n}`;
    }

    // Position at the end of the category
    const { data: maxRow } = await supabase
      .from("menu_items")
      .select("sort_order")
      .eq("category", category)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = ((maxRow as { sort_order: number } | null)?.sort_order ?? 0) + 1;

    const { data: inserted, error: itemErr } = await supabase
      .from("menu_items")
      .insert({
        slug,
        name,
        description: input.description.trim() || null,
        category,
        sort_order: nextOrder,
        monogram: name.charAt(0).toUpperCase(),
        is_available: true,
      } as never)
      .select("id")
      .single();
    if (itemErr) return { ok: false, error: itemErr.message };

    const newId = (inserted as { id: string }).id;

    const rows = variants.map((v, i) => ({
      menu_item_id: newId,
      size_label: v.size,
      price: v.price,
      sort_order: i,
      is_available: true,
    }));
    const { error: vErr } = await supabase
      .from("menu_variants")
      .insert(rows as never);
    if (vErr) return { ok: false, error: vErr.message };

    revalidateMenu();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export interface UpdateMenuItemInput {
  dbId: string;
  name: string;
  description: string;
  longDescription: string;
  ingredients: string[];
  spiceLevels: string[];
  isWeeklySpecial: boolean;
  variants: { id: string; price: number }[];
}

/**
 * Edit a dish's name, description, and per-variant prices. Staff-authenticated
 * so the menu_staff_write / menu_variants_staff_write RLS policies allow it.
 * Refreshes the public menu so changes show immediately.
 */
export async function updateMenuItem(
  input: UpdateMenuItemInput,
): Promise<{ ok: boolean; error?: string }> {
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Name can't be empty." };

  for (const v of input.variants) {
    if (!Number.isFinite(v.price) || v.price < 0) {
      return { ok: false, error: "Prices must be zero or more." };
    }
  }

  try {
    const supabase = await createServerSupabase();

    const cleanIngredients = input.ingredients
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const cleanSpice = input.spiceLevels
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);

    const { error: itemErr } = await supabase
      .from("menu_items")
      .update({
        name,
        description: input.description.trim(),
        long_description: input.longDescription.trim() || null,
        ingredients: cleanIngredients,
        spice_levels: cleanSpice,
        is_weekly_special: input.isWeeklySpecial,
      } as never)
      .eq("id", input.dbId);
    if (itemErr) return { ok: false, error: itemErr.message };

    for (const v of input.variants) {
      const { error: vErr } = await supabase
        .from("menu_variants")
        .update({ price: v.price } as never)
        .eq("id", v.id);
      if (vErr) return { ok: false, error: vErr.message };
    }

    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
