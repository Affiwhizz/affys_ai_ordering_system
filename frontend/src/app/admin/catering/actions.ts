"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CateringStatus } from "@/lib/catering/types";

interface UpdateResult {
  ok: boolean;
  error?: string;
}

/**
 * Update the status of a catering inquiry. Lifecycle stamps mirror the
 * orders flow (contacted_at / quoted_at / confirmed_at / declined_at).
 * Uses the SSR client so staff RLS gates writes.
 */
export async function setCateringStatus(
  id: string,
  status: CateringStatus,
): Promise<UpdateResult> {
  if (!id) return { ok: false, error: "Missing id." };
  try {
    const supabase = await createServerSupabase();
    const now = new Date().toISOString();
    const patch: Record<string, unknown> = { status };
    if (status === "reviewing") patch.contacted_at = now;
    if (status === "quoted")    patch.quoted_at = now;
    if (status === "confirmed") patch.confirmed_at = now;
    if (status === "declined")  patch.declined_at = now;

    const { error } = await supabase
      .from("catering_inquiries")
      .update(patch as never)
      .eq("id", id);

    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/catering");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Save the quoted amount + optional internal staff notes. */
export async function setCateringQuote(
  id: string,
  quoteAmount: number | null,
  staffNotes: string | null,
): Promise<UpdateResult> {
  if (!id) return { ok: false, error: "Missing id." };
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("catering_inquiries")
      .update({
        quote_amount: quoteAmount,
        staff_notes: staffNotes,
      } as never)
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/catering");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Count of unhandled catering inquiries — used for the admin sidebar badge. */
export async function getNewCateringCount(): Promise<number> {
  try {
    const supabase = await createServerSupabase();
    const { count } = await supabase
      .from("catering_inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");
    return count ?? 0;
  } catch {
    return 0;
  }
}
