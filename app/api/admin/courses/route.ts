import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

const questionSchema = z.object({
  question: z.string().min(1, "Question prompt is required"),
  options: z.array(z.string().min(1, "Option text is required")).min(2, "At least 2 options required"),
  correctOptionIndex: z.number().int().min(0),
  explanation: z.string().optional().default(""),
});

const quizSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  passingScore: z.number().int().min(1).max(100).default(70),
  questions: z.array(questionSchema).default([]),
});

const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  order: z.number().int().optional(),
  durationText: z.string().optional().default("30m"),
  durationSec: z.number().int().optional().default(0),
  videoUrl: z.string().optional().default(""),
  isPreview: z.boolean().optional().default(false),
  technicalSheetUrl: z.string().optional().nullable(),
  contentMarkdown: z.string().optional().default(""),
});

const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  order: z.number().int().optional(),
  description: z.string().optional().default(""),
  lessons: z.array(lessonSchema).default([]),
  quiz: quizSchema.optional().nullable(),
});

const createCourseSchema = z.object({
  title: z.string().min(3, "Course title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  code: z.string().min(2, "Course code is required (e.g., PVOL101)").transform((val) => val.toUpperCase().trim()),
  subtitle: z.string().optional().default(""),
  description: z.string().min(10, "Description must be at least 10 characters"),
  level: z.enum(["INTRODUCTORY", "INTERMEDIATE", "ADVANCED", "COMPREHENSIVE_MASTERCLASS"]).default("INTRODUCTORY"),
  deliveryType: z.enum(["SELF_PACED", "COHORT"]).default("SELF_PACED"),
  contactHours: z.coerce.number().int().min(1).default(40),
  price: z.coerce.number().min(0).default(0),
  originalPrice: z.coerce.number().min(0).optional().nullable(),
  isPublished: z.boolean().default(false),
  whatYoullLearn: z.array(z.string()).default([]),
  includesList: z.array(z.string()).default([]),
  targetAudience: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  thumbnailUrl: z.string().optional().default("/images/courses/course-1-solar-intro.jpg"),
  promoVideoUrl: z.string().optional().default(""),
  badge: z.string().optional().default("New"),
  instructorName: z.string().optional().default("Engr. Asanga"),
  modules: z.array(moduleSchema).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const parsed = createCourseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Resolve instructor user ID
    let instructorId: string | undefined = session?.user?.id;
    if (!instructorId) {
      // Find or create default admin director user
      const defaultAdmin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });
      if (defaultAdmin) {
        instructorId = defaultAdmin.id;
      }
    }

    // Check slug uniqueness
    const existingSlug = await prisma.course.findUnique({
      where: { slug: data.slug },
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: `Course slug "${data.slug}" already exists. Please choose a unique slug.` },
        { status: 409 }
      );
    }

    // Check code uniqueness
    const existingCode = await prisma.course.findUnique({
      where: { code: data.code },
    });
    if (existingCode) {
      return NextResponse.json(
        { error: `Course code "${data.code}" already exists. Please choose a unique code.` },
        { status: 409 }
      );
    }

    // Create course with nested modules, lessons, quizzes, and questions
    const createdCourse = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        code: data.code,
        subtitle: data.subtitle || null,
        description: data.description,
        level: data.level,
        deliveryType: data.deliveryType,
        contactHours: data.contactHours,
        price: data.price,
        originalPrice: data.originalPrice || null,
        isPublished: data.isPublished,
        instructorId: instructorId || null,
        instructorName: data.instructorName || "Engr. Asanga",
        whatYoullLearn: JSON.stringify(data.whatYoullLearn || []),
        includesList: JSON.stringify(data.includesList || []),
        targetAudience: Array.isArray(data.targetAudience)
          ? data.targetAudience.map((item: any) => String(item).trim()).filter(Boolean)
          : [],
        requirements: Array.isArray(data.requirements)
          ? data.requirements.map((item: any) => String(item).trim()).filter(Boolean)
          : [],
        thumbnailUrl: data.thumbnailUrl || "/images/courses/course-1-solar-intro.jpg",
        promoVideoUrl: data.promoVideoUrl || null,
        badge: data.badge || null,
        modules: {
          create: data.modules.map((m, mIdx) => ({
            title: m.title,
            sortOrder: m.order ?? mIdx + 1,
            description: m.description || null,
            lessons: {
              create: m.lessons.map((l, lIdx) => {
                // Calculate rough duration in seconds from text if not provided
                let durationSec = l.durationSec || 0;
                if (!durationSec && l.durationText) {
                  const matchMin = l.durationText.match(/(\d+)\s*m/i);
                  const matchHour = l.durationText.match(/(\d+)\s*h/i);
                  if (matchMin) durationSec += parseInt(matchMin[1], 10) * 60;
                  if (matchHour) durationSec += parseInt(matchHour[1], 10) * 3600;
                  if (!durationSec && parseInt(l.durationText, 10)) {
                    durationSec = parseInt(l.durationText, 10) * 60;
                  }
                }
                return {
                  title: l.title,
                  sortOrder: l.order ?? lIdx + 1,
                  durationText: l.durationText || "30m",
                  durationSec: durationSec || 1800,
                  videoUrl: l.videoUrl || "",
                  isFreePreview: l.isPreview ?? false,
                  downloadableUrl: l.technicalSheetUrl || null,
                  technicalSheetUrl: l.technicalSheetUrl || null,
                  contentMarkdown: l.contentMarkdown || "",
                };
              }),
            },
            ...(m.quiz && m.quiz.title ? {
              quiz: {
                create: {
                  title: m.quiz.title,
                  passingScore: m.quiz.passingScore || 70,
                  questions: {
                    create: (m.quiz.questions || []).map((q) => ({
                      text: q.question,
                      optionsJson: JSON.stringify(q.options || []),
                      correctOptionIndex: q.correctOptionIndex ?? 0,
                      explanation: q.explanation || "",
                    })),
                  },
                },
              },
            } : {}),
          })),
        },
      },
      include: {
        modules: {
          include: {
            lessons: true,
            quiz: {
              include: {
                questions: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: data.isPublished
          ? "Course published to public catalog successfully"
          : "Course draft saved successfully",
        courseId: createdCourse.id,
        slug: createdCourse.slug,
        code: createdCourse.code,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating course in studio:", error);
    return NextResponse.json(
      {
        error: "Failed to create course",
        details: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        modules: {
          orderBy: { sortOrder: "asc" },
          include: {
            lessons: {
              orderBy: { sortOrder: "asc" },
            },
            quiz: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      courses: courses.map((c) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        slug: c.slug,
        level: c.level,
        description: c.description,
        instructorName: c.instructorName || "Subway Engineering Faculty",
        price: c.price,
        originalPrice: c.originalPrice,
        contactHours: c.contactHours,
        isPublished: c.isPublished,
        status: c.status || (c.isPublished ? "PUBLISHED" : "DRAFT"),
        moduleCount: c.modules.length,
        lessonCount: c.modules.reduce((sum, m) => sum + m.lessons.length, 0),
        quizCount: c.modules.filter((m) => !!m.quiz).length,
        createdAt: c.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Error listing admin courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses", details: error?.message },
      { status: 500 }
    );
  }
}
