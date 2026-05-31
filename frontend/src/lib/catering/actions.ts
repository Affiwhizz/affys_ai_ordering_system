"use server";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import {
  cateringCustomerAckEmail,
  cateringOwnerAlertEmail,
} from "@/lib/email/templates";
import type {
  NewCateringInquiryInput,
  SubmitCateringResult,
} from "./types";

/**
 * Public catering form submission. Anyone can insert (RLS allows anon
 * insert); we use the service-role client so we can read the new row's id
 * back to build the customer-facing reference code.
 *
 * Sends two emails best-effort (never blocks the submission):
 *   1. Customer "received your inquiry"
 *   2. Owner "new catering inquiry"
 */
export async function submitCateringInquiry(
  input: NewCateringInquiryInput,
): Promise<SubmitCateringResult> {
  // Minimal trust-but-verify: name + phone required (email optional).
  const name = input.name?.trim();
  const phone = input.phone?.trim();
  if (!name || !phone) {
    return { ok: false, error: "Name and phone are required." };
  }
  const email = input.email?.trim() || null;
  const guestCount =
    typeof input.guestCount === "number" && !Number.isNaN(input.guestCount)
      ? Math.max(1, Math.round(input.guestCount))
      : null;

  try {
    const admin = createAdminSupabase();
    const { data, error } = await admin
      .from("catering_inquiries")
      .insert({
        name,
        email,
        phone,
        event_type: input.eventType?.trim() || null,
        event_date: input.eventDate || null,
        guest_count: guestCount,
        location: input.location?.trim() || null,
        budget: input.budget?.trim() || null,
        notes: input.notes?.trim() || null,
        status: "new",
      } as never)
      .select("id")
      .maybeSingle();

    if (error) return { ok: false, error: error.message };

    // Short human-friendly reference: first 4 chars of the uuid, uppercased.
    const row = data as { id: string } | null;
    const reference = row?.id ? `CAT-${row.id.slice(0, 4).toUpperCase()}` : "CAT-NEW";

    // Best-effort emails. NEVER fail the submission on email errors.
    const ownerTo =
      process.env.OWNER_EMAIL ||
      process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
      "";

    const payload = {
      reference,
      name,
      email: email ?? "",
      phone,
      eventType: input.eventType?.trim() || "",
      eventDate: input.eventDate || "",
      guestCount: guestCount ?? 0,
      location: input.location?.trim() || "",
      budget: input.budget?.trim() || "",
      notes: input.notes?.trim() || "",
    };

    const ackHtml = email ? cateringCustomerAckEmail(payload) : null;
    const ownerHtml = ownerTo ? cateringOwnerAlertEmail(payload) : null;

    await Promise.allSettled([
      ackHtml && email
        ? sendEmail({
            to: email,
            subject: ackHtml.subject,
            html: ackHtml.html,
            replyTo: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
          })
        : Promise.resolve(),
      ownerHtml && ownerTo
        ? sendEmail({
            to: ownerTo,
            subject: ownerHtml.subject,
            html: ownerHtml.html,
            replyTo: email ?? undefined,
          })
        : Promise.resolve(),
    ]);

    return { ok: true, reference };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not submit your inquiry.",
    };
  }
}
