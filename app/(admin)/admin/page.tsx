"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowLeft,
  Settings
} from "lucide-react";
import { SEED_COURSES } from "@/lib/seed-data";

export default function AdminStudioPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/courses"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Catalog</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Solar Academy Faculty & Curriculum Studio
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authenticated Admin: <strong className="text-amber-400">{session?.user?.email || "admin@solaracademy.org"}</strong> (Role: ADMIN)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("New Course Creation Modal")}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Program</span>
            </button>
          </div>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 uppercase font-mono">Active Courses</span>
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">{SEED_COURSES.length}</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% Published & Gated</span>
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 uppercase font-mono">Scheduled Cohorts</span>
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">2</p>
            <p className="text-[11px] text-slate-400 mt-1">Spring & Summer 2026</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 uppercase font-mono">Total Candidates</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">1,248</p>
            <p className="text-[11px] text-slate-400 mt-1">+14% month-over-month</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 uppercase font-mono">Average Pass Rate</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white font-mono">82.4%</p>
            <p className="text-[11px] text-amber-400/90 mt-1">70% Milestone Benchmark</p>
          </div>
        </div>

        {/* Courses Table */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Curriculum Inventory
            </h3>
            <span className="text-xs text-slate-400 font-mono">2 Programs Active</span>
          </div>

          <div className="divide-y divide-slate-800">
            {SEED_COURSES.map((course) => (
              <div
                key={course.code}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {course.code}
                    </span>
                    <h4 className="text-base font-bold text-white">{course.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl line-clamp-1">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>{course.contactHours} Contact Hours</span>
                    <span>•</span>
                    <span>{course.modules.length} Modules</span>
                    <span>•</span>
                    <span>Format: {course.deliveryType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
                  >
                    View Public Page
                  </Link>
                  <Link
                    href={`/learn/${course.slug}`}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
                  >
                    Enter Classroom
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cohort Schedule Overview */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Upcoming Scheduled Cohorts (BESS201)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Spring 2026 Intensive Cohort</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  Enrolling (28/35 Seats)
                </span>
              </div>
              <p className="text-slate-400">Duration: April 15, 2026 – May 20, 2026</p>
              <p className="text-slate-400">Instructors: Lead BESS Commissioning Engineers</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Summer 2026 Engineering Cohort</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono">
                  Early Bird Open (12/30 Seats)
                </span>
              </div>
              <p className="text-slate-400">Duration: July 1, 2026 – August 5, 2026</p>
              <p className="text-slate-400">Instructors: NFPA 855 Regulatory Specialists</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
