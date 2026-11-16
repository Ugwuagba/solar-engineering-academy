import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import { createStaffAccount } from "../actions/user-actions";
import Link from "next/link";
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Building2, 
  Calendar, 
  Mail, 
  ArrowLeft,
  GraduationCap,
  Shield,
  Briefcase
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Super Admin | User & Staff Governance",
  description: "Manage system users, provision staff accounts, and enforce role-based access control.",
};

export default async function SuperAdminUsersPage() {
  // 1. Defense-in-depth: Verify SUPER_ADMIN role
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/super-admin/users");
  }

  const role = session.user.role;
  if (role !== Role.SUPER_ADMIN && role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  // 2. Fetch all users from Prisma (excluding sensitive credentials)
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      departmentId: true,
      isEmailVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Role counters for overview metric cards
  const totalUsers = users.length;
  const superAdminsCount = users.filter((u) => u.role === Role.SUPER_ADMIN || (u.role as string) === "SUPER_ADMIN").length;
  const programAdminsCount = users.filter((u) => u.role === Role.PROGRAM_ADMIN || (u.role as string) === "PROGRAM_ADMIN").length;
  const instructorsCount = users.filter((u) => u.role === Role.INSTRUCTOR || (u.role as string) === "INSTRUCTOR").length;
  const learnersCount = users.filter((u) => u.role === Role.LEARNER || (u.role as string) === "LEARNER" || (u.role as string) === "STUDENT").length;

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> SUPER ADMIN
              </span>
              <span className="text-xs text-slate-500 font-mono">RBAC GOVERNANCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              User & Staff Management
            </h1>
            <p className="text-sm text-slate-400">
              Provision administrative staff accounts, configure departmental scopes, and inspect platform membership.
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

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-[#0b1528] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Total Users</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{totalUsers}</p>
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

        {/* ─── React Server Component Staff Provisioning Form ─── */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Provision New Staff Account</h2>
              <p className="text-xs text-slate-400">
                Create an authenticated Program Admin or Instructor account. An audit trail will be generated automatically.
              </p>
            </div>
          </div>

          <form action={createStaffAccount} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Email Field */}
            <div className="md:col-span-4 space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
                Staff Email <span className="text-rose-500">*</span>
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
            <div className="md:col-span-3 space-y-1.5">
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

            {/* Department ID (Optional) */}
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
                  placeholder="e.g. DEPT-SOLAR-01"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#070e1b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>
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

        {/* ─── Cleanly Styled Tailwind Users Table ─── */}
        <div className="bg-[#0b1528] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Platform Users Directory</h2>
              <p className="text-xs text-slate-400">
                Listing all registered accounts across all roles. Passwords and credentials are securely protected.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              {users.length} {users.length === 1 ? "Record" : "Records"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#070e1b]/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">User Email</th>
                  <th scope="col" className="px-6 py-3.5">Role</th>
                  <th scope="col" className="px-6 py-3.5">Department</th>
                  <th scope="col" className="px-6 py-3.5">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-normal">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      No users found in the system.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    // Role Badge Styles
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
                    } else if (roleStr === "LEARNER" || roleStr === "STUDENT") {
                      badgeStyles = "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
                      roleLabel = "LEARNER";
                    }

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

                        {/* Department */}
                        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                          {u.departmentId ? (
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {u.departmentId}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs">—</span>
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
    </div>
  );
}

