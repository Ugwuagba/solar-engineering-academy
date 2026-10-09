"use client";

import CourseCard from "@/components/course/CourseCard";

interface CourseSliderProps {
  courses?: any[];
}

export default function CourseSlider({ courses = [] }: CourseSliderProps) {
  const activeCourses = courses || [];

  if (activeCourses.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {activeCourses.map((course: any) => (
        <CourseCard key={course.id || course.slug} course={course} />
      ))}
    </div>
  );
}
