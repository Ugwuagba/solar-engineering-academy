"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role, CourseStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Ensures caller is authenticated and has PROGRAM_ADMIN, SUPER_ADMIN, or legacy ADMIN role.
 */
async function requireProgramOrSuperAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized: Authentication required.");
  }

  const role = session.user.role;
  const isSuperAdmin = role === Role.SUPER_ADMIN || role === "SUPER_ADMIN";
  const isProgramAdmin =
    role === Role.PROGRAM_ADMIN ||
    role === "PROGRAM_ADMIN" ||
    role === Role.ADMIN ||
    role === "ADMIN";

  if (!isSuperAdmin && !isProgramAdmin) {
    throw new Error("Unauthorized: Program Admin or Super Admin privileges required.");
  }

  return { session, isSuperAdmin };
}

/**
 * Approves and publishes a pending course.
 */
export async function publishCourse(courseIdOrFormData: string | FormData): Promise<void> {
  const { session } = await requireProgramOrSuperAdmin();

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
  revalidatePath("/program-admin/review-queue");
  revalidatePath("/instructor");
  revalidatePath("/courses");
  revalidatePath("/");
}

/**
 * Requests curriculum revisions from the instructor.
 */
export async function requestRevision(
  courseIdOrFormData: string | FormData,
  maybeFormData?: FormData
): Promise<void> {
  const { session } = await requireProgramOrSuperAdmin();

  let courseId: string = "";
  let feedback: string | undefined;

  if (typeof courseIdOrFormData === "string") {
    courseId = courseIdOrFormData;
    if (maybeFormData instanceof FormData) {
      const fb = maybeFormData.get("feedback");
      if (typeof fb === "string" && fb.trim()) {
        feedback = fb.trim();
      }
    }
  } else if (courseIdOrFormData instanceof FormData) {
    courseId = (courseIdOrFormData.get("courseId") as string) || "";
    const fb = courseIdOrFormData.get("feedback");
    if (typeof fb === "string" && fb.trim()) {
      feedback = fb.trim();
    }
  }

  if (!courseId) {
    throw new Error("Course ID is required.");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error(`Course with ID "${courseId}" was not found.`);
  }

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
          feedback: feedback || null,
          timestamp: new Date().toISOString(),
        },
      },
    });
  });

  revalidatePath("/program-admin");
  revalidatePath("/program-admin/review-queue");
  revalidatePath("/instructor");
}

