"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import CourseCard from "@/components/course/CourseCard";

interface CourseSliderProps {
  courses?: any[];
}

export default function CourseSlider({ courses = [] }: CourseSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    // Allow small epsilon tolerance for fractional pixels
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);

    // Re-check after images or fonts settle
    const timer = setTimeout(checkScroll, 300);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [courses, checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>("[data-carousel-item]");
    const gap = 20; // gap-5 in Tailwind
    const cardWidth = card ? card.offsetWidth + gap : 320;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const distance = isMobile ? cardWidth : cardWidth * 2;
    const targetLeft =
      direction === "left"
        ? Math.max(0, container.scrollLeft - distance)
        : container.scrollLeft + distance;

    // Programmatic smooth scroll execution:
    container.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 450);
  };

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
    <div className="relative group/slider w-full">
      {/* Navigation Arrow Controls */}
      {/* Left button: < (chevron left) positioned vertically centered at left-0 -translate-x-1/2 z-20 */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        disabled={!canScrollLeft}
        aria-label="Previous courses"
        className={`absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-full flex items-center justify-center text-slate-800 dark:text-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
          canScrollLeft
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Right button: > (chevron right) positioned vertically centered at right-0 translate-x-1/2 z-20 */}
      <button
        type="button"
        onClick={() => handleScroll("right")}
        disabled={!canScrollRight}
        aria-label="Next courses"
        className={`absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-full flex items-center justify-center text-slate-800 dark:text-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
          canScrollRight
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Scroll Track: A single horizontal flex row with fluid CSS scroll-snapping */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        style={{ scrollBehavior: "smooth" }}
        className="flex flex-nowrap gap-5 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-proximity md:snap-mandatory px-4 sm:px-6 scroll-pl-4 sm:scroll-pl-6 py-4"
      >
        {courses.map((course: any) => (
          <div
            key={course.id || course.slug}
            data-carousel-item
            className="w-[82vw] sm:w-[70vw] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)] flex-none shrink-0 flex flex-col snap-start"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
}
