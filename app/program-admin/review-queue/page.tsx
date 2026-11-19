import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Role, CourseStatus } from "@prisma/client";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  BookOpen,
  Calendar,
  AlertCircle,
  FileCheck
} from "lucide-react";
import { publishCourse, requestRevision } from "../actions/approval-actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Curriculum Review Queue | Subway Energy Faculty Studio",
  description: "Audit submitted engineering course syllabi, verify accreditation standards, and approve for publication.",
};

export default async function ProgramAdminReviewQueuePage() {
  // 1. Route Security: Require NextAuth session with PROGRAM_ADMIN, SUPER_ADMIN, or legacy ADMIN role
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/program-admin/review-queue");
  }

  const role = session.user.role;
  const isAuthorized =
    role === Role.PROGRAM_ADMIN ||
    role === "PROGRAM_ADMIN" ||
    role === Role.SUPER_ADMIN ||
    role === "SUPER_ADMIN" ||
    role === Role.ADMIN ||
    role === "ADMIN";

  if (!isAuthorized) {
    redirect("/dashboard");
  }

  // 2. Data Fetching: Fetch pending submissions and catalog counts
  const [pendingCourses, totalPublished, totalDrafts] = await Promise.all([
    prisma.course.findMany({
      where: {
        status: CourseStatus.PENDING_APPROVAL,
      },
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
    }),
    prisma.course.count({ where: { status: CourseStatus.PUBLISHED } }).catch(() => 0),
    prisma.course.count({ where: { status: CourseStatus.DRAFT } }).catch(() => 0),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ─── Header Bar ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                href="/program-admin"
                prefetch={false}
                className="text-xs font-semibold text-slate-500 hover:text-[#2B82C9] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Studio Overview</span>
              </Link>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-mono text-xs font-bold">
                CURRICULUM GOVERNANCE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Curriculum Review Queue
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Reviewing Officer: <strong className="text-slate-900">{session.user.name || session.user.email}</strong> • Authority Level: <span className="font-mono text-[#2B82C9] font-bold">{session.user.role || "PROGRAM_ADMIN"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>{pendingCourses.length} {pendingCourses.length === 1 ? "Pending Submission" : "Pending Submissions"}</span>
            </span>
          </div>
        </div>

        {/* ─── Top Highlights Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Pending Submissions</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">{pendingCourses.length}</p>
            <p className="text-xs text-amber-700 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Awaiting accreditation review</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Live Published Tracks</span>
              <FileCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">{totalPublished}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active in public catalog</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Faculty Drafts</span>
              <BookOpen className="w-5 h-5 text-[#2B82C9]" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">{totalDrafts}</p>
            <p className="text-xs text-slate-500 mt-1">Under instructor preparation</p>
          </div>
        </div>

        {/* ─── Submissions Inventory Table ─── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Submitted Syllabi Awaiting Action</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit module structures, preview student experience, and either publish to live catalog or provide revision notes.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Total Queue: {pendingCourses.length}
            </span>
          </div>

          {pendingCourses.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Review Queue is Clear</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  All submitted course materials have been processed. When instructors submit new curricula for governance approval, they will automatically appear here.
                </p>
              </div>
              <Link
                href="/program-admin"
                className="mt-2 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                Return to Studio Overview
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Course Code &amp; Title</th>
                    <th scope="col" className="px-6 py-3.5">Assigned Instructor</th>
                    <th scope="col" className="px-6 py-3.5">Submitted Date</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Approval &amp; Feedback Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {pendingCourses.map((course) => {
                    const instructorName =
                      course.instructor?.name || course.instructorName || "Subway Engineering Faculty";
                    const instructorEmail =
                      course.instructor?.email || "Email not available";
                    const submittedDate = new Date(course.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Course Code & Title */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-[#2B82C9] border border-blue-200">
                                {course.code}
                              </span>
                              <span className="font-bold text-slate-900">{course.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>Level: <strong>{course.level}</strong></span>
                              <span>•</span>
                              <span>Hours: <strong>{course.contactHours} hrs</strong></span>
                              <span>•</span>
                              <span>Price: <strong>₦{Number(course.price || 0).toLocaleString()}</strong></span>
                            </div>
                          </div>
                        </td>

                        {/* Instructor */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center uppercase">
                              {instructorName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900">{instructorName}</div>
                              <div className="text-[11px] text-slate-500">{instructorEmail}</div>
                            </div>
                          </div>
                        </td>

                        {/* Submitted Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          <div className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{submittedDate}</span>
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex flex-wrap items-center justify-end gap-2.5">
                            {/* 1. Preview Course Link */}
                            <Link
                              href={`/courses/${course.slug || course.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:text-slate-900 text-xs font-bold shadow-2xs transition"
                              title="Preview student-facing course view in a new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#2B82C9]" />
                              <span>Preview</span>
                            </Link>

                            {/* 2. Approve & Publish Button */}
                            <form action={publishCourse.bind(null, course.id)}>
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve &amp; Publish</span>
                              </button>
                            </form>

                            {/* 3. Request Revision Form */}
                            <form action={requestRevision} className="inline-flex items-center gap-1.5">
                              <input type="hidden" name="courseId" value={course.id} />
                              <input
                                type="text"
                                name="feedback"
                                placeholder="Revision feedback..."
                                className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 w-36"
                              />
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition active:scale-95 cursor-pointer whitespace-nowrap"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                                <span>Request Revision</span>
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

