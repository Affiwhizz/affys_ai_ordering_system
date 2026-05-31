/**
 * Client-safe catering types (no "server-only" import).
 *
 * Shared by the public form, the server action, the admin manager, and the
 * email template. Anything imported into a client component MUST live here.
 */

export type CateringStatus =
  | "new"
  | "reviewing"
  | "quoted"
  | "confirmed"
  | "declined";

export const CATERING_STATUSES: CateringStatus[] = [
  "new",
  "reviewing",
  "quoted",
  "confirmed",
  "declined",
];

export const CATERING_STATUS_TONE: Record<
  CateringStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  new:       { label: "New",       bg: "bg-gold/10",    text: "text-espresso", border: "border-gold" },
  reviewing: { label: "Reviewing", bg: "bg-cream-deep", text: "text-espresso", border: "border-foreground-muted" },
  quoted:    { label: "Quoted",    bg: "bg-red/10",     text: "text-red",      border: "border-red" },
  confirmed: { label: "Confirmed", bg: "bg-forest/10",  text: "text-forest",   border: "border-forest" },
  declined:  { label: "Declined",  bg: "bg-cream",      text: "text-foreground-muted", border: "border-border-strong" },
};

/** What the public form sends to the server action. */
export interface NewCateringInquiryInput {
  name: string;
  email?: string;
  phone: string;
  eventType?: string;
  eventDate?: string;   // "YYYY-MM-DD"
  guestCount?: number;
  location?: string;
  budget?: string;
  notes?: string;
}

/** Row shape returned by the admin reader. */
export interface AdminCateringInquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  eventType: string | null;
  eventDate: string | null;
  guestCount: number | null;
  location: string | null;
  budget: string | null;
  notes: string | null;
  status: CateringStatus;
  quoteAmount: number | null;
  staffNotes: string | null;
  createdAt: string;
  contactedAt: string | null;
  quotedAt: string | null;
  confirmedAt: string | null;
  declinedAt: string | null;
}

export interface SubmitCateringResult {
  ok: boolean;
  /** Short reference shown back to the customer ("CAT-A1B2"). */
  reference?: string;
  error?: string;
}
