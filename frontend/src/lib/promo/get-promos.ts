import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { PromoCode, PromoKind } from "./types";

interface PromoRow {
  id: string;
  code: string;
  kind: PromoKind;
  value: number | string;
  description: string | null;
  min_order: number | string | null;
  max_uses: number | null;
  used_count: number;
  per_customer_limit: number | null;
  first_order_only: boolean;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
}

const n = (v: number | string | null): number | null =>
  v == null ? null : Number(v);

/** All promo codes for the admin manager, newest first. */
export async function getPromoCodes(): Promise<PromoCode[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("promo_codes")
      .select(
        "id, code, kind, value, description, min_order, max_uses, used_count, per_customer_limit, first_order_only, valid_from, valid_until, is_active, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) return [];
    const rows = (data as (PromoRow & { created_at: string })[] | null) ?? [];
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      kind: r.kind,
      value: Number(r.value),
      description: r.description,
      minOrder: n(r.min_order),
      maxUses: r.max_uses,
      usedCount: r.used_count ?? 0,
      perCustomerLimit: r.per_customer_limit,
      firstOrderOnly: !!r.first_order_only,
      validFrom: r.valid_from,
      validUntil: r.valid_until,
      isActive: !!r.is_active,
    }));
  } catch {
    return [];
  }
}
