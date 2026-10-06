const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, '../backup-neon-data.json');
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
const bData = backup.data || backup;

const courses = bData.Course || [];
const modules = bData.Module || [];
const lessons = bData.Lesson || [];
const quizzes = bData.Quiz || [];
const questions = bData.Question || [];

function formatNaira(amount) {
  return `₦${Number(amount || 0).toLocaleString()}`;
}

const prodSeedCourses = courses.map((c) => {
  const cMods = modules
    .filter((m) => m.courseId === c.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => {
      const mLessons = lessons
        .filter((l) => l.moduleId === m.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((l) => ({
          id: l.id,
          title: l.title,
          sortOrder: l.sortOrder,
          videoUrl: l.videoUrl || "",
          durationSec: l.durationSec || 1800,
          contentMarkdown: "",
          downloadableUrl: l.technicalSheetUrl || l.downloadableUrl || undefined,
          isFreePreview: l.isFreePreview || false,
        }));

      const mQuiz = quizzes.find((q) => q.moduleId === m.id);
      const mQuestions = mQuiz
        ? questions.filter((q) => q.quizId === mQuiz.id)
        : [];

      return {
        title: m.title,
        sortOrder: m.sortOrder,
        lessons: mLessons,
        quiz: {
          title: mQuiz?.title || `${m.title} Assessment`,
          passingScore: mQuiz?.passingScore || 70,
          questions: mQuestions.map((q) => {
            let options = ["Option A", "Option B", "Option C", "Option D"];
            try {
              if (q.optionsJson) options = JSON.parse(q.optionsJson);
            } catch {}
            return {
              text: q.text,
              options,
              correctOptionIndex: q.correctOptionIndex ?? 0,
              explanation: q.explanation || "Verified by curriculum board.",
            };
          }),
        },
      };
    });

  let whatYouWillLearn = [
    "Scientific solar PV design according to international IEC/IEEE & Nigerian NEC standards",
    "Sizing battery energy storage systems (BESS) for continuous operation",
    "Comprehensive single-line diagrams (SLD) and protective earthing calculations",
    "Hands-on equipment commissioning, hybrid inverter programming, and fault diagnostics",
  ];
  try {
    if (c.whatYoullLearn) {
      const parsed = JSON.parse(c.whatYoullLearn);
      if (Array.isArray(parsed) && parsed.length > 0) whatYouWillLearn = parsed;
    }
  } catch {}

  const priceNgn = formatNaira(c.price);
  const originalPriceNgn = c.originalPrice ? formatNaira(c.originalPrice) : undefined;
  const discountPercentage = c.originalPrice && c.originalPrice > c.price
    ? Math.round(((c.originalPrice - c.price) / c.originalPrice) * 100)
    : undefined;

  // Safe thumbnail that avoids embedding megabytes of base64 data in JS bundle
  const thumbnailImage =
    c.thumbnailUrl && c.thumbnailUrl.length < 500 && !c.thumbnailUrl.startsWith("data:")
      ? c.thumbnailUrl
      : "/images/courses/course-1-solar-intro.jpg";

  return {
    id: c.id,
    code: c.code,
    title: c.title,
    subtitle: c.subtitle || (c.description ? c.description.slice(0, 150) + "..." : undefined),
    slug: c.slug,
    description: c.description,
    level: c.level || "INTRODUCTORY",
    deliveryType: c.deliveryType || "SELF_PACED",
    contactHours: c.contactHours || 40,
    price: c.price,
    originalPrice: c.originalPrice || undefined,
    priceNgn,
    originalPriceNgn,
    discountPercentage,
    rating: 4.9,
    ratingCount: 120,
    studentsCount: 850,
    thumbnailImage,
    badge: c.badge || (c.code === "SI101" ? "Bestseller" : "Accredited"),
    instructor: c.instructorName || "Engr. Asanga (Certified Solar Professional, 20+ Years Experience)",
    fieldAttachment: "Official Subway Schools Accredited Certificate of Completion",
    isPublished: true,
    whatYouWillLearn,
    requirements: [
      "Basic understanding of electrical principles (Voltage, Current, Resistance)",
      "A laptop or smartphone for technical calculation simulations",
      "Commitment to complete technical assessments and coursework",
    ],
    targetAudience: [
      "Electrical engineers, technicians, and installers aiming for commercial EPC mastery",
      "Facility directors and solar business entrepreneurs building high-reliability mini-grids",
    ],
    includes: [
      `${c.contactHours || 40} Contact Hours of Accredited Technical Training`,
      "Official Subway Schools Accredited Certificate of Completion",
      "Downloadable Technical Calculation Sheets & Handbooks",
      "Field Attachment & Direct WhatsApp Instructor Mentorship",
    ],
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
    cohorts: [
      {
        name: `${c.code} • October 2026 Active Cohort`,
        startDate: "2026-10-01T00:00:00.000Z",
        endDate: "2026-12-31T23:59:59.000Z",
        maxCapacity: 35,
      },
      {
        name: `${c.code} • Comprehensive Masterclass Cohort`,
        startDate: "2026-10-01T00:00:00.000Z",
        endDate: "2027-01-31T23:59:59.000Z",
        maxCapacity: 40,
      },
    ],
    modules: cMods,
  };
});

const fileHeader = `import type { SeedCourse } from "./seed-data";
import { SEED_COURSES } from "./seed-data";

export const PRODUCTION_COURSES_FALLBACK: SeedCourse[] = ${JSON.stringify(prodSeedCourses, null, 2)};

// Complete catalog fallback with SI101, SI102, SI103 up front followed by curriculum tracks
export const ALL_FALLBACK_COURSES: SeedCourse[] = [
  ...PRODUCTION_COURSES_FALLBACK,
  ...SEED_COURSES.filter(
    (sc) => !PRODUCTION_COURSES_FALLBACK.some((pc) => pc.code === sc.code || pc.slug === sc.slug)
  ),
];
`;

const outputPath = path.join(__dirname, '../lib/fallback-courses.ts');
fs.writeFileSync(outputPath, fileHeader, 'utf8');
console.log('Successfully generated clean lib/fallback-courses.ts without base64 bloat!');
