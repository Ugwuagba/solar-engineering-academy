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
    <section className="relative min-h-[85vh] lg:min-h-[800px] flex items-center justify-center overflow-hidden bg-slate-950">
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col justify-between min-h-[85vh] lg:min-h-[800px]">
        <div className="my-auto max-w-3xl space-y-6 sm:space-y-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Eyebrow Pill */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
              <span>SUBWAY ENERGY & ACADEMY • RC: 1837154</span>
            </motion.div>

            {/* Big Punchy Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] text-balance"
            >
              Smart Energy Storage & <br className="hidden sm:inline" />
              <span className="text-[#2B82C9]">Certified Solar</span> Engineering.
            </motion.h1>

            {/* Single Concise Sentence */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-xl text-slate-200 leading-relaxed font-normal max-w-2xl text-balance"
            >
              Empowering homes, industries, and certified technicians with next-generation solar power systems and professional training.
            </motion.p>

            {/* Two Clean Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <Link
                href="/courses/solar-installation-101"
                className="px-8 py-4 rounded-xl bg-[#2B82C9] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <span>Explore Academy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#solutions"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-[#2B82C9]" />
                <span>Our Solar Solutions</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Translucent Bottom Industrial Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8"
        >
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl sm:text-3xl font-black font-mono">15+ Yrs</span>
              <BarChart3 className="w-5 h-5 text-[#2B82C9]" />
            </div>
            <p className="text-xs font-medium text-slate-300">Commercial & Industrial EPC</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#E13B2B]">120+ MW</span>
              <Award className="w-5 h-5 text-[#E13B2B]" />
            </div>
            <p className="text-xs font-medium text-slate-300">Designed & Installed Capacity</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">2–4 Mos</span>
              <Briefcase className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs font-medium text-slate-300">Practical Field Attachment</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#2B82C9]">70% Pass</span>
              <ShieldCheck className="w-5 h-5 text-[#2B82C9]" />
            </div>
            <p className="text-xs font-medium text-slate-300">Milestone Assessment Gating</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
