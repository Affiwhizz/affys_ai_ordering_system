"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { NewOrderInput } from "./types";

export type CreateOrderResult =
  | { ok: true; shortCode: string; publicToken: string }
  | { ok: false; error: string };

/**
 * Persist a submitted order + its line items. Runs server-side with the
 * service-role client (orders allow anon insert, but we use the admin client so
 * we can read the generated short_code / public_token back for the customer).
 */
export async function createOrder(input: NewOrderInput): Promise<CreateOrderResult> {
  if (!input.customerName?.trim() || !input.customerPhone?.trim()) {
    return { ok: false, error: "Missing customer details." };
  }
  if (!input.items || input.items.length === 0) {
    return { ok: false, error: "No items in the order." };
  }

  try {
    const admin = createAdminSupabase();

    const { data, error } = await admin
      .from("orders")
      .insert({
        customer_name: input.customerName.trim(),
        customer_phone_e164: input.customerPhone.trim(),
        customer_email: input.customerEmail?.trim() || null,
        channel: input.channel,
        status: "new",
        fulfilment: input.fulfilment,
        scheduled_for: input.scheduledFor || null,
        delivery_region: input.deliveryRegion || null,
        delivery_municipality_key: input.deliveryMunicipalityKey || null,
        delivery_parish: input.deliveryParish || null,
        delivery_street: input.deliveryStreet || null,
        delivery_house_number: input.deliveryHouseNumber || null,
        delivery_floor: input.deliveryFloor || null,
        delivery_postcode: input.deliveryPostcode || null,
        subtotal: input.subtotal,
        delivery_fee: input.deliveryFee,
        takeout_bag_fee: input.takeoutBagFee,
        promo_code: input.promoCode || null,
        promo_discount: input.promoDiscount,
        total: input.total,
        payment_method: input.paymentMethod,
        payment_status: "pending",
        notes: input.notes?.trim() || null,
        allow_notifications: input.allowNotifications,
      } as never)
      .select("id, short_code, public_token")
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Couldn't save the order." };
    }

    const order = data as { id: string; short_code: string; public_token: string };

    const itemRows = input.items.map((it) => ({
      order_id: order.id,
      name: it.name,
      variant_label: it.variantLabel || null,
      unit_price: it.unitPrice,
      quantity: it.quantity,
      line_total: it.lineTotal,
      notes: it.notes || null,
    }));

    const { error: itemsError } = await admin
      .from("order_items")
      .insert(itemRows as never);

    if (itemsError) {
      // The order row exists; surface the issue but don't hard-fail the customer.
      return { ok: false, error: itemsError.message };
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return { ok: true, shortCode: order.short_code, publicToken: order.public_token };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
