"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role, CourseStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Helper to ensure the caller has an active session with the INSTRUCTOR role.
 */
async function requireInstructorSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized: You must be logged in to perform this action.");
  }

  const role = session.user.role;
  if (role !== Role.INSTRUCTOR && role !== "INSTRUCTOR") {
    throw new Error("Unauthorized: Only users with the INSTRUCTOR role may perform this action.");
  }

  return session;
}

/**
 * Drafts a new course syllabus for the authenticated instructor.
 */
export async function draftCourse(formData: FormData): Promise<void> {
  const session = await requireInstructorSession();

  const titleRaw = formData.get("title");
  const departmentIdRaw = formData.get("departmentId");

  if (!titleRaw || typeof titleRaw !== "string" || !titleRaw.trim()) {
    throw new Error("Course title is required.");
  }
  const title = titleRaw.trim();

  const departmentId =
    typeof departmentIdRaw === "string" && departmentIdRaw.trim().length > 0
      ? departmentIdRaw.trim()
      : null;

  // Generate URL slug & course identifier
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const uniqueCode = `CRS-${Date.now().toString().slice(-6)}`;
  let finalSlug = baseSlug ? `${baseSlug}-${Date.now().toString().slice(-4)}` : `draft-${Date.now()}`;

  // Check collision for slug
  const existingSlug = await prisma.course.findUnique({
    where: { slug: finalSlug },
  });
  if (existingSlug) {
    finalSlug = `${finalSlug}-${Date.now().toString().slice(-3)}`;
  }

  // Create course in DRAFT status with instructorId
  await prisma.course.create({
    data: {
      code: uniqueCode,
      title,
      slug: finalSlug,
      description: "Comprehensive curriculum in development.",
      level: "INTRODUCTORY",
      deliveryType: "SELF_PACED",
      contactHours: 40,
      price: 0,
      status: CourseStatus.DRAFT,
      isPublished: false,
      departmentId,
      instructorId: session.user.id,
      instructorName: session.user.name || "Lead Instructor",
    },
  });

  revalidatePath("/instructor");
}

/**
 * Submits an existing draft or revision-requested course for program admin approval.
 */
export async function submitForApproval(courseIdOrFormData: string | FormData): Promise<void> {
  const session = await requireInstructorSession();

  const courseId =
    typeof courseIdOrFormData === "string"
      ? courseIdOrFormData
      : (courseIdOrFormData.get("courseId") as string);

  if (!courseId) {
    throw new Error("Course ID is required to submit for approval.");
  }

  // Verify course belongs to this instructor
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(`Course with ID "${courseId}" was not found.`);
  }

  if (course.instructorId !== session.user.id) {
    throw new Error("Forbidden: You can only submit courses that belong to your account.");
  }

  // Execute status update and audit log in an atomic transaction
  await prisma.$transaction(async (tx) => {
    await tx.course.update({
      where: { id: courseId },
      data: {
        status: CourseStatus.PENDING_APPROVAL,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "COURSE_SUBMITTED",
        resource: courseId,
        details: {
          courseId,
          title: course.title,
          code: course.code,
          previousStatus: course.status,
          newStatus: "PENDING_APPROVAL",
          submittedAt: new Date().toISOString(),
        },
      },
    });
  });

  revalidatePath("/instructor");
}

