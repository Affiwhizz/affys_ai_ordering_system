/**
 * Client-safe delivery settings types + defaults.
 *
 * This module has NO "server-only" import so it can be shared by client
 * components (CheckoutModal) and server code (get-delivery-settings.ts).
 */

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
