import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import CourseStudioForm from "@/components/admin/CourseStudioForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: Props) {
  // 1. Authentication & Role Check
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    const { id } = await params;
    redirect(`/login?callbackUrl=/admin/courses/${id}/edit`);
  }

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "INSTRUCTOR" && (role as string) !== "DIRECTOR") {
    redirect("/dashboard");
  }

  const { id } = await params;
  if (!id) {
    redirect("/admin");
  }

  let course: any = null;

  // 2. Fetch course from Prisma by ID
  try {
    course = await prisma.course.findUnique({
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

    // Fallback: check by slug
    if (!course) {
      course = await prisma.course.findUnique({
        where: { slug: id },
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
    }
  } catch (error) {
    console.error("Error loading course from database:", error);
  }

  if (!course) {
    redirect("/admin");
  }

  // Ensure dates are stringified if serialized to client component
  const serializedCourse = {
    ...course,
    createdAt: course.createdAt ? course.createdAt.toString() : null,
    updatedAt: course.updatedAt ? course.updatedAt.toString() : null,
  };

  return <CourseStudioForm initialCourse={serializedCourse} mode="edit" />;
}
