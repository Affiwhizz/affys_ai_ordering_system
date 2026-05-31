import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Supabase client for server-side use (Server Components, Server Actions,
 * Route Handlers). Reads/writes the auth cookie so the user's session is
 * available on the server.
 *
 * Uses the browser-safe publishable/anon key, RLS in the database protects
 * sensitive data. For privileged server-only operations (writing to
 * admin_actions, bypassing RLS), use lib/supabase/admin.ts.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, that's fine; the middleware
            // handles refreshing the session cookies.
          }
        },
      },
    },
  );
}
