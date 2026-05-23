"use server";

import { getStoreFlags } from "./get-store-flags";
import type { StoreFlags } from "./types";

/**
 * Public server action so client components (the cart provider) can read the
 * daily-ordering pause flag + resume date. store_settings is public-read.
 */
export async function fetchStoreFlags(): Promise<StoreFlags> {
  return getStoreFlags();
}
