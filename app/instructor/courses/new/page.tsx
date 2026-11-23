import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import InstructorCourseArchitect from "../InstructorCourseArchitect";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Create New Program | Instructor Studio",
  description: "Draft an accredited solar curriculum, technical lessons, and module assessments.",
};

export default async function NewInstructorCoursePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/instructor/courses/new");
  }

  const userRole = session.user.role as string;
  const isAuthorized =
    userRole === "INSTRUCTOR" ||
    userRole === "SUPER_ADMIN" ||
    userRole === "PROGRAM_ADMIN" ||
    userRole === "ADMIN";

  if (!isAuthorized) {
    redirect("/dashboard");
  }

  return <InstructorCourseArchitect mode="create" basePath="/instructor" />;
}
