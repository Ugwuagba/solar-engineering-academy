import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import { draftCourse, submitForApproval } from "./actions/course-actions";
import Link from "next/link";
import {
  GraduationCap,
  BookPlus,
  Send,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowLeft,
  Sparkles,
  Layers
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Instructor Studio | Course Drafting & Approvals",
  description: "Draft solar and storage engineering courses, track approval progress, and manage curriculum modules.",
};

export default async function InstructorStudioPage() {
  // 1. Verify INSTRUCTOR role server-side
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/instructor");
  }

  const role = session.user.role;
  if (role !== Role.INSTRUCTOR && role !== "INSTRUCTOR") {
    redirect("/dashboard");
  }

  const instructorId = session.user.id;

  // 2. Fetch courses belonging to this instructor
  const courses = await prisma.course.findMany({
    where: {
      instructorId,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      title: true,
      slug: true,
      status: true,
      departmentId: true,
      contactHours: true,
      price: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Calculate metrics
  const totalCourses = courses.length;
  const draftCount = courses.filter((c) => c.status === "DRAFT").length;
  const pendingCount = courses.filter((c) => c.status === "PENDING_APPROVAL").length;
  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;
  const revisionCount = courses.filter((c) => c.status === "REVISION_REQUESTED").length;

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
              <span className="text-xs text-slate-500 font-mono">CURRICULUM WORKFLOW</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Course Authoring & Submission
            </h1>
            <p className="text-sm text-slate-400">
              Draft technical modules, assign departmental codes, and submit courses for Program Administration review.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> My Classroom
            </Link>
          </div>
        </div>

        {/* ─── Metric Overview Cards ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">My Courses</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalCourses}</p>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Drafts</span>
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-200">{draftCount}</p>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <span className="text-xs font-medium">Pending Review</span>
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-400">{pendingCount}</p>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-xs font-medium">Published</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-400">{publishedCount}</p>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-rose-400 mb-1">
              <span className="text-xs font-medium">Revisions</span>
              <AlertCircle className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-rose-400">{revisionCount}</p>
          </div>
        </div>

        {/* ─── React Server Component Course Draft Form ─── */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Draft a New Course</h2>
              <p className="text-xs text-slate-400">
                Initialize a draft syllabus in your portfolio. Once ready, you can submit it to the Program Administrator for review.
              </p>
            </div>
          </div>

          <form action={draftCourse} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Title Input */}
            <div className="md:col-span-7 space-y-1.5">
              <label htmlFor="title" className="block text-xs font-semibold text-slate-300">
                Course Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. SOLAR 203 - Commercial Microgrid Protection & Sync"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#070e1b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Department ID Input */}
            <div className="md:col-span-3 space-y-1.5">
              <label htmlFor="departmentId" className="block text-xs font-semibold text-slate-300">
                Department ID <span className="text-slate-500 text-[11px] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="departmentId"
                  name="departmentId"
                  type="text"
                  placeholder="e.g. DEPT-SOLAR-02"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#070e1b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <BookPlus className="w-4 h-4" />
                Draft Course
              </button>
            </div>
          </form>
        </div>

        {/* ─── Tailwind Course Pipeline Table ─── */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">My Authored Courses</h2>
              <p className="text-xs text-slate-400">
                Manage your syllabus drafts, inspect review states, and send ready courses to the approval queue.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              {courses.length} {courses.length === 1 ? "Program" : "Programs"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#070e1b]/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Course Title</th>
                  <th scope="col" className="px-6 py-3.5">Department</th>
                  <th scope="col" className="px-6 py-3.5">Status</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Workflow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-normal">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      You haven&apos;t drafted any courses yet. Use the form above to initialize your first curriculum.
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => {
                    const statusStr = String(course.status);

                    // Color-coded status badge configuration
                    let badgeStyles = "bg-slate-800 text-slate-300 border-slate-700";
                    let statusLabel = statusStr;

                    if (statusStr === "DRAFT") {
                      badgeStyles = "bg-slate-800 text-slate-300 border-slate-700";
                      statusLabel = "DRAFT";
                    } else if (statusStr === "PENDING_APPROVAL") {
                      badgeStyles = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                      statusLabel = "PENDING APPROVAL";
                    } else if (statusStr === "PUBLISHED") {
                      badgeStyles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                      statusLabel = "PUBLISHED";
                    } else if (statusStr === "REVISION_REQUESTED") {
                      badgeStyles = "bg-rose-500/10 text-rose-400 border-rose-500/30";
                      statusLabel = "REVISION REQUESTED";
                    }

                    // Submission allowed ONLY if status is DRAFT or REVISION_REQUESTED
                    const canSubmit = statusStr === "DRAFT" || statusStr === "REVISION_REQUESTED";

                    return (
                      <tr key={course.id} className="hover:bg-slate-800/30 transition-colors">
                        {/* Course Title & Code */}
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{course.title}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-xs text-amber-400/90">{course.code}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs text-slate-500 font-mono">/{course.slug}</span>
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

                        {/* Status Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles}`}>
                            {statusLabel}
                          </span>
                        </td>

                        {/* Workflow Action */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {canSubmit ? (
                            <form action={submitForApproval.bind(null, course.id)} className="inline-block">
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-md shadow-amber-500/10 transition-all cursor-pointer active:scale-95"
                              >
                                <Send className="w-3.5 h-3.5" />
                                Submit for Approval
                              </button>
                            </form>
                          ) : statusStr === "PENDING_APPROVAL" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 text-slate-400 text-xs border border-slate-800 cursor-not-allowed">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              Under Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 text-emerald-400 text-xs border border-emerald-500/20 cursor-not-allowed">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Live on Platform
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

