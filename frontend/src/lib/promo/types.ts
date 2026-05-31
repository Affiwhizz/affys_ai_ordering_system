/**
 * Client-safe promo code types + discount math.
 *
 * No "server-only" import, shared by the admin manager, the server actions,
 * and the checkout (client) component.
 */

export type PromoKind = "percent" | "fixed" | "free_delivery";

export interface PromoCode {
  id: string;
  code: string;
  kind: PromoKind;
  value: number; // percent (10 = 10%), fixed EUR (5 = €5), or 0 for free_delivery
  description: string | null;
  minOrder: number | null;
  maxUses: number | null; // global cap across all customers
  usedCount: number;
  perCustomerLimit: number | null; // uses per phone/email/device; null = unlimited
  firstOrderOnly: boolean;
  validFrom: string | null; // ISO
  validUntil: string | null; // ISO
  isActive: boolean;
}

/** A successfully-applied promo, kept in checkout state. */
export interface AppliedPromo {
  code: string;
  kind: PromoKind;
  value: number;
}

/**
 * The discount (in €) a promo produces against the current cart numbers.
 * - percent       → subtotal × value%
 * - fixed         → min(value, subtotal)
 * - free_delivery → the current delivery fee
 * Always clamped so it can never exceed subtotal + deliveryFee.
 */
export function computeDiscount(
  promo: AppliedPromo | null,
  subtotal: number,
  deliveryFee: number,
): number {
  if (!promo) return 0;
  let raw = 0;
  if (promo.kind === "percent") {
    raw = (subtotal * promo.value) / 100;
  } else if (promo.kind === "fixed") {
    raw = Math.min(promo.value, subtotal);
  } else if (promo.kind === "free_delivery") {
    raw = deliveryFee;
  }
  const ceiling = subtotal + deliveryFee;
  const clamped = Math.max(0, Math.min(raw, ceiling));
  // Round to cents.
  return Math.round(clamped * 100) / 100;
}

/** Short human label for a promo's reward, e.g. "10% off" or "Free delivery". */
export function promoRewardLabel(kind: PromoKind, value: number): string {
  if (kind === "percent") return `${value}% off`;
  if (kind === "fixed") return `€${value} off`;
  return "Free delivery";
}
