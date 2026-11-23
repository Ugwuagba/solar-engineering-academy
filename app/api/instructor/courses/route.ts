import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Role, CourseStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized: You must be signed in to perform this action." },
        { status: 401 }
      );
    }

    const userRole = session.user.role as string;
    const isInstructor = userRole === "INSTRUCTOR";
    const isAdmin =
      userRole === "SUPER_ADMIN" ||
      userRole === "PROGRAM_ADMIN" ||
      userRole === "ADMIN";

    if (!isInstructor && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Instructor or Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      courseId,
      id,
      title,
      slug,
      code,
      subtitle,
      description,
      level,
      deliveryType,
      contactHours,
      price,
      originalPrice,
      thumbnailUrl,
      promoVideoUrl,
      badge,
      instructorName,
      whatYoullLearn,
      includesList,
      targetAudience,
      requirements,
      modules = [],
      action = "draft", // "draft" | "submit"
      submitForApproval = false,
      publish = false, // Ignored for instructors: cannot directly publish
    } = body;

    const targetId = courseId || id || null;
    const isSubmitting = action === "submit" || Boolean(submitForApproval);

    // 1. Verify Ownership on Update
    let existingCourse = null;
    if (targetId) {
      existingCourse = await prisma.course.findUnique({
        where: { id: targetId },
      });

      if (!existingCourse) {
        return NextResponse.json(
          { error: `Course with ID "${targetId}" not found.` },
          { status: 404 }
        );
      }

      if (isInstructor && existingCourse.instructorId !== session.user.id) {
        return NextResponse.json(
          { error: "Forbidden: You may only modify courses authored by you." },
          { status: 403 }
        );
      }
    }

    // 2. Format / normalize core metadata
    const finalTitle =
      (title && typeof title === "string" ? title.trim() : "") ||
      (isSubmitting ? "Untitled Technical Program" : "Untitled Course Draft");

    let finalSlug =
      slug && typeof slug === "string"
        ? slug
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
        : "";

    if (!finalSlug) {
      finalSlug = `course-${Date.now()}`;
    }

    let finalCode =
      code && typeof code === "string"
        ? code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "")
        : "";

    if (!finalCode) {
      finalCode = `CRS-${Date.now().toString().slice(-6)}`;
    }

    // Check slug collision with other courses
    const slugCollision = await prisma.course.findFirst({
      where: {
        slug: finalSlug,
        ...(targetId ? { NOT: { id: targetId } } : {}),
      },
    });

    if (slugCollision) {
      if (isSubmitting) {
        return NextResponse.json(
          { error: `Slug "/courses/${finalSlug}" is already taken by another course. Please choose a unique slug.` },
          { status: 409 }
        );
      }
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Check code collision with other courses
    const codeCollision = await prisma.course.findFirst({
      where: {
        code: finalCode,
        ...(targetId ? { NOT: { id: targetId } } : {}),
      },
    });

    if (codeCollision) {
      if (isSubmitting) {
        return NextResponse.json(
          { error: `Course Code "${finalCode}" is already in use. Please specify a unique departmental code.` },
          { status: 409 }
        );
      }
      finalCode = `${finalCode}-${Date.now().toString().slice(-4)}`;
    }

    // 3. Status Guard: Instructors can NEVER set PUBLISHED or isPublished: true
    // When submitting for approval -> PENDING_APPROVAL
    // Otherwise -> DRAFT
    const finalStatus: CourseStatus = isSubmitting
      ? CourseStatus.PENDING_APPROVAL
      : CourseStatus.DRAFT;

    const finalIsPublished = false;

    // Resolve instructor attribution
    // For instructors: ALWAYS bind to session.user.id
    // For admins creating on behalf of instructor: keep existing or bind to session
    const finalInstructorId = isInstructor
      ? session.user.id
      : existingCourse?.instructorId || session.user.id;

    const finalInstructorName =
      instructorName && String(instructorName).trim()
        ? String(instructorName).trim()
        : session.user.name || "Lead Instructor";

    // 4. Prepare modules payload
    const modulesCreateData = Array.isArray(modules)
      ? modules.map((m: any, mIdx: number) => ({
          title:
            (m.title && typeof m.title === "string" ? m.title.trim() : "") ||
            `Module ${mIdx + 1}`,
          sortOrder: m.order ?? mIdx + 1,
          description: m.description ? String(m.description).trim() : null,
          lessons: {
            create: Array.isArray(m.lessons)
              ? m.lessons.map((l: any, lIdx: number) => ({
                  title:
                    (l.title && typeof l.title === "string" ? l.title.trim() : "") ||
                    `Lesson ${lIdx + 1}`,
                  sortOrder: l.order ?? lIdx + 1,
                  durationText: l.durationText ? String(l.durationText).trim() : "30m",
                  durationSec: Number(l.durationSec) || 1800,
                  videoUrl: l.videoUrl ? String(l.videoUrl).trim() : "",
                  isFreePreview: Boolean(l.isPreview),
                  downloadableUrl: l.technicalSheetUrl ? String(l.technicalSheetUrl).trim() : null,
                  technicalSheetUrl: l.technicalSheetUrl ? String(l.technicalSheetUrl).trim() : null,
                  contentMarkdown: l.contentMarkdown ? String(l.contentMarkdown) : "",
                }))
              : [],
          },
          ...(m.hasQuiz && m.quiz && m.quiz.title
            ? {
                quiz: {
                  create: {
                    title: String(m.quiz.title).trim(),
                    passingScore: Number(m.quiz.passingScore) || 70,
                    questions: {
                      create: Array.isArray(m.quiz.questions)
                        ? m.quiz.questions
                            .filter((q: any) => q.question && String(q.question).trim().length > 0)
                            .map((q: any) => ({
                              text: String(q.question).trim(),
                              optionsJson: JSON.stringify(
                                Array.isArray(q.options) ? q.options : []
                              ),
                              correctOptionIndex: Number(q.correctOptionIndex) || 0,
                              explanation: q.explanation
                                ? String(q.explanation).trim()
                                : "Assessment rationale verified by Subway Schools curriculum board.",
                            }))
                        : [],
                    },
                  },
                },
              }
            : {}),
        }))
      : [];

    const courseData = {
      title: finalTitle,
      slug: finalSlug,
      code: finalCode,
      subtitle: subtitle ? String(subtitle).trim() : null,
      description: description
        ? String(description).trim()
        : isSubmitting
        ? `Accredited technical program in ${finalTitle}.`
        : "Draft program syllabus in development.",
      level: level || "INTRODUCTORY",
      deliveryType: deliveryType || "SELF_PACED",
      contactHours: Number(contactHours) || 40,
      price: Number(price) || 0,
      originalPrice:
        originalPrice !== "" && originalPrice != null
          ? Number(originalPrice)
          : null,
      status: finalStatus,
      isPublished: finalIsPublished,
      instructorId: finalInstructorId,
      instructorName: finalInstructorName,
      whatYoullLearn: JSON.stringify(
        Array.isArray(whatYoullLearn) ? whatYoullLearn : []
      ),
      includesList: JSON.stringify(
        Array.isArray(includesList) ? includesList : []
      ),
      targetAudience: Array.isArray(targetAudience)
        ? targetAudience.map((item: any) => String(item).trim()).filter(Boolean)
        : [],
      requirements: Array.isArray(requirements)
        ? requirements.map((item: any) => String(item).trim()).filter(Boolean)
        : [],
      thumbnailUrl:
        thumbnailUrl && String(thumbnailUrl).trim().length > 0
          ? String(thumbnailUrl).trim()
          : body.imageUrl && String(body.imageUrl).trim().length > 0
          ? String(body.imageUrl).trim()
          : null,
      promoVideoUrl: promoVideoUrl ? String(promoVideoUrl).trim() : null,
      badge: badge ? String(badge).trim() : null,
    };

    let savedCourse;

    // 5. Database Upsert within transaction
    if (targetId && existingCourse) {
      savedCourse = await prisma.$transaction(async (tx) => {
        // Clear old modules to cleanly replace
        await tx.module.deleteMany({
          where: { courseId: targetId },
        });

        const updated = await tx.course.update({
          where: { id: targetId },
          data: {
            ...courseData,
            modules: {
              create: modulesCreateData,
            },
          },
        });

        if (isSubmitting) {
          await tx.auditLog.create({
            data: {
              actorId: session.user.id,
              action: "COURSE_SUBMITTED_FOR_APPROVAL",
              resource: targetId,
              details: {
                courseId: targetId,
                title: updated.title,
                code: updated.code,
                submittedBy: session.user.id,
                instructorName: finalInstructorName,
                timestamp: new Date().toISOString(),
              },
            },
          });
        }

        return updated;
      });
    } else {
      savedCourse = await prisma.$transaction(async (tx) => {
        const created = await tx.course.create({
          data: {
            ...courseData,
            modules: {
              create: modulesCreateData,
            },
          },
        });

        if (isSubmitting) {
          await tx.auditLog.create({
            data: {
              actorId: session.user.id,
              action: "COURSE_SUBMITTED_FOR_APPROVAL",
              resource: created.id,
              details: {
                courseId: created.id,
                title: created.title,
                code: created.code,
                submittedBy: session.user.id,
                instructorName: finalInstructorName,
                timestamp: new Date().toISOString(),
              },
            },
          });
        }

        return created;
      });
    }

    // 6. Cache Revalidation
    try {
      revalidatePath("/instructor");
      revalidatePath("/program-admin");
      revalidatePath("/program-admin/review-queue");
      revalidatePath("/courses");
      if (savedCourse.slug) {
        revalidatePath(`/courses/${savedCourse.slug}`);
      }
    } catch (e) {
      console.warn("Revalidation warning in instructor course route:", e);
    }

    return NextResponse.json({
      success: true,
      courseId: savedCourse.id,
      slug: savedCourse.slug,
      status: savedCourse.status,
      isPublished: savedCourse.isPublished,
      message: isSubmitting
        ? "Course submitted for Program Admin review and approval!"
        : "Course draft saved successfully.",
    });
  } catch (error: any) {
    console.error("Error in /api/instructor/courses:", error);
    return NextResponse.json(
      { error: "Failed to process course action.", details: error?.message || String(error) },
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

    const userRole = session.user.role as string;
    const isInstructor = userRole === "INSTRUCTOR";
    const isAdmin =
      userRole === "SUPER_ADMIN" ||
      userRole === "PROGRAM_ADMIN" ||
      userRole === "ADMIN";

    if (!isInstructor && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const courses = await prisma.course.findMany({
      where: isInstructor ? { instructorId: session.user.id } : {},
      orderBy: { updatedAt: "desc" },
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

    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch instructor courses.", details: error?.message },
      { status: 500 }
    );
  }
}
