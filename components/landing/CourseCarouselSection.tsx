"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Clock, Award } from "lucide-react";
import CourseCard from "@/components/course/CourseCard";

interface CourseCarouselSectionProps {
  courses?: any[];
}

export default function CourseCarouselSection({ courses = [] }: CourseCarouselSectionProps) {
  // If the carousel requires multiple items for infinite CSS loop animation, loop over the active courses array
  const displayCourses =
    courses.length > 0 && courses.length < 4
      ? [...courses, ...courses, ...courses, ...courses]
      : courses;

  return (
    <section className="bg-white py-16 lg:py-24 border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#2B82C9] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACCREDITED CURRICULUM & CERTIFICATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Skills to Transform Your Energy Career
          </h2>
          <p className="text-base text-slate-600 mt-3 font-normal leading-relaxed">
            From foundational solar PV principles to high-voltage industrial engineering, Subway Schools supports your professional accreditation with hands-on field attachment.
          </p>
        </div>

        {/* 1. Dynamic Infinite Scrolling Marquee / Ticker */}
        {displayCourses.length > 0 && (
          <div className="relative w-full py-4 mb-12 bg-slate-50 border-y border-slate-200/80 overflow-hidden rounded-2xl">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee flex items-center gap-4">
              {displayCourses.map((c: any, idx: number) => (
                <Link
                  key={`${c.id || c.slug}-${idx}`}
                  href={`/courses/${c.slug}`}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-[#2B82C9] hover:shadow-xs transition-all shrink-0 group"
                >
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2B82C9] font-mono text-[11px] font-bold border border-blue-200">
                    {c.code}
                  </span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#2B82C9] transition-colors whitespace-nowrap">
                    {c.title}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>{c.contactHours}h</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {c.priceNgn}
                  </span>
                  <Zap className="w-3.5 h-3.5 text-[#2B82C9] shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 2. Course Grid / Catalog Showcase */}
        {courses.length > 0 ? (
          <div
            className={`grid grid-cols-1 ${
              courses.length === 1
                ? "max-w-md"
                : courses.length === 2
                ? "md:grid-cols-2 max-w-4xl"
                : "md:grid-cols-2 lg:grid-cols-3 max-w-7xl"
            } mx-auto gap-6 sm:gap-8`}
          >
            {courses.map((course: any) => (
              <CourseCard key={course.id || course.slug} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 max-w-md mx-auto">
            <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">New Cohorts in Preparation</h3>
            <p className="text-xs text-slate-500 mt-1">
              Check back soon or contact admissions for upcoming cohort schedules.
            </p>
          </div>
        )}

        {/* 3. Catalog Footer CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-[#2B82C9] text-slate-800 hover:text-[#2B82C9] text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <span>Explore All Academy Programs & Details</span>
            <ArrowRight className="w-4 h-4 text-[#2B82C9]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
