"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { 
  Sun, 
  Zap, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  Layers, 
  Cpu,
  BarChart3
} from "lucide-react";

export default function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-[#F8FAFC]">
      {/* Background Deye Grid */}
      <div className="absolute inset-0 deye-grid-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Institutional Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2B82C9] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#E13B2B] animate-ping" />
            <span>Subway Energy Limited • RC: 1837154 • Subway Schools</span>
          </motion.div>

          {/* Bold Industrial Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]"
          >
            Next-Generation Solar Engineering, <br />
            <span className="text-[#2B82C9]">Power Auditing</span> &{" "}
            <span className="text-[#0F172A] relative inline-block">
              Renewable Training.
              <span className="absolute bottom-1 left-0 right-0 h-1.5 bg-[#E13B2B]/20 rounded-full -z-10" />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            From residential mini-grids to commercial megawatt solar installations. We design, install, and train the next generation of certified solar engineers with <strong>2–4 months practical partner field attachment</strong>.
          </motion.p>

          {/* Dual Action CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link
              href="/courses/solar-installation-101"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore Professional Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/#solutions"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold text-sm shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-[#2B82C9]" />
              <span>Commercial Solar Solutions</span>
            </Link>
          </motion.div>

          {/* Animated Metrics Strip */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left"
          >
            <div className="deye-card p-5 bg-white border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">15+ Yrs</p>
                <BarChart3 className="w-5 h-5 text-[#2B82C9]" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry Experience</p>
              <p className="text-[11px] text-slate-400 mt-1">Commercial & Industrial EPC</p>
            </div>

            <div className="deye-card p-5 bg-white border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <p className="text-2xl sm:text-3xl font-black text-[#E13B2B] font-mono">20+ Yrs</p>
                <Award className="w-5 h-5 text-[#E13B2B]" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instructor Expertise</p>
              <p className="text-[11px] text-slate-400 mt-1">Engr. Asanga Certified</p>
            </div>

            <div className="deye-card p-5 bg-white border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">10,000+</p>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trained Technicians</p>
              <p className="text-[11px] text-slate-400 mt-1">Across West Africa</p>
            </div>

            <div className="deye-card p-5 bg-white border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <p className="text-2xl sm:text-3xl font-black text-[#2B82C9] font-mono">40+ Hrs</p>
                <Briefcase className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accredited Contact</p>
              <p className="text-[11px] text-slate-400 mt-1">+ 2–4 Mos Field Placement</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
