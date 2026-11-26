import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { CourseStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { status: { in: [CourseStatus.PUBLISHED] } },
          { isPublished: true },
        ],
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
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


    return NextResponse.json({ courses: courses || [] });
  } catch (error: unknown) {
    console.error("[API Courses GET Error]:", error);
    return NextResponse.json({ courses: [] }, { status: 500 });
  }
}
