import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
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

    const course = await prisma.course.findUnique({
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

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (isInstructor && course.instructorId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You may only view courses authored by you." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to retrieve course details", details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
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

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (isInstructor && course.instructorId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You may only delete your own draft courses." },
        { status: 403 }
      );
    }

    const hasApprovedLessonVideo = false;
    const isApprovedByAdmin =
      course.isPublished ||
      course.status === "PUBLISHED" ||
      hasApprovedLessonVideo;

    if (isInstructor && isApprovedByAdmin) {
      return NextResponse.json(
        { error: "Cannot delete this course: its video curriculum has already been approved by an administrator." },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id },
    });

    revalidatePath("/instructor");
    revalidatePath("/program-admin");
    revalidatePath("/program-admin/review-queue");

    return NextResponse.json({ success: true, message: "Course deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete course", details: error?.message },
      { status: 500 }
    );
  }
}
