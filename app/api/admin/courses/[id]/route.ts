import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Authentication & Authorization Check
    const role = session?.user?.role;
    if (!session?.user || (role !== "ADMIN" && role !== "DIRECTOR" && role !== "INSTRUCTOR")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin or Director privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // 2. Verify course existence
    let course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      // Check fallback by slug
      course = await prisma.course.findUnique({
        where: { slug: id },
      });
    }

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // 3. Delete course (Prisma cascade relations clean up modules, lessons, quizzes, questions, cohorts, enrollments)
    await prisma.course.delete({
      where: { id: course.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course deleted successfully",
        deletedId: course.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting course in Admin Studio:", error);
    return NextResponse.json(
      {
        error: "Failed to delete course",
        details: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
