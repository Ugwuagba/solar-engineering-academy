import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.subwayschools.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/program-admin",
          "/super-admin",
          "/instructor",
          "/lp-admin",
          "/api",
          "/dashboard",
          "/classroom",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

