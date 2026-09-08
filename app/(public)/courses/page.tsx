"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle,
  Zap,
  FilterX
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
        return matchTitle || matchCode || matchDesc;
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
    <div className="relative min-h-screen py-12 lg:py-16">
      {/* Background Grid */}
      <div className="absolute inset-0 solar-grid-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Catalog Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Technical Curriculum Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Accredited Solar & Storage Programs
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Choose from comprehensive self-paced technical masterclasses or instructor-led scheduled cohorts. All courses confer NABCEP continuing education contact hours upon passing the 70% milestone exam.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search course code or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Clear Filters (if active) */}
            {(selectedLevel !== "ALL" || selectedDelivery !== "ALL" || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 self-end md:self-center font-medium"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Filter Pills: Level & Delivery */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Level Pills */}
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
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
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-amber-400 text-slate-950 shadow-sm font-semibold"
                        : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Delivery Type Pills */}
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Format:
              </span>
              {[
                { label: "All Formats", value: "ALL" },
                { label: "Self-Paced / On-Demand", value: "SELF_PACED" },
                { label: "Scheduled Cohorts", value: "COHORT" },
              ].map((pill) => {
                const isActive = selectedDelivery === pill.value;
                return (
                  <button
                    key={pill.value}
                    onClick={() => setSelectedDelivery(pill.value)}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-amber-400 text-slate-950 shadow-sm font-semibold"
                        : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
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
            <p className="text-xs font-mono text-slate-400">
              Showing <strong className="text-white">{filteredCourses.length}</strong> Program
              {filteredCourses.length === 1 ? "" : "s"}
            </p>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.code} course={course} />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
              <p className="text-base text-slate-300 font-semibold">No courses match your filter criteria.</p>
              <p className="text-xs text-slate-500">Try adjusting your search query or resetting filters.</p>
              <button
                onClick={resetFilters}
                className="mt-2 px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg"
              >
                Show All Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
