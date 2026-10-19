import prisma from "@/lib/db";
import CoursesCatalogClient from "@/components/course/CoursesCatalogClient";
import { PRODUCTION_COURSES_FALLBACK } from "@/lib/fallback-courses";

export const revalidate = 60; // Cache page for 60 seconds

export const metadata = {
  title: "Accredited Solar & Storage Programs | Subway Schools",
  description: "Browse accredited professional solar engineering courses, hands-on field attachments, and energy storage certifications.",
};

function parseFeatures(raw: any): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string" && raw.trim().length > 0) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [raw];
    }
  }
  return [];
}

export default async function CoursesCatalogPage() {
  let courses: any[] = [];

  try {
    const dbCourses = await prisma.course.findMany({
      where: {
        OR: [
          { status: { in: ["PUBLISHED", "published", "ACTIVE", "active", "OPEN", "open"] } },
          { isPublished: true },
        ],
      },
      include: {
        cohorts: {
          orderBy: { startDate: "asc" },
        },
        modules: {
          select: {
            id: true,
            title: true,
            sortOrder: true,
            lessons: {
              select: {
                id: true,
                durationSec: true,
              },
            },
          },
        },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    if (Array.isArray(dbCourses) && dbCourses.length > 0) {
      courses = dbCourses.map((c: any) => {
        try {
          const rawFeatures = c?.features || c?.whatYoullLearn;
          const parsedFeatures = parseFeatures(rawFeatures);
          const features = parsedFeatures.length > 0 ? parsedFeatures : (courseFallbackFeatures(c?.code));

          const formattedPrice = c?.price ? Number(c.price).toLocaleString() : "5,000";
          const priceNgn = `₦${formattedPrice}`;
          const originalPriceNgn = c?.originalPrice ? `₦${Number(c.originalPrice).toLocaleString()}` : undefined;

          const cohorts = c?.cohorts?.map((ch: any) => ({
            id: ch?.id,
            name: ch?.name || "Standard Cohort",
            startDate: ch?.startDate ? new Date(ch.startDate).toISOString() : new Date().toISOString(),
            endDate: ch?.endDate ? new Date(ch.endDate).toISOString() : new Date().toISOString(),
            maxCapacity: ch?.maxCapacity || 30,
          })) || [];

          const modules = c?.modules?.map((m: any, mIdx: number) => ({
            id: m?.id || `m-${mIdx}`,
            title: m?.title || `Module ${mIdx + 1}`,
            sortOrder: m?.sortOrder ?? mIdx + 1,
            lessons: m?.lessons || [],
          })) || [];

          const imageUrl = c?.thumbnailUrl || c?.imageUrl || "/placeholder-course.jpg";

          return {
            id: c?.id || `course-${c?.code || Math.random()}`,
            code: c?.code || "SI100",
            title: c?.title || "Solar Engineering Program",
            subtitle: c?.subtitle || (c?.description ? c.description.slice(0, 150) + "..." : ""),
            slug: c?.slug || c?.code?.toLowerCase() || "course",
            description: c?.description || "",
            level: c?.level || "INTRODUCTORY",
            deliveryType: c?.deliveryType || "SELF_PACED",
            mode: c?.deliveryType || "SELF_PACED",
            contactHours: c?.contactHours || 40,
            hours: c?.contactHours || 40,
            price: c?.price !== undefined && !isNaN(Number(c.price)) ? Number(c.price) : 5000,
            priceNgn,
            tuitionFee: priceNgn,
            originalPriceNgn,
            rating: 4.9,
            ratingCount: 120,
            thumbnailUrl: imageUrl,
            thumbnailImage: imageUrl,
            imageUrl: imageUrl,
            badge: c?.badge || (c?.originalPrice ? "Special Offer" : "Accredited"),
            instructor: c?.instructorName || "Engr. Asanga (Certified Solar Professional)",
            instructorName: c?.instructorName || "Engr. Asanga (Certified Solar Professional)",
            fieldAttachment: "Official Accredited Certificate",
            isPublished: c?.isPublished ?? true,
            cohorts,
            modules,
            modulesCount: c?.modules?.length || 0,
            features,
            whatYouWillLearn: features,
          };
        } catch (itemError) {
          console.error("[COURSES_PAGE_ERROR]: Error processing course record:", itemError);
          return null;
        }
      }).filter(Boolean);
    }
  } catch (error) {
    console.error("[COURSES_PAGE_ERROR]:", error);
  }

  // Graceful fallback to verified course catalog if database returns no records or encounters an error
  if (!courses || courses.length === 0) {
    try {
      courses = (PRODUCTION_COURSES_FALLBACK || []).map((c) => ({
        ...c,
        imageUrl: c.imageUrl || c.thumbnailUrl || c.thumbnailImage || "/placeholder-course.jpg",
        description: c.description || "",
        priceNgn: `₦${c.price ? Number(c.price).toLocaleString() : "5,000"}`,
        cohorts: c.cohorts?.map((ch: any) => ({ ...ch })) || [],
        modulesCount: c.modules?.length || 0,
        features: c.whatYouWillLearn || [],
      }));
    } catch (fallbackError) {
      console.error("[COURSES_PAGE_ERROR]: Fallback catalog error:", fallbackError);
      courses = [];
    }
  }

  return <CoursesCatalogClient initialCourses={courses} />;
}

function courseFallbackFeatures(code?: string): string[] {
  if (code === "SI101") {
    return [
      "Introduction to photovoltaic cells, solar radiation, and standard test conditions",
      "DC & AC electrical safety, protective personal equipment, and hazard mitigation",
      "Hands-on multimeter testing, circuit continuity, and array wiring best practices",
    ];
  }
  if (code === "SI102") {
    return [
      "Scientific load profiling, surge factor derating, and battery autonomy sizing",
      "Charge controller matching (PWM vs MPPT) and maximum power point tracking",
      "Off-grid and grid-interactive system commissioning and failure diagnosis",
    ];
  }
  return [
    "Master scientific solar PV design according to international standards",
    "Sizing battery energy storage systems (BESS) for continuous operation",
    "Equipment commissioning, hybrid inverter programming, and fault diagnostics",
  ];
}

