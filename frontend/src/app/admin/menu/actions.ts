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
