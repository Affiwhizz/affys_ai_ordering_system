import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { AdminCateringInquiry, CateringStatus } from "./types";

/**
 * Column names match db/schema.sql's catering_inquiries table:
 *   customer_name / customer_phone_e164 / customer_email
 *   submitted_at (created), quote_sent_at, confirmed_at, declined_reason
 *   internal_notes (staff-only)
 *   contacted_at (added by db/catering_inquiries.sql)
 */
interface Row {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone_e164: string;
  event_type: string | null;
  event_date: string | null;
  guest_count: number | null;
  location: string | null;
  budget: string | null;
  notes: string | null;
  status: string;
  quote_amount: number | string | null;
  internal_notes: string | null;
  submitted_at: string;
  contacted_at: string | null;
  quote_sent_at: string | null;
  confirmed_at: string | null;
  declined_reason: string | null;
}

/**
 * Reads all catering inquiries for the admin board. Uses the SSR client so the
 * staff session + RLS gate access. Newest first.
 */
export async function getCateringInquiries(): Promise<AdminCateringInquiry[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("catering_inquiries")
      .select(
        "id, customer_name, customer_email, customer_phone_e164, event_type, event_date, guest_count, location, budget, notes, status, quote_amount, internal_notes, submitted_at, contacted_at, quote_sent_at, confirmed_at, declined_reason",
      )
      .order("submitted_at", { ascending: false });

    if (error || !data) return [];

    return (data as unknown as Row[]).map((r) => ({
      id: r.id,
      name: r.customer_name,
      email: r.customer_email,
      phone: r.customer_phone_e164,
      eventType: r.event_type,
      eventDate: r.event_date,
      guestCount: r.guest_count,
      location: r.location,
      budget: r.budget,
      notes: r.notes,
      status: (["new", "reviewing", "quoted", "confirmed", "declined"].includes(r.status)
        ? r.status
        : "new") as CateringStatus,
      quoteAmount: r.quote_amount != null ? Number(r.quote_amount) : null,
      // Surface the existing schema's `internal_notes` as our TS `staffNotes`.
      staffNotes: r.internal_notes,
      createdAt: r.submitted_at,
      contactedAt: r.contacted_at,
      quotedAt: r.quote_sent_at,
      confirmedAt: r.confirmed_at,
      // Existing schema doesn't have a separate declined_at, surface
      // declined_reason as the timestamp surrogate (null if absent).
      declinedAt: r.declined_reason ? r.submitted_at : null,
    }));
  } catch {
    return [];
  }
}
