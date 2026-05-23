"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { PromoKind } from "@/lib/promo/types";

export interface PromoInput {
  code: string;
  kind: PromoKind;
  value: number;
  description: string;
  minOrder: number | null;
  maxUses: number | null;
  perCustomerLimit: number | null;
  firstOrderOnly: boolean;
  validFrom: string | null;
  validUntil: string | null;
  isActive: boolean;
}

type Result = { ok: boolean; error?: string };

function revalidate() {
  revalidatePath("/admin/promos");
  revalidatePath("/"); // checkout validates against these
}

function toRow(input: PromoInput) {
  return {
    code: input.code.trim(),
    kind: input.kind,
    value: input.kind === "free_delivery" ? 0 : Math.max(0, input.value),
    description: input.description.trim() || null,
    min_order: input.minOrder,
    max_uses: input.maxUses,
    per_customer_limit: input.perCustomerLimit,
    first_order_only: input.firstOrderOnly,
    valid_from: input.validFrom || null,
    valid_until: input.validUntil || null,
    is_active: input.isActive,
  };
}

export async function createPromo(input: PromoInput): Promise<Result> {
  const code = input.code.trim();
  if (!code) return { ok: false, error: "Code is required." };
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("promo_codes")
      .insert(toRow(input) as never);
    if (error) {
      if (error.code === "23505")
        return { ok: false, error: "That code already exists." };
      return { ok: false, error: error.message };
    }
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function updatePromo(id: string, input: PromoInput): Promise<Result> {
  if (!id) return { ok: false, error: "Missing id." };
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("promo_codes")
      .update(toRow(input) as never)
      .eq("id", id);
    if (error) {
      if (error.code === "23505")
        return { ok: false, error: "That code already exists." };
      return { ok: false, error: error.message };
    }
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function setPromoActive(id: string, isActive: boolean): Promise<Result> {
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("promo_codes")
      .update({ is_active: isActive } as never)
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function deletePromo(id: string): Promise<Result> {
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase.from("promo_codes").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
