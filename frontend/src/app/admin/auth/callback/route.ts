import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Magic-link callback handler.
 *
 * Supabase redirects here after a user clicks the sign-in link in their
 * email. We exchange the `code` query param for an auth session (which
 * sets the auth cookie), then redirect to `?next=` (or /admin by default).
 *
 * Note: the middleware will further verify the user has an active
 * staff_users row before they actually see any admin pages.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  // Anything else: redirect to login with a generic error
  return NextResponse.redirect(
    new URL("/admin/login?error=callback-failed", url.origin),
  );
}
