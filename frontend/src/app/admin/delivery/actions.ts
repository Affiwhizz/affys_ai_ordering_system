"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { DeliveryGlobals, PaymentInfo } from "@/lib/delivery/get-delivery-settings";

function revalidate() {
  revalidatePath("/admin/delivery");
  revalidatePath("/"); // checkout reads these
}

/** Set one municipality's delivery fee. */
export async function setZoneFee(
  municipalityKey: string,
  fee: number,
): Promise<{ ok: boolean; error?: string }> {
  const value = Math.max(0, fee);
  if (!Number.isFinite(value)) return { ok: false, error: "Invalid fee." };
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("delivery_zones")
      .update({ base_fee: value } as never)
      .eq("municipality_key", municipalityKey);
    if (error) return { ok: false, error: error.message };
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Save delivery globals + payment details (single store_settings row). */
export async function setDeliverySettings(
  globals: DeliveryGlobals,
  payment: PaymentInfo,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("store_settings")
      .update({
        free_delivery_threshold: globals.freeDeliveryThreshold,
        tier1_threshold: globals.tier1Threshold,
        tier1_fee: globals.tier1Fee,
        tier2_threshold: globals.tier2Threshold,
        tier2_fee: globals.tier2Fee,
        whatsapp_threshold: globals.whatsappThreshold,
        outside_aml_fee: globals.outsideAmlFee,
        weight_threshold: globals.weightThreshold,
        weight_surcharge: globals.weightSurcharge,
        pay_account_name: payment.accountName.trim() || null,
        pay_iban: payment.iban.trim() || null,
        pay_mbway: payment.mbway.trim() || null,
        pay_note: payment.note.trim() || null,
      } as never)
      .eq("id", true);
    if (error) return { ok: false, error: error.message };
    revalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
