"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { NewOrderInput } from "./types";
import { sendEmail } from "@/lib/email/send";
import {
  orderReceivedEmail,
  ownerNewOrderEmail,
  type EmailOrder,
} from "@/lib/email/templates";

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

    // Confirmation emails, customer "order received" + owner alert. Never block
    // or fail the order on email problems (sendEmail no-ops without a key).
    try {
      const addressLine =
        input.fulfilment === "delivery"
          ? [
              [input.deliveryStreet, input.deliveryHouseNumber]
                .filter(Boolean)
                .join(" "),
              input.deliveryFloor,
              input.deliveryParish,
              input.deliveryMunicipalityKey,
              input.deliveryPostcode,
            ]
              .filter((x) => x && String(x).trim().length > 0)
              .join(", ")
          : null;

      const emailOrder: EmailOrder = {
        shortCode: order.short_code,
        customerName: input.customerName,
        channel: input.channel,
        fulfilment: input.fulfilment,
        scheduledFor: input.scheduledFor ?? null,
        addressLine,
        items: input.items.map((it) => ({
          name: it.name,
          variantLabel: it.variantLabel ?? null,
          quantity: it.quantity,
          lineTotal: it.lineTotal,
          notes: it.notes ?? null,
        })),
        subtotal: input.subtotal,
        deliveryFee: input.deliveryFee,
        takeoutBagFee: input.takeoutBagFee,
        promoCode: input.promoCode ?? null,
        promoDiscount: input.promoDiscount,
        total: input.total,
        paymentMethod: input.paymentMethod,
        notes: input.notes ?? null,
      };

      const ownerTo =
        process.env.OWNER_EMAIL || process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
      const sends: Promise<unknown>[] = [];
      if (input.customerEmail) {
        const e = orderReceivedEmail(emailOrder);
        sends.push(
          sendEmail({ to: input.customerEmail, subject: e.subject, html: e.html }),
        );
      }
      if (ownerTo) {
        const o = ownerNewOrderEmail(emailOrder);
        sends.push(sendEmail({ to: ownerTo, subject: o.subject, html: o.html }));
      }
      await Promise.allSettled(sends);
    } catch {
      /* email failures never affect the order */
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");

    return { ok: true, shortCode: order.short_code, publicToken: order.public_token };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
