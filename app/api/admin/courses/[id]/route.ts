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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    const role = session?.user?.role;
    if (!session?.user || (role !== "ADMIN" && role !== "DIRECTOR" && role !== "INSTRUCTOR")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin or Instructor privileges required." },
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

    let course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
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

    const body = await req.json();
    const updateData: any = {};

    if (body.targetAudience !== undefined) {
      updateData.targetAudience = Array.isArray(body.targetAudience)
        ? body.targetAudience.map((item: any) => String(item).trim()).filter(Boolean)
        : [];
    }

    if (body.requirements !== undefined) {
      updateData.requirements = Array.isArray(body.requirements)
        ? body.requirements.map((item: any) => String(item).trim()).filter(Boolean)
        : [];
    }

    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle ? String(body.subtitle).trim() : null;
    if (body.description !== undefined) updateData.description = String(body.description).trim();
    if (body.level !== undefined) updateData.level = body.level;
    if (body.deliveryType !== undefined) updateData.deliveryType = body.deliveryType;
    if (body.contactHours !== undefined) updateData.contactHours = Number(body.contactHours) || 40;
    if (body.price !== undefined) updateData.price = Number(body.price) || 0;
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice !== "" && body.originalPrice != null ? Number(body.originalPrice) : null;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.isPublished !== undefined) updateData.isPublished = Boolean(body.isPublished);
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl;
    if (body.promoVideoUrl !== undefined) updateData.promoVideoUrl = body.promoVideoUrl ? String(body.promoVideoUrl).trim() : null;
    if (body.badge !== undefined) updateData.badge = body.badge ? String(body.badge).trim() : null;
    if (body.instructorName !== undefined) updateData.instructorName = body.instructorName ? String(body.instructorName).trim() : "Engr. Asanga";
    if (body.whatYoullLearn !== undefined) {
      updateData.whatYoullLearn = JSON.stringify(Array.isArray(body.whatYoullLearn) ? body.whatYoullLearn : []);
    }
    if (body.includesList !== undefined) {
      updateData.includesList = JSON.stringify(Array.isArray(body.includesList) ? body.includesList : []);
    }

    const updated = await prisma.course.update({
      where: { id: course.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      course: updated,
      message: "Course updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course", details: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(req, context);
}
