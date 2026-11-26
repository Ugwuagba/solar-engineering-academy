import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/courses";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import ClassroomPlayer from "@/components/classroom/ClassroomPlayer";

export const dynamic = "force-dynamic";

interface ClassroomPageProps {
  params: Promise<{ courseSlug: string }>;
  searchParams: Promise<{ lesson?: string; payment?: string; tx_ref?: string }>;
}

export default async function ClassroomPage({
  params,
  searchParams,
}: ClassroomPageProps) {
  const { courseSlug } = await params;
  const { lesson, payment, tx_ref } = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/learn/${courseSlug}`)}`);
  }

  const course = await getCourseBySlug(courseSlug);
  if (!course) {
    notFound();
  }

  const userId = session.user.id;
  const userRole = session.user.role as string;
  const isStaffOrAuthor =
    userRole === Role.SUPER_ADMIN ||
    userRole === "SUPER_ADMIN" ||
    userRole === Role.PROGRAM_ADMIN ||
    userRole === "PROGRAM_ADMIN" ||
    userRole === Role.ADMIN ||
    userRole === "ADMIN" ||
    Boolean(course.instructorId && course.instructorId === userId);

  const isPublished = Boolean(course.isPublished || course.status === "PUBLISHED");
  if (!isPublished && !isStaffOrAuthor) {
    notFound();
  }

  // Enforce active enrollment for non-staff learners
  if (!isStaffOrAuthor) {
    const targetCourseId = course.id;
    const enrollment = targetCourseId
      ? await prisma.enrollment.findFirst({
          where: {
            userId,
            courseId: targetCourseId,
            status: { in: ["ACTIVE", "COMPLETED"] },
          },
          select: { id: true },
        })
      : null;

    if (!enrollment) {
      redirect(`/courses/${course.slug}?enroll=required`);
    }
  }

  // Fetch initial progress records for this student and course
  const initialProgress: Record<string, { completed: boolean; lastPosition: number }> = {};
  const progresses = await prisma.lessonProgress.findMany({
    where: {
      userId,
      OR: [
        ...(course.id ? [{ courseId: course.id }] : []),
        { courseId: course.slug },
        { courseId: course.code },
      ],
    },
  });

  progresses.forEach((p) => {
    initialProgress[p.lessonId] = {
      completed: p.completed,
      lastPosition: p.lastPosition,
    };
  });

  return (
    <ClassroomPlayer
      course={course}
      initialProgress={initialProgress}
      requestedLessonId={lesson}
      userId={userId}
      paymentStatus={payment}
      txRef={tx_ref}
      studentName={session.user.name || undefined}
      studentEmail={session.user.email || undefined}
    />
  );
}
