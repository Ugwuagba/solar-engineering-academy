"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  Award, 
  BarChart3, 
  Briefcase 
} from "lucide-react";

export default function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Full-Bleed High-Resolution Solar Farm Background */}
      <img
        src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1920&q=80"
        alt="Commercial and Industrial Solar Power Plant"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Cinematic High-Contrast Dark Gradient Overlay (Deye Style) */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-900/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-8 flex flex-col justify-between h-full min-h-[calc(100vh-5rem)] lg:min-h-0">
        {/* Main Hero Text (Moved up so bottom metric boxes are visible above fold without scrolling) */}
        <div className="pt-2 sm:pt-4 lg:pt-6 max-w-3xl space-y-4 sm:space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-5"
          >
            {/* Big Punchy Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15] text-balance"
            >
              Smart Energy Storage & <br className="hidden sm:inline" />
              <span className="text-[#2B82C9]">Certified Solar</span> Engineering.
            </motion.h1>

            {/* Single Concise Sentence */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl text-balance"
            >
              Empowering homes, industries, and certified technicians with next-generation solar power systems and professional training.
            </motion.p>

            {/* Two Clean Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1"
            >
              <Link
                href="/courses/solar-installation-101"
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#2B82C9] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Explore Academy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#solutions"
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-[#2B82C9]" />
                <span>Our Solar Solutions</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Translucent Bottom Industrial Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6 pb-2"
        >
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 rounded-xl text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl sm:text-2xl font-black font-mono">15+ Yrs</span>
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B82C9]" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Commercial & Industrial EPC</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 rounded-xl text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-[#E13B2B]">120+ MW</span>
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#E13B2B]" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Designed & Installed Capacity</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 rounded-xl text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">2–4 Mos</span>
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Practical Field Attachment</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-3.5 sm:p-4 rounded-xl text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-[#2B82C9]">70% Pass</span>
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B82C9]" />
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-300">Milestone Assessment Gating</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
