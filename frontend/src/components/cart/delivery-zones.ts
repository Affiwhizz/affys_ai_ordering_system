/**
 * Delivery fee calculator — now driven by AML municipality data.
 *
 * Rules (mirrors Affy's brief):
 *   - subtotal > €500 → WhatsApp-only (contact card, no checkout button)
 *   - subtotal > €400 → flat €50 delivery fee
 *   - subtotal > €200 → flat €30 delivery fee
 *   - subtotal ≤ €200 → municipality's base fee (from aml-data.ts)
 *   - outside AML  → flat €25 "from" (real fee shared after weight check)
 */

import { getMunicipality, OUTSIDE_AML } from "./aml-data";

export type DeliveryResult =
  | { kind: "fee"; amount: number; note?: string }
  | { kind: "whatsapp"; reason: string };

const WHATSAPP_THRESHOLD = 500;
const TIER_400 = 400;
const TIER_200 = 200;

/**
 * Compute the delivery fee for a given municipality key + cart subtotal.
 * Pass `municipalityKey = "outside-aml"` for orders beyond the metro area.
 */
export function computeDelivery(
  municipalityKey: string | null,
  subtotal: number,
): DeliveryResult {
  if (subtotal > WHATSAPP_THRESHOLD) {
    return {
      kind: "whatsapp",
      reason:
        "Orders over €500 — message us on WhatsApp to finalize the details and pricing.",
    };
  }
  if (subtotal > TIER_400) {
    return { kind: "fee", amount: 50, note: "Tiered fee for €400+ orders" };
  }
  if (subtotal > TIER_200) {
    return { kind: "fee", amount: 30, note: "Tiered fee for €200+ orders" };
  }
  if (municipalityKey === "outside-aml") {
    return {
      kind: "fee",
      amount: OUTSIDE_AML.baseFee,
      note: OUTSIDE_AML.note,
    };
  }
  if (!municipalityKey) {
    // No municipality selected yet — return 0 with a hint
    return { kind: "fee", amount: 0, note: "Pick a municipality to see the fee" };
  }
  const m = getMunicipality(municipalityKey);
  if (!m) {
    return { kind: "fee", amount: 0, note: "Unknown municipality" };
  }
  return { kind: "fee", amount: m.baseFee };
}

/**
 * Free-delivery welcome offer threshold (kicks in once we wire customer
 * recognition by phone/email — until then this is shown as a target).
 */
export const FREE_DELIVERY_THRESHOLD = 200;

export function formatEuro(n: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}
