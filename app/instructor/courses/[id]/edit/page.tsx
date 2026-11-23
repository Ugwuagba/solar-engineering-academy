import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import InstructorCourseArchitect from "../../InstructorCourseArchitect";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Edit Course Curriculum | Instructor Studio",
  description: "Edit syllabus, modules, video lectures, and assessments.",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditInstructorCoursePage({ params }: Props) {
  const session = await getServerSession(authOptions);

  const { id } = await params;

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/instructor/courses/${id || ""}/edit`);
  }

  const userRole = session.user.role as string;
  const isInstructor = userRole === "INSTRUCTOR";
  const isAdmin =
    userRole === "SUPER_ADMIN" ||
    userRole === "PROGRAM_ADMIN" ||
    userRole === "ADMIN";

  if (!isInstructor && !isAdmin) {
    redirect("/dashboard");
  }

  if (!id) {
    redirect("/instructor");
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
    redirect("/instructor");
  }

  // Strict ownership check: instructors can ONLY edit their own authored courses
  if (isInstructor && course.instructorId !== session.user.id) {
    redirect("/instructor");
  }

  return (
    <InstructorCourseArchitect
      mode="edit"
      initialCourse={course}
      basePath="/instructor"
    />
  );
}
