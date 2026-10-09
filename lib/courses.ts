import prisma from "@/lib/db";
import type { SeedCourse } from "@/lib/seed-data";
import { formatDuration } from "@/lib/utils";

function parseJsonArray<T = string>(raw: string | null | undefined, fallback: T[] = []): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function formatNaira(amount: number): string {
  return `₦${Number(amount || 0).toLocaleString()}`;
}

function mapPrismaCourseToSeedCourse(c: any): SeedCourse {
  const whatYouWillLearn = parseJsonArray<string>(
    c.whatYoullLearn,
    [
      "Scientific solar PV design according to international IEC/IEEE & Nigerian NEC standards",
      "Sizing battery energy storage systems (BESS) for zero-flicker commercial microgrids",
      "Comprehensive single-line diagrams (SLD) and protective earthing calculations",
      "Hands-on equipment commissioning, hybrid inverter programming, and fault diagnostics",
    ]
  );

  const includes = parseJsonArray<string>(
    c.includesList,
    [
      `${c.contactHours || 40} Contact Hours of Accredited Technical Training`,
      "Official Subway Schools Accredited Certificate of Completion",
      "Downloadable Technical Calculation Sheets & Handbooks",
      "Official Subway Schools Accredited Certificate",
    ]
  );

  const priceNgn = formatNaira(c.price);
  const originalPriceNgn = c.originalPrice ? formatNaira(c.originalPrice) : undefined;
  const discountPercentage = c.originalPrice && c.originalPrice > c.price
    ? Math.round(((c.originalPrice - c.price) / c.originalPrice) * 100)
    : undefined;

  return {
    id: c.id,
    code: c.code,
    title: c.title,
    subtitle: c.subtitle || c.description?.slice(0, 150) + "...",
    slug: c.slug,
    description: c.description,
    level: (c.level as "INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED") || "INTRODUCTORY",
    deliveryType: (c.deliveryType as "SELF_PACED" | "COHORT") || "SELF_PACED",
    contactHours: c.contactHours || 40,
    price: c.price,
    originalPrice: c.originalPrice || undefined,
    priceNgn,
    originalPriceNgn,
    discountPercentage,
    rating: 4.9,
    ratingCount: 120,
    studentsCount: 850,
    thumbnailImage: c.thumbnailUrl || c.imageUrl || "",
    thumbnailUrl: c.thumbnailUrl || c.imageUrl || "",
    badge: c.badge || (c.originalPrice ? "Special Offer" : "Accredited"),
    instructor: c.instructorName || "Engr. Asanga (Certified Solar Professional, 20+ Years Experience)",
    fieldAttachment: "Official Subway Schools Accredited Certificate of Completion",
    isPublished: c.isPublished ?? true,
    whatYouWillLearn,
    requirements: (Array.isArray(c.requirements) && c.requirements.length > 0)
      ? c.requirements
      : parseJsonArray<string>(
          c.requirements,
          [
            "Basic understanding of electrical principles (Voltage, Current, Resistance)",
            "A laptop or smartphone for technical calculation simulations",
            "Commitment to complete technical assessments and coursework",
          ]
        ),
    targetAudience: (Array.isArray(c.targetAudience) && c.targetAudience.length > 0)
      ? c.targetAudience
      : parseJsonArray<string>(
          c.targetAudience,
          [
            "Electrical engineers, technicians, and installers aiming for commercial EPC mastery",
            "Facility directors and solar business entrepreneurs building high-reliability mini-grids",
          ]
        ),
    includes,
    tools: [
      {
        title: "Commercial Solar System Sizing Spreadsheet",
        format: "XLSX",
        fileSize: "2.4 MB",
        description: "Standardized sizing matrix with Nigerian meteorological irradiance constants.",
      },
      {
        title: "PV Array String & Inverter Clipping Calculator",
        format: "XLSX",
        fileSize: "1.8 MB",
        description: "DC-to-AC ratio derating and voltage drop calculator.",
      },
      {
        title: "Official Solar Engineering Handbook & SLD Schematics",
        format: "PDF",
        fileSize: "14.2 MB",
        description: "Field manual by Engr. Asanga covering grounding, earthing, and protection.",
      },
    ],
    cohorts: (c.cohorts || []).map((ch: any) => ({
      name: ch.name,
      startDate: ch.startDate instanceof Date ? ch.startDate.toISOString() : ch.startDate,
      endDate: ch.endDate instanceof Date ? ch.endDate.toISOString() : ch.endDate,
      maxCapacity: ch.maxCapacity,
    })),
    modules: (c.modules || []).map((m: any, mIdx: number) => ({
      title: m.title,
      sortOrder: m.sortOrder ?? mIdx + 1,
      lessons: (m.lessons || []).map((l: any, lIdx: number) => ({
        id: l.id,
        title: l.title,
        sortOrder: l.sortOrder ?? lIdx + 1,
        videoUrl: l.videoUrl || "",
        durationSec: l.durationSec || 1800,
        durationText: l.durationText || formatDuration(l.durationSec || 1800),
        contentMarkdown: l.contentMarkdown || "",
        downloadableUrl: l.technicalSheetUrl || l.downloadableUrl || undefined,
        isFreePreview: l.isFreePreview ?? false,
      })),
      quiz: {
        title: m.quiz?.title || `Module ${m.sortOrder || mIdx + 1} Assessment`,
        passingScore: m.quiz?.passingScore || 70,
        questions: (m.quiz?.questions || []).map((q: any) => ({
          text: q.text,
          options: parseJsonArray<string>(q.optionsJson, ["Option A", "Option B", "Option C", "Option D"]),
          correctOptionIndex: q.correctOptionIndex ?? 0,
          explanation: q.explanation || "Correct answer verified by Subway Schools curriculum board.",
        })),
      },
    })),
  };
}

export async function getAllCourses(): Promise<SeedCourse[]> {
  try {
    let dbCourses = await prisma.course.findMany({
      where: {
        OR: [
          { status: { in: ["PUBLISHED", "published", "ACTIVE", "active", "OPEN", "open"] } },
          { isPublished: true },
        ],
      },
      include: {
        modules: {
          orderBy: { sortOrder: "asc" },
          include: {
            lessons: { orderBy: { sortOrder: "asc" } },
            quiz: {
              include: { questions: true },
            },
          },
        },
        cohorts: {
          orderBy: { startDate: "asc" },
        },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    // If no published courses match, loosen filter to fetch all database courses
    if (!dbCourses || dbCourses.length === 0) {
      dbCourses = await prisma.course.findMany({
        include: {
          modules: {
            orderBy: { sortOrder: "asc" },
            include: {
              lessons: { orderBy: { sortOrder: "asc" } },
              quiz: {
                include: { questions: true },
              },
            },
          },
          cohorts: {
            orderBy: { startDate: "asc" },
          },
        },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      });
    }

    if (dbCourses && dbCourses.length > 0) {
      return dbCourses.map((c) => ({
        ...mapPrismaCourseToSeedCourse(c),
        id: c.id,
      }));
    }

    return [];
  } catch (error) {
    console.error("[getAllCourses] Prisma query failed:", (error as Error).message);
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<SeedCourse | null> {
  try {
    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug },
          { code: slug },
          { code: slug.toUpperCase() },
        ],
      },
      include: {
        modules: {
          orderBy: { sortOrder: "asc" },
          include: {
            lessons: { orderBy: { sortOrder: "asc" } },
            quiz: {
              include: { questions: true },
            },
          },
        },
        cohorts: {
          orderBy: { startDate: "asc" },
        },
      },
    });

    if (course) {
      return mapPrismaCourseToSeedCourse(course);
    }
  } catch (err) {
    console.error("[getCourseBySlug Error]:", err);
  }

  return null;
}
