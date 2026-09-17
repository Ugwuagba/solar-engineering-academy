import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Authorization: require ADMIN, INSTRUCTOR, or DIRECTOR
    const role = session?.user?.role;
    if (!session?.user || (role !== "ADMIN" && role !== "INSTRUCTOR" && (role as string) !== "DIRECTOR")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin or Instructor privileges required." },
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
      modules = [],
      publish = false,
    } = body;

    const targetId = courseId || id || null;
    const isPublishing = Boolean(publish);

    // 2. Format / normalize core metadata
    const finalTitle = (title && typeof title === "string" ? title.trim() : "") || (isPublishing ? "Untitled Course" : "Untitled Course Draft");
    
    // Generate or clean slug
    let finalSlug = slug && typeof slug === "string" 
      ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
      : "";
    if (!finalSlug) {
      finalSlug = `draft-${Date.now()}`;
    }

    // Generate or clean code
    let finalCode = code && typeof code === "string"
      ? code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "")
      : "";
    if (!finalCode) {
      finalCode = `DFT-${Date.now().toString().slice(-6)}`;
    }

    // Resolve instructor user ID
    let instructorId: string | undefined = session?.user?.id;
    if (!instructorId) {
      const defaultAdmin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });
      if (defaultAdmin) instructorId = defaultAdmin.id;
    }

    // Check slug collision with other courses
    const slugCollision = await prisma.course.findFirst({
      where: {
        slug: finalSlug,
        ...(targetId ? { NOT: { id: targetId } } : {}),
      },
    });
    if (slugCollision) {
      if (isPublishing) {
        return NextResponse.json(
          { error: `Slug "${finalSlug}" is already taken by another course. Please choose a unique slug.` },
          { status: 409 }
        );
      }
      // For drafts, auto-disambiguate slug with unique suffix
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
      if (isPublishing) {
        return NextResponse.json(
          { error: `Code "${finalCode}" is already in use by another course. Please choose a unique code.` },
          { status: 409 }
        );
      }
      // For drafts, auto-disambiguate code
      finalCode = `${finalCode}-${Date.now().toString().slice(-4)}`;
    }

    // Prepare modules payload
    const modulesCreateData = Array.isArray(modules)
      ? modules.map((m: any, mIdx: number) => ({
          title: (m.title && typeof m.title === "string" ? m.title.trim() : "") || `Module ${mIdx + 1}`,
          sortOrder: m.order ?? mIdx + 1,
          description: m.description ? String(m.description).trim() : null,
          lessons: {
            create: Array.isArray(m.lessons)
              ? m.lessons.map((l: any, lIdx: number) => ({
                  title: (l.title && typeof l.title === "string" ? l.title.trim() : "") || `Lesson ${lIdx + 1}`,
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
          ...(m.hasQuiz && m.quiz && m.quiz.title ? {
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
                          optionsJson: JSON.stringify(Array.isArray(q.options) ? q.options : []),
                          correctOptionIndex: Number(q.correctOptionIndex) || 0,
                          explanation: q.explanation ? String(q.explanation).trim() : "Curriculum Assessment",
                        }))
                    : [],
                },
              },
            },
          } : {}),
        }))
      : [];

    const courseData = {
      title: finalTitle,
      slug: finalSlug,
      code: finalCode,
      subtitle: subtitle ? String(subtitle).trim() : null,
      description: description ? String(description).trim() : (isPublishing ? "Accredited technical program." : "Draft program syllabus."),
      level: level || "INTRODUCTORY",
      deliveryType: deliveryType || "SELF_PACED",
      contactHours: Number(contactHours) || 40,
      price: Number(price) || 0,
      originalPrice: originalPrice !== "" && originalPrice != null ? Number(originalPrice) : null,
      status: isPublishing ? "PUBLISHED" : "DRAFT",
      isPublished: isPublishing,
      instructorId: instructorId || null,
      instructorName: instructorName ? String(instructorName).trim() : "Engr. Asanga",
      whatYoullLearn: JSON.stringify(Array.isArray(whatYoullLearn) ? whatYoullLearn : []),
      includesList: JSON.stringify(Array.isArray(includesList) ? includesList : []),
      thumbnailUrl: thumbnailUrl || "/images/hero/hero-commercial.jpg",
      promoVideoUrl: promoVideoUrl ? String(promoVideoUrl).trim() : null,
      badge: badge ? String(badge).trim() : null,
    };

    let savedCourse;

    // 3. Update existing course or create new
    if (targetId) {
      const existing = await prisma.course.findUnique({
        where: { id: targetId },
      });

      if (existing) {
        // Remove existing modules to cleanly replace with incoming modules structure
        await prisma.module.deleteMany({
          where: { courseId: existing.id },
        });

        savedCourse = await prisma.course.update({
          where: { id: existing.id },
          data: {
            ...courseData,
            modules: {
              create: modulesCreateData,
            },
          },
        });
      }
    }

    if (!savedCourse) {
      savedCourse = await prisma.course.create({
        data: {
          ...courseData,
          modules: {
            create: modulesCreateData,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      courseId: savedCourse.id,
      slug: savedCourse.slug,
      status: savedCourse.status,
      isPublished: savedCourse.isPublished,
      message: isPublishing ? "Course published to live catalog successfully" : "Draft saved successfully",
    });
  } catch (error: any) {
    console.error("Error saving course draft:", error);
    return NextResponse.json(
      { error: "Failed to save draft", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
