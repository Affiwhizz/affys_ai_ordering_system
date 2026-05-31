"use server";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { notifyWelcomeEmail } from "@/lib/email/templates";

export type NotifyResult = { ok: boolean; error?: string };

/**
 * Capture a "notify me" / waitlist sign-up. At least one of email/phone is
 * required. Inserts via the service-role client (table also allows anon insert).
 *
 * If the customer left an email, send a source-specific welcome email so they
 * know they're on the list and what to expect, no more confusion with order
 * confirmations. Email is best-effort and NEVER fails the signup.
 */
export async function submitNotifySignup(input: {
  email?: string;
  phone?: string;
  source: string;
}): Promise<NotifyResult> {
  const email = input.email?.trim() || null;
  const phone = input.phone?.trim() || null;
  if (!email && !phone) {
    return { ok: false, error: "Add an email or phone number." };
  }
  const source = input.source || "general";

  try {
    const admin = createAdminSupabase();
    const { error } = await admin.from("notify_signups").insert({
      email,
      phone,
      source,
    } as never);
    if (error) return { ok: false, error: error.message };

    // Fire-and-forget welcome email. Wrapped so it can never throw the signup.
    if (email) {
      const welcome = notifyWelcomeEmail(source, email);
      if (welcome) {
        sendEmail({ to: email, subject: welcome.subject, html: welcome.html }).catch(
          () => {},
        );
      }
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
