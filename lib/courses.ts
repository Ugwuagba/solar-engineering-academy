import prisma from "@/lib/db";
import { SEED_COURSES, SeedCourse } from "@/lib/seed-data";
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

function mapPrismaCourseToSeedCourse(c: any, seedMatch?: SeedCourse): SeedCourse {
  const whatYouWillLearn = parseJsonArray<string>(
    c.whatYoullLearn,
    seedMatch?.whatYouWillLearn || [
      "Scientific solar PV design according to international IEC/IEEE & Nigerian NEC standards",
      "Sizing battery energy storage systems (BESS) for zero-flicker commercial microgrids",
      "Comprehensive single-line diagrams (SLD) and protective earthing calculations",
      "Hands-on equipment commissioning, hybrid inverter programming, and fault diagnostics",
    ]
  );

  const includes = parseJsonArray<string>(
    c.includesList,
    seedMatch?.includes || [
      `${c.contactHours || 40} Contact Hours of Accredited Technical Training`,
      "Official Subway Schools Accredited Certificate of Completion",
      "Downloadable Technical Calculation Sheets & Handbooks",
      "Official Subway Schools Accredited Certificate",
    ]
  );

  const priceNgn = formatNaira(c.price);
  const originalPriceNgn = c.originalPrice ? formatNaira(c.originalPrice) : seedMatch?.originalPriceNgn;
  const discountPercentage = c.originalPrice && c.originalPrice > c.price
    ? Math.round(((c.originalPrice - c.price) / c.originalPrice) * 100)
    : seedMatch?.discountPercentage;

  return {
    id: c.id,
    code: c.code,
    title: c.title,
    subtitle: c.subtitle || seedMatch?.subtitle || c.description?.slice(0, 150) + "...",
    slug: c.slug,
    description: c.description,
    level: (c.level as "INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED") || "INTRODUCTORY",
    deliveryType: (c.deliveryType as "SELF_PACED" | "COHORT") || "SELF_PACED",
    contactHours: c.contactHours || 40,
    price: c.price,
    originalPrice: c.originalPrice,
    priceNgn,
    originalPriceNgn,
    discountPercentage,
    rating: seedMatch?.rating || 4.9,
    ratingCount: seedMatch?.ratingCount || 120,
    studentsCount: seedMatch?.studentsCount || 850,
    thumbnailImage: c.thumbnailUrl || seedMatch?.thumbnailImage || "/images/courses/course-1-solar-intro.jpg",
    badge: c.badge || seedMatch?.badge || (c.originalPrice ? "Special Offer" : "New Program"),
    instructor: c.instructorName || seedMatch?.instructor || "Engr. Asanga (Certified Solar Professional, 20+ Years Experience)",
    fieldAttachment: seedMatch?.fieldAttachment || "Official Subway Schools Accredited Certificate of Completion",
    isPublished: c.isPublished ?? true,
    whatYouWillLearn,
    requirements: (Array.isArray(c.requirements) && c.requirements.length > 0)
      ? c.requirements
      : parseJsonArray<string>(
          c.requirements,
          seedMatch?.requirements && seedMatch.requirements.length > 0
            ? seedMatch.requirements
            : [
                "Basic understanding of electrical principles (Voltage, Current, Resistance)",
                "A laptop or smartphone for technical calculation simulations",
                "Commitment to complete technical assessments and coursework",
              ]
        ),
    targetAudience: (Array.isArray(c.targetAudience) && c.targetAudience.length > 0)
      ? c.targetAudience
      : parseJsonArray<string>(
          c.targetAudience,
          seedMatch?.targetAudience && seedMatch.targetAudience.length > 0
            ? seedMatch.targetAudience
            : [
                "Electrical engineers, technicians, and installers aiming for commercial EPC mastery",
                "Facility directors and solar business entrepreneurs building high-reliability mini-grids",
              ]
        ),
    includes,
    tools: seedMatch?.tools || [
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
    const dbCourses = await prisma.course.findMany({
      where: {
        OR: [
          { status: "PUBLISHED" },
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
      orderBy: { createdAt: "desc" },
    });

    if (dbCourses && dbCourses.length > 0) {
      return dbCourses.map((c) => {
        const seedMatch = SEED_COURSES.find((s) => s.code === c.code || s.slug === c.slug);
        return {
          ...mapPrismaCourseToSeedCourse(c, seedMatch),
          id: c.id,
        };
      });
    }
    return [];
  } catch (error) {
    console.warn("Prisma query failed:", (error as Error).message);
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<SeedCourse | null> {
  try {
    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug },
          { slug: { startsWith: slug } },
          { id: slug },
          { code: slug },
          ...(slug.toLowerCase().includes("101") ? [{ code: "SI101" }, { slug: "solar-installation-101-6402" }, { slug: "solar-installation-101" }] : []),
          ...(slug.toLowerCase().includes("102") ? [{ code: "SI102" }, { slug: "solar-installation-102" }] : []),
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
      const seedMatch = SEED_COURSES.find((s) => s.code === course.code || s.slug === course.slug);
      return mapPrismaCourseToSeedCourse(course, seedMatch);
    }
  } catch (err) {
    console.error("[getCourseBySlug Error]:", err);
  }

  const normalizedSlug = slug.toLowerCase();
  if (normalizedSlug === "pvol-101" || normalizedSlug === "pvol101" || normalizedSlug === "commercial-industrial-solar") {
    const pvolMatch = SEED_COURSES.find((c) => c.slug === "advance-commercial-solar-training" || c.code === "CIGID201");
    if (pvolMatch) return { ...pvolMatch, slug: "commercial-industrial-solar", code: "CIGID 201", title: "Commercial & Industrial (C&I) Mini-Grid Design" };
  }
  if (normalizedSlug === "bess-201" || normalizedSlug === "bess201") {
    const bessMatch = SEED_COURSES.find((c) => c.slug === "advance-battery-demystified-training" || c.code === "BATT201");
    if (bessMatch) return { ...bessMatch, slug: "bess-201", code: "BESS 201", title: "Battery Energy Storage Systems (BESS) & Safety" };
  }
  if (normalizedSlug === "power-audit-masterclass") {
    const auditMatch = SEED_COURSES.find((c) => c.slug === "solar-installation-101");
    if (auditMatch) return { ...auditMatch, slug: "power-audit-masterclass", code: "AUDIT 201", title: "Solar Power Auditing, Load Profiling & Sizing Masterclass" };
  }
  if (normalizedSlug === "solar-entrepreneurship") {
    const entreMatch = SEED_COURSES.find((c) => c.slug === "solar-fast-track-blueprint");
    if (entreMatch) return { ...entreMatch, slug: "solar-entrepreneurship", code: "ENTRE 301", title: "Solar Business, Contracting & Project Financing" };
  }

  const match = SEED_COURSES.find((c) => c.slug.toLowerCase() === normalizedSlug);
  return match || null;
}
