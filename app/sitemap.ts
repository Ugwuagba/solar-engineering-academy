import type { MetadataRoute } from "next";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.subwayschools.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/courses`, lastModified: new Date() },
    { url: `${baseUrl}/lp/solar`, lastModified: new Date() },
    { url: `${baseUrl}/terms-of-attachment`, lastModified: new Date() },
    { url: `${baseUrl}/certificate-verification`, lastModified: new Date() },
    { url: `${baseUrl}/hse-protocol`, lastModified: new Date() },
  ];

  let courseRoutes: MetadataRoute.Sitemap = [];
  try {
    const publishedCourses = await prisma.course.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    courseRoutes = publishedCourses
      .filter((c) => c.slug && c.slug.trim().length > 0)
      .map((course) => ({
        url: `${baseUrl}/courses/${course.slug}`,
        lastModified: course.updatedAt || new Date(),
      }));
  } catch (error) {
    console.error("[Sitemap]: Failed to fetch published courses:", error);
  }

  return [...staticRoutes, ...courseRoutes];
}

