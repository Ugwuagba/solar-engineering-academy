"use client";

import { useState, useEffect } from "react";
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

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic interval timer running every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[85vh] min-h-[620px] w-full overflow-hidden bg-slate-950 flex flex-col justify-between select-none">
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

        {/* Subtle continuous gradient overlay above images (Deye style) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* 2. Left-Positioned Hero Text with Generous Spacing */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-18 lg:pt-20 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl min-h-[290px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Eyebrow */}
              <div className="text-sky-400 font-semibold uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>{slide.eyebrow}</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] text-balance">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-slate-200 text-base sm:text-lg max-w-2xl font-light leading-relaxed mt-4 text-balance">
                {slide.description}
              </p>

              {/* Dual Standout Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
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
      </div>

      {/* 3. Bottom Controls Area with Progress Pill Lines & Arrows */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
          {/* Left: 3 Interactive Progress Pill Lines */}
          <div className="flex items-center gap-2.5">
            {slides.map((s, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className="group flex flex-col gap-1 cursor-pointer focus:outline-none py-2"
                  aria-label={`Jump to slide ${idx + 1}`}
                >
                  <div className={`h-1.5 rounded-full overflow-hidden transition-all duration-500 ${isActive ? "w-16 sm:w-20 bg-white/20" : "w-8 sm:w-10 bg-white/20 hover:bg-white/40"}`}>
                    {isActive ? (
                      <motion.div
                        key={`fill-${currentSlide}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5.5, ease: "linear" }}
                        className="h-full bg-sky-400 rounded-full"
                      />
                    ) : (
                      <div className={`h-full ${idx < currentSlide ? "bg-white/40" : "bg-transparent"}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Counter and Subtle Arrows */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-slate-300">
              0{currentSlide + 1} <span className="text-slate-500 font-light">/</span> 0{slides.length}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="border border-white/20 hover:bg-white/10 active:scale-95 text-white rounded-full p-2 backdrop-blur-md transition-all cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="border border-white/20 hover:bg-white/10 active:scale-95 text-white rounded-full p-2 backdrop-blur-md transition-all cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Floating Frosted-Glass Metric Accents Bar */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-5">
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
