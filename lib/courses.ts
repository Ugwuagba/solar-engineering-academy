import prisma from "@/lib/db";
import { SEED_COURSES, SeedCourse } from "@/lib/seed-data";

export async function getAllCourses(): Promise<SeedCourse[]> {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
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

    if (courses && courses.length > 0) {
      return courses.map((c) => {
        const seedMatch = SEED_COURSES.find((s) => s.code === c.code);
        return {
          code: c.code,
          title: c.title,
          slug: c.slug,
          description: c.description,
          level: c.level as "INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED",
          deliveryType: c.deliveryType as "SELF_PACED" | "COHORT",
          contactHours: c.contactHours,
          price: c.price,
          isPublished: c.isPublished,
          tools: seedMatch?.tools || [],
          cohorts: c.cohorts.map((ch) => ({
            name: ch.name,
            startDate: ch.startDate.toISOString(),
            endDate: ch.endDate.toISOString(),
            maxCapacity: ch.maxCapacity,
          })),
          modules: c.modules.map((m) => ({
            title: m.title,
            sortOrder: m.sortOrder,
            lessons: m.lessons.map((l) => ({
              title: l.title,
              sortOrder: l.sortOrder,
              videoUrl: l.videoUrl || "",
              durationSec: l.durationSec,
              contentMarkdown: l.contentMarkdown,
              downloadableUrl: l.downloadableUrl || undefined,
              isFreePreview: l.isFreePreview,
            })),
            quiz: {
              title: m.quiz?.title || "Module Quiz",
              passingScore: m.quiz?.passingScore || 70,
              questions: (m.quiz?.questions || []).map((q) => ({
                text: q.text,
                options: JSON.parse(q.optionsJson || "[]"),
                correctOptionIndex: q.correctOptionIndex,
                explanation: q.explanation,
              })),
            },
          })),
        };
      });
    }
  } catch (error) {
    // Database connection not initialized or offline - fallback gracefully to seed data
    console.warn("Prisma query failed, serving seed curriculum data:", (error as Error).message);
  }

  return SEED_COURSES;
}

export async function getCourseBySlug(slug: string): Promise<SeedCourse | null> {
  try {
    const course = await prisma.course.findUnique({
      where: { slug },
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
      const seedMatch = SEED_COURSES.find((s) => s.code === course.code);
      return {
        code: course.code,
        title: course.title,
        slug: course.slug,
        description: course.description,
        level: course.level as "INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED",
        deliveryType: course.deliveryType as "SELF_PACED" | "COHORT",
        contactHours: course.contactHours,
        price: course.price,
        isPublished: course.isPublished,
        tools: seedMatch?.tools || [],
        cohorts: course.cohorts.map((ch) => ({
          name: ch.name,
          startDate: ch.startDate.toISOString(),
          endDate: ch.endDate.toISOString(),
          maxCapacity: ch.maxCapacity,
        })),
        modules: course.modules.map((m) => ({
          title: m.title,
          sortOrder: m.sortOrder,
          lessons: m.lessons.map((l) => ({
            title: l.title,
            sortOrder: l.sortOrder,
            videoUrl: l.videoUrl || "",
            durationSec: l.durationSec,
            contentMarkdown: l.contentMarkdown,
            downloadableUrl: l.downloadableUrl || undefined,
            isFreePreview: l.isFreePreview,
          })),
          quiz: {
            title: m.quiz?.title || "Module Quiz",
            passingScore: m.quiz?.passingScore || 70,
            questions: (m.quiz?.questions || []).map((q) => ({
              text: q.text,
              options: JSON.parse(q.optionsJson || "[]"),
              correctOptionIndex: q.correctOptionIndex,
              explanation: q.explanation,
            })),
          },
        })),
      };
    }
  } catch {
    // Fall back to seed data
  }

  const match = SEED_COURSES.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  return match || null;
}
