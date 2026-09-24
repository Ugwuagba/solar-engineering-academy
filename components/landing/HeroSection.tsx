"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Clock 
} from "lucide-react";

interface SlideData {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  courseCode: string;
  trainingHours: string;
  priceNgn: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
}

interface HeroSectionProps {
  courses?: any[];
  primaryCourse?: any;
}

export default function HeroSection({ courses = [] }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Identify course 101 and course 102 from database courses
  const course101 = courses.find((c) => c.code === "SI101" || c.slug.includes("101")) || courses[0];
  const course102 = courses.find((c) => c.code === "SI102" || c.slug.includes("102")) || courses[1] || courses[0];

  const slug101 = course101?.slug || "solar-installation-101-6402";
  const slug102 = course102?.slug || "solar-installation-102";

  const slides: SlideData[] = [
    {
      id: 1,
      image: "/images/hero/hero-academy.jpg",
      eyebrow: "SUBWAY SCHOOLS • ACCREDITED TRAINING",
      title: course101?.title || "Solar Installation 101",
      description:
        course101?.shortDescription ||
        course101?.subtitle ||
        "A comprehensive foundational program covering solar PV design, load auditing, balance of system components, and safe installation practices.",
      courseCode: course101?.code || "SI101",
      trainingHours: `${course101?.contactHours || 8} Training Hours`,
      priceNgn: course101?.priceNgn || `₦${Number(course101?.price || 5000).toLocaleString()}`,
      primaryCtaText: "Enroll in Academy",
      primaryCtaHref: `/courses/${slug101}`,
      secondaryCtaText: "View Course Syllabus",
      secondaryCtaHref: `/courses/${slug101}#curriculum`,
    },
    {
      id: 2,
      image: "/images/hero/hero-commercial.jpg",
      eyebrow: "SUBWAY SCHOOLS • ADVANCED ENGINEERING",
      title: course102?.title || "SOLAR INSTALLATION 102",
      description:
        "Professional solar training designed to master photovoltaic component selection, inverter configurations, battery sizing, and certified system design.",
      courseCode: course102?.code || "SI102",
      trainingHours: `${course102?.contactHours || 15} Training Hours`,
      priceNgn: course102?.priceNgn || `₦${Number(course102?.price || 15000).toLocaleString()}`,
      primaryCtaText: "Enroll in Academy",
      primaryCtaHref: `/courses/${slug102}`,
      secondaryCtaText: "View Course Syllabus",
      secondaryCtaHref: `/courses/${slug102}#curriculum`,
    },
  ];

  // Automatic interval timer running synchronously every 60 seconds (1 minute)
  const SLIDE_INTERVAL = 60000; // 60,000 ms = 1 minute

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide % slides.length];

  return (
    <section className="relative min-h-[85vh] lg:min-h-[640px] w-full overflow-hidden bg-transparent flex flex-col justify-between select-none py-12 lg:py-16">
      {/* 1. Background Image with AnimatePresence and Zoom-In Transition */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#080f1e] overflow-hidden">
        {/* Subtle Shimmer Skeleton while media mounts */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-pulse pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={slide.image}
              alt={slide.title}
              loading={currentSlide === 0 ? "eager" : "lazy"}
              fetchPriority={currentSlide === 0 ? "high" : "auto"}
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Lighter, high-visibility dual-layer gradient overlays making solar photography distinctly visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/45 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080f1e]/85 via-transparent to-black/30" />
      </div>

      {/* 2. Full-Width Responsive Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center my-auto">
        <div className="max-w-3xl lg:max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-5 sm:space-y-6"
            >
              {/* Eyebrow Pill */}
              <div className="text-sky-400 font-semibold uppercase tracking-widest text-xs flex items-center gap-2 drop-shadow-sm">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>{slide.eyebrow}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] text-balance drop-shadow-md [text-shadow:_0_2px_10px_rgb(0_0_0_/_60%)]">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-slate-100 text-base sm:text-lg lg:text-xl max-w-2xl font-normal leading-relaxed text-balance drop-shadow-sm [text-shadow:_0_1px_8px_rgb(0_0_0_/_50%)]">
                {slide.description}
              </p>

              {/* Relocated Course Price & Training Duration Badge */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono font-bold text-sm backdrop-blur-md shadow-xs">
                  <span className="text-xs uppercase tracking-wider text-emerald-200/80 font-sans font-semibold">Tuition</span>
                  <span className="text-white text-base font-extrabold">{slide.priceNgn}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-slate-200 text-sm font-medium backdrop-blur-md shadow-xs">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{slide.trainingHours}</span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-mono font-bold backdrop-blur-md">
                  <span>{slide.courseCode}</span>
                </div>
              </div>

              {/* Dual Standout Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href={slide.primaryCtaHref}
                  className="bg-[#2B82C9] hover:bg-sky-600 active:scale-[0.98] text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer text-base"
                >
                  <span>{slide.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={slide.secondaryCtaHref}
                  className="backdrop-blur-md bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/20 text-white font-medium px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  <span>{slide.secondaryCtaText}</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Carousel Indicator Dots (Subway Blue & White) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex items-center justify-center">
        <div className="flex items-center gap-2.5">
          {slides.map((s, idx) => {
            const isActive = idx === (currentSlide % slides.length);
            return (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className="group relative flex items-center justify-center w-5 h-5 cursor-pointer focus:outline-none"
                aria-label={`Jump to slide ${idx + 1}`}
              >
                {isActive ? (
                  <div className="relative flex items-center justify-center w-3.5 h-3.5 rounded-full border border-[#2B82C9]">
                    <motion.span
                      layoutId="activeHeroDot"
                      className="w-1.5 h-1.5 rounded-full bg-[#2B82C9]"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  </div>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 group-hover:bg-white transition-all duration-200" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
