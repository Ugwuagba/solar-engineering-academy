"use client";

import CourseCard from "@/components/course/CourseCard";
import { ALL_FALLBACK_COURSES } from "@/lib/fallback-courses";

interface CourseSliderProps {
  courses?: any[];
}

export default function CourseSlider({ courses = [] }: CourseSliderProps) {
  const activeCourses = courses && courses.length > 0 ? courses : ALL_FALLBACK_COURSES;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {activeCourses.map((course: any) => (
        <CourseCard key={course.id || course.slug} course={course} />
      ))}
    </div>
  );
}
