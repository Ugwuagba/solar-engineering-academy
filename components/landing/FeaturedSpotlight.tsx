"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Play, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  ShieldCheck
} from "lucide-react";

interface FeaturedSpotlightProps {
  course?: any;
}

export default function FeaturedSpotlight({ course }: FeaturedSpotlightProps) {
  const outcomes =
    (Array.isArray(course?.learningOutcomes) && course.learningOutcomes.length > 0 && course.learningOutcomes) ||
    (Array.isArray(course?.outcomes) && course.outcomes.length > 0 && course.outcomes) ||
    (Array.isArray(course?.whatYouWillLearn) && course.whatYouWillLearn.length > 0 && course.whatYouWillLearn) ||
    [];

  const defaultHighlights = [
    "Identify the major components required for a solar PV system.",
    "Describe the purpose and operation of each major component.",
    "Read and interpret relevant component specifications.",
    "Differentiate between various component configurations.",
    "Explain the factors that influence component selection.",
    "Apply appropriate sizing principles to solar system components.",
  ];

  const highlights: string[] =
    outcomes.length > 0
      ? (outcomes.slice(0, 6) as string[])
      : defaultHighlights;

  const targetSlug = course?.slug || "solar-installation-102";
  const targetTitle = course?.title || "SOLAR INSTALLATION 102";
  const targetCode = course?.code || "SI102";
  const targetPrice = course?.priceNgn || "₦15,000";
  const targetHours = course?.contactHours || 40;
  const targetModulesCount = course?.modules?.length || 10;
  const targetDescription =
    course?.shortDescription ||
    course?.subtitle ||
    "Professional solar training designed to master photovoltaic component selection, inverter configurations, battery sizing, and certified system design.";

  return (
    <section className="py-24 lg:py-28 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B82C9] block mb-2.5">
            ACADEMY FLAGSHIP PROGRAM
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {targetTitle}
          </h2>
          <p className="text-base text-slate-600 mt-3 font-normal">
            Practical, industry-standard engineering training paired with verified official accreditation.
          </p>
        </div>

        {/* Clean Split Screen Container with Smooth Hover Lift */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -6 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#2B82C9]/40 transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0"
        >
          {/* Left Column: Course Curriculum & Instructor Mockup */}
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Prominent Badges Row */}
              <div className="flex items-center flex-wrap gap-2.5">
                <span className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-[#2B82C9] border border-blue-200 font-mono text-xs font-black tracking-wide">
                  {targetCode}
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold uppercase flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#2B82C9]" />
                  {targetModulesCount} Comprehensive Chapters
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {targetHours} Contact Hours
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  Official Accredited Certificate
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {targetTitle}
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed font-normal">
                  {targetDescription}
                </p>
              </div>

              {/* Instructor Spotlight Badge */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2B82C9] to-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                  EA
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Engr. Asanga</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-[#2B82C9] font-black">
                      COREN REGISTERED ENGINEER
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    Lead PV & Storage Engineer • 20+ Years Experience • 120+ MW Designed
                  </p>
                </div>
              </div>

              {/* Curriculum Key Highlights */}
              <div className="space-y-3 pt-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#2B82C9]" />
                  <span>Key Course Learning Modules</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                  {highlights.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2B82C9] shrink-0 mt-0.5" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Standout Enrollment CTA */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-500 block">Tuition & Certification</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    {targetPrice}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/courses/${targetSlug}`}
                  className="px-8 py-4 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-[#2B82C9]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Enroll in Program</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Large Video / Inverter Installation Preview */}
          <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full bg-slate-950 flex items-center justify-center overflow-hidden group">
            {/* Background Image of Inverter & Solar Installation */}
            <img
              src="/images/solutions/solutions-inverters.jpg"
              alt="Solar Inverter & Battery Installation"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-slate-950/20" />

            {/* Play Button Overlay */}
            <div className="relative z-10 text-center space-y-4 p-6">
              <Link
                href={`/courses/${targetSlug}`}
                className="w-20 h-20 mx-auto rounded-full bg-white/95 hover:bg-white text-[#2B82C9] flex items-center justify-center shadow-2xl backdrop-blur-xs group-hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              </Link>
              <div className="space-y-1">
                <p className="text-white font-bold text-base">Watch Course Preview</p>
                <p className="text-slate-300 text-xs font-mono">{targetCode} Masterclass</p>
              </div>
            </div>

            {/* Bottom Indicators Tag */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono font-medium">{targetHours} Contact Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono font-medium">70% Milestone Exam Lock</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
