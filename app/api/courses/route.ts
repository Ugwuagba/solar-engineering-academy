import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { status: "PUBLISHED" },
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

    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error("[API Courses GET Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch published courses", message: error.message },
      { status: 500 }
    );
  }
}
