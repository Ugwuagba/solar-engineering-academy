"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Plus, 
  ArrowLeft,
  Briefcase,
  ExternalLink
} from "lucide-react";
import { SEED_COURSES } from "@/lib/seed-data";

export default function AdminStudioPage() {
  const { data: session } = useSession();

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
              Lead Administrator: <strong className="text-slate-900">{session?.user?.name || session?.user?.email || "Lead Solar Engineer"}</strong> • Authority Level: <span className="font-mono text-[#2B82C9] font-bold">ADMIN / DIRECTOR</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Program Creator: Subway Schools Curriculum Expansion")}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#2B82C9] hover:bg-blue-600 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Program</span>
            </button>
          </div>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Active Tracks</span>
              <BookOpen className="w-5 h-5 text-[#2B82C9]" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">{SEED_COURSES.length}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Gated & Field-Attached</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Scheduled Cohorts</span>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">3</p>
            <p className="text-xs text-slate-500 mt-1">Q2 & Q3 2026 Academic Calendar</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Total Candidates</span>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">1,480</p>
            <p className="text-xs text-emerald-600 mt-1">+18% enrollment rate</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Milestone Pass Rate</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">84.2%</p>
            <p className="text-xs text-slate-500 mt-1">70% Milestone Benchmark</p>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Curriculum & Program Inventory
              </h3>
              <p className="text-xs text-slate-500">
                Managed courses, milestone assessment thresholds, and partner placements
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#2B82C9] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              {SEED_COURSES.length} Programs Live
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {SEED_COURSES.map((course) => (
              <div
                key={course.code}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-[#2B82C9] border border-blue-200">
                      {course.code}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {course.level}
                    </span>
                    {course.fieldAttachment && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-[#E13B2B] border border-red-200 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {course.fieldAttachment}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{course.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {course.description}
                  </p>
                  <div className="flex items-center flex-wrap gap-4 text-xs text-slate-500 pt-1 font-mono">
                    <span>{course.contactHours} Contact Hours</span>
                    <span>•</span>
                    <span>{course.modules.length} Modules ({course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons)</span>
                    <span>•</span>
                    <span>{course.instructor || "Subway Engineering Faculty"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:text-slate-900 shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Public View</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </Link>
                  <Link
                    href={`/learn/${course.slug}`}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-[#2B82C9] hover:bg-blue-600 text-white shadow-sm transition-colors"
                  >
                    Enter Classroom
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Attachment Placement Log */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#E13B2B]" />
                <span>Partner Field Attachment Deployments</span>
              </h3>
              <p className="text-xs text-slate-500">
                Candidates matched with commercial EPC contractors and industrial solar farms
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              100% Placement Rate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Industrial Rooftop Inverter Commissioning</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2B82C9] font-bold text-[10px] font-mono">
                  Active Deployment
                </span>
              </div>
              <p className="text-slate-600">Partner: Apex Industrial Energy EPC Ltd • Lagos, Nigeria</p>
              <p className="text-slate-500">Lead Mentor: Engr. Asanga (Direct Sign-Off on Safety Logbook)</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">High-Voltage Battery Energy Storage (BESS)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] font-mono">
                  Upcoming Cohort Match
                </span>
              </div>
              <p className="text-slate-600">Partner: Prime Grid Mini-Grid Utility • Abuja, Nigeria</p>
              <p className="text-slate-500">Focus: Rack Balancing, UL9540A Thermal Protocols, SCADA Integration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
