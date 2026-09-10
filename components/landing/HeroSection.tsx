"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Play, 
  BarChart3, 
  Award, 
  ShieldCheck, 
  Briefcase 
} from "lucide-react";

interface CoursePreviewData {
  courseTitle: string;
  courseCode: string;
  contactHours: string;
  level: string;
  previewThumbnail: string;
  highlights: string[];
  slug: string;
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

const slides: SlideData[] = [
  {
    id: 1,
    image: "/images/hero/hero-commercial.jpg",
    eyebrow: "SUBWAY ENERGY LIMITED • RC: 1837154",
    title: "Engineering Utility-Scale Solar Infrastructure",
    description: "High-efficiency commercial PV arrays and mini-grid installations built for continuous industrial power.",
    primaryCtaText: "Our Energy Solutions",
    primaryCtaHref: "#solutions",
    secondaryCtaText: "Explore Academy",
    secondaryCtaHref: "/courses",
    coursePreview: {
      courseTitle: "Commercial & Industrial Solar PV Design",
      courseCode: "PVOL 101",
      contactHours: "40 Contact Hours",
      level: "Professional Foundation",
      previewThumbnail: "/images/solutions/factory-roof.jpg",
      highlights: [
        "Utility-Scale Single-Line Diagrams",
        "Medium-Voltage Interconnection",
        "Transformer & Inverter Sizing"
      ],
      slug: "pvol-101"
    }
  },
  {
    id: 2,
    image: "/images/hero/hero-urban.jpg",
    eyebrow: "SMART STORAGE & HYBRID SYSTEMS",
    title: "Intelligent Commercial Energy Storage",
    description: "Advanced hybrid inverters and lithium storage systems engineered for reliability, safety, and peak demand shaving.",
    primaryCtaText: "Explore Commercial Systems",
    primaryCtaHref: "#solutions",
    secondaryCtaText: "View Specifications",
    secondaryCtaHref: "/courses",
    coursePreview: {
      courseTitle: "Battery Energy Storage Systems (BESS) & Safety",
      courseCode: "BESS 201",
      contactHours: "24 Contact Hours",
      level: "Advanced Technical",
      previewThumbnail: "/images/hero/hero-urban.jpg",
      highlights: [
        "Lithium & Flow Battery Chemistry",
        "Peak-Shaving & Demand Management",
        "Thermal Runaway & Fire Safety"
      ],
      slug: "bess-201"
    }
  },
  {
    id: 3,
    image: "/images/hero/hero-academy.jpg",
    eyebrow: "SUBWAY SCHOOLS • ACCREDITED TRAINING",
    title: "Training the Next Generation of Solar Engineers",
    description: "10 comprehensive modules by Engr. Asanga paired with 2-4 months intensive hands-on field attachment.",
    primaryCtaText: "Enroll in Academy",
    primaryCtaHref: "/courses/solar-installation-101",
    secondaryCtaText: "Download Syllabus",
    secondaryCtaHref: "/courses",
    coursePreview: {
      courseTitle: "Solar System Design, Installation & Maintenance",
      courseCode: "Solar Installation 101",
      contactHours: "40 Contact Hours",
      level: "Comprehensive Masterclass",
      previewThumbnail: "/images/hero/hero-academy.jpg",
      highlights: [
        "Masterclass by Engr. Asanga",
        "10 Comprehensive Chapters + Companion",
        "Includes 2-4 Months Practical Field Attachment"
      ],
      slug: "solar-installation-101"
    }
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic interval timer running synchronously every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-[90vh] lg:min-h-[720px] w-full overflow-hidden bg-slate-950 flex flex-col justify-between select-none py-10 lg:py-14">
      {/* 1. Background Image with AnimatePresence and Zoom-In Transition */}
      <div className="absolute inset-0 z-0">
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
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Continuous gradient overlays preserving Subway Energy dark aesthetics */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
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
                <div className="text-sky-400 font-semibold uppercase tracking-widest text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span>{slide.eyebrow}</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.12] text-balance">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-slate-200 text-sm sm:text-base lg:text-lg max-w-xl font-light leading-relaxed text-balance">
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
                  <span className="text-amber-400 text-xs font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slide.coursePreview.contactHours}</span>
                  </span>
                </div>

                {/* Thumbnail Container (160px height with subtle play overlay) */}
                <div className="h-[160px] rounded-xl overflow-hidden relative my-4 bg-slate-950 group">
                  <img
                    src={slide.coursePreview.previewThumbnail}
                    alt={slide.coursePreview.courseTitle}
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
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center">
        <div className="flex items-center gap-2.5">
          {slides.map((s, idx) => {
            const isActive = idx === currentSlide;
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

      {/* 4. Floating Frosted-Glass Metric Accents Bar */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3 sm:p-3.5 rounded-xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-base sm:text-lg font-black font-mono">15+ Years</span>
              <BarChart3 className="w-4 h-4 text-[#2B82C9]" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Power Engineering</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3 sm:p-3.5 rounded-xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-base sm:text-lg font-black font-mono text-[#E13B2B]">20+ Years</span>
              <Award className="w-4 h-4 text-[#E13B2B]" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Lead Instructor Experience</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3 sm:p-3.5 rounded-xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-base sm:text-lg font-black font-mono text-[#2B82C9]">40 Hours</span>
              <ShieldCheck className="w-4 h-4 text-[#2B82C9]" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Accredited Technical Training</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3 sm:p-3.5 rounded-xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-base sm:text-lg font-black font-mono text-emerald-400">2–4 Months</span>
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Practical Field Attachment</p>
          </div>
        </div>
      </div>
    </section>
  );
}
