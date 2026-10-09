import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Plus, 
  ArrowLeft 
} from "lucide-react";
import AdminStudioClient from "@/components/admin/AdminStudioClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminStudioPage() {
  const session = await getServerSession(authOptions);

  // 1. Dynamic Server Component Prisma Queries for Metric Cards
  const [
    candidatesCount,
    enrollmentsCount,
    activeTracksCount,
    cohortsCount,
    totalQuizAttempts,
    passedQuizAttempts,
    completedEnrollmentsCount,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }).catch(() => 0),
    prisma.enrollment.count().catch(() => 0),
    prisma.course.count().catch(() => 0),
    prisma.cohort.count().catch(() => 0),
    prisma.quizAttempt.count().catch(() => 0),
    prisma.quizAttempt.count({ where: { passed: true } }).catch(() => 0),
    prisma.enrollment.count({ where: { status: "COMPLETED" } }).catch(() => 0),
  ]);

  // Total candidates (fallback to non-admin accounts if roles aren't partitioned)
  let totalCandidates = candidatesCount;
  if (totalCandidates === 0) {
    totalCandidates = await prisma.user.count({ where: { role: { not: "ADMIN" } } }).catch(() => 0);
  }
  if (totalCandidates === 0) {
    totalCandidates = await prisma.user.count().catch(() => 0);
  }

  const totalEnrollments = enrollmentsCount;
  const activeTracks = activeTracksCount;
  const scheduledCohorts = cohortsCount;

  // Dynamic milestone pass rate calculation
  const hasAssessmentData = totalQuizAttempts > 0;
  const milestonePassRate = hasAssessmentData
    ? `${((passedQuizAttempts / totalQuizAttempts) * 100).toFixed(1)}%`
    : null;

  // 2. Fetch live curriculum inventory for the studio table
  let dbCourses: any[] = [];
  try {
    dbCourses = await prisma.course.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        modules: {
          orderBy: { sortOrder: "asc" },
          include: {
            lessons: {
              orderBy: { sortOrder: "asc" },
            },
            quiz: true,
          },
        },
      },
    });
  } catch (err) {
    console.error("Error fetching courses for Admin Studio Server Component:", err);
  }

  const coursesSource = dbCourses || [];

  const initialCourses = coursesSource.map((c: any, idx: number) => ({
    id: c.id || c.code,
    code: c.code,
    title: c.title,
    slug: c.slug,
    level: c.level,
    description: c.description,
    instructorId: c.instructorId,
    instructorName: c.instructorName || c.instructor || "Lead Solar Engineer (Director)",
    fieldAttachment: c.fieldAttachment,
    price: c.price,
    originalPrice: c.originalPrice,
    contactHours: c.contactHours || 40,
    isPublished: c.isPublished ?? true,
    status: c.status || (c.isPublished ? "PUBLISHED" : "DRAFT"),
    order: c.order ?? idx,
    moduleCount: c.modules?.length ?? 0,
    lessonCount: (c.modules || []).reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0),
    quizCount: (c.modules || []).filter((m: any) => !!m.quiz).length,
    createdAt: c.createdAt ? c.createdAt.toString() : new Date().toISOString(),
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                href="/courses"
                className="text-xs font-semibold text-slate-500 hover:text-[#2B82C9] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Catalog</span>
              </Link>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#2B82C9] border border-blue-200 font-mono text-xs font-bold">
                DIRECTORATE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Subway Energy Faculty & Curriculum Studio
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Lead Administrator: <strong className="text-slate-900">{session?.user?.name || session?.user?.email || "Lead Solar Engineer (Director)"}</strong> • Authority Level: <span className="font-mono text-[#2B82C9] font-bold">ADMIN / DIRECTOR</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/students"
              prefetch={false}
              className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center gap-2 shadow-2xs transition-all cursor-pointer bg-white"
            >
              <Users className="w-4 h-4 text-[#2B82C9]" />
              <span>Students &amp; Payments</span>
            </Link>
            <Link
              href="/admin/courses/new"
              prefetch={false}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#2B82C9] hover:bg-blue-600 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Program</span>
            </Link>
          </div>
        </div>

        {/* Top Analytics Cards - Dynamically Calculated from Live Database on Every Request */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Active Tracks */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Active Tracks</span>
              <BookOpen className="w-5 h-5 text-[#2B82C9]" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">{activeTracks || initialCourses.length}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Gated &amp; Field-Attached</span>
            </p>
          </div>

          {/* Card 2: Scheduled Cohorts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Scheduled Cohorts</span>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">{scheduledCohorts}</p>
            <p className="text-xs text-slate-500 mt-1">Active Academic Calendar</p>
          </div>

          {/* Card 3: Total Candidates */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Total Candidates</span>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">{totalCandidates.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{totalEnrollments} active course enrollments</span>
            </p>
          </div>

          {/* Card 4: Milestone Pass Rate or Total Enrollments */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">
                {hasAssessmentData ? "Milestone Pass Rate" : "Total Enrollments"}
              </span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">
              {hasAssessmentData ? milestonePassRate : totalEnrollments.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {hasAssessmentData
                ? `${passedQuizAttempts} of ${totalQuizAttempts} assessments passed`
                : completedEnrollmentsCount > 0
                ? `${completedEnrollmentsCount} completed track ${completedEnrollmentsCount === 1 ? "credential" : "credentials"}`
                : "Verified student enrollments"}
            </p>
          </div>
        </div>

        {/* Interactive Curriculum Studio Client */}
        <AdminStudioClient initialCourses={initialCourses} />
      </div>
    </div>
  );
}
