import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";

export interface DeliveryZoneFee {
  key: string;
  name: string;
  fee: number;
}

export interface DeliveryGlobals {
  freeDeliveryThreshold: number;
  tier1Threshold: number;
  tier1Fee: number;
  tier2Threshold: number;
  tier2Fee: number;
  whatsappThreshold: number;
  outsideAmlFee: number;
  weightThreshold: number;
  weightSurcharge: number;
}

export interface PaymentInfo {
  accountName: string;
  iban: string;
  mbway: string;
  note: string;
}

export interface DeliverySettings {
  globals: DeliveryGlobals;
  zones: DeliveryZoneFee[];
  payment: PaymentInfo;
}

export const DEFAULT_GLOBALS: DeliveryGlobals = {
  freeDeliveryThreshold: 200,
  tier1Threshold: 200,
  tier1Fee: 30,
  tier2Threshold: 400,
  tier2Fee: 50,
  whatsappThreshold: 500,
  outsideAmlFee: 25,
  weightThreshold: 160,
  weightSurcharge: 15,
};

export const DEFAULT_PAYMENT: PaymentInfo = {
  accountName: "Affy's · Unipessoal LDA",
  iban: "",
  mbway: "+351 914 145 519",
  note: "Please send payment before confirmation and share the receipt via WhatsApp.",
};

const num = (v: unknown, fallback: number): number => {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Reads delivery globals, per-municipality fees, and payment details. Falls
 * back to sensible defaults so checkout always works.
 */
export async function getDeliverySettings(): Promise<DeliverySettings> {
  try {
    const supabase = await createServerSupabase();
    const [{ data: s }, { data: zones }] = await Promise.all([
      supabase
        .from("store_settings")
        .select(
          "free_delivery_threshold, tier1_threshold, tier1_fee, tier2_threshold, tier2_fee, whatsapp_threshold, outside_aml_fee, weight_threshold, weight_surcharge, pay_account_name, pay_iban, pay_mbway, pay_note",
        )
        .eq("id", true)
        .maybeSingle(),
      supabase
        .from("delivery_zones")
        .select("municipality_key, municipality_name, base_fee")
        .order("municipality_name", { ascending: true }),
    ]);

    const row = (s ?? {}) as Record<string, unknown>;
    const globals: DeliveryGlobals = {
      freeDeliveryThreshold: num(row.free_delivery_threshold, DEFAULT_GLOBALS.freeDeliveryThreshold),
      tier1Threshold: num(row.tier1_threshold, DEFAULT_GLOBALS.tier1Threshold),
      tier1Fee: num(row.tier1_fee, DEFAULT_GLOBALS.tier1Fee),
      tier2Threshold: num(row.tier2_threshold, DEFAULT_GLOBALS.tier2Threshold),
      tier2Fee: num(row.tier2_fee, DEFAULT_GLOBALS.tier2Fee),
      whatsappThreshold: num(row.whatsapp_threshold, DEFAULT_GLOBALS.whatsappThreshold),
      outsideAmlFee: num(row.outside_aml_fee, DEFAULT_GLOBALS.outsideAmlFee),
      weightThreshold: num(row.weight_threshold, DEFAULT_GLOBALS.weightThreshold),
      weightSurcharge: num(row.weight_surcharge, DEFAULT_GLOBALS.weightSurcharge),
    };
    const payment: PaymentInfo = {
      accountName: (row.pay_account_name as string) || DEFAULT_PAYMENT.accountName,
      iban: (row.pay_iban as string) || "",
      mbway: (row.pay_mbway as string) || DEFAULT_PAYMENT.mbway,
      note: (row.pay_note as string) || DEFAULT_PAYMENT.note,
    };
    const zoneList = ((zones as
      | { municipality_key: string; municipality_name: string; base_fee: number | string }[]
      | null) ?? []).map((z) => ({
      key: z.municipality_key,
      name: z.municipality_name,
      fee: num(z.base_fee, 0),
    }));

    return { globals, zones: zoneList, payment };
  } catch {
    return { globals: DEFAULT_GLOBALS, zones: [], payment: DEFAULT_PAYMENT };
  }
}
