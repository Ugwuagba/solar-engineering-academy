import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/courses";
import prisma from "@/lib/db";
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

  const course = await getCourseBySlug(courseSlug);
  if (!course) {
    notFound();
  }

  // Fetch initial progress records for this student and course
  const initialProgress: Record<string, { completed: boolean; lastPosition: number }> = {};

  if (session?.user?.id) {
    const userId = session.user.id;
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
  }

  return (
    <ClassroomPlayer
      course={course}
      initialProgress={initialProgress}
      requestedLessonId={lesson}
      userId={session?.user?.id}
      paymentStatus={payment}
      txRef={tx_ref}
      studentName={session?.user?.name || undefined}
      studentEmail={session?.user?.email || undefined}
    />
  );
}
