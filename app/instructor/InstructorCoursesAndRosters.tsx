"use client";

import { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Edit3,
  Clock,
  AlertCircle,
  Send,
  Loader2,
  Search,
  Filter,
  CreditCard,
  GraduationCap
} from "lucide-react";
import DeleteCourseButton from "./DeleteCourseButton";
import { submitForApproval } from "./actions/course-actions";

export interface InstructorRosterStudent {
  id: string; // enrollment id
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  enrolledAt: string;
  status: string;
  progressPercent: number;
  amountPaid: number;
  isPaid: boolean;
  paymentStatus: "PAID" | "UNPAID" | "FREE";
  courseId: string;
  courseTitle: string;
  courseCode: string;
  paymentDate?: string | null;
}

export interface InstructorCourseItem {
  id: string;
  code: string;
  title: string;
  slug: string;
  status: string;
  isPublished: boolean;
  price: number;
  contactHours: number;
  revisionFeedback?: string | null;
  enrolledCount: number;
  paidCount: number;
  revenue: number;
  students: InstructorRosterStudent[];
}

interface InstructorCoursesAndRostersProps {
  courses: InstructorCourseItem[];
}

export default function InstructorCoursesAndRosters({
  courses,
}: InstructorCoursesAndRostersProps) {
  const [activeTab, setActiveTab] = useState<"by-course" | "all-paid">("by-course");
  const [openCourseIds, setOpenCourseIds] = useState<Record<string, boolean>>({});
  const [drawerFilters, setDrawerFilters] = useState<Record<string, "paid" | "all">>({});
  const [isPending, startTransition] = useTransition();
  const [submittingCourseId, setSubmittingCourseId] = useState<string | null>(null);

  // Tab 2 Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("ALL");

  const toggleCourse = (id: string) => {
    setOpenCourseIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const setDrawerFilter = (courseId: string, filterType: "paid" | "all") => {
    setDrawerFilters((prev) => ({
      ...prev,
      [courseId]: filterType,
    }));
  };

  // Flatten all paid students across all authored courses (ZERO unenrolled users)
  const allPaidStudents = useMemo(() => {
    const list: InstructorRosterStudent[] = [];
    for (const c of courses) {
      for (const s of c.students) {
        if (s.isPaid) {
          list.push(s);
        }
      }
    }
    return list;
  }, [courses]);

  // Tab 2 Filtered Paid Students
  const filteredPaidStudents = useMemo(() => {
    return allPaidStudents.filter((s) => {
      const matchesCourse = courseFilter === "ALL" || s.courseId === courseFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.courseTitle.toLowerCase().includes(q) ||
        s.courseCode.toLowerCase().includes(q);
      return matchesCourse && matchesSearch;
    });
  }, [allPaidStudents, courseFilter, searchQuery]);

  const handleSubmitCourse = (courseId: string) => {
    setSubmittingCourseId(courseId);
    startTransition(async () => {
      try {
        await submitForApproval(courseId);
      } catch (err: any) {
        console.error("Failed to submit course for approval:", err);
        alert(err?.message || "Failed to submit course for approval.");
      } finally {
        setSubmittingCourseId(null);
      }
    });
  };

  return (
    <div className="bg-[#0b1528] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* ─── Header with Navigation View Toggle ─── */}
      <div className="px-6 py-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>My Authored Courses &amp; Student Rosters</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your syllabus drafts, inspect review states, and inspect paid student rosters across your authored tracks.
          </p>
        </div>

        {/* View Toggle Bar */}
        <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("by-course")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === "by-course"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Paid Students by Course</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-md bg-slate-800 text-slate-300">
              {courses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("all-paid")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === "all-paid"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>All Paid Students</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300">
              {allPaidStudents.length}
            </span>
          </button>
        </div>
      </div>

      {/* ─── TAB 1: PAID STUDENTS BY COURSE ─── */}
      {activeTab === "by-course" && (
        <div>
          {courses.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No courses authored yet</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                You haven&apos;t drafted any courses yet. Use the Course Architect above to initialize your first curriculum.
              </p>
              <Link
                href="/instructor/courses/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md transition"
              >
                + Create New Program
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {courses.map((course) => {
                const isOpen = Boolean(openCourseIds[course.id]);
                const filterMode = drawerFilters[course.id] || (course.paidCount > 0 ? "paid" : "all");
                const displayedStudents =
                  filterMode === "paid"
                    ? course.students.filter((s) => s.isPaid)
                    : course.students;

                const statusStr = course.status;
                let badgeStyles = "bg-slate-800 text-slate-300 border-slate-700";
                let statusLabel = statusStr;

                if (statusStr === "DRAFT") {
                  badgeStyles = "bg-slate-800 text-slate-300 border-slate-700";
                  statusLabel = "DRAFT";
                } else if (statusStr === "PENDING_APPROVAL") {
                  badgeStyles = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                  statusLabel = "PENDING APPROVAL";
                } else if (statusStr === "PUBLISHED" || course.isPublished) {
                  badgeStyles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                  statusLabel = "PUBLISHED";
                } else if (statusStr === "REVISION_REQUESTED") {
                  badgeStyles = "bg-rose-500/10 text-rose-400 border-rose-500/30";
                  statusLabel = "REVISION REQUESTED";
                }

                const canSubmit = statusStr === "DRAFT" || statusStr === "REVISION_REQUESTED";
                const isApprovedByAdmin = Boolean(course.isPublished || statusStr === "PUBLISHED");
                const isSubmittingThis = isPending && submittingCourseId === course.id;

                return (
                  <div key={course.id} className="p-6 hover:bg-slate-800/10 transition-colors">
                    {/* Top Row: Course Info & Metrics */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      {/* Left: Info, Badges, Links */}
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-base text-white">{course.title}</span>
                          <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {course.code}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyles}`}
                          >
                            {statusLabel}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          <span>
                            Price:{" "}
                            <strong className="text-slate-200">
                              {course.price > 0 ? `₦${course.price.toLocaleString()}` : "Free"}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            Hours: <strong className="text-slate-300">{course.contactHours}h</strong>
                          </span>
                          <span>•</span>
                          <Link
                            href={`/courses/${course.slug || course.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-medium"
                          >
                            <span>Preview Syllabus</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>

                        {/* Revision feedback display if requested */}
                        {statusStr === "REVISION_REQUESTED" && course.revisionFeedback && (
                          <div className="mt-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-rose-200">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>Program Admin Feedback:</span>
                            </div>
                            <p className="pl-5 text-slate-300 leading-relaxed">
                              {course.revisionFeedback}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Middle/Right: Real Course Metrics */}
                      <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                        {/* Enrolled */}
                        <div className="bg-[#070e1b] border border-slate-800 rounded-xl px-3.5 py-2 text-center min-w-[90px]">
                          <div className="text-[10px] font-mono uppercase text-slate-400">Enrolled</div>
                          <div className="text-base font-bold text-slate-200 font-mono">
                            {course.enrolledCount}
                          </div>
                        </div>

                        {/* Paid Students */}
                        <div className="bg-[#070e1b] border border-slate-800 rounded-xl px-3.5 py-2 text-center min-w-[90px]">
                          <div className="text-[10px] font-mono uppercase text-emerald-400">Paid</div>
                          <div className="text-base font-bold text-emerald-400 font-mono">
                            {course.paidCount}
                          </div>
                        </div>

                        {/* Revenue */}
                        <div className="bg-[#070e1b] border border-slate-800 rounded-xl px-3.5 py-2 text-center min-w-[110px]">
                          <div className="text-[10px] font-mono uppercase text-sky-400">Revenue</div>
                          <div className="text-base font-bold text-sky-400 font-mono">
                            ₦{course.revenue.toLocaleString()}
                          </div>
                        </div>

                        {/* Authoring Actions */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/instructor/courses/${course.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                            <span>{statusStr === "REVISION_REQUESTED" ? "Edit & Resubmit" : "Edit"}</span>
                          </Link>

                          <DeleteCourseButton
                            courseId={course.id}
                            courseTitle={course.title}
                            isApproved={isApprovedByAdmin}
                          />

                          {canSubmit && (
                            <button
                              type="button"
                              onClick={() => handleSubmitCourse(course.id)}
                              disabled={isSubmittingThis}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-md shadow-amber-500/10 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                              {isSubmittingThis ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Submitting...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Submit for Approval</span>
                                </>
                              )}
                            </button>
                          )}

                          {statusStr === "PENDING_APPROVAL" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 text-slate-400 text-xs border border-slate-800">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              Under Review
                            </span>
                          )}

                          {(statusStr === "PUBLISHED" || course.isPublished) && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 text-emerald-400 text-xs border border-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              Live on Platform
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Roster Button */}
                    <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleCourse(course.id)}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 cursor-pointer select-none bg-sky-500/10 hover:bg-sky-500/15 border border-sky-500/20 px-3.5 py-1.5 rounded-xl transition"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>View Paid &amp; Enrolled Roster ({course.enrolledCount})</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-sky-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div className="text-xs text-slate-500 font-mono hidden sm:block">
                        {course.paidCount} Verified Paid • {course.enrolledCount - course.paidCount} Free/Audit
                      </div>
                    </div>

                    {/* Expandable Drawer Content */}
                    {isOpen && (
                      <div className="mt-3 bg-[#070e1b] border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                        {/* Drawer Filter Sub-Bar */}
                        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                              Filter Roster:
                            </span>
                            <button
                              type="button"
                              onClick={() => setDrawerFilter(course.id, "paid")}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                                filterMode === "paid"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              Paid Only ({course.paidCount})
                            </button>
                            <button
                              type="button"
                              onClick={() => setDrawerFilter(course.id, "all")}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                                filterMode === "all"
                                  ? "bg-slate-800 text-white border border-slate-700"
                                  : "text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              All Course Enrollees ({course.enrolledCount})
                            </button>
                          </div>

                          <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
                            Showing {displayedStudents.length} of {course.enrolledCount} enrolled
                          </span>
                        </div>

                        {/* Roster Table */}
                        {displayedStudents.length === 0 ? (
                          <div className="py-8 px-4 text-center text-xs text-slate-400">
                            {filterMode === "paid"
                              ? "No paid students enrolled in this course yet."
                              : "No students enrolled in this course yet."}
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-[#0b1528] border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                <tr>
                                  <th scope="col" className="px-4 py-2.5">STUDENT NAME</th>
                                  <th scope="col" className="px-4 py-2.5">EMAIL ADDRESS</th>
                                  <th scope="col" className="px-4 py-2.5">AMOUNT PAID</th>
                                  <th scope="col" className="px-4 py-2.5">PAYMENT STATUS</th>
                                  <th scope="col" className="px-4 py-2.5">ENROLLED DATE</th>
                                  <th scope="col" className="px-4 py-2.5 text-right">PROGRESS %</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60">
                                {displayedStudents.map((student) => {
                                  const enrolledDateFormatted = new Date(
                                    student.enrolledAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  });

                                  return (
                                    <tr
                                      key={student.id}
                                      className="hover:bg-slate-800/30 transition-colors"
                                    >
                                      {/* Name */}
                                      <td className="px-4 py-2.5 font-medium text-slate-200">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[10px] flex items-center justify-center uppercase shrink-0">
                                            {student.name.charAt(0)}
                                          </div>
                                          <span>{student.name}</span>
                                        </div>
                                      </td>

                                      {/* Email */}
                                      <td className="px-4 py-2.5 font-mono text-slate-300">
                                        {student.email}
                                      </td>

                                      {/* Amount Paid */}
                                      <td className="px-4 py-2.5 font-mono font-semibold text-emerald-400">
                                        {student.amountPaid > 0
                                          ? `₦${student.amountPaid.toLocaleString()}`
                                          : "₦0"}
                                      </td>

                                      {/* Payment Status */}
                                      <td className="px-4 py-2.5">
                                        {student.isPaid ? (
                                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            PAID
                                          </span>
                                        ) : course.price === 0 ? (
                                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                            FREE TIER
                                          </span>
                                        ) : (
                                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                            UNPAID / AUDIT
                                          </span>
                                        )}
                                      </td>

                                      {/* Enrolled Date */}
                                      <td className="px-4 py-2.5 text-slate-400">
                                        {enrolledDateFormatted}
                                      </td>

                                      {/* Progress */}
                                      <td className="px-4 py-2.5 text-right font-mono">
                                        <div className="flex items-center justify-end gap-2">
                                          <span className="text-slate-300">
                                            {student.progressPercent}%
                                          </span>
                                          <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-emerald-500 rounded-full"
                                              style={{ width: `${student.progressPercent}%` }}
                                            />
                                          </div>
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: ALL PAID STUDENTS CONSOLIDATED VIEW ─── */}
      {activeTab === "all-paid" && (
        <div>
          {/* Controls Bar: Search & Course Filter */}
          <div className="p-4 sm:p-6 border-b border-slate-800 bg-[#070e1b]/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, email, or track..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Course Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                <option value="ALL">All My Courses ({allPaidStudents.length} Paid)</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.paidCount} Paid)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Consolidated Paid Student Table */}
          {allPaidStudents.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-7 h-7 text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                No paid student enrollments recorded yet
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                As students complete payments for your courses, they will automatically appear in this verified ledger.
              </p>
            </div>
          ) : filteredPaidStudents.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No paid students match your search filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#070e1b] border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">STUDENT NAME</th>
                    <th scope="col" className="px-6 py-3.5">EMAIL ADDRESS</th>
                    <th scope="col" className="px-6 py-3.5">COURSE PAID FOR</th>
                    <th scope="col" className="px-6 py-3.5">AMOUNT PAID</th>
                    <th scope="col" className="px-6 py-3.5">PAYMENT DATE</th>
                    <th scope="col" className="px-6 py-3.5 text-right">PROGRESS %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-normal">
                  {filteredPaidStudents.map((student) => {
                    const paymentDateFormatted = new Date(
                      student.paymentDate || student.enrolledAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <tr
                        key={`${student.courseId}-${student.userId}`}
                        className="hover:bg-slate-800/25 transition-colors"
                      >
                        {/* Student Name */}
                        <td className="px-6 py-3.5 font-medium text-slate-200">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center uppercase shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-white">{student.name}</span>
                          </div>
                        </td>

                        {/* Email Address */}
                        <td className="px-6 py-3.5 font-mono text-slate-300">
                          {student.email}
                        </td>

                        {/* Course Paid For */}
                        <td className="px-6 py-3.5">
                          <div className="text-slate-200 font-medium">{student.courseTitle}</div>
                          <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            {student.courseCode}
                          </span>
                        </td>

                        {/* Amount Paid */}
                        <td className="px-6 py-3.5 font-mono font-bold text-emerald-400">
                          ₦{student.amountPaid.toLocaleString()}
                        </td>

                        {/* Payment Date */}
                        <td className="px-6 py-3.5 text-slate-400">
                          {paymentDateFormatted}
                        </td>

                        {/* Progress */}
                        <td className="px-6 py-3.5 text-right font-mono">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-slate-300 font-semibold">
                              {student.progressPercent}%
                            </span>
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${student.progressPercent}%` }}
                              />
                            </div>
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
    </div>
  );
}

