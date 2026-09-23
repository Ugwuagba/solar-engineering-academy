"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Play 
} from "lucide-react";

interface CoursePreviewData {
  courseTitle: string;
  courseCode: string;
  contactHours: string;
  level: string;
  previewThumbnail: string;
  highlights: string[];
  slug: string;
  priceNgn?: string;
}

interface SlideData {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  coursePreview: CoursePreviewData;
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
        "A comprehensive foundational program covering solar PV design, load auditing, balance of system components, and safe installation practices.",
      primaryCtaText: "Enroll in Academy",
      primaryCtaHref: `/courses/${slug101}`,
      secondaryCtaText: "View Course Syllabus",
      secondaryCtaHref: `/courses/${slug101}#curriculum`,
      coursePreview: {
        courseTitle: course101?.title || "Solar Installation 101",
        courseCode: course101?.code || "SI101",
        contactHours: `${course101?.contactHours || 40} Contact Hours`,
        level: course101?.level || "Introductory / Foundational",
        previewThumbnail: course101?.thumbnailImage || course101?.thumbnailUrl || "/images/hero/hero-academy.jpg",
        highlights: (course101?.whatYouWillLearn && course101.whatYouWillLearn.length > 0)
          ? course101.whatYouWillLearn.slice(0, 3)
          : [
              "Master solar PV system sizing & precision power audits",
              "Design commercial inverters & battery backup systems",
              "Includes 2–4 months practical partner attachment"
            ],
        slug: slug101,
        priceNgn: course101?.priceNgn || `₦${Number(course101?.price || 5000).toLocaleString()}`,
      },
    },
    {
      id: 2,
      image: "/images/hero/hero-commercial.jpg",
      eyebrow: "SUBWAY SCHOOLS • ADVANCED ENGINEERING",
      title: course102?.title || "SOLAR INSTALLATION 102",
      description:
        "Advanced commercial and industrial microgrid design, battery energy storage systems (BESS), and hybrid system commissioning.",
      primaryCtaText: "Enroll in Academy",
      primaryCtaHref: `/courses/${slug102}`,
      secondaryCtaText: "View Course Syllabus",
      secondaryCtaHref: `/courses/${slug102}#curriculum`,
      coursePreview: {
        courseTitle: course102?.title || "SOLAR INSTALLATION 102",
        courseCode: course102?.code || "SI102",
        contactHours: `${course102?.contactHours || 40} Contact Hours`,
        level: course102?.level || "Intermediate / Advanced",
        previewThumbnail: course102?.thumbnailImage || course102?.thumbnailUrl || "/images/hero/hero-commercial.jpg",
        highlights: (course102?.whatYouWillLearn && course102.whatYouWillLearn.length > 0)
          ? course102.whatYouWillLearn.slice(0, 3)
          : [
              "Utility-Scale C&I Solar Arrays & Single-Line Diagrams",
              "Harmonic Analysis & Medium-Voltage Interconnection",
              "BESS, Battery Chemistry & Multi-Megawatt Inverters"
            ],
        slug: slug102,
        priceNgn: course102?.priceNgn || `₦${Number(course102?.price || 15000).toLocaleString()}`,
      },
    },
  ];

  // Automatic interval timer running synchronously every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide % slides.length];

  return (
    <section className="relative min-h-[90vh] lg:min-h-[680px] w-full overflow-hidden bg-transparent flex flex-col justify-between select-none py-10 lg:py-14">
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
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-900/35 to-slate-950/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080f1e]/80 via-transparent to-black/20" />
      </div>

      {/* 2. Responsive 2-Column Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (60% on desktop): Headline, Eyebrow, Subtitle & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Eyebrow Pill */}
                <div className="text-sky-400 font-semibold uppercase tracking-widest text-xs flex items-center gap-2 drop-shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span>{slide.eyebrow}</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.12] text-balance drop-shadow-md [text-shadow:_0_2px_10px_rgb(0_0_0_/_60%)]">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-slate-100 text-sm sm:text-base lg:text-lg max-w-xl font-normal leading-relaxed text-balance drop-shadow-sm [text-shadow:_0_1px_8px_rgb(0_0_0_/_50%)]">
                  {slide.description}
                </p>

                {/* Dual Standout Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href={slide.primaryCtaHref}
                    className="bg-[#2B82C9] hover:bg-sky-600 active:scale-[0.98] text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <span>{slide.primaryCtaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={slide.secondaryCtaHref}
                    className="backdrop-blur-md bg-white/10 hover:bg-white/20 active:scale-[0.98] border border-white/20 text-white font-medium px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{slide.secondaryCtaText}</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column (40% on desktop): Dynamic edX-Style Glassmorphic Course Preview Card */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="backdrop-blur-xl bg-slate-900/80 border border-white/20 rounded-2xl p-5 sm:p-6 shadow-2xl text-white max-w-md w-full mx-auto"
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-sky-500/20 text-sky-300 font-mono text-xs px-2.5 py-1 rounded-full border border-sky-400/30">
                    {slide.coursePreview.courseCode}
                  </span>
                  <div className="flex items-center gap-2">
                    {slide.coursePreview.priceNgn && (
                      <span className="text-emerald-400 text-xs font-mono font-bold">
                        {slide.coursePreview.priceNgn}
                      </span>
                    )}
                    <span className="text-amber-400 text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slide.coursePreview.contactHours}</span>
                    </span>
                  </div>
                </div>

                {/* Thumbnail Container (160px height with subtle play overlay) */}
                <div className="h-[160px] rounded-xl overflow-hidden relative my-4 bg-gradient-to-br from-slate-950 to-slate-900 group">
                  <img
                    src={slide.coursePreview.previewThumbnail}
                    alt={slide.coursePreview.courseTitle}
                    loading={currentSlide === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/30 to-transparent" />
                  
                  {/* Subtle Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Level tag in corner */}
                  <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-white/90">
                    {slide.coursePreview.level}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug line-clamp-2 mb-3">
                  {slide.coursePreview.courseTitle}
                </h3>

                {/* Quick Specs List */}
                <div className="space-y-2">
                  {slide.coursePreview.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[#2B82C9] shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Card Action Button */}
                <Link
                  href={`/courses/${slide.coursePreview.slug}`}
                  className="bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-semibold py-3 rounded-xl transition-all shadow-md text-center block text-sm mt-5 cursor-pointer"
                >
                  View Course & Syllabus →
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

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
