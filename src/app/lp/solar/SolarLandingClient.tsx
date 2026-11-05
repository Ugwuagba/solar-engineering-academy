"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Wrench,
  Award,
  Users,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Clock,
  Compass,
  Building2,
  HardHat,
  GraduationCap,
  Cpu,
  Layers,
  HelpCircle,
  Flame,
  Star,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface CourseItem {
  id: string;
  level: string;
  title: string;
  description: string;
  image: string;
  fallback: string;
}

const courses: CourseItem[] = [
  {
    id: "SOLAR 101",
    level: "Beginner",
    title: "Introduction to Solar Photovoltaic Systems",
    description:
      "Fundamentals of solar radiation, PV cell technology, basic circuit principles, system components, and energy audit basics.",
    image:
      "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=800&q=80",
    fallback: "/images/courses/course-1-solar-intro.jpg",
  },
  {
    id: "SOLAR 102",
    level: "Intermediate",
    title: "Solar PV System Design & Component Sizing",
    description:
      "In-depth mathematical calculation for PV array sizing, charge controller selection, string inverter matchmaking, and cable cross-section calculations.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
    fallback: "/images/courses/course-2-solar-advanced.jpg",
  },
  {
    id: "SOLAR 201",
    level: "Advanced",
    title: "Advanced Inverter Systems & Hybrid Integration",
    description:
      "Setup and programming of hybrid, off-grid, and grid-tied inverters (Deye, Victron, Growatt), automatic generator start (AGS), and zero-export limits.",
    image:
      "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
    fallback: "/images/solutions/solutions-inverters.jpg",
  },
  {
    id: "SOLAR 202",
    level: "Advanced",
    title: "Stationary Battery Storage & Lithium BMS",
    description:
      "Lithium iron phosphate (LiFePO4) architecture, cell balancing, Battery Management System (BMS) communications (CAN bus / RS485), and thermal safety.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    fallback: "/images/courses/course-7-battery-fabrication.jpg",
  },
  {
    id: "SOLAR 301",
    level: "Professional",
    title: "Commercial & Industrial (C&I) Solar Engineering",
    description:
      "Three-phase system design, transformer integration, high-voltage balance of system (BOS), surge protection, and commercial sub-station earthing.",
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
    fallback: "/images/solutions/factory-roof.jpg",
  },
  {
    id: "SOLAR 302",
    level: "Executive",
    title: "Solar Project Management & Bankable Proposals",
    description:
      "Levelized Cost of Energy (LCOE) calculations, payback analysis, diesel displacement modeling, and crafting bankable EPC client proposals.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    fallback: "/images/solutions/solutions-audit.jpg",
  },
];

const FAQS: FAQItem[] = [
  {
    question: "What are the prerequisites for joining the Solar & Storage Program?",
    answer:
      "This program is designed for engineers (electrical, mechanical, civil), technicians, electricians, polytechnic/university STEM graduates, and career switchers with an aptitude for technical work. Basic familiarity with electrical concepts is helpful, but our foundational modules build you up from fundamental principles to commercial commissioning.",
  },
  {
    question: "How is the training delivered, and how do practical sessions work?",
    answer:
      "The program integrates intensive engineering theory, mathematical sizing labs, and hands-on workbench sessions using live hybrid inverters (Deye, Victron, Growatt), lithium LiFePO4 battery modules, and DC distribution equipment. Eligible enrollees also gain access to our 3-month field attachment on active commercial and residential installations.",
  },
  {
    question: "Is the certification recognized in the renewable energy industry?",
    answer:
      "Yes. The Certificate of Competence is issued under Subway Energy Limited (RC: 1837154), an established engineering firm operating in commercial and industrial solar power projects. The certification verifies that you have completed field-tested sizing, installation, and safety protocols according to international IEEE and local Nigerian standards.",
  },
  {
    question: "What is the cohort size and why is enrollment limited?",
    answer:
      "To ensure that every engineer gets personal workbench time with high-voltage inverters, battery management systems (BMS), and torque-tested mechanical mounting rigs, each cohort is strictly capped at 25 participants. Seats are allocated on a first-come, verified-registration basis.",
  },
  {
    question: "How do I receive the full syllabus, fee breakdown, and payment options?",
    answer:
      "Click any of the WhatsApp buttons on this page to chat directly with our Admissions Desk. We provide the complete module breakdown, current cohort timetable, and flexible tuition installments directly on WhatsApp.",
  },
  {
    question: "Can working professionals attend weekend or evening sessions?",
    answer:
      "Yes. We offer flexible tracks tailored for working professionals and practicing field technicians, including accelerated weekend intensives and evening support sessions alongside our dedicated practical workbench days.",
  },
];

export default function SolarLandingClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // WhatsApp Configuration
  const rawPhone = process.env.NEXT_PUBLIC_INSTRUCTOR_WHATSAPP || "2347012715632";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const prefilledMessage =
    "Hello Subway Schools, I am interested in the Solar Engineering Training program and would like details on admission.";
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(prefilledMessage)}`;
  const groupFallbackUrl = "https://shorturl.at/iI5NJ";

  // Event Tracking Hook
  const handleWhatsAppClick = (source: string = "Solar Landing Page WhatsApp") => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      try {
        (window as any).fbq("track", "Contact", { content_name: source });
      } catch (err) {
        console.warn("Meta Pixel tracking error:", err);
      }
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#080e1a] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 pb-20 md:pb-0">
      {/* 1. TOP URGENCY ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-semibold text-xs sm:text-sm py-2 px-4 text-center sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 bg-slate-950/20 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Admissions Open
          </span>
          <span>
            Upcoming Cohort: Limited to <strong>25 seats</strong> for practical workbench access.
          </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleWhatsAppClick("Top Banner WhatsApp CTA")}
            className="underline underline-offset-4 font-bold hover:text-slate-900 inline-flex items-center gap-1 ml-1"
          >
            Reserve Your Seat on WhatsApp &rarr;
          </a>
        </div>
      </div>

      {/* 2. ISOLATED BRANDED HEADER (NO GLOBAL NAV LINKS) */}
      <header className="border-b border-[#1e293b] bg-[#080e1a]/90 backdrop-blur-md sticky top-8 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Accreditation */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-700/60 p-1 flex items-center justify-center shadow-lg shadow-black/40 shrink-0">
              <Image
                src="/images/subway-logo.png"
                alt="Subway Schools Logo"
                width={44}
                height={44}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  SUBWAY SCHOOLS
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-mono font-bold bg-[#1e293b] text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                  RC: 1837154
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Subway Energy Limited • Engineering & Energy Storage Academy
              </p>
            </div>
          </div>

          {/* Desktop WhatsApp CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end text-right">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Admissions Desk Online
              </span>
              <span className="text-[11px] text-slate-400">Response time: ~15 mins</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWhatsAppClick("Header WhatsApp Button")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4 fill-slate-950 shrink-0" />
              <span>Chat with Admissions</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[350px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Offer Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Field-Grade Solar Engineering Training</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Become a Certified Solar &{" "}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Energy Storage Installation
                </span>{" "}
                Professional
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Master industry-standard photovoltaic sizing, inverter integration, and stationary
                battery storage through practical, field-tested engineering training.
              </p>

              {/* Trust Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>Deye & Victron Hybrid Inverters</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>Lithium LiFePO4 BMS Wiring</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>Subway Energy (RC: 1837154) Accreditation</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>3-Month Practical Field Attachment</span>
                </div>
              </div>

              {/* Primary Call to Action */}
              <div className="pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleWhatsAppClick("Hero Primary WhatsApp Button")}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-[#25D366]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                  >
                    <WhatsAppIcon className="w-6 h-6 fill-slate-950 shrink-0" />
                    <span>Chat with an Admissions Advisor on WhatsApp</span>
                  </a>
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Direct WhatsApp routing • Instant syllabus, cohort calendar & fee options</span>
                </p>
              </div>

              {/* Social Proof Strip below CTA */}
              <div className="pt-6 border-t border-[#1e293b] flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#080e1a] flex items-center justify-center text-[10px] text-amber-300 font-bold"
                      >
                        ★
                      </div>
                    ))}
                  </div>
                  <span className="font-semibold text-slate-200">
                    4.9/5 Rating from 10,000+ Enrollees
                  </span>
                </div>

                <div className="h-4 w-px bg-slate-700 hidden sm:block" />

                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Corporate EPC Backed</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual / Equipment Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl border border-[#1e293b] bg-[#0c1629] overflow-hidden shadow-2xl p-2 group">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900">
                  <Image
                    src="/images/solutions/solutions-installation.jpg"
                    alt="Solar and battery installation field training"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080e1a] via-[#080e1a]/40 to-transparent" />

                  {/* Badge on Image */}
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>FIELD TRAINING FACILITY</span>
                  </div>

                  {/* Bottom Stats Floating Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 shadow-xl">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          Next Cohort Model
                        </div>
                        <div className="font-bold text-white text-sm">
                          25 Enrollees Capped
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-amber-400 uppercase">
                          Training Mode
                        </div>
                        <div className="font-bold text-white text-sm">
                          Theory + Field Rig
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Micro Metrics Beneath Visual */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 px-1 text-center">
                  <div className="bg-[#080e1a]/80 p-2.5 rounded-lg border border-[#1e293b]">
                    <div className="text-amber-400 font-black text-sm">100%</div>
                    <div className="text-[10px] text-slate-400">Practical Gear</div>
                  </div>
                  <div className="bg-[#080e1a]/80 p-2.5 rounded-lg border border-[#1e293b]">
                    <div className="text-emerald-400 font-black text-sm">3 Months</div>
                    <div className="text-[10px] text-slate-400">Field Attach.</div>
                  </div>
                  <div className="bg-[#080e1a]/80 p-2.5 rounded-lg border border-[#1e293b]">
                    <div className="text-blue-400 font-black text-sm">RC: 1837154</div>
                    <div className="text-[10px] text-slate-400">Certified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY VALUE PILLARS (THE 3 CORE PILLARS) */}
      <section className="py-20 bg-[#0b1528] border-y border-[#1e293b] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
              ENGINEERED FOR FIELD EXCELLENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Engineers & Contractors Choose Subway Schools
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              General courses teach basic solar panel series wiring from slides. We train you on
              fault diagnosis, mathematical deratings, inverter synchronization, and commercial energy
              storage systems that prevent multimillion-naira project failures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="rounded-2xl bg-[#0c1629] border border-[#1e293b] p-8 hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/5 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                  <Wrench className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Hands-on Practical Engineering
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Real-world equipment training, load calculation, and safety protocols. Work directly
                  with commercial hybrid inverters, DC combiners, PV arrays, and battery banks rather
                  than theoretical presentations.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#1e293b] text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Deye, Growatt & Victron live wiring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>DC Surge & Earthing safety systems</span>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl bg-[#0c1629] border border-[#1e293b] p-8 hover:border-[#25D366]/50 transition-all hover:shadow-xl hover:shadow-[#25D366]/5 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] mb-6 group-hover:scale-110 group-hover:bg-[#25D366]/20 transition-all">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Industry Certification</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Recognized accreditation positioning graduates for immediate commercial and
                  residential projects. Validate your technical competence to corporate clients, EPC
                  firms, and renewable developers.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#1e293b] text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>Corporate RC: 1837154 backing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>Verified transcript & project portfolio</span>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl bg-[#0c1629] border border-[#1e293b] p-8 hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/5 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Dedicated Mentorship & Network
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Ongoing support, handbook access, and career guidance. Direct technical support
                  from Engr. Asanga, exclusive engineering group access, project quotation vetting, and
                  alumni referrals.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#1e293b] text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Direct WhatsApp advisory desk access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Handbook: 49 Reasons Why Solar Fails</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick CTA under Pillars */}
          <div className="mt-12 text-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWhatsAppClick("Pillars Section WhatsApp CTA")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-sm shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-5 h-5 fill-slate-950 shrink-0" />
              <span>Ask an Advisor Which Track Fits Your Background</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. TARGET AUDIENCE (WHO THIS PROGRAM IS BUILT FOR) */}
      <section className="py-20 bg-[#080e1a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
              TARGET AUDIENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Designed for High-Impact Technical Careers
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Whether you are an experienced engineer modernizing into renewables or a graduate
              seeking an immediate commercial skill, Subway Schools gives you the execution edge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#0c1629] border border-[#1e293b] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Electrical & Mechanical Engineers</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Master high-level system sizing, deratings, hybrid zero-export synchronization, and
                lead multi-kilowatt commercial solar design with precision.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0c1629] border border-[#1e293b] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Field Technicians & Electricians</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Graduate from basic AC wiring to high-voltage DC distribution, lithium BMS
                communication, and become an indispensable field lead installer.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0c1629] border border-[#1e293b] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Polytechnic & STEM Graduates</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bridge the academic gap with hands-on workbench equipment, verified project hours,
                and an industry-recognized certificate to unlock top EPC roles.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0c1629] border border-[#1e293b] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Renewable Career Switchers & Bidders</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Equip yourself to accurately audit client facilities, prepare bankable energy
                proposals, and run a profitable solar installation enterprise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FLAGSHIP ENGINEERING & ENERGY COURSES */}
      <section className="py-20 bg-[#0b1528] border-y border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
              OUR FLAGSHIP PROGRAMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Industry-Standard Engineering & Energy Courses
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Practical, accredited programs engineered to take you from fundamentals to commercial deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full text-left">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border border-slate-800 bg-[#0b1528] overflow-hidden flex flex-col shadow-xl"
              >
                <div className="relative w-full h-48 bg-slate-900 border-b border-slate-800">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (course.fallback && target.src !== course.fallback) {
                        target.src = course.fallback;
                      }
                    }}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-amber-400 text-xs font-bold px-2 py-1 rounded border border-amber-400/30 bg-amber-400/10 uppercase tracking-wide">
                      {course.id}
                    </span>
                    <span className="text-slate-400 text-xs font-semibold px-2 py-1 rounded bg-slate-800/50">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Course Catalog WhatsApp CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#0c1629] via-[#0f1d38] to-[#0c1629] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-white">
                Need the complete course syllabus & cohort schedule?
              </h3>
              <p className="text-xs text-slate-300">
                Our admissions advisor can send the full training catalog and fee breakdown directly to your WhatsApp.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWhatsAppClick("Course Catalog WhatsApp CTA")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-sm shadow-md transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-4 h-4 fill-slate-950 shrink-0" />
              <span>Request Full Course Catalog on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. SOCIAL PROOF & TRUST SECTION */}
      <section className="py-20 bg-[#080e1a] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
              CREDIBILITY & ALUMNI SUCCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Trusted by Practicing Engineers & Corporate Clients
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Subway Energy Limited (RC: 1837154) has trained over 10,000 technicians and engineers
              who now lead clean energy projects across West Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="rounded-2xl bg-[#0c1629] border border-[#1e293b] p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;Engr. Asanga&apos;s breakdown of equipment nameplate surge currents and phantom load
                  management saved our company over ₦4.2M on an oversized inverter quotation for a
                  beverage packaging plant. The 3 months field attachment is unparalleled.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#1e293b]">
                <div className="font-bold text-white text-sm">Tunde Balogun, MNSE</div>
                <div className="text-xs text-slate-400">
                  Lead Electrical Engineer, Apex Power Solutions
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-2xl bg-[#0c1629] border border-[#1e293b] p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;Before Subway Schools, I only understood panels in series. This academy taught me
                  actual mathematical deratings for ambient temperature, inverter clipping limits, and
                  Deye hybrid wiring. I secured an EPC project developer role right after my field
                  attachment.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#1e293b]">
                <div className="font-bold text-white text-sm">Chidinma Okafor</div>
                <div className="text-xs text-slate-400">
                  Renewable Energy Project Developer • Alumna
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-2xl bg-[#0c1629] border border-[#1e293b] p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;Subway Energy performed a comprehensive power audit on our 24/7 medical center and
                  deployed a 60kW hybrid system with zero-export control. Their training academy
                  faculty are technically immaculate and field-tested.&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#1e293b]">
                <div className="font-bold text-white text-sm">Engr. Ibrahim Sanusi</div>
                <div className="text-xs text-slate-400">
                  Facility Director, Prime Care Clinics
                </div>
              </div>
            </div>
          </div>

          {/* Handbook Feature Sub-Banner */}
          <div className="mt-16 rounded-2xl bg-[#0c1629] border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3 aspect-[4/3] relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
              <Image
                src="/images/books/solar-books-podium-1.jpg"
                alt="Solar Engineering Handbooks by Engr. Asanga"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 350px"
              />
            </div>
            <div className="w-full md:w-2/3 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase bg-amber-500/10 px-2.5 py-1 rounded">
                <BookOpen className="w-3.5 h-3.5" />
                <span>INCLUDED COURSE COMPANION TEXTS</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Learn from the Author of &ldquo;49 Reasons Why Solar Installations Fail&rdquo;
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Trainees receive direct reference manuals, solar sizing templates, and engineering
                calculators created by Engr. Asanga. Avoid the common rookie mistakes that cost solar
                installers millions in burnt inverters and degraded battery packs.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleWhatsAppClick("Handbook Callout WhatsApp CTA")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-xs sm:text-sm transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-slate-950 shrink-0" />
                  <span>Ask for Enrollee Book Package</span>
                </a>
                <a
                  href={groupFallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
                >
                  Join the Solar Reading & Engineering Group &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LIMITED COHORT CALLOUT & URGENCY */}
      <section className="py-16 bg-[#0b1528] border-t border-[#1e293b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Strict 25-Seat Quality Cap</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Small Cohort Model for Guaranteed Equipment Time
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Unlike mass lecture seminars where you watch from row 15, Subway Schools keeps each cohort
            strictly limited to 25 engineers. You personally wire inverters, configure BMS parameters,
            and complete live commissioning tests.
          </p>

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWhatsAppClick("Cohort Section WhatsApp CTA")}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-[#25D366]/20 transition-all hover:scale-[1.02]"
            >
              <WhatsAppIcon className="w-5 h-5 fill-slate-950 shrink-0" />
              <span>Check Remaining Slots on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-[#080e1a] border-t border-[#1e293b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Everything you need to know about enrollment, requirements, and field attachments.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#1e293b] bg-[#0c1629] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 text-white font-bold text-sm sm:text-base hover:text-amber-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 text-slate-400 ${
                        isOpen ? "rotate-180 text-amber-400" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-[#1e293b]/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. FINAL HIGH-CONVERTING CTA BOX */}
      <section className="py-20 bg-gradient-to-b from-[#0b1528] to-[#080e1a] border-t border-[#1e293b] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0c1629] border border-amber-500/40 shadow-2xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 inline-block">
                BECOME AN ACCREDITED SOLAR INSTALLATION PRO
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                Launch or Accelerate Your Renewable Energy Career
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Connect directly with an admissions advisor on WhatsApp. We will discuss your current
                technical background, explain our upcoming cohort dates, and provide the exact
                curriculum syllabus.
              </p>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleWhatsAppClick("Final Footer Box WhatsApp CTA")}
                  className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-base sm:text-xl shadow-2xl shadow-[#25D366]/30 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  <WhatsAppIcon className="w-6 h-6 fill-slate-950 shrink-0" />
                  <span>Chat with an Admissions Advisor on WhatsApp</span>
                </a>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Average response: under 15 minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  RC: 1837154 Corporate Accreditation
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-400" />
                  Cohort Limited to 25 Seats
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. ISOLATED LANDING PAGE FOOTER (NO GLOBAL LINKS) */}
      <footer className="border-t border-[#1e293b] bg-[#050a14] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-bold text-slate-300">
              Subway Schools • Subway Energy Limited (RC: 1837154)
            </p>
            <p className="text-[11px] text-slate-400">
              Accredited solar photovoltaic engineering, energy storage and commercial power audit training.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>&copy; {new Date().getFullYear()} Subway Energy Limited. All Rights Reserved.</span>
          </div>
        </div>
      </footer>

      {/* 12. FIXED MOBILE STICKY WHATSAPP BAR (md:hidden) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-[#080e1a]/95 backdrop-blur-lg border-t border-[#1e293b] shadow-2xl">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleWhatsAppClick("Sticky Mobile WhatsApp Bar")}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl bg-[#25D366] active:bg-[#20ba5a] text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-[#25D366]/30 transition-transform active:scale-[0.98]"
        >
          <WhatsAppIcon className="w-5 h-5 fill-slate-950 shrink-0" />
          <span>Chat with Admissions on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.778.978-.954 1.179-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.494-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.131-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.588-.493-.509-.678-.518-.175-.009-.376-.009-.577-.009-.201 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.111c.15.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.9-.119.579-.352 1.78-7.26 2.031-1.428.251-.703.251-1.305.176-1.429-.075-.125-.276-.201-.577-.351z" />
      <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.947.56 3.764 1.524 5.301L2 22l4.834-1.472C8.309 21.464 10.103 22 12.004 22c5.523 0 10-4.48 10-10s-4.477-10-10-10zm0 18.273c-1.642 0-3.167-.47-4.464-1.282l-.32-.202-2.871.874.887-2.8-.21-.334C4.168 15.172 3.727 13.626 3.727 12c0-4.564 3.713-8.273 8.277-8.273 4.563 0 8.273 3.709 8.273 8.273 0 4.564-3.71 8.273-8.273 8.273z" />
    </svg>
  );
}

