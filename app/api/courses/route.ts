import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { ALL_FALLBACK_COURSES } from "@/lib/fallback-courses";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let courses = await prisma.course.findMany({
      where: {
        OR: [
          { status: { in: ["PUBLISHED", "published", "ACTIVE", "active", "OPEN", "open"] } },
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

    if (!courses || courses.length === 0) {
      courses = await prisma.course.findMany({
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
    }

    if (courses && courses.length > 0) {
      return NextResponse.json({ courses });
    }

    return NextResponse.json({ courses: ALL_FALLBACK_COURSES });
  } catch (error: any) {
    console.error("[API Courses GET Error]:", error);
    return NextResponse.json({ courses: ALL_FALLBACK_COURSES });
  }
}
