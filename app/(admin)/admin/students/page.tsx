import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import StudentsManagementClient, { 
  RegisteredUser, 
  PaidEnrollment 
} from "@/components/admin/StudentsManagementClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminStudentsPage() {
  // 1. Route Security: Require NextAuth session with role === 'ADMIN' or 'INSTRUCTOR' or 'DIRECTOR'
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/admin/students");
  }

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "INSTRUCTOR" && (role as string) !== "DIRECTOR") {
    redirect("/dashboard");
  }

  let registeredStudents: RegisteredUser[] = [];
  let paidEnrollments: PaidEnrollment[] = [];

  // 2. Data Fetching using Prisma
  try {
    const studentsData = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        enrollments: {
          include: {
            course: {
              select: {
                code: true,
                title: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (studentsData && studentsData.length > 0) {
      registeredStudents = studentsData.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        role: s.role,
        isEmailVerified: s.isEmailVerified,
        createdAt: s.createdAt.toISOString(),
        enrollments: s.enrollments.map((e) => ({
          id: e.id,
          courseId: e.courseId,
          status: e.status,
          course: e.course
            ? {
                code: e.course.code,
                title: e.course.title,
                price: e.course.price,
              }
            : undefined,
        })),
      }));
    }

    const enrollmentsData = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            code: true,
            title: true,
            price: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    if (enrollmentsData && enrollmentsData.length > 0) {
      paidEnrollments = enrollmentsData.map((e) => ({
        id: e.id,
        userId: e.userId,
        courseId: e.courseId,
        status: e.status,
        progressPercent: e.progressPercent,
        enrolledAt: e.enrolledAt.toISOString(),
        user: e.user
          ? {
              id: e.user.id,
              name: e.user.name,
              email: e.user.email,
            }
          : undefined,
        course: e.course
          ? {
              id: e.course.id,
              code: e.course.code,
              title: e.course.title,
              price: e.course.price,
            }
          : undefined,
      }));
    }
  } catch (error) {
    console.warn("Prisma query in /admin/students failed or DB unreachable:", error);
  }

  return (
    <StudentsManagementClient
      initialStudents={registeredStudents}
      initialEnrollments={paidEnrollments}
      sessionUser={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }}
    />
  );
}
