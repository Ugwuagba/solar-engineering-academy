"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  BookOpen
} from "lucide-react";

export interface EnrolledStudentData {
  id: string;
  name: string;
  email: string;
  enrolledAt: string;
  status: string;
  progressPercent: number;
}

export interface PublishedCourseData {
  id: string;
  title: string;
  code: string;
  slug: string;
  level: string;
  price: number;
  status: string;
  instructorName: string;
  instructorEmail: string;
  enrollments: EnrolledStudentData[];
}

interface ActiveCoursesRosterProps {
  courses: PublishedCourseData[];
}

export default function ActiveCoursesRoster({ courses }: ActiveCoursesRosterProps) {
  const [openCourseIds, setOpenCourseIds] = useState<Record<string, boolean>>({});

  const toggleCourse = (id: string) => {
    setOpenCourseIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (courses.length === 0) {
    return (
      <div className="bg-[#0b1528] border border-slate-800 rounded-2xl shadow-xl p-16 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7 text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No active courses published yet</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Courses approved and published to the live academy catalog will appear here along with their enrolled student rosters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1528] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Container Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Active Published Courses &amp; Rosters</h2>
          <p className="text-xs text-slate-400">
            Inspect currently live courses and view the student roster for each active syllabus.
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
          {courses.length} {courses.length === 1 ? "Published Course" : "Published Courses"}
        </span>
      </div>

      {/* Course List */}
      <div className="divide-y divide-slate-800/80">
        {courses.map((course) => {
          const totalEnrolled = course.enrollments.length;
          const isOpen = Boolean(openCourseIds[course.id]);

          return (
            <div key={course.id} className="p-6 hover:bg-slate-800/20 transition-colors">
              {/* Row Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Top Left: Title, Code, Status, Meta */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-base text-white">{course.title}</span>
                    <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {course.code}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      PUBLISHED
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span>Level: <strong className="text-slate-300">{course.level}</strong></span>
                    <span>•</span>
                    <span>Price: <strong className="text-slate-300">₦{course.price.toLocaleString()}</strong></span>
                    <span>•</span>
                    <Link
                      href={`/courses/${course.slug || course.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-medium"
                    >
                      <span>View Public Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Top Right: Instructor & Enrolled Count */}
                <div className="flex items-center gap-6">
                  {/* Instructor Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center uppercase">
                      {course.instructorName.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-slate-200">{course.instructorName}</div>
                      <div className="text-[11px] text-slate-500">{course.instructorEmail}</div>
                    </div>
                  </div>

                  {/* Total Enrolled */}
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Enrolled</div>
                    <div className="text-lg font-bold text-sky-400 font-mono">
                      {totalEnrolled} {totalEnrolled === 1 ? "Student" : "Students"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Left Toggle Button */}
              <div className="mt-4 pt-4 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => toggleCourse(course.id)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 cursor-pointer select-none bg-sky-500/10 hover:bg-sky-500/15 border border-sky-500/20 px-3.5 py-1.5 rounded-xl transition"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View Student Roster ({totalEnrolled})</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-sky-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Expandable Roster Dropdown Panel */}
                {isOpen && (
                  <div className="mt-3 bg-[#070e1b] border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                    {totalEnrolled === 0 ? (
                      <div className="py-6 px-4 text-center text-xs text-slate-400">
                        No students enrolled in this course yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            <tr>
                              <th scope="col" className="px-4 py-2.5">STUDENT</th>
                              <th scope="col" className="px-4 py-2.5">EMAIL ADDRESS</th>
                              <th scope="col" className="px-4 py-2.5">ENROLLED DATE</th>
                              <th scope="col" className="px-4 py-2.5">STATUS</th>
                              <th scope="col" className="px-4 py-2.5 text-right">PROGRESS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {course.enrollments.map((enrollment) => {
                              const enrolledDateFormatted = new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              });

                              return (
                                <tr key={enrollment.id} className="hover:bg-slate-800/40 transition-colors">
                                  <td className="px-4 py-2.5 font-medium text-slate-200">
                                    {enrollment.name}
                                  </td>
                                  <td className="px-4 py-2.5 font-mono text-slate-300">
                                    {enrollment.email}
                                  </td>
                                  <td className="px-4 py-2.5 text-slate-400">
                                    {enrolledDateFormatted}
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
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

