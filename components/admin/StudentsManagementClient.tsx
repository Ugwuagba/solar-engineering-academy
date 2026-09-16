"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Users, 
  CreditCard, 
  Search, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  GraduationCap,
  X,
  UserCheck
} from "lucide-react";

export interface RegisteredUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  enrollments?: Array<{
    id: string;
    courseId: string;
    status: string;
    course?: {
      code: string;
      title: string;
      price: number;
    };
  }>;
}

export interface PaidEnrollment {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  progressPercent: number;
  enrolledAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
  course?: {
    id: string;
    code: string;
    title: string;
    price: number;
  };
}

interface Props {
  initialStudents: RegisteredUser[];
  initialEnrollments: PaidEnrollment[];
  sessionUser?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function StudentsManagementClient({
  initialStudents,
  initialEnrollments,
  sessionUser,
}: Props) {
  const [activeTab, setActiveTab] = useState<"users" | "enrollments">("users");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered datasets based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return initialStudents;
    const q = searchQuery.toLowerCase().trim();
    return initialStudents.filter((student) => {
      const name = (student.name || "").toLowerCase();
      const email = student.email.toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [initialStudents, searchQuery]);

  const filteredEnrollments = useMemo(() => {
    if (!searchQuery.trim()) return initialEnrollments;
    const q = searchQuery.toLowerCase().trim();
    return initialEnrollments.filter((enrollment) => {
      const userName = (enrollment.user?.name || "").toLowerCase();
      const userEmail = (enrollment.user?.email || "").toLowerCase();
      const courseTitle = (enrollment.course?.title || "").toLowerCase();
      const courseCode = (enrollment.course?.code || "").toLowerCase();
      return (
        userName.includes(q) ||
        userEmail.includes(q) ||
        courseTitle.includes(q) ||
        courseCode.includes(q)
      );
    });
  }, [initialEnrollments, searchQuery]);

  // Aggregate Metrics
  const totalTuition = useMemo(() => {
    return initialEnrollments.reduce((acc, e) => acc + (e.course?.price || 0), 0);
  }, [initialEnrollments]);

  const verifiedStudentsCount = useMemo(() => {
    return initialStudents.filter((s) => s.isEmailVerified).length;
  }, [initialStudents]);

  // CSV Export Handler
  const handleExportCsv = () => {
    const today = new Date().toISOString().slice(0, 10);

    if (activeTab === "users") {
      const headers = ["Full Name", "Email", "Verification Status", "Date Registered", "Courses Enrolled Count"];
      const rows = filteredStudents.map((s) => [
        `"${(s.name || "Candidate").replace(/"/g, '""')}"`,
        `"${s.email.replace(/"/g, '""')}"`,
        `"${s.isEmailVerified ? "Verified" : "Pending Verification"}"`,
        `"${new Date(s.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}"`,
        `"${s.enrollments?.length || 0}"`,
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `subway-schools-registered-users-${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ["Student Name", "Email", "Course Code", "Course Title", "Amount Paid (NGN)", "Payment Date", "Access Status"];
      const rows = filteredEnrollments.map((e) => [
        `"${(e.user?.name || "Student").replace(/"/g, '""')}"`,
        `"${(e.user?.email || "N/A").replace(/"/g, '""')}"`,
        `"${(e.course?.code || "N/A").replace(/"/g, '""')}"`,
        `"${(e.course?.title || "N/A").replace(/"/g, '""')}"`,
        `"₦${(e.course?.price || 0).toLocaleString()}"`,
        `"${new Date(e.enrolledAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}"`,
        `"${e.status || "ACTIVE"}"`,
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `subway-schools-paid-enrollments-${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                href="/admin"
                className="text-xs font-semibold text-slate-500 hover:text-[#2B82C9] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Studio Overview</span>
              </Link>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#2B82C9] border border-blue-200 font-mono text-xs font-bold">
                ENROLLMENT REGISTRY
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Students &amp; Paid Enrollments Roster
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Admin Supervisor: <strong className="text-slate-900">{sessionUser?.name || sessionUser?.email || "Lead Solar Engineer"}</strong> • Authority Level: <span className="font-mono text-[#2B82C9] font-bold">ADMIN / DIRECTOR</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center gap-2 shadow-2xs transition-all cursor-pointer bg-white"
              title="Download filtered roster as CSV"
            >
              <Download className="w-4 h-4 text-[#2B82C9]" />
              <span>Export CSV</span>
            </button>
            <Link
              href="/admin/courses/new"
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-[#2B82C9] hover:bg-blue-600 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Create Program</span>
            </Link>
          </div>
        </div>

        {/* Analytics Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Registered Candidates</span>
              <Users className="w-5 h-5 text-[#2B82C9]" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">{initialStudents.length}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{verifiedStudentsCount} Email Verified</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Paid Program Enrollments</span>
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">{initialEnrollments.length}</p>
            <p className="text-xs text-slate-500 mt-1">Active Classroom Credentials</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Total Tuition Volume</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">
              ₦{totalTuition.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Paid Tuition Inflow</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Accreditation Rate</span>
              <GraduationCap className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">100%</p>
            <p className="text-xs text-slate-500 mt-1">Verifiable Credentials</p>
          </div>
        </div>

        {/* Tab & Search Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl max-w-fit">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "users"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#2B82C9]" />
                <span>Registered Users</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-700">
                  {initialStudents.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("enrollments")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "enrollments"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paid Students</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-800">
                  {initialEnrollments.length}
                </span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === "users" ? "Search by candidate name or email..." : "Search by student, email, or course..."}
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#2B82C9] focus:ring-1 focus:ring-[#2B82C9] bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          
          {/* TAB 1: Registered Users */}
          {activeTab === "users" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-mono uppercase tracking-wider">
                    <th className="py-3.5 px-6 font-bold">Avatar &amp; Full Name</th>
                    <th className="py-3.5 px-6 font-bold">Email Address</th>
                    <th className="py-3.5 px-6 font-bold">Verification Status</th>
                    <th className="py-3.5 px-6 font-bold">Date Registered</th>
                    <th className="py-3.5 px-6 font-bold text-right">Courses Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const initials = (student.name || student.email.split("@")[0])
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                                {initials || "ST"}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block text-sm">
                                  {student.name || "Candidate"}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  ID: {student.id.slice(0, 8)}...
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span className="font-mono text-slate-700">{student.email}</span>
                          </td>

                          <td className="py-4 px-6">
                            {student.isEmailVerified ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-slate-600 font-mono">
                            {new Date(student.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-blue-50 text-[#2B82C9] border border-blue-200">
                              {student.enrollments?.length || 0} {student.enrollments?.length === 1 ? "Program" : "Programs"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-600">No students match your query</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Paid Students */}
          {activeTab === "enrollments" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-mono uppercase tracking-wider">
                    <th className="py-3.5 px-6 font-bold">Student Candidate</th>
                    <th className="py-3.5 px-6 font-bold">Email Address</th>
                    <th className="py-3.5 px-6 font-bold">Enrolled Program</th>
                    <th className="py-3.5 px-6 font-bold">Amount Paid</th>
                    <th className="py-3.5 px-6 font-bold">Payment Date</th>
                    <th className="py-3.5 px-6 font-bold text-right">Access Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnrollments.length > 0 ? (
                    filteredEnrollments.map((enrollment) => {
                      const initials = (enrollment.user?.name || enrollment.user?.email || "ST")
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();

                      return (
                        <tr key={enrollment.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                                {initials || "ST"}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block text-sm">
                                  {enrollment.user?.name || "Student Candidate"}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  Progression: {enrollment.progressPercent || 0}%
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span className="font-mono text-slate-700">
                              {enrollment.user?.email || "N/A"}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            <div>
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-[#2B82C9] border border-blue-200 mb-0.5">
                                {enrollment.course?.code || "COURSE"}
                              </span>
                              <span className="font-bold text-slate-900 block text-xs line-clamp-1 max-w-xs">
                                {enrollment.course?.title || "Enrolled Technical Program"}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span className="font-black text-slate-900 font-mono text-sm">
                              ₦{(enrollment.course?.price || 0).toLocaleString()}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-slate-600 font-mono">
                            {new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                              <CheckCircle2 className="w-3 h-3" />
                              {enrollment.status || "ACTIVE"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-600">No enrollment records found</p>
                        <p className="text-xs text-slate-400 mt-1">Paid candidate course enrollments will appear here</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
