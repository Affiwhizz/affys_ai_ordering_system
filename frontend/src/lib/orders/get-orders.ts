import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  AdminOrder,
  AdminOrderItem,
  OrderChannel,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  Fulfilment,
} from "./types";

interface OrderRow {
  id: string;
  short_code: string;
  channel: OrderChannel;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  fulfilment: Fulfilment;
  customer_name: string;
  customer_phone_e164: string;
  customer_email: string | null;
  scheduled_for: string | null;
  delivery_region: string | null;
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
  notes: string | null;
  submitted_at: string;
  order_items: {
    name: string;
    variant_label: string | null;
    unit_price: number | string;
    quantity: number;
    line_total: number | string;
    notes: string | null;
  }[] | null;
}

function buildAddress(r: OrderRow): string | null {
  if (r.fulfilment !== "delivery") return null;
  const parts = [
    [r.delivery_street, r.delivery_house_number].filter(Boolean).join(" "),
    r.delivery_floor,
    r.delivery_parish,
    r.delivery_municipality_key,
    r.delivery_postcode,
  ].filter((x) => x && String(x).trim().length > 0);
  return parts.length ? parts.join(", ") : null;
}

/** All orders (newest first) with their line items, for the admin Orders page. */
export async function getOrders(limit = 200): Promise<AdminOrder[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, short_code, channel, status, payment_status, payment_method, fulfilment, customer_name, customer_phone_e164, customer_email, scheduled_for, delivery_region, delivery_municipality_key, delivery_parish, delivery_street, delivery_house_number, delivery_floor, delivery_postcode, subtotal, delivery_fee, takeout_bag_fee, promo_code, promo_discount, total, notes, submitted_at, order_items(name, variant_label, unit_price, quantity, line_total, notes)",
      )
      .order("submitted_at", { ascending: false })
      .limit(limit);

    if (error) return [];
    const rows = (data as OrderRow[] | null) ?? [];

    return rows.map((r) => {
      const items: AdminOrderItem[] = (r.order_items ?? []).map((it) => ({
        name: it.name,
        variantLabel: it.variant_label,
        unitPrice: Number(it.unit_price),
        quantity: it.quantity,
        lineTotal: Number(it.line_total),
        notes: it.notes,
      }));
      return {
        id: r.id,
        shortCode: r.short_code,
        channel: r.channel,
        status: r.status,
        paymentStatus: r.payment_status,
        paymentMethod: r.payment_method,
        fulfilment: r.fulfilment,
        customerName: r.customer_name,
        customerPhone: r.customer_phone_e164,
        customerEmail: r.customer_email,
        scheduledFor: r.scheduled_for,
        addressLine: buildAddress(r),
        subtotal: Number(r.subtotal),
        deliveryFee: Number(r.delivery_fee),
        takeoutBagFee: Number(r.takeout_bag_fee),
        promoCode: r.promo_code,
        promoDiscount: Number(r.promo_discount),
        total: Number(r.total),
        notes: r.notes,
        submittedAt: r.submitted_at,
        items,
      };
    });
  } catch {
    return [];
  }
}
