"use server";

import { createAdminSupabase } from "@/lib/supabase/admin";
import type { AppliedPromo, PromoKind } from "./types";

interface PromoRow {
  id: string;
  code: string;
  kind: PromoKind;
  value: number | string;
  min_order: number | string | null;
  max_uses: number | null;
  used_count: number;
  per_customer_limit: number | null;
  first_order_only: boolean;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
}

interface RedemptionRow {
  phone: string | null;
  email: string | null;
  device_id: string | null;
}

export type ValidatePromoResult =
  | { ok: true; promo: AppliedPromo; message: string }
  | { ok: false; message: string };

const norm = (s: string | null | undefined) => (s ?? "").trim().toLowerCase();

/**
 * Validate a promo code against the cart + customer identity. Does NOT record a
 * redemption, call redeemPromoCode at order confirmation for that.
 */
export async function validatePromoCode(input: {
  code: string;
  subtotal: number;
  phone?: string;
  email?: string;
  deviceId?: string;
}): Promise<ValidatePromoResult> {
  const code = input.code.trim();
  if (!code) return { ok: false, message: "Enter a promo code." };

  try {
    const admin = createAdminSupabase();
    const { data, error } = await admin
      .from("promo_codes")
      .select(
        "id, code, kind, value, min_order, max_uses, used_count, per_customer_limit, first_order_only, valid_from, valid_until, is_active",
      )
      .ilike("code", code)
      .maybeSingle();

    if (error) return { ok: false, message: "Couldn't check that code, try again." };
    const promo = data as PromoRow | null;
    if (!promo) return { ok: false, message: "That code isn't valid." };

    if (!promo.is_active) return { ok: false, message: "This code is no longer active." };

    const now = Date.now();
    if (promo.valid_from && now < new Date(promo.valid_from).getTime()) {
      return { ok: false, message: "This code isn't active yet." };
    }
    if (promo.valid_until && now > new Date(promo.valid_until).getTime()) {
      return { ok: false, message: "This code has expired." };
    }

    const minOrder = promo.min_order == null ? 0 : Number(promo.min_order);
    if (minOrder > 0 && input.subtotal < minOrder) {
      return {
        ok: false,
        message: `Spend at least €${minOrder} to use this code.`,
      };
    }

    if (promo.max_uses != null && promo.used_count >= promo.max_uses) {
      return { ok: false, message: "This code has reached its usage limit." };
    }

    // Per-customer + first-order checks need the redemption ledger.
    const needsLedger = promo.first_order_only || promo.per_customer_limit != null;
    if (needsLedger) {
      const { data: redData } = await admin
        .from("promo_redemptions")
        .select("phone, email, device_id")
        .ilike("code", code);
      const reds = (redData as RedemptionRow[] | null) ?? [];

      const phone = norm(input.phone);
      const email = norm(input.email);
      const device = norm(input.deviceId);
      const mine = reds.filter(
        (r) =>
          (phone && norm(r.phone) === phone) ||
          (email && norm(r.email) === email) ||
          (device && norm(r.device_id) === device),
      ).length;

      if (promo.first_order_only && mine > 0) {
        return { ok: false, message: "This code is for first-time orders only." };
      }
      if (promo.per_customer_limit != null && mine >= promo.per_customer_limit) {
        return {
          ok: false,
          message: "You've already used this code.",
        };
      }
    }

    return {
      ok: true,
      message: "Code applied.",
      promo: { code: promo.code, kind: promo.kind, value: Number(promo.value) },
    };
  } catch {
    return { ok: false, message: "Couldn't check that code, try again." };
  }
}

/**
 * Record a redemption + bump the global used_count. Call this once the customer
 * confirms the order with a validated code applied. Best-effort: never throws.
 */
export async function redeemPromoCode(input: {
  code: string;
  discount: number;
  subtotal: number;
  phone?: string;
  email?: string;
  deviceId?: string;
}): Promise<{ ok: boolean }> {
  const code = input.code.trim();
  if (!code) return { ok: false };
  try {
    const admin = createAdminSupabase();
    const { data, error } = await admin
      .from("promo_codes")
      .select("id, used_count")
      .ilike("code", code)
      .maybeSingle();
    if (error || !data) return { ok: false };
    const promo = data as { id: string; used_count: number };

    await admin.from("promo_redemptions").insert({
      code,
      promo_id: promo.id,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      device_id: input.deviceId?.trim() || null,
      order_subtotal: input.subtotal,
      discount: input.discount,
    } as never);

    await admin
      .from("promo_codes")
      .update({ used_count: (promo.used_count ?? 0) + 1 } as never)
      .eq("id", promo.id);

    return { ok: true };
  } catch {
    return { ok: false };
  }
}
