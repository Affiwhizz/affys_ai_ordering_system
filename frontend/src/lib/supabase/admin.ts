import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Admin (service-role) Supabase client, bypasses Row Level Security.
 *
 * SERVER-ONLY. Never import this from a "use client" file.
 *
 * Use this for:
 *   - Writing audit log rows
 *   - Stripe webhook handlers (need to update orders without a user session)
 *   - Server-side data jobs (e.g. sending reminder emails)
 *   - Anything that needs to read/write across users
 *
 * The service role key MUST stay private, it's set as SUPABASE_SERVICE_ROLE_KEY
 * in Vercel env vars and is NOT prefixed with NEXT_PUBLIC_.
 */
export function createAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "createAdminSupabase: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var.",
    );
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
