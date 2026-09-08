"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Play, 
  Award, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  ShieldCheck,
  UserCheck
} from "lucide-react";

export default function FeaturedSpotlight() {
  const highlights = [
    "Load Analysis, Power Consumption & Energy Auditing",
    "Solar PV Modules & Extreme Voc Temperature Limits",
    "Battery Technologies: LiFePO4 vs Lead-Acid C-Rates",
    "Solar Charge Controllers (PWM vs MPPT Tracking)",
    "Pure Sine Wave Inverters & Harmonic Distortion",
    "The Solar Companion: Quick Lookup Calculations",
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B82C9] block mb-2.5">
            ACADEMY FLAGSHIP PROGRAM
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Solar Installation 101: System Design & Maintenance
          </h2>
          <p className="text-base text-slate-600 mt-3 font-normal">
            Practical, industry-standard engineering training paired with verified on-site field attachment.
          </p>
        </div>

        {/* Clean Split Screen Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Course Curriculum & Instructor Mockup */}
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Badges Row */}
              <div className="flex items-center flex-wrap gap-2.5">
                <span className="px-3 py-1 rounded-md bg-blue-50 text-[#2B82C9] border border-blue-200 font-mono text-xs font-bold">
                  SOLAR-101
                </span>
                <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold uppercase">
                  Comprehensive Track
                </span>
                <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                  2–4 Months Field Attachment
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Solar System Design, Installation & Maintenance
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed font-normal">
                  Master end-to-end solar engineering from foundational photovoltaic physics to sizing commercial three-phase hybrid inverters, assembling lithium battery racks, and performing professional power audits.
                </p>
              </div>

              {/* Instructor Badge */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2B82C9] to-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  EA
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Engr. Asanga</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#2B82C9] font-bold">
                      COREN Engineer
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Lead PV & Storage Engineer • 20+ Years Experience • 120+ MW Designed
                  </p>
                </div>
              </div>

              {/* Curriculum Key Highlights */}
              <div className="space-y-2.5 pt-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#2B82C9]" />
                  <span>10 Core Chapters + Technical Reference Handbook</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2B82C9] shrink-0 mt-0.5" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Direct Enrollment CTA */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-500 block">Tuition & Attachment</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 font-mono">$350</span>
                  <span className="text-sm font-bold text-slate-500 font-mono">/ ₦150,000</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/courses/solar-installation-101"
                  className="px-7 py-3.5 rounded-xl bg-[#2B82C9] hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Enroll in Academy</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Large Video / Inverter Installation Preview */}
          <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full bg-slate-950 flex items-center justify-center overflow-hidden group">
            {/* Background Image of Inverter & Solar Installation */}
            <img
              src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80"
              alt="Solar Inverter & Battery Installation"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/20" />

            {/* Play Button Overlay */}
            <div className="relative z-10 text-center space-y-4 p-6">
              <Link
                href="/courses/solar-installation-101"
                className="w-18 h-18 mx-auto rounded-full bg-white/90 hover:bg-white text-[#2B82C9] flex items-center justify-center shadow-2xl backdrop-blur-xs group-hover:scale-110 transition-all cursor-pointer"
              >
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              </Link>
              <div className="space-y-1">
                <p className="text-white font-bold text-base">Watch Course Preview</p>
                <p className="text-slate-300 text-xs font-mono">Module 1: Photovoltaic Physics & Radiation</p>
              </div>
            </div>

            {/* Bottom Indicators Tag */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">40 Contact Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">70% Milestone Exam Lock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
