"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  BookOpen, 
  Clock, 
  FilterX,
  GraduationCap
} from "lucide-react";
import CourseCard from "@/components/course/CourseCard";
import { SEED_COURSES } from "@/lib/seed-data";

export default function CoursesCatalogPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedDelivery, setSelectedDelivery] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCourses = useMemo(() => {
    return SEED_COURSES.filter((course) => {
      // Level filter
      if (selectedLevel !== "ALL" && course.level !== selectedLevel) {
        return false;
      }
      // Delivery filter
      if (selectedDelivery !== "ALL" && course.deliveryType !== selectedDelivery) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchCode = course.code.toLowerCase().includes(q);
        const matchDesc = course.description.toLowerCase().includes(q);
        const matchInstructor = (course.instructor || "").toLowerCase().includes(q);
        return matchTitle || matchCode || matchDesc || matchInstructor;
      }
      return true;
    });
  }, [selectedLevel, selectedDelivery, searchQuery]);

  const resetFilters = () => {
    setSelectedLevel("ALL");
    setSelectedDelivery("ALL");
    setSearchQuery("");
  };

  return (
    <div className="relative min-h-screen py-12 lg:py-16 bg-[#F8FAFC]">
      {/* Background Grid */}
      <div className="absolute inset-0 deye-grid-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Catalog Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-[#2B82C9] text-xs font-mono font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-[#E13B2B]" />
            <span>Subway Schools Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Accredited Solar & Storage Programs
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From comprehensive foundational solar design with <strong>Engr. Asanga (20+ Years Experience)</strong> to specialized utility battery storage. All courses include accredited contact hours and physical partner field attachment.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="deye-card p-4 sm:p-6 bg-white border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search course, topic, or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2B82C9] transition-colors"
              />
            </div>

            {/* Clear Filters Button */}
            {(selectedLevel !== "ALL" || selectedDelivery !== "ALL" || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#2B82C9] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Level Pills */}
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-xs font-mono font-semibold text-slate-500 mr-2 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Level:
              </span>
              {[
                { label: "All Levels", value: "ALL" },
                { label: "Introductory", value: "INTRODUCTORY" },
                { label: "Intermediate", value: "INTERMEDIATE" },
                { label: "Advanced", value: "ADVANCED" },
              ].map((pill) => {
                const isActive = selectedLevel === pill.value;
                return (
                  <button
                    key={pill.value}
                    onClick={() => setSelectedLevel(pill.value)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#2B82C9] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Delivery Type Pills */}
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-xs font-mono font-semibold text-slate-500 mr-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Format:
              </span>
              {[
                { label: "All Formats", value: "ALL" },
                { label: "Self-Paced + Field Attachment", value: "SELF_PACED" },
                { label: "Scheduled Cohorts", value: "COHORT" },
              ].map((pill) => {
                const isActive = selectedDelivery === pill.value;
                return (
                  <button
                    key={pill.value}
                    onClick={() => setSelectedDelivery(pill.value)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#2B82C9] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-mono text-slate-500">
              Showing <strong className="text-slate-900">{filteredCourses.length}</strong> Technical Program
              {filteredCourses.length === 1 ? "" : "s"}
            </p>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.code} course={course} />
              ))}
            </div>
          ) : (
            <div className="deye-card p-12 bg-white text-center space-y-3">
              <p className="text-base text-slate-800 font-bold">No programs match your filter criteria.</p>
              <p className="text-xs text-slate-500">Try adjusting your keyword search or resetting active filters.</p>
              <button
                onClick={resetFilters}
                className="mt-2 px-4 py-2 text-xs font-bold bg-[#2B82C9] text-white rounded-lg cursor-pointer"
              >
                Show All Programs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
