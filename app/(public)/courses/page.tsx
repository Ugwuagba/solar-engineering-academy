"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import CourseCard from "@/components/course/CourseCard";
import { SEED_COURSES } from "@/lib/seed-data";

function CoursesCatalogContent() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("query") || "";

  const filteredCourses = useMemo(() => {
    if (!urlQuery.trim()) return SEED_COURSES;
    const q = urlQuery.toLowerCase();
    return SEED_COURSES.filter((course) => {
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchCode = course.code.toLowerCase().includes(q);
      const matchDesc = course.description.toLowerCase().includes(q);
      const matchInstructor = (course.instructor || "").toLowerCase().includes(q);
      return matchTitle || matchCode || matchDesc || matchInstructor;
    });
  }, [urlQuery]);

  return (
    <div className="relative min-h-screen py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Catalog Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-[#2B82C9] text-xs font-mono font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-[#E13B2B]" />
            <span>Subway Schools Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Accredited Solar &amp; Storage Programs
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From comprehensive foundational solar design with <strong>Engr. Asanga (20+ Years Experience)</strong> to specialized utility battery storage. All courses include accredited contact hours and physical partner field attachment.
          </p>
        </div>

        {/* Course Card Grid */}
        <div className="mt-8 sm:mt-10">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.code} course={course} />
              ))}
            </div>
          ) : (
            <div className="deye-card p-12 bg-white text-center space-y-3 border border-slate-200">
              <p className="text-base text-slate-800 font-bold">No programs match &ldquo;{urlQuery}&rdquo;.</p>
              <p className="text-xs text-slate-500">Try searching for other solar engineering topics or browse all programs.</p>
              <Link
                href="/courses"
                className="mt-3 inline-block px-5 py-2.5 text-xs font-bold bg-[#2B82C9] text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                View All Programs
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoursesCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white py-16 flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-[#2B82C9] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CoursesCatalogContent />
    </Suspense>
  );
}
