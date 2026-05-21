"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

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
