import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Magic-link callback handler.
 *
 * Supabase redirects here after a user clicks the sign-in link in their
 * email, with a `code` query param. We exchange that code for a session and
 *, crucially, write the resulting auth cookies directly onto the redirect
 * response we return, so the session survives the redirect to /admin.
 *
 * (An earlier version set cookies via next/headers, which didn't reliably
 * attach them to the redirect, causing an endless bounce back to /login.)
 *
 * The proxy then verifies the user has an active staff_users row before any
 * admin page renders.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/admin";

  const fail = () =>
    NextResponse.redirect(new URL("/admin/login?error=callback-failed", url.origin));

  if (!code) return fail();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) return fail();

  // The response we'll return on success, auth cookies get written onto it.
  const response = NextResponse.redirect(new URL(next, url.origin));

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return fail();

  return response;
}
