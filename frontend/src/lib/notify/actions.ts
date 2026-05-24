"use server";

import { createAdminSupabase } from "@/lib/supabase/admin";

export type NotifyResult = { ok: boolean; error?: string };

/**
 * Capture a "notify me" / waitlist sign-up. At least one of email/phone is
 * required. Inserts via the service-role client (table also allows anon insert).
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
  try {
    const admin = createAdminSupabase();
    const { error } = await admin.from("notify_signups").insert({
      email,
      phone,
      source: input.source || "general",
    } as never);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
