import prisma from "@/lib/db";
import CoursesCatalogClient from "@/components/course/CoursesCatalogClient";

export const revalidate = 60; // Cache page for 60 seconds

export const metadata = {
  title: "Accredited Solar & Storage Programs | Subway Schools",
  description: "Browse accredited professional solar engineering courses, hands-on field attachments, and energy storage certifications.",
};

export default async function CoursesCatalogPage() {
  let dbCourses: any[] = [];
  try {
    dbCourses = await prisma.course.findMany({
      where: {
        OR: [
          { status: { in: ["PUBLISHED", "published", "ACTIVE", "active", "OPEN", "open"] } },
          { isPublished: true },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        code: true,
        subtitle: true,
        description: true,
        level: true,
        deliveryType: true,
        contactHours: true,
        price: true,
        originalPrice: true,
        thumbnailUrl: true,
        badge: true,
        instructorName: true,
        order: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.error("[CoursesCatalogPage] Prisma query failed:", err);
  }

  const courses = (dbCourses || []).map((c: any) => {
    const priceNgn = `₦${Number(c.price || 0).toLocaleString()}`;
    const originalPriceNgn = c.originalPrice ? `₦${Number(c.originalPrice).toLocaleString()}` : undefined;

    return {
      id: c.id,
      code: c.code,
      title: c.title,
      subtitle: c.subtitle || (c.description ? c.description.slice(0, 150) + "..." : ""),
      slug: c.slug,
      description: c.description || "",
      level: c.level || "INTRODUCTORY",
      deliveryType: c.deliveryType || "SELF_PACED",
      mode: c.deliveryType || "SELF_PACED",
      contactHours: c.contactHours || 40,
      hours: c.contactHours || 40,
      price: c.price,
      priceNgn,
      tuitionFee: priceNgn,
      originalPriceNgn,
      rating: 4.9,
      ratingCount: 120,
      thumbnailUrl: c.thumbnailUrl || "",
      thumbnailImage: c.thumbnailUrl || "",
      imageUrl: c.thumbnailUrl || "",
      badge: c.badge || (c.originalPrice ? "Special Offer" : "Accredited"),
      instructor: c.instructorName || "Engr. Asanga (Certified Solar Professional)",
      instructorName: c.instructorName || "Engr. Asanga (Certified Solar Professional)",
      fieldAttachment: "Official Accredited Certificate",
      isPublished: true,
    };
  });

  return <CoursesCatalogClient initialCourses={courses} />;
}
