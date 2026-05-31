import type { MetadataRoute } from "next";

/**
 * Robots policy. While the site is on the staging Vercel alias we still want
 * search engines to discover it once the domain is connected, so this returns
 * an "allow" policy. Switch to a disallow temporarily if you ever need to
 * de-index a draft (e.g., a campaign landing page).
 */
export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://atasteofaffys.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
