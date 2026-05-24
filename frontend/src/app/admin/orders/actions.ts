"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders/types";

type Result = { ok: boolean; error?: string };

/** Update an order's status, keeping the matching timestamp + payment_status in sync. */
export async function setOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Result> {
  if (!id) return { ok: false, error: "Missing order id." };
  if (!ORDER_STATUSES.includes(status))
    return { ok: false, error: "Invalid status." };

  const patch: Record<string, unknown> = { status };
  const nowIso = new Date().toISOString();
  if (status === "confirmed") patch.confirmed_at = nowIso;
  if (status === "completed") patch.completed_at = nowIso;
  if (status === "cancelled") patch.cancelled_at = nowIso;
  // Marking 'paid' also flips the payment status + paid_at.
  if (status === "paid") {
    patch.payment_status = "paid";
    patch.paid_at = nowIso;
  }

  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("orders")
      .update(patch as never)
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
