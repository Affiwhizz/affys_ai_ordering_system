import type { MetadataRoute } from "next";

/**
 * Sitemap for the public site. Add new public pages here as we build them
 * (especially blog posts so Google can index Afro Nation / Portimão / festival
 * content quickly).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://atasteofaffys.com";

  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/menu`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/portimao`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
