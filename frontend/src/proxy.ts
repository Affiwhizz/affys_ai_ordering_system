import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next.js proxy, runs before a request reaches the page.
 * (In Next.js 16 this replaces the old `middleware` file convention.)
 *
 * Design rule: the PUBLIC site must never depend on Supabase. Only the
 * /admin area is gated. So we bail out immediately for every public route
 * and only touch Supabase when the request is actually for /admin. That way
 * a missing env var or a Supabase outage can never take down the homepage , 
 * worst case, admin sign-in is briefly unavailable.
 *
 * Job (admin routes only):
 *  1. Refresh the Supabase auth session cookie.
 *  2. Gate /admin/*, only signed-in staff with an active staff_users row
 *     get through. Everyone else is redirected to /admin/login.
 */

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes: do nothing, never touch Supabase.
  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  // The login page itself must stay reachable without a session.
  if (path === "/admin/login") {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Supabase renamed "anon key" to "publishable key", accept either name.
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // If Supabase isn't configured on this deployment, send admin traffic to
  // the login page rather than crashing with a 500.
  if (!supabaseUrl || !supabaseAnonKey) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "not-configured");
    return NextResponse.redirect(url);
  }

  try {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }

    // Check active staff row
    const { data: staff } = await supabase
      .from("staff_users")
      .select("is_active")
      .eq("id", user.id)
      .single();

    if (!staff?.is_active) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "not-staff");
      return NextResponse.redirect(url);
    }

    return response;
  } catch {
    // Any auth/network failure: fail safe to the login page, never 500.
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "auth-error");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Run only on /admin routes. (The public site is intentionally excluded
     * so it never depends on Supabase or auth.)
     */
    "/admin/:path*",
  ],
};
