"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  PlayCircle, 
  Award, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  Zap, 
  UserCheck,
  ShieldCheck
} from "lucide-react";

export default function FeaturedSpotlight() {
  const modulesList = [
    "Ch 1: Introduction to Solar Energy & Physical Photovoltaics",
    "Ch 2: Solar Panels, Batteries, Inverters & Charge Controllers",
    "Ch 3: System Topologies: Standalone, Hybrid, Grid-Tied & Pumping",
    "Ch 4: Levelized Economics, Diesel Displacement & Payback",
    "Ch 5: Forensic Failure Analysis & Precise Sizing Criteria",
    "Ch 6: Professional Power Auditing Tools & Methodologies",
    "Ch 7: Electrical Loads, Phantom Drain & Power Factor Sizing",
    "Ch 8: Equipment Nameplates, Starting Surge & Load Shifting",
    "Ch 9: Roof Types, Racking Clamps & Working-at-Heights HSE",
    "Ch 10: The Solar Entrepreneur: Commercial Contracts & EPC",
    "+ Solar Companion: Inverter, Battery & Temperature Formulations"
  ];

  return (
    <section className="py-20 bg-[#F8FAFC] border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="deye-card bg-white border border-slate-200 overflow-hidden shadow-sm p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#0F172A] text-white font-mono text-xs font-bold tracking-wider">
                  FLAGSHIP ACADEMY MASTERCLASS
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-[#2B82C9] border border-blue-200 uppercase">
                  Intermediate / Pro
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Includes Field Attachment
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Solar System Design, Installation & Maintenance
                </h3>
                <p className="text-sm font-semibold text-[#2B82C9] mt-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Lead Instructor: Engr. Asanga (Certified Solar Professional, 20+ Years Experience)</span>
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                The comprehensive professional certification developed by Subway Schools. Go from foundational photovoltaic physics to sizing commercial inverters, conducting scientific power audits, and executing zero-export commercial installations.
              </p>

              {/* Module Fast Strip */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#2B82C9]" />
                  <span>10 Core Chapters + Solar Companion Reference Handbook</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  {modulesList.slice(0, 6).map((m, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="truncate">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats & CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-500 font-mono block">Complete Course + 2–4 Mos Field Attachment</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">$350</span>
                    <span className="text-sm font-bold text-slate-500 font-mono">/ ₦150,000</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/courses/solar-installation-101"
                    className="px-6 py-3.5 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <span>View Full Curriculum & Syllabus</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Video Mockup & Attachment Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md relative group">
                <img
                  src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80"
                  alt="Solar Installation 101 Lecture Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/30 transition-colors">
                  <Link
                    href="/courses/solar-installation-101"
                    className="w-14 h-14 rounded-full bg-white/95 text-[#2B82C9] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer"
                  >
                    <PlayCircle className="w-8 h-8 fill-current" />
                  </Link>
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-xs text-white text-xs flex items-center justify-between">
                  <span className="font-semibold text-[11px]">Free Preview: Historical Dev & PV Physics</span>
                  <span className="font-mono text-[10px] text-amber-400">30:00</span>
                </div>
              </div>

              {/* Field Attachment Callout */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 text-xs text-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Briefcase className="w-4 h-4 text-[#2B82C9]" />
                  <span>Physical Field Attachment Guarantee</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  All enrolled candidates receive physical field placement with verified solar engineering partners, participating in roof racking, inverter termination, and commissioning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
