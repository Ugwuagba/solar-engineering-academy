import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Role, CourseStatus } from "@prisma/client";
import { publishCourse, requestRevision } from "./actions/approval-actions";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle,
  RotateCcw,
  Building2,
  Calendar,
  User,
  Clock,
  Briefcase,
  ExternalLink,
  Users,
  GraduationCap,
  ChevronDown,
  BookOpen,
  ArrowLeft,
  Mail,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Program Admin | Curriculum Governance & Rosters",
  description: "Review, approve, or request revisions for submitted courses and inspect student rosters across published programs.",
};

interface PageProps {
  searchParams?: Promise<{ tab?: string }>;
}

export default async function ProgramAdminPage({ searchParams }: PageProps) {
  // 1. Verify PROGRAM_ADMIN or SUPER_ADMIN role
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/program-admin");
  }

  const role = session.user.role;
  const isSuperAdmin = role === Role.SUPER_ADMIN || role === "SUPER_ADMIN";
  const isProgramAdmin =
    role === Role.PROGRAM_ADMIN ||
    role === "PROGRAM_ADMIN" ||
    role === Role.ADMIN ||
    role === "ADMIN";

  if (!isSuperAdmin && !isProgramAdmin) {
    redirect("/dashboard");
  }

  // Fetch admin user profile
  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true },
  });

  // 2. Resolve Active Tab from URL search params
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams?.tab === "active" ? "active" : "queue";

  // 3. Metric aggregations
  const [pendingCoursesCount, publishedCoursesCount, totalEnrollmentsCount] = await Promise.all([
    prisma.course.count({ where: { status: CourseStatus.PENDING_APPROVAL } }).catch(() => 0),
    prisma.course.count({ where: { status: CourseStatus.PUBLISHED } }).catch(() => 0),
    prisma.enrollment.count().catch(() => 0),
  ]);

  // 4. Tab-specific data fetching
  const pendingCourses =
    activeTab === "queue"
      ? await prisma.course.findMany({
        where: { status: CourseStatus.PENDING_APPROVAL },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      })
      : [];

  const publishedCourses =
    activeTab === "active"
      ? await prisma.course.findMany({
        where: { status: CourseStatus.PUBLISHED },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          enrollments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  createdAt: true,
                },
              },
            },
            orderBy: { enrolledAt: "desc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      })
      : [];

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ─── Top Header Bar ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Briefcase className="w-3.5 h-3.5" />
                {isSuperAdmin ? "SUPER ADMIN" : "PROGRAM ADMIN"}
              </span>
              <span className="text-xs text-slate-500 font-mono">ACADEMIC OPERATIONS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Curriculum Review &amp; Student Rosters
            </h1>
            <p className="text-sm text-slate-400">
              Audit submitted engineering syllabi, manage course approval pipelines, and inspect enrolled student rosters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSuperAdmin && (
              <Link
                href="/super-admin/users"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Staff Directory
              </Link>
            )}
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition shadow-sm"
            >
              <Layers className="w-3.5 h-3.5" /> View Legacy Studio
            </Link>
          </div>
        </div>

        {/* ─── Metric Summary Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-medium text-slate-400">Review Queue Pending</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{pendingCoursesCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-medium text-slate-400">Active Published Courses</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{publishedCoursesCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Academy Enrollments</p>
              <p className="text-2xl font-bold text-sky-400 mt-1">{totalEnrollmentsCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ─── URL-Based Tab Navigation ─── */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
          <Link
            href="/program-admin?tab=queue"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${activeTab === "queue"
              ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-md shadow-amber-500/5"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent"
              }`}
          >
            <Clock className="w-4 h-4" />
            Review Queue
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {pendingCoursesCount}
            </span>
          </Link>

          <Link
            href="/program-admin?tab=active"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${activeTab === "active"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-md shadow-emerald-500/5"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent"
              }`}
          >
            <GraduationCap className="w-4 h-4" />
            Active Courses &amp; Rosters
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {publishedCoursesCount}
            </span>
          </Link>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 1: REVIEW QUEUE (?tab=queue)
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "queue" && (
          <div className="bg-[#0b1528] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Submitted Curricula Awaiting Review</h2>
                <p className="text-xs text-slate-400">
                  Inspect module syllabi, approve for publication, or request specific improvements with feedback.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
                {pendingCourses.length} {pendingCourses.length === 1 ? "Course Pending" : "Courses Pending"}
              </span>
            </div>

            {pendingCourses.length === 0 ? (
              <div className="py-16 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No courses pending approval</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  All submitted course materials have been processed. Newly submitted drafts from instructors will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#070e1b]/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">Course Title</th>
                      <th scope="col" className="px-6 py-3.5">Instructor</th>
                      <th scope="col" className="px-6 py-3.5">Submitted Date</th>
                      <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-normal">
                    {pendingCourses.map((course) => {
                      const instructorName =
                        course.instructor?.name || course.instructorName || "Lead Instructor";
                      const instructorEmail =
                        course.instructor?.email || "Email not available";

                      return (
                        <tr key={course.id} className="hover:bg-slate-800/30 transition-colors">
                          {/* Course Title */}
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">{course.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-xs text-amber-400">{course.code}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-xs text-slate-500 font-mono">/{course.slug}</span>
                            </div>
                          </td>

                          {/* Instructor */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center uppercase">
                                {instructorName.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-slate-200">{instructorName}</div>
                                <div className="text-xs text-slate-500">{instructorEmail}</div>
                              </div>
                            </div>
                          </td>

                          {/* Submitted Date */}
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                            <div className="inline-flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              {new Date(course.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </td>

                          {/* Actions Column */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="inline-flex flex-wrap items-center justify-end gap-2.5">
                              {/* 1. Preview Course Link */}
                              <Link
                                href={`/courses/${course.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                                Preview Course
                              </Link>

                              {/* 2. Approve & Publish Button */}
                              <form action={publishCourse.bind(null, course.id)}>
                                <button
                                  type="submit"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/10 transition active:scale-95 cursor-pointer"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Approve &amp; Publish
                                </button>
                              </form>

                              {/* 3. Request Revision Form */}
                              <form action={requestRevision} className="inline-flex items-center gap-1.5">
                                <input type="hidden" name="courseId" value={course.id} />
                                <input
                                  type="text"
                                  name="feedback"
                                  placeholder="Feedback / notes..."
                                  className="px-2.5 py-1.5 bg-[#070e1b] border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 w-40"
                                />
                                <button
                                  type="submit"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition active:scale-95 cursor-pointer whitespace-nowrap"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  Request Revision
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 2: ACTIVE COURSES & ROSTERS (?tab=active)
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "active" && (
          <div className="bg-[#0b1528] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Active Published Courses &amp; Rosters</h2>
                <p className="text-xs text-slate-400">
                  Inspect currently live courses and view the student roster for each active syllabus.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                {publishedCourses.length} {publishedCourses.length === 1 ? "Published Course" : "Published Courses"}
              </span>
            </div>

            {publishedCourses.length === 0 ? (
              <div className="py-16 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-7 h-7 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No active courses published yet</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Courses approved from the review queue will appear here along with their live student enrollments.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {publishedCourses.map((course) => {
                  const instructorName =
                    course.instructor?.name || course.instructorName || "Lead Instructor";
                  const instructorEmail =
                    course.instructor?.email || "Email not available";
                  const totalEnrolled = course.enrollments.length;

                  return (
                    <div key={course.id} className="p-6 hover:bg-slate-800/20 transition-colors">
                      {/* Course Row Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-base text-white">{course.title}</span>
                            <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {course.code}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle className="w-3 h-3" />
                              PUBLISHED
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>Level: <strong className="text-slate-300">{course.level}</strong></span>
                            <span>•</span>
                            <span>Price: <strong className="text-slate-300">₦{Number(course.price || 0).toLocaleString()}</strong></span>
                            <span>•</span>
                            <Link
                              href={`/courses/${course.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
                            >
                              View Public Page <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>

                        {/* Instructor & Enrolled Count */}
                        <div className="flex items-center gap-6">
                          {/* Instructor Info */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center uppercase">
                              {instructorName.charAt(0)}
                            </div>
                            <div className="text-left">
                              <div className="text-xs font-semibold text-slate-200">{instructorName}</div>
                              <div className="text-[11px] text-slate-500">{instructorEmail}</div>
                            </div>
                          </div>

                          {/* Total Enrolled Badge */}
                          <div className="text-right">
                            <div className="text-xs text-slate-400">Total Enrolled</div>
                            <div className="text-lg font-bold text-sky-400 font-mono">
                              {totalEnrolled} {totalEnrolled === 1 ? "Student" : "Students"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* View Roster Interactive Element (Details Accordion) */}
                      <div className="mt-4 pt-4 border-t border-slate-800/60">
                        <details className="group">
                          <summary className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 cursor-pointer select-none bg-sky-500/10 hover:bg-sky-500/15 border border-sky-500/20 px-3.5 py-1.5 rounded-xl transition list-none">
                            <Users className="w-3.5 h-3.5" />
                            <span>View Student Roster ({totalEnrolled})</span>
                            <ChevronDown className="w-3.5 h-3.5 text-sky-400 transition-transform duration-200 group-open:rotate-180" />
                          </summary>

                          <div className="mt-3 bg-[#070e1b] border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                            {totalEnrolled === 0 ? (
                              <div className="py-6 px-4 text-center text-xs text-slate-400">
                                No students have enrolled in this course yet.
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    <tr>
                                      <th scope="col" className="px-4 py-2.5">Student</th>
                                      <th scope="col" className="px-4 py-2.5">Email Address</th>
                                      <th scope="col" className="px-4 py-2.5">Enrolled Date</th>
                                      <th scope="col" className="px-4 py-2.5">Status</th>
                                      <th scope="col" className="px-4 py-2.5 text-right">Progress</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800/60">
                                    {course.enrollments.map((enrollment) => {
                                      const studentName = enrollment.user.name || "Student Learner";
                                      const studentEmail = enrollment.user.email;
                                      const enrolledDate = new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      });

                                      return (
                                        <tr key={enrollment.id} className="hover:bg-slate-800/40 transition-colors">
                                          <td className="px-4 py-2.5 font-medium text-slate-200">
                                            {studentName}
                                          </td>
                                          <td className="px-4 py-2.5 font-mono text-slate-300">
                                            {studentEmail}
                                          </td>
                                          <td className="px-4 py-2.5 text-slate-400">
                                            {enrolledDate}
                                          </td>
                                          <td className="px-4 py-2.5">
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                              {enrollment.status}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2.5 text-right font-mono text-slate-300">
                                            {enrollment.progressPercent}%
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </details>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
