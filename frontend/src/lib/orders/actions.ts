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

    // Resolve (or create) the customers row tied to this order so admin can
    // see repeat customers and lifetime stats. Match by phone first (unique +
    // always present), then by email as a fallback for the rare case where
    // the same person used a different number. NEVER blocks the order.
    const customerId = await upsertCustomer(admin, {
      name: input.customerName.trim(),
      phone: input.customerPhone.trim(),
      email: input.customerEmail?.trim() || null,
      region: input.deliveryRegion || null,
      municipalityKey: input.deliveryMunicipalityKey || null,
    });

    const { data, error } = await admin
      .from("orders")
      .insert({
        customer_id: customerId,
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

// =============================================================================
// Customer upsert
// =============================================================================

interface UpsertCustomerInput {
  name: string;
  phone: string;
  email: string | null;
  region: string | null;
  municipalityKey: string | null;
}

interface CustomerRow {
  id: string;
  orders_count: number;
}

/**
 * Find or create a customers row tied to this checkout, returning its id so
 * the order can be linked. Match priority: phone (unique + always present),
 * then email. NEVER throws — if anything goes wrong we return null and the
 * order falls back to customer_id = null (the prior behaviour), so this is
 * strictly additive.
 *
 * Also bumps orders_count and updates preferred region/municipality if the
 * customer already existed.
 */
async function upsertCustomer(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any,
  input: UpsertCustomerInput,
): Promise<string | null> {
  try {
    // 1) Match by phone (most reliable — checkout always captures it).
    let existing: CustomerRow | null = null;

    const byPhone = await admin
      .from("customers")
      .select("id, orders_count")
      .eq("phone_e164", input.phone)
      .maybeSingle();
    if (byPhone.data) existing = byPhone.data as CustomerRow;

    // 2) Fallback: match by email if we have one.
    if (!existing && input.email) {
      const byEmail = await admin
        .from("customers")
        .select("id, orders_count")
        .eq("email", input.email)
        .maybeSingle();
      if (byEmail.data) existing = byEmail.data as CustomerRow;
    }

    if (existing) {
      // Update: bump the orders counter + sync the freshest preferences.
      const patch: Record<string, unknown> = {
        name: input.name, // keep latest spelling
        orders_count: (existing.orders_count ?? 0) + 1,
        last_order_at: new Date().toISOString(),
      };
      if (input.email) patch.email = input.email;
      if (input.region) patch.preferred_region = input.region;
      if (input.municipalityKey) patch.preferred_municipality_key = input.municipalityKey;

      await admin
        .from("customers")
        .update(patch as never)
        .eq("id", existing.id);

      return existing.id;
    }

    // 3) Create a new customer row.
    const insertRes = await admin
      .from("customers")
      .insert({
        name: input.name,
        phone_e164: input.phone,
        email: input.email,
        preferred_region: input.region,
        preferred_municipality_key: input.municipalityKey,
        orders_count: 1,
        last_order_at: new Date().toISOString(),
      } as never)
      .select("id")
      .single();

    return (insertRes.data as { id: string } | null)?.id ?? null;
  } catch {
    // Strict additive: the order itself succeeds even if the customer link fails.
    return null;
  }
}
