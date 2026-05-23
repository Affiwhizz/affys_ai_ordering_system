"use server";

import { getDeliverySettings } from "./get-delivery-settings";
import type { DeliverySettings } from "./types";

/**
 * Public server action so client components (CheckoutModal) can read the
 * admin-managed delivery fees, tiers, weight surcharge, and payment details.
 * store_settings + delivery_zones are public-read under RLS.
 */
export async function fetchDeliverySettings(): Promise<DeliverySettings> {
  return getDeliverySettings();
}
