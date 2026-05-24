/**
 * Client-safe order types + status helpers (no "server-only" import).
 * Shared by the checkout, the createOrder action, and the admin Orders page.
 */

export type OrderChannel = "udia" | "form" | "portimao";
export type OrderStatus =
  | "new"
  | "confirmed"
  | "paid"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type PaymentMethod = "bank" | "stripe";
export type Fulfilment = "pickup" | "delivery";

/** Status options shown in the admin dropdown, in workflow order. */
export const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "paid",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export const STATUS_TONE: Record<
  OrderStatus,
  "neutral" | "amber" | "green" | "red" | "gold"
> = {
  new: "amber",
  confirmed: "amber",
  paid: "gold",
  preparing: "amber",
  ready: "green",
  completed: "green",
  cancelled: "red",
};

// ---------- Checkout → createOrder payload ----------

export interface NewOrderItem {
  name: string;
  variantLabel?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  notes?: string | null;
}

export interface NewOrderInput {
  customerName: string;
  customerPhone: string; // E.164
  customerEmail?: string | null;
  channel: OrderChannel;
  fulfilment: Fulfilment;
  scheduledFor?: string | null; // ISO timestamp

  // delivery address (optional)
  deliveryRegion?: string | null;
  deliveryMunicipalityKey?: string | null;
  deliveryParish?: string | null;
  deliveryStreet?: string | null;
  deliveryHouseNumber?: string | null;
  deliveryFloor?: string | null;
  deliveryPostcode?: string | null;

  // money
  subtotal: number;
  deliveryFee: number;
  takeoutBagFee: number;
  promoCode?: string | null;
  promoDiscount: number;
  total: number;

  paymentMethod: PaymentMethod;
  notes?: string | null;
  allowNotifications: boolean;

  items: NewOrderItem[];
}

// ---------- Admin read shapes ----------

export interface AdminOrderItem {
  name: string;
  variantLabel: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  notes: string | null;
}

export interface AdminOrder {
  id: string;
  shortCode: string;
  channel: OrderChannel;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  fulfilment: Fulfilment;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  scheduledFor: string | null;
  addressLine: string | null;
  subtotal: number;
  deliveryFee: number;
  takeoutBagFee: number;
  promoCode: string | null;
  promoDiscount: number;
  total: number;
  notes: string | null;
  submittedAt: string;
  items: AdminOrderItem[];
}
