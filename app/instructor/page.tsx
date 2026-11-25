import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Link from "next/link";
import InstructorCoursesAndRosters, {
  InstructorCourseItem,
} from "./InstructorCoursesAndRosters";
import {
  GraduationCap,
  ArrowLeft,
  Layers,
  Plus,
  Users,
  CreditCard,
  Receipt,
  Clock
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Instructor Studio | Course Drafting, Revenue & Student Rosters",
  description:
    "Draft solar engineering courses, track admin approvals, inspect paid student rosters, and monitor live curriculum revenue.",
};

export default async function InstructorStudioPage() {
  // 1. Verify INSTRUCTOR or administrative role server-side
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/instructor");
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

  const isInstructor = userRole === "INSTRUCTOR";
  const instructorId = session.user.id;

  // 2. Fetch courses belonging to this instructor (or all if admin viewing studio)
  // Include modules/lessons for progress calculation, enrollments with user details, and payments
  const courses = await prisma.course.findMany({
    where: isInstructor ? { instructorId } : {},
    orderBy: { createdAt: "desc" },
    include: {
      modules: {
        include: {
          lessons: {
            select: { id: true },
          },
        },
      },
      enrollments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          progresses: {
            select: {
              isCompleted: true,
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      },
      payments: {
        where: { status: "COMPLETED" },
        select: {
          id: true,
          userId: true,
          amount: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Fetch any recent revision request audit feedback for authored courses
  const courseIds = courses.map((c) => c.id);
  const revisionLogs = await prisma.auditLog.findMany({
    where: {
      action: "COURSE_REVISION_REQUESTED",
      resource: { in: courseIds },
    },
    orderBy: { timestamp: "desc" },
  });

  const feedbackMap: Record<string, string> = {};
  for (const log of revisionLogs) {
    if (!feedbackMap[log.resource]) {
      const details = log.details as any;
      if (details?.feedback) {
        feedbackMap[log.resource] = details.feedback;
      }
    }
  }

  // 3. Serialize courses and calculate organic metrics per-course and platform-wide
  const serializedCourses: InstructorCourseItem[] = courses.map((course) => {
    const totalLessons = course.modules.reduce(
      (sum, m) => sum + m.lessons.length,
      0
    );

    // Map verified completed payments for this course
    const userPaymentsMap = new Map<string, { amount: number; createdAt: Date }>();
    let coursePaymentsSum = 0;
    for (const p of course.payments) {
      if (p.status === "COMPLETED") {
        coursePaymentsSum += Number(p.amount || 0);
        if (!userPaymentsMap.has(p.userId)) {
          userPaymentsMap.set(p.userId, {
            amount: Number(p.amount || 0),
            createdAt: p.createdAt,
          });
        }
      }
    }

    // Map enrolled students (Strictly belonging to this instructor's course)
    const enrolledStudents = course.enrollments.map((e) => {
      const paymentInfo = userPaymentsMap.get(e.userId);
      const recordedAmount = e.amountPaid != null ? Number(e.amountPaid) : 0;
      const paymentAmount = paymentInfo ? paymentInfo.amount : 0;
      const finalAmountPaid =
        recordedAmount > 0 ? recordedAmount : paymentAmount;

      const isPaid =
        finalAmountPaid > 0 ||
        (Number(course.price || 0) > 0 && Boolean(paymentInfo));

      let paymentStatus: "PAID" | "UNPAID" | "FREE" = "UNPAID";
      if (isPaid) {
        paymentStatus = "PAID";
      } else if (Number(course.price || 0) === 0) {
        paymentStatus = "FREE";
      }

      let progressPercent = Math.round(Number(e.progressPercent || 0));
      if (
        progressPercent === 0 &&
        totalLessons > 0 &&
        e.progresses.length > 0
      ) {
        const completed = e.progresses.filter((p) => p.isCompleted).length;
        progressPercent = Math.round((completed / totalLessons) * 100);
      }
      if (progressPercent > 100) progressPercent = 100;

      return {
        id: e.id,
        userId: e.userId,
        name: e.user?.name || "Student Learner",
        email: e.user?.email || "No email available",
        image: null,
        enrolledAt: e.enrolledAt.toISOString(),
        status: e.status || "ACTIVE",
        progressPercent,
        amountPaid: finalAmountPaid,
        isPaid,
        paymentStatus,
        courseId: course.id,
        courseTitle: course.title,
        courseCode: course.code,
        paymentDate: paymentInfo?.createdAt
          ? paymentInfo.createdAt.toISOString()
          : e.enrolledAt.toISOString(),
      };
    });

    // Compute total course revenue
    let courseRevenue = coursePaymentsSum;
    for (const e of course.enrollments) {
      if (
        !userPaymentsMap.has(e.userId) &&
        e.amountPaid != null &&
        Number(e.amountPaid) > 0
      ) {
        courseRevenue += Number(e.amountPaid);
      }
    }

    const enrolledCount = enrolledStudents.length;
    const paidCount = enrolledStudents.filter((s) => s.isPaid).length;

    return {
      id: course.id,
      code: course.code,
      title: course.title,
      slug: course.slug,
      status: String(course.status),
      isPublished: Boolean(course.isPublished),
      price: Number(course.price || 0),
      contactHours: Number(course.contactHours || 0),
      revisionFeedback: feedbackMap[course.id] || null,
      enrolledCount,
      paidCount,
      revenue: courseRevenue,
      students: enrolledStudents,
    };
  });

  // Calculate platform aggregate metrics for instructor
  const totalCourses = serializedCourses.length;
  const draftCount = serializedCourses.filter((c) => c.status === "DRAFT").length;
  const pendingCount = serializedCourses.filter(
    (c) => c.status === "PENDING_APPROVAL"
  ).length;
  const publishedCount = serializedCourses.filter(
    (c) => c.status === "PUBLISHED" || c.isPublished
  ).length;
  const revisionCount = serializedCourses.filter(
    (c) => c.status === "REVISION_REQUESTED"
  ).length;

  const totalEnrolledStudents = serializedCourses.reduce(
    (sum, c) => sum + c.enrolledCount,
    0
  );
  const totalPaidStudents = serializedCourses.reduce(
    (sum, c) => sum + c.paidCount,
    0
  );
  const totalRevenue = serializedCourses.reduce(
    (sum, c) => sum + c.revenue,
    0
  );

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ─── Header Section ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <GraduationCap className="w-3.5 h-3.5" /> INSTRUCTOR STUDIO
              </span>
              <span className="text-xs text-slate-500 font-mono">
                CURRICULUM &amp; REVENUE LEDGER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Course Authoring &amp; Student Rosters
            </h1>
            <p className="text-sm text-slate-400">
              Draft technical modules, inspect admin approval states, and track enrolled &amp; paid students across your syllabi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> My Classroom
            </Link>
            <Link
              href="/instructor/courses/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Create New Program</span>
            </Link>
          </div>
        </div>

        {/* ─── 5 Crisp Dark-Mode KPI Cards ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {/* 1. My Courses */}
          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">My Courses</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalCourses}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              {publishedCount} Published • {draftCount} Drafts
            </p>
          </div>

          {/* 2. Enrolled Students */}
          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-sky-400 mb-1">
              <span className="text-xs font-medium text-slate-400">Enrolled Students</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalEnrolledStudents}</p>
            <p className="text-[11px] text-slate-400 mt-1">Across your authored tracks</p>
          </div>

          {/* 3. Paid Students */}
          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-xs font-medium text-slate-400">Paid Students</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
              {totalPaidStudents}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Verified tuition enrollments</p>
          </div>

          {/* 4. Revenue Generated */}
          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-xs font-medium text-slate-400">Revenue Generated</span>
              <Receipt className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
              ₦{totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Total course earnings</p>
          </div>

          {/* 5. Review Status */}
          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <span className="text-xs font-medium text-slate-400">Review Status</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-400">
              {pendingCount} Pending
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {revisionCount} Revisions requested
            </p>
          </div>
        </div>

        {/* ─── Interactive Courses, Rosters & Paid Students Component ─── */}
        <InstructorCoursesAndRosters courses={serializedCourses} />
      </div>
    </div>
  );
}
