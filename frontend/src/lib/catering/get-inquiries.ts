import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { AdminCateringInquiry, CateringStatus } from "./types";

interface Row {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  event_type: string | null;
  event_date: string | null;
  guest_count: number | null;
  location: string | null;
  budget: string | null;
  notes: string | null;
  status: string;
  quote_amount: number | string | null;
  staff_notes: string | null;
  created_at: string;
  contacted_at: string | null;
  quoted_at: string | null;
  confirmed_at: string | null;
  declined_at: string | null;
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
        "id, name, email, phone, event_type, event_date, guest_count, location, budget, notes, status, quote_amount, staff_notes, created_at, contacted_at, quoted_at, confirmed_at, declined_at",
      )
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return (data as unknown as Row[]).map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
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
      staffNotes: r.staff_notes,
      createdAt: r.created_at,
      contactedAt: r.contacted_at,
      quotedAt: r.quoted_at,
      confirmedAt: r.confirmed_at,
      declinedAt: r.declined_at,
    }));
  } catch {
    return [];
  }
}
