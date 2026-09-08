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
    <section className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Full-Bleed High-Resolution Solar Farm Background */}
      <img
        src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=2400&q=85"
        alt="Commercial and Industrial Solar Power Plant"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Sleek Gradient Overlay (Deye Style) */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 flex flex-col justify-between min-h-[85vh]">
        {/* Main Hero Text (Razor-sharp, large, and easy to scan) */}
        <div className="max-w-3xl space-y-6 sm:space-y-8 my-auto pt-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Big Punchy Razor-Sharp Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] text-balance"
            >
              Smart Energy Storage & <br className="hidden sm:inline" />
              <span className="text-[#2B82C9]">Certified Solar</span> Engineering.
            </motion.h1>

            {/* Single Concise Sentence */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed font-normal max-w-2xl text-balance"
            >
              Empowering homes, industries, and certified technicians with next-generation solar power systems and professional training.
            </motion.p>

            {/* Two Standout Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <Link
                href="/courses/solar-installation-101"
                className="px-8 py-4 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#2B82C9]/30 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer"
              >
                <span>Explore Academy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#solutions"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] backdrop-blur-md border border-white/30 text-white font-bold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
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
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 sm:pt-14"
        >
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all duration-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono">15+ Yrs</span>
              <BarChart3 className="w-5 h-5 text-[#2B82C9]" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-300">Commercial & Industrial EPC</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all duration-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#E13B2B]">120+ MW</span>
              <Award className="w-5 h-5 text-[#E13B2B]" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-300">Designed & Installed Capacity</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all duration-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">2–4 Mos</span>
              <Briefcase className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-300">Practical Field Attachment</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl text-white hover:border-white/25 hover:bg-slate-900/75 transition-all duration-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#2B82C9]">70% Pass</span>
              <ShieldCheck className="w-5 h-5 text-[#2B82C9]" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-300">Milestone Assessment Gating</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
