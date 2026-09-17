import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { SEED_COURSES } from "@/lib/seed-data";
import CourseStudioForm from "@/components/admin/CourseStudioForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: Props) {
  // 1. Authentication & Role Check
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    const { id } = await params;
    redirect(`/login?callbackUrl=/admin/courses/${id}/edit`);
  }

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "INSTRUCTOR" && (role as string) !== "DIRECTOR") {
    redirect("/dashboard");
  }

  const { id } = await params;
  if (!id) {
    redirect("/admin");
  }

  let course: any = null;

  // 2. Fetch course from Prisma by ID
  try {
    course = await prisma.course.findUnique({
      where: { id },
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
      },
    });

    // Fallback: check by slug
    if (!course) {
      course = await prisma.course.findUnique({
        where: { slug: id },
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
        },
      });
    }
  } catch (error) {
    console.error("Error loading course from database:", error);
  }

  // 3. Fallback to SEED_COURSES if course not in DB (e.g. initial seed inventory item)
  if (!course) {
    const seed = SEED_COURSES.find((s) => s.slug === id || s.code === id || s.code.toLowerCase() === id.toLowerCase());
    if (seed) {
      const parsedOriginalPrice = seed.originalPriceNgn
        ? Number(seed.originalPriceNgn.replace(/[^0-9]/g, ""))
        : 120000;

      course = {
        id: seed.code.toLowerCase(),
        code: seed.code,
        title: seed.title,
        slug: seed.slug,
        subtitle: seed.subtitle || seed.description,
        description: seed.description,
        level: seed.level,
        deliveryType: seed.deliveryType || "SELF_PACED",
        contactHours: seed.contactHours || 40,
        price: seed.price || 75000,
        originalPrice: parsedOriginalPrice,
        thumbnailUrl: seed.thumbnailImage || "/images/hero/hero-commercial.jpg",
        badge: seed.badge || "Industry Accredited",
        instructorName: seed.instructor || "Engr. Asanga",
        whatYoullLearn: JSON.stringify(seed.whatYouWillLearn || []),
        includesList: JSON.stringify(seed.includes || []),
        status: "PUBLISHED",
        modules: (seed.modules || []).map((m, mIdx) => ({
          id: `seed-mod-${mIdx + 1}`,
          title: m.title,
          description: "",
          sortOrder: m.sortOrder || mIdx + 1,
          lessons: (m.lessons || []).map((l, lIdx) => ({
            id: `seed-les-${mIdx + 1}-${lIdx + 1}`,
            title: l.title,
            durationText: `${Math.round((l.durationSec || 1800) / 60)}m`,
            videoUrl: l.videoUrl || "",
            isFreePreview: Boolean(l.isFreePreview),
            technicalSheetUrl: l.downloadableUrl || "",
          })),
          quiz: m.quiz
            ? {
                title: m.quiz.title,
                passingScore: m.quiz.passingScore || 70,
                questions: (m.quiz.questions || []).map((q, qIdx) => ({
                  id: `seed-q-${qIdx + 1}`,
                  question: q.text,
                  options: q.options || [],
                  correctOptionIndex: q.correctOptionIndex || 0,
                  explanation: q.explanation || "",
                })),
              }
            : null,
        })),
      };
    }
  }

  if (!course) {
    redirect("/admin");
  }

  // Ensure dates are stringified if serialized to client component
  const serializedCourse = {
    ...course,
    createdAt: course.createdAt ? course.createdAt.toString() : null,
    updatedAt: course.updatedAt ? course.updatedAt.toString() : null,
  };

  return <CourseStudioForm initialCourse={serializedCourse} mode="edit" />;
}
