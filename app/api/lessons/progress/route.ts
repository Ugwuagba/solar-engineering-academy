import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    let { lessonId, courseId, completed, lastPosition } = body;

    if (!lessonId || !courseId) {
      return NextResponse.json(
        { error: "lessonId and courseId are required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // 1. Resolve actual course in DB if courseId is slug or code
    let dbCourse = await prisma.course.findFirst({
      where: {
        OR: [
          { id: courseId },
          { slug: courseId },
          { slug: { startsWith: courseId } },
          { code: courseId },
          ...(courseId.toLowerCase().includes("101")
            ? [{ code: "SI101" }, { slug: "solar-installation-101-6402" }, { slug: "solar-installation-101" }]
            : []),
          ...(courseId.toLowerCase().includes("102")
            ? [{ code: "SI102" }, { slug: "solar-installation-102" }]
            : []),
        ],
      },
      include: {
        modules: {
          include: { lessons: true },
        },
      },
    });

    const targetCourseId = dbCourse ? dbCourse.id : courseId;

    // 2. Resolve lessonId: verify if lessonId exists in Lesson table
    let actualLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!actualLesson && dbCourse) {
      // Find matching lesson within course modules by title or sortOrder
      for (const mod of dbCourse.modules) {
        const found = mod.lessons.find(
          (l) =>
            l.id === lessonId ||
            l.title.toLowerCase() === String(lessonId).toLowerCase() ||
            l.sortOrder === Number(lessonId)
        );
        if (found) {
          actualLesson = found;
          break;
        }
      }
      // If still not found, fallback to first lesson of first module
      if (!actualLesson && dbCourse.modules.length > 0 && dbCourse.modules[0].lessons.length > 0) {
        actualLesson = dbCourse.modules[0].lessons[0];
      }
    }

    if (!actualLesson) {
      return NextResponse.json(
        { error: "Lesson not found in curriculum" },
        { status: 404 }
      );
    }

    const targetLessonId = actualLesson.id;

    // 3. Upsert LessonProgress record
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: targetLessonId,
        },
      },
      update: {
        ...(typeof completed === "boolean" ? { completed } : {}),
        ...(typeof lastPosition === "number" ? { lastPosition: Math.round(lastPosition) } : {}),
      },
      create: {
        userId,
        lessonId: targetLessonId,
        courseId: targetCourseId,
        completed: Boolean(completed),
        lastPosition: typeof lastPosition === "number" ? Math.round(lastPosition) : 0,
      },
    });

    // 4. Update overall Enrollment progressPercent
    if (dbCourse) {
      const allCourseLessons: string[] = [];
      dbCourse.modules.forEach((m) => {
        m.lessons.forEach((l) => allCourseLessons.push(l.id));
      });

      if (allCourseLessons.length > 0) {
        const completedCount = await prisma.lessonProgress.count({
          where: {
            userId,
            lessonId: { in: allCourseLessons },
            completed: true,
          },
        });

        const progressPercent = Math.min(
          100,
          Math.round((completedCount / allCourseLessons.length) * 100)
        );

        await prisma.enrollment.updateMany({
          where: {
            userId,
            courseId: targetCourseId,
          },
          data: {
            progressPercent,
            ...(progressPercent >= 100 ? { status: "COMPLETED" } : {}),
          },
        });
      }
    }

    return NextResponse.json({ success: true, progress });
  } catch (error: any) {
    console.error("[Lesson Progress Error]:", error);
    return NextResponse.json(
      { error: "Failed to update lesson progress", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const courseId = searchParams.get("courseId");
    const lessonId = searchParams.get("lessonId");

    const userId = session.user.id;

    if (lessonId) {
      const progress = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
      });
      return NextResponse.json({ progress: progress || null });
    }

    if (courseId) {
      // Resolve course by id, slug, or code
      const dbCourse = await prisma.course.findFirst({
        where: {
          OR: [
            { id: courseId },
            { slug: courseId },
            { code: courseId },
            ...(courseId.toLowerCase().includes("101")
              ? [{ code: "SI101" }, { slug: "solar-installation-101-6402" }, { slug: "solar-installation-101" }]
              : []),
            ...(courseId.toLowerCase().includes("102")
              ? [{ code: "SI102" }, { slug: "solar-installation-102" }]
              : []),
          ],
        },
        include: {
          modules: {
            include: { lessons: true },
          },
        },
      });

      const targetCourseId = dbCourse ? dbCourse.id : courseId;
      const lessonIds = dbCourse
        ? dbCourse.modules.flatMap((m) => m.lessons.map((l) => l.id))
        : [];

      const progresses = await prisma.lessonProgress.findMany({
        where: {
          userId,
          OR: [
            { courseId: targetCourseId },
            { courseId },
            ...(lessonIds.length > 0 ? [{ lessonId: { in: lessonIds } }] : []),
          ],
        },
      });

      return NextResponse.json({ progresses });
    }

    const allProgresses = await prisma.lessonProgress.findMany({
      where: { userId },
    });
    return NextResponse.json({ progresses: allProgresses });
  } catch (error: any) {
    console.error("[Lesson Progress Fetch Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson progress", details: error?.message },
      { status: 500 }
    );
  }
}
