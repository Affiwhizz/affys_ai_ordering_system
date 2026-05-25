"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders/types";
import { sendEmail } from "@/lib/email/send";
import { orderConfirmedEmail, type EmailOrder } from "@/lib/email/templates";

interface ConfirmRow {
  short_code: string;
  customer_name: string;
  customer_email: string | null;
  channel: "udia" | "form" | "portimao";
  fulfilment: "pickup" | "delivery";
  scheduled_for: string | null;
  delivery_municipality_key: string | null;
  delivery_parish: string | null;
  delivery_street: string | null;
  delivery_house_number: string | null;
  delivery_floor: string | null;
  delivery_postcode: string | null;
  subtotal: number | string;
  delivery_fee: number | string;
  takeout_bag_fee: number | string;
  promo_code: string | null;
  promo_discount: number | string;
  total: number | string;
  payment_method: "bank" | "stripe" | null;
  notes: string | null;
  order_items:
    | { name: string; variant_label: string | null; quantity: number; line_total: number | string; notes: string | null }[]
    | null;
}

/** Send the customer "confirmed" email once an order is confirmed/paid. */
async function sendConfirmedEmail(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  id: string,
) {
  try {
    const { data } = await supabase
      .from("orders")
      .select(
        "short_code, customer_name, customer_email, channel, fulfilment, scheduled_for, delivery_municipality_key, delivery_parish, delivery_street, delivery_house_number, delivery_floor, delivery_postcode, subtotal, delivery_fee, takeout_bag_fee, promo_code, promo_discount, total, payment_method, notes, order_items(name, variant_label, quantity, line_total, notes)",
      )
      .eq("id", id)
      .maybeSingle();
    const r = data as ConfirmRow | null;
    if (!r || !r.customer_email) return;

    const addressLine =
      r.fulfilment === "delivery"
        ? [
            [r.delivery_street, r.delivery_house_number].filter(Boolean).join(" "),
            r.delivery_floor,
            r.delivery_parish,
            r.delivery_municipality_key,
            r.delivery_postcode,
          ]
            .filter((x) => x && String(x).trim().length > 0)
            .join(", ")
        : null;

    const emailOrder: EmailOrder = {
      shortCode: r.short_code,
      customerName: r.customer_name,
      channel: r.channel,
      fulfilment: r.fulfilment,
      scheduledFor: r.scheduled_for,
      addressLine,
      items: (r.order_items ?? []).map((it) => ({
        name: it.name,
        variantLabel: it.variant_label,
        quantity: it.quantity,
        lineTotal: Number(it.line_total),
        notes: it.notes,
      })),
      subtotal: Number(r.subtotal),
      deliveryFee: Number(r.delivery_fee),
      takeoutBagFee: Number(r.takeout_bag_fee),
      promoCode: r.promo_code,
      promoDiscount: Number(r.promo_discount),
      total: Number(r.total),
      paymentMethod: r.payment_method,
      notes: r.notes,
    };
    const e = orderConfirmedEmail(emailOrder);
    await sendEmail({ to: r.customer_email, subject: e.subject, html: e.html });
  } catch {
    /* never block the status update on email */
  }
}

type Result = { ok: boolean; error?: string };

/** Count of orders still on "new" (awaiting a status) — for the admin nav badge. */
export async function getNewOrdersCount(): Promise<number> {
  try {
    const supabase = await createServerSupabase();
    const { count } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");
    return count ?? 0;
  } catch {
    return 0;
  }
}

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

    // Customer "confirmed" email when the order is confirmed or marked paid.
    if (status === "confirmed" || status === "paid") {
      await sendConfirmedEmail(supabase, id);
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
