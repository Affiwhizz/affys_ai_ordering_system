import "server-only";
import { Resend } from "resend";

/**
 * Thin Resend wrapper. SERVER-ONLY.
 *
 * Degrades gracefully: if RESEND_API_KEY isn't set yet, sends are skipped
 * silently (logged) so order creation / status updates never break. Flip it on
 * by adding RESEND_API_KEY + FROM_EMAIL in Vercel and verifying the domain.
 */

const FROM =
  process.env.FROM_EMAIL || "Affy's <hello@atasteofaffys.com>";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`[email] RESEND_API_KEY not set — skipping "${input.subject}"`);
    return { ok: false };
  }
  if (!input.to || !input.to.includes("@")) {
    return { ok: false };
  }
  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    });
    if (error) {
      console.error("[email] send error:", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] send threw:", e);
    return { ok: false };
  }
}
