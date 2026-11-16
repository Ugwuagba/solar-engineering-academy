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
  Layers,
  ArrowLeft,
  Briefcase,
  AlertTriangle
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Program Admin | Course Approval Queue",
  description: "Review, approve, or request revisions for submitted courses across academy departments.",
};

export default async function ProgramAdminApprovalPage() {
  // 1. Verify PROGRAM_ADMIN or SUPER_ADMIN role
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/program-admin");
  }

  const role = session.user.role;
  const isSuperAdmin = role === Role.SUPER_ADMIN || role === "SUPER_ADMIN";
  const isProgramAdmin = role === Role.PROGRAM_ADMIN || role === "PROGRAM_ADMIN";

  if (!isSuperAdmin && !isProgramAdmin) {
    redirect("/dashboard");
  }

  // Fetch admin user from Prisma to determine department scope
  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, departmentId: true },
  });

  // 2. Fetch courses where status === "PENDING_APPROVAL"
  // Scoped by departmentId if caller is a PROGRAM_ADMIN with a department assigned
  const whereClause: {
    status: CourseStatus;
    departmentId?: string;
  } = {
    status: CourseStatus.PENDING_APPROVAL,
  };

  if (!isSuperAdmin && adminUser?.departmentId) {
    whereClause.departmentId = adminUser.departmentId;
  }

  const pendingCourses = await prisma.course.findMany({
    where: whereClause,
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
  });

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ─── Header Bar ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Briefcase className="w-3.5 h-3.5" />
                {isSuperAdmin ? "SUPER ADMIN" : "PROGRAM ADMIN"}
              </span>
              <span className="text-xs text-slate-500 font-mono">CURRICULUM GOVERNANCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Course Approval Queue
            </h1>
            <p className="text-sm text-slate-400">
              Audit submitted engineering syllabi, ensure departmental compliance, and publish approved masterclasses.
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
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Admin Studio
            </Link>
          </div>
        </div>

        {/* ─── Operational Scope Banner ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Pending Approval Queue</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{pendingCourses.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Department Scope</p>
              <p className="text-base font-semibold text-white mt-1">
                {isSuperAdmin
                  ? "Global (All Departments)"
                  : adminUser?.departmentId || "Unassigned / General"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Reviewer Identity</p>
              <p className="text-sm font-semibold text-slate-200 mt-1 truncate max-w-[200px]">
                {adminUser?.email || session.user.email}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ─── Pending Courses Table ─── */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Submitted Curricula Awaiting Review</h2>
              <p className="text-xs text-slate-400">
                Actioning a course immediately updates the platform catalog and records an immutable audit log.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
              {pendingCourses.length} {pendingCourses.length === 1 ? "Course Pending" : "Courses Pending"}
            </span>
          </div>

          {pendingCourses.length === 0 ? (
            /* Styled Empty State */
            <div className="py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No courses pending approval</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                All submitted curriculum syllabi have been reviewed. When instructors submit new courses for review, they will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#070e1b]/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Course Title</th>
                    <th scope="col" className="px-6 py-3.5">Instructor</th>
                    <th scope="col" className="px-6 py-3.5">Department</th>
                    <th scope="col" className="px-6 py-3.5">Submitted Date</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Approval Actions</th>
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

                        {/* Department */}
                        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                          {course.departmentId ? (
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {course.departmentId}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs">—</span>
                          )}
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

                        {/* Action Buttons */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* Request Revision Button */}
                            <form action={requestRevision.bind(null, course.id)}>
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition active:scale-95 cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Request Revision
                              </button>
                            </form>

                            {/* Approve & Publish Button */}
                            <form action={publishCourse.bind(null, course.id)}>
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/10 transition active:scale-95 cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Approve & Publish
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

      </div>
    </div>
  );
}

