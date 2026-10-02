"use client";

import CourseCard from "@/components/course/CourseCard";
import { Award } from "lucide-react";

interface CourseSliderProps {
  courses?: any[];
}

export default function CourseSlider({ courses = [] }: CourseSliderProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 max-w-md mx-auto">
        <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">New Cohorts in Preparation</h3>
        <p className="text-xs text-slate-500 mt-1">
          Check back soon or contact admissions for upcoming cohort schedules.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {courses.map((course: any) => (
        <CourseCard key={course.id || course.slug} course={course} />
      ))}
    </div>
  );
}
