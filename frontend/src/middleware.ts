import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next.js middleware — runs on every request before the page renders.
 *
 * Two jobs:
 *  1. Refresh the Supabase auth session cookie so server components see a
 *     fresh token (Supabase access tokens expire every hour).
 *  2. Gate /admin/* routes — only signed-in staff with an active staff_users
 *     row get through. Everyone else is redirected to /admin/login.
 *
 * To skip middleware on assets / Next.js internals, see the `matcher` config
 * at the bottom.
 */

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Public env (NEXT_PUBLIC_*) is safe to use in middleware.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Gate /admin/* — but allow /admin/login through
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") && path !== "/admin/login") {
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
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything EXCEPT:
     *  - _next/static (built JS/CSS)
     *  - _next/image (image optimizer)
     *  - favicon.ico, robots.txt, sitemap.xml
     *  - public files with extensions (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
