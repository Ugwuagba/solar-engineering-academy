import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Role, CourseStatus } from "@prisma/client";
import { createStaffAccount } from "../actions/user-actions";
import ActiveCoursesRoster from "./ActiveCoursesRoster";
import Link from "next/link";
import {
  ShieldCheck,
  UserPlus,
  Users,
  Calendar,
  Mail,
  ArrowLeft,
  GraduationCap,
  Shield,
  Briefcase,
  BookOpen,
  CreditCard,
  Receipt,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Super Admin | Governance, Learners & Financials",
  description: "Manage system staff, student enrollments, and payment receipts across the platform.",
};

interface PageProps {
  searchParams?: Promise<{ tab?: string }>;
}

export default async function SuperAdminUsersPage({ searchParams }: PageProps) {
  // 1. Defense-in-depth: Verify SUPER_ADMIN role
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/super-admin/users");
  }

  const role = session.user.role;
  if (role !== Role.SUPER_ADMIN && role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  // Resolve current active tab (?tab=staff | ?tab=learners | ?tab=financials | ?tab=courses)
  const resolvedParams = searchParams ? await searchParams : {};
  const activeTab =
    resolvedParams.tab === "learners" ||
    resolvedParams.tab === "financials" ||
    resolvedParams.tab === "courses"
      ? resolvedParams.tab
      : "staff";

  // 2. Overview metrics & counts across all roles
  const [
    totalUsersCount,
    superAdminsCount,
    programAdminsCount,
    instructorsCount,
    learnersCount,
    allPaymentsTotal,
    publishedCoursesCount,
  ] = await Promise.all([
    prisma.user.count().catch(() => 0),
    prisma.user.count({ where: { role: Role.SUPER_ADMIN } }).catch(() => 0),
    prisma.user.count({ where: { role: Role.PROGRAM_ADMIN } }).catch(() => 0),
    prisma.user.count({ where: { role: Role.INSTRUCTOR } }).catch(() => 0),
    prisma.user.count({
      where: {
        role: { in: [Role.LEARNER, Role.STUDENT] },
      },
    }).catch(() => 0),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED" },
    }).catch(() => ({ _sum: { amount: 0 } })),
    prisma.course.count({
      where: {
        OR: [
          { status: CourseStatus.PUBLISHED },
          { isPublished: true },
        ],
      },
    }).catch(() => 0),
  ]);

  const totalRevenue = allPaymentsTotal._sum?.amount || 0;

  // 3. Tab-specific data fetching
  // Staff users: Super Admins, Program Admins, Instructors
  const staffUsers =
    activeTab === "staff"
      ? await prisma.user.findMany({
          where: {
            role: {
              in: [
                Role.SUPER_ADMIN,
                Role.PROGRAM_ADMIN,
                Role.INSTRUCTOR,
                Role.ADMIN,
              ],
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
            courses: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

  // Learners: Students & Learners with their enrollments and payments
  const learnerUsers =
    activeTab === "learners"
      ? await prisma.user.findMany({
          where: {
            role: { in: [Role.LEARNER, Role.STUDENT] },
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            enrollments: {
              select: {
                id: true,
                amountPaid: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                    code: true,
                  },
                },
              },
            },
            payments: {
              select: {
                id: true,
                amount: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

  // Financials: All Payment records
  const payments =
    activeTab === "financials"
      ? await prisma.payment.findMany({
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
                title: true,
                code: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

  // Active Courses: Published courses with instructors and enrolled student rosters
  const publishedCourses =
    activeTab === "courses"
      ? await prisma.course.findMany({
          where: {
            OR: [
              { status: CourseStatus.PUBLISHED },
              { isPublished: true },
            ],
          },
          select: {
            id: true,
            title: true,
            code: true,
            slug: true,
            level: true,
            price: true,
            status: true,
            instructorName: true,
            instructor: {
              select: {
                name: true,
                email: true,
              },
            },
            enrollments: {
              orderBy: {
                enrolledAt: "desc",
              },
              select: {
                id: true,
                status: true,
                progressPercent: true,
                enrolledAt: true,
                createdAt: true,
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
        })
      : [];

  const serializedPublishedCourses = publishedCourses.map((c) => ({
    id: c.id,
    title: c.title,
    code: c.code,
    slug: c.slug,
    level: c.level,
    price: Number(c.price || 0),
    status: c.status,
    instructorName: c.instructor?.name || c.instructorName || "Faculty Lead",
    instructorEmail: c.instructor?.email || "No email available",
    enrollments: c.enrollments.map((e) => ({
      id: e.id,
      name: e.user?.name || "Student Learner",
      email: e.user?.email || "No email available",
      enrolledAt: (e.enrolledAt || e.createdAt).toISOString(),
      status: e.status || "ACTIVE",
      progressPercent: Math.round(e.progressPercent || 0),
    })),
  }));

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ─── Header Bar ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> SUPER ADMIN
              </span>
              <span className="text-xs text-slate-500 font-mono">EXECUTIVE CONTROL CENTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Platform Administration
            </h1>
            <p className="text-sm text-slate-400">
              Manage staff permissions, review learner enrollments, and track institution-wide payment receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Admin Studio
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              My Dashboard
            </Link>
          </div>
        </div>

        {/* ─── Metric Badges ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Total Users</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalUsersCount}</p>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <span className="text-xs font-medium">Super Admins</span>
              <Shield className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-400">{superAdminsCount}</p>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-sky-400 mb-1">
              <span className="text-xs font-medium">Program Admins</span>
              <Briefcase className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-sky-400">{programAdminsCount}</p>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-xs font-medium">Instructors</span>
              <GraduationCap className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-400">{instructorsCount}</p>
          </div>

          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-indigo-400 mb-1">
              <span className="text-xs font-medium">Learners</span>
              <Users className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-indigo-400">{learnersCount}</p>
          </div>
        </div>

        {/* ─── URL-Based Tab Navigation ─── */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
          <Link
            href="/super-admin/users?tab=staff"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              activeTab === "staff"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-md shadow-amber-500/5"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent"
            }`}
          >
            <Shield className="w-4 h-4" />
            Staff Governance
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {superAdminsCount + programAdminsCount + instructorsCount}
            </span>
          </Link>

          <Link
            href="/super-admin/users?tab=learners"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              activeTab === "learners"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-md shadow-amber-500/5"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Enrolled Learners
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              {learnersCount}
            </span>
          </Link>

          <Link
            href="/super-admin/users?tab=financials"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              activeTab === "financials"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-md shadow-amber-500/5"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Payment Receipts
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
              ₦{totalRevenue.toLocaleString()}
            </span>
          </Link>

          <Link
            href="/super-admin/users?tab=courses"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              activeTab === "courses"
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
            TAB 1: STAFF GOVERNANCE (?tab=staff)
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            {/* Staff Provisioning Form */}
            <div className="bg-[#0b1528] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Provision New Staff Account</h2>
                  <p className="text-xs text-slate-400">
                    Create an institutional Program Admin or Instructor account. An immutable audit trail is logged automatically.
                  </p>
                </div>
              </div>

              <form action={createStaffAccount} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Email Field */}
                <div className="md:col-span-6 space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
                    Staff Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="instructor@subwayschools.org"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#070e1b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                {/* Role Select */}
                <div className="md:col-span-4 space-y-1.5">
                  <label htmlFor="role" className="block text-xs font-semibold text-slate-300">
                    Assigned Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    defaultValue="PROGRAM_ADMIN"
                    className="w-full px-3.5 py-2.5 bg-[#070e1b] border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  >
                    <option value="PROGRAM_ADMIN">Program Admin (Curriculum & Ops)</option>
                    <option value="INSTRUCTOR">Instructor (Faculty / Lead)</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    Provision Staff
                  </button>
                </div>
              </form>
            </div>

            {/* Staff Table */}
            <div className="bg-[#0b1528] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Staff & Administrative Directory</h2>
                  <p className="text-xs text-slate-400">
                    Showing active platform administrators, program coordinators, and instructors.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  {staffUsers.length} {staffUsers.length === 1 ? "Staff Member" : "Staff Members"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#070e1b]/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">User Email</th>
                      <th scope="col" className="px-6 py-3.5">Role</th>
                      <th scope="col" className="px-6 py-3.5">Active Courses</th>
                      <th scope="col" className="px-6 py-3.5">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-normal">
                    {staffUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                          No staff accounts configured.
                        </td>
                      </tr>
                    ) : (
                      staffUsers.map((u) => {
                        const roleStr = String(u.role);
                        let badgeStyles = "bg-slate-800 text-slate-300 border-slate-700";
                        let roleLabel = roleStr;

                        if (roleStr === "SUPER_ADMIN") {
                          badgeStyles = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                          roleLabel = "SUPER ADMIN";
                        } else if (roleStr === "PROGRAM_ADMIN") {
                          badgeStyles = "bg-sky-500/10 text-sky-400 border-sky-500/30";
                          roleLabel = "PROGRAM ADMIN";
                        } else if (roleStr === "INSTRUCTOR") {
                          badgeStyles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                          roleLabel = "INSTRUCTOR";
                        } else if (roleStr === "ADMIN") {
                          badgeStyles = "bg-orange-500/10 text-orange-400 border-orange-500/30";
                          roleLabel = "ADMIN";
                        }

                        const courseCount = u.courses?.length || 0;

                        return (
                          <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                            {/* User Email */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center uppercase">
                                  {u.email.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium text-white">{u.email}</div>
                                  {u.name && (
                                    <div className="text-xs text-slate-400">{u.name}</div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Role */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles}`}>
                                {roleLabel}
                              </span>
                            </td>

                            {/* Active Courses */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {courseCount > 0 ? (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  {courseCount} {courseCount === 1 ? "Course Assigned" : "Courses Assigned"}
                                </div>
                              ) : (
                                <span className="text-slate-500 text-xs font-mono">0 Courses</span>
                              )}
                            </td>

                            {/* Joined Date */}
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                              <div className="inline-flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                {new Date(u.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
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
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 2: LEARNERS ONLY (?tab=learners)
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "learners" && (
          <div className="bg-[#0b1528] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Registered Learners Directory</h2>
                <p className="text-xs text-slate-400">
                  Track student cohort enrollments, course activity, and lifetime investment.
                </p>
              </div>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg">
                {learnerUsers.length} {learnerUsers.length === 1 ? "Learner" : "Learners"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#070e1b]/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Student Email</th>
                    <th scope="col" className="px-6 py-3.5">Joined Date</th>
                    <th scope="col" className="px-6 py-3.5">Enrolled Courses</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-normal">
                  {learnerUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No registered learners found on the platform.
                      </td>
                    </tr>
                  ) : (
                    learnerUsers.map((learner) => {
                      const enrolledCount = learner.enrollments?.length || 0;

                      // Compute total spent from Payments (fallback to Enrollment amountPaid)
                      const paymentsSum =
                        learner.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
                      const enrollmentsSum =
                        learner.enrollments?.reduce((sum, e) => sum + (e.amountPaid || 0), 0) || 0;
                      const totalSpent = Math.max(paymentsSum, enrollmentsSum);

                      return (
                        <tr key={learner.id} className="hover:bg-slate-800/30 transition-colors">
                          {/* Student Email */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold text-xs flex items-center justify-center uppercase">
                                {learner.email.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-white">{learner.email}</div>
                                {learner.name && (
                                  <div className="text-xs text-slate-400">{learner.name}</div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Joined Date */}
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                            <div className="inline-flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              {new Date(learner.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </td>

                          {/* Enrolled Courses */}
                          <td className="px-6 py-4">
                            {enrolledCount > 0 ? (
                              <div className="flex flex-wrap gap-1.5 max-w-md">
                                {learner.enrollments.map((enr) => (
                                  <span
                                    key={enr.id}
                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-200"
                                    title={enr.course.title}
                                  >
                                    <span className="font-mono text-amber-400 font-semibold">
                                      {enr.course.code}
                                    </span>
                                    <span className="text-slate-400 truncate max-w-[140px]">
                                      {enr.course.title}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500 font-mono">Not yet enrolled</span>
                            )}
                          </td>

                          {/* Total Spent */}
                          <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-semibold text-emerald-400">
                            ₦{totalSpent.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 3: FINANCIALS & PAYMENTS (?tab=financials)
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "financials" && (
          <div className="bg-[#0b1528] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Payment Ledger & Receipts</h2>
                <p className="text-xs text-slate-400">
                  Comprehensive audit trail of course tuition, automated gateway transactions, and settlements.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                {payments.length} {payments.length === 1 ? "Transaction" : "Transactions"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#070e1b]/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Transaction ID</th>
                    <th scope="col" className="px-6 py-3.5">Student Email</th>
                    <th scope="col" className="px-6 py-3.5">Course Paid For</th>
                    <th scope="col" className="px-6 py-3.5">Amount</th>
                    <th scope="col" className="px-6 py-3.5">Date</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-normal">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-3">
                          <Receipt className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-sm font-semibold text-white">No payment transactions recorded yet</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                          When learners complete course tuition payments, automated gateway receipts will appear here in real-time.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => {
                      const isCompleted = p.status === "COMPLETED";

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                          {/* Transaction ID */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                              {p.id.slice(0, 14)}...
                            </span>
                          </td>

                          {/* Student Email */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-white">{p.user?.email || "Unknown"}</div>
                            {p.user?.name && (
                              <div className="text-xs text-slate-500">{p.user.name}</div>
                            )}
                          </td>

                          {/* Course Paid For */}
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-200">{p.course?.title}</div>
                            <div className="font-mono text-xs text-amber-400">{p.course?.code}</div>
                          </td>

                          {/* Amount in Naira */}
                          <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-white">
                            ₦{Number(p.amount).toLocaleString()}
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                            <div className="inline-flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              {new Date(p.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                isCompleted
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            TAB 4: ACTIVE COURSES & ROSTERS (?tab=courses)
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "courses" && (
          <ActiveCoursesRoster courses={serializedPublishedCourses} />
        )}

      </div>
    </div>
  );
}
