"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Award, 
  ShieldCheck, 
  Briefcase 
} from "lucide-react";

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
  },
];

const SLIDE_DURATION = 6000; // 6 seconds

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  // Auto-rotation every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, currentSlide]);

  const slide = slides[currentSlide];

  return (
    <section 
      className="relative h-[88vh] min-h-[640px] max-h-[850px] w-full overflow-hidden bg-slate-950 flex flex-col justify-between select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Animated Full-Bleed Background Images with Zoom-In Transition */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.id}
            src={slide.image}
            alt={slide.title}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              transition: { duration: 1.2, ease: "easeOut" } 
            }}
            exit={{ 
              opacity: 0, 
              transition: { duration: 0.8 } 
            }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* Fixed Cinematic Gradient Overlay (Deye Style) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* 2. Slide Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl min-h-[290px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                transition: { duration: 0.6, ease: "easeOut" } 
              }}
              exit={{ 
                opacity: 0, 
                y: -18, 
                transition: { duration: 0.35 } 
              }}
              className="space-y-5 sm:space-y-6"
            >
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{slide.eyebrow}</span>
              </div>

              {/* Slide Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] text-balance">
                {slide.title}
              </h1>

              {/* Slide Description */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl text-balance">
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href={slide.primaryCtaHref}
                  className="px-8 py-4 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#2B82C9]/30 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer"
                >
                  <span>{slide.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={slide.secondaryCtaHref}
                  className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] backdrop-blur-md border border-white/30 text-white font-bold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  <span>{slide.secondaryCtaText}</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Carousel Navigation & Progress Bars (Bottom Right) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* Left: Interactive Slide Progress Indicators */}
          <div className="flex items-center gap-3">
            {slides.map((s, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={s.id}
                  onClick={() => goToSlide(idx)}
                  className="group flex flex-col gap-1 text-left cursor-pointer focus:outline-none"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div className="h-1 w-16 sm:w-24 bg-white/20 rounded-full overflow-hidden">
                    {isActive ? (
                      <motion.div
                        key={`progress-${currentSlide}`}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ 
                          duration: SLIDE_DURATION / 1000, 
                          ease: "linear" 
                        }}
                        className="h-full bg-[#2B82C9]"
                      />
                    ) : (
                      <div 
                        className={`h-full ${idx < currentSlide ? "bg-white/60" : "bg-transparent"} group-hover:bg-white/40 transition-colors`} 
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Slide Counter and Arrow Controls */}
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-slate-300">
              0{currentSlide + 1} <span className="text-slate-500 font-light">/</span> 0{slides.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="border border-white/20 hover:bg-white/10 active:scale-95 text-white rounded-full p-2.5 backdrop-blur-md transition-all cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="border border-white/20 hover:bg-white/10 active:scale-95 text-white rounded-full p-2.5 backdrop-blur-md transition-all cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Floating Frosted-Glass Metric Accents Bar */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 rounded-xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg sm:text-xl font-black font-mono">15+ Years</span>
              <BarChart3 className="w-4 h-4 text-[#2B82C9]" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Power Engineering</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 rounded-xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg sm:text-xl font-black font-mono text-[#E13B2B]">20+ Years</span>
              <Award className="w-4 h-4 text-[#E13B2B]" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Lead Instructor Experience</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 rounded-xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg sm:text-xl font-black font-mono text-[#2B82C9]">40 Hours</span>
              <ShieldCheck className="w-4 h-4 text-[#2B82C9]" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Accredited Technical Training</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 rounded-xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg sm:text-xl font-black font-mono text-emerald-400">2–4 Months</span>
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Practical Field Attachment</p>
          </div>
        </div>
      </div>
    </section>
  );
}
