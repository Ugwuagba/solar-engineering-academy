"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role, CourseStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Ensures caller is authenticated and has PROGRAM_ADMIN or SUPER_ADMIN role.
 */
async function requireProgramOrSuperAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized: Authentication required.");
  }

  const role = session.user.role;
  const isSuperAdmin = role === Role.SUPER_ADMIN || role === "SUPER_ADMIN";
  const isProgramAdmin = role === Role.PROGRAM_ADMIN || role === "PROGRAM_ADMIN";

  if (!isSuperAdmin && !isProgramAdmin) {
    throw new Error("Unauthorized: Program Admin or Super Admin privileges required.");
  }

  // Fetch admin user from Prisma to inspect assigned departmentId
  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, departmentId: true },
  });

  return { session, adminUser, isSuperAdmin };
}

/**
 * Approves and publishes a pending course.
 */
export async function publishCourse(courseIdOrFormData: string | FormData): Promise<void> {
  const { session, adminUser, isSuperAdmin } = await requireProgramOrSuperAdmin();

  const courseId =
    typeof courseIdOrFormData === "string"
      ? courseIdOrFormData
      : (courseIdOrFormData.get("courseId") as string);

  if (!courseId) {
    throw new Error("Course ID is required.");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(`Course with ID "${courseId}" was not found.`);
  }

  // If PROGRAM_ADMIN, verify departmental scope (skip for SUPER_ADMIN)
  if (!isSuperAdmin && adminUser?.departmentId) {
    if (course.departmentId && course.departmentId !== adminUser.departmentId) {
      throw new Error(
        `Department scope mismatch: Course belongs to "${course.departmentId}", but your scope is limited to "${adminUser.departmentId}".`
      );
    }
  }

  // Execute update and audit log in transaction
  await prisma.$transaction(async (tx) => {
    await tx.course.update({
      where: { id: courseId },
      data: {
        status: CourseStatus.PUBLISHED,
        isPublished: true,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "COURSE_PUBLISHED",
        resource: courseId,
        details: {
          courseId,
          title: course.title,
          code: course.code,
          previousStatus: course.status,
          newStatus: "PUBLISHED",
          publishedBy: session.user.id,
          timestamp: new Date().toISOString(),
        },
      },
    });
  });

  revalidatePath("/program-admin");
  revalidatePath("/instructor");
  revalidatePath("/courses");
  revalidatePath("/");
}

/**
 * Requests curriculum revisions from the instructor.
 */
export async function requestRevision(courseIdOrFormData: string | FormData): Promise<void> {
  const { session, adminUser, isSuperAdmin } = await requireProgramOrSuperAdmin();

  const courseId =
    typeof courseIdOrFormData === "string"
      ? courseIdOrFormData
      : (courseIdOrFormData.get("courseId") as string);

  if (!courseId) {
    throw new Error("Course ID is required.");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(`Course with ID "${courseId}" was not found.`);
  }

  // If PROGRAM_ADMIN, verify departmental scope (skip for SUPER_ADMIN)
  if (!isSuperAdmin && adminUser?.departmentId) {
    if (course.departmentId && course.departmentId !== adminUser.departmentId) {
      throw new Error(
        `Department scope mismatch: Course belongs to "${course.departmentId}", but your scope is limited to "${adminUser.departmentId}".`
      );
    }
  }

  // Execute update and audit log in transaction
  await prisma.$transaction(async (tx) => {
    await tx.course.update({
      where: { id: courseId },
      data: {
        status: CourseStatus.REVISION_REQUESTED,
        isPublished: false,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "COURSE_REVISION_REQUESTED",
        resource: courseId,
        details: {
          courseId,
          title: course.title,
          code: course.code,
          previousStatus: course.status,
          newStatus: "REVISION_REQUESTED",
          requestedBy: session.user.id,
          timestamp: new Date().toISOString(),
        },
      },
    });
  });

  revalidatePath("/program-admin");
  revalidatePath("/instructor");
}

