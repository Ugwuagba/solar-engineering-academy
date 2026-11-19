"use client";

import React from "react";
import Image from "next/image";
import {
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";

const WHATSAPP_WEBINAR_URL =
  "https://chat.whatsapp.com/KOI7BGwsQot4AQgEXce0zF?s=cl&p=i&iam=2";

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.32 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.37C16.32 14.25 15.1 13.65 14.88 13.56C14.65 13.48 14.48 13.44 14.32 13.69C14.15 13.94 13.67 14.5 13.52 14.67C13.38 14.84 13.23 14.86 12.98 14.74C12.73 14.61 11.94 14.35 11 13.51C10.27 12.86 9.77 12.05 9.63 11.8C9.48 11.55 9.61 11.42 9.74 11.29C9.85 11.18 9.99 11 10.11 10.86C10.24 10.72 10.28 10.62 10.36 10.45C10.45 10.29 10.41 10.14 10.34 10.02C10.28 9.89 9.79 8.68 9.58 8.19C9.38 7.7 9.18 7.77 9.02 7.76C8.88 7.75 8.71 7.75 8.54 7.75C8.38 7.75 8.1 7.81 7.87 8.06C7.64 8.31 7 8.91 7 10.13C7 11.35 7.89 12.52 8.01 12.69C8.14 12.86 9.76 15.35 12.24 16.42C12.83 16.67 13.29 16.82 13.65 16.94C14.24 17.13 14.79 17.1 15.22 17.04C15.7 16.97 16.69 16.44 16.9 15.85C17.11 15.27 17.11 14.77 17.04 14.67C16.98 14.56 16.82 14.5 16.57 14.37Z" />
    </svg>
  );
}

function WhatsAppCTAButton({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: "compact" | "default" | "large";
}) {
  const sizeClasses = {
    compact: "px-4 py-2 text-xs sm:text-sm gap-2",
    default: "px-6 py-3 text-xs sm:text-sm md:text-base gap-2.5",
    large: "px-8 py-4 sm:py-4.5 text-base sm:text-lg gap-3",
  }[size];

  return (
    <a
      href={WHATSAPP_WEBINAR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-extrabold uppercase tracking-wide rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/45 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${sizeClasses} ${className}`}
    >
      <WhatsAppIcon className={size === "compact" ? "w-4 h-4 shrink-0" : "w-5 h-5 shrink-0"} />
      <span className="whitespace-nowrap">JOIN THE FREE WEBINAR</span>
    </a>
  );
}

export default function SolarLandingClient() {
  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">

      {/* ═════════════════════════════════════════════════════════════════════
          A. MINIMAL BRANDED HEADER (STICKY)
         ═════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#070e1b]/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center">
          {/* Brand Identity (Non-clickable to keep visitors focused on conversion) */}
          <div className="flex items-center gap-3 select-none cursor-default">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white p-1 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-md">
              <Image
                src="/images/subway-logo.png"
                alt="Subway Schools Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-base sm:text-lg tracking-wider">
                SUBWAY SCHOOLS
              </span>
              <span className="text-slate-400 text-[10px] sm:text-xs font-medium tracking-tight">
                Subway Energy Limited • RC: 1837154
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ═════════════════════════════════════════════════════════════════════
            B. SECTION 1 — HERO / FIRST IMPRESSION
           ═════════════════════════════════════════════════════════════════════ */}
        <section className="relative bg-[#070e1b] text-white pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-slate-800/80 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

              {/* Left Column: Headlines & CTA */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

                {/* Eyebrow & Highlight Pill */}
                <div className="space-y-3">
                  <div className="text-xs sm:text-sm font-bold tracking-widest text-amber-400 uppercase">
                    SUBWAY SCHOOLS PRESENTS
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-500/10 text-sky-400 border border-blue-500/25 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      FREE SOLAR ENERGY CAREER &amp; BUSINESS WEBINAR
                    </span>
                  </div>
                </div>

                {/* Main H1 Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] font-black text-white tracking-tight leading-[1.15]">
                  TAP FROM THE{" "}
                  <span className="text-amber-400 underline decoration-amber-500/40 underline-offset-8 decoration-4">
                    $268.93 BILLION
                  </span>{" "}
                  OF SOLAR ENERGY MARKET VALUE WHEN YOU ATTEND THIS WEBINAR
                </h1>

                {/* Subheadline */}
                <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Discover How to Build a Successful Career in the Solar Energy Industry and Make a Fortune For Yourself Quick.
                </p>

                {/* Hero CTA & Urgency */}
                <div className="pt-2 sm:pt-4 space-y-3">
                  <div>
                    <WhatsAppCTAButton size="large" className="w-full sm:w-auto" />
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
                    <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>We are starting the webinar soonest…. Don&apos;t miss it…</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Authentic Real Solar Installation Photo */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-blue-950/60 group">
                  <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full">
                    <Image
                      src="/images/webinar/webinar-hero.jpg"
                      alt="Subway Schools Real Field Solar Engineering Installation"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070e1b] via-transparent to-transparent opacity-60" />
                  </div>
                  {/* Subtle Authentic Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#070e1b]/90 backdrop-blur-md border-t border-slate-800 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Subway Energy Practical Field Installation</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            C. SECTION 2 — THE OPPORTUNITY
           ═════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white text-slate-900 py-16 sm:py-24 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Left Column: Editorial & Checklist */}
              <div className="lg:col-span-7 space-y-6">

                {/* Intro Body Copy */}
                <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed">
                  <p>
                    It&apos;s no longer a news that electricity is essential to homes, businesses, industries, hospitals, schools, and virtually every aspect of modern life.
                  </p>
                  <p>
                    As more individuals and organisations seek reliable alternative power solutions, solar energy is creating job and career opportunities for people with the right technical knowledge and practical skills.
                  </p>
                </div>

                {/* Sub-lead */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-2">
                  Think about it:
                </h3>

                {/* Styled Checklist (5 items) */}
                <div className="space-y-3 pt-1">
                  {[
                    "Homes need reliable solar power solutions.",
                    "Businesses need alternative electricity systems to reduce dependence on conventional power.",
                    "Industries require experienced professionals to design and manage larger energy systems.",
                    "Solar companies need competent technicians, installers, designers, and engineers.",
                    "Entrepreneurs have opportunities to establish and grow businesses in the renewable energy sector.",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Follow-up Copy */}
                <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed pt-2">
                  <p>
                    But there&apos;s a difference between being interested in solar energy and having the professional skills to work in the industry.
                  </p>
                  <p>
                    The opportunity is growing. The question is: will you develop the skills to become part of it?
                  </p>
                  <p>
                    The world is moving towards renewable energy, and the demand for skilled solar professionals continues to create new opportunities.
                  </p>
                </div>

                {/* Highlighted Callout Box */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border-l-4 border-amber-500 shadow-sm">
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    Whether you are an electrician, engineer, graduate, technician, entrepreneur, or someone looking to acquire a valuable professional skill, this is your opportunity to discover what the solar energy industry has to offer.
                  </p>
                </div>

              </div>

              {/* Right Column: Supporting Solar Installation Photos */}
              <div className="lg:col-span-5 space-y-6">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src="/images/webinar/webinar-inverters-bank.jpg"
                      alt="Commercial Inverter Integration and Power Systems"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full">
                    <Image
                      src="/images/webinar/webinar-technicians.jpg"
                      alt="Field Technical Skills in Action"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            D. SECTION 3 — CLARITY BEFORE YOU INVEST
           ═════════════════════════════════════════════════════════════════════ */}
        <section className="bg-slate-50 text-slate-900 py-16 sm:py-24 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            {/* Headline & Lead Copy */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Before You Invest in Solar Training, Get the Knowledge You Need to Make the Right Decision.
              </h2>
              <div className="text-base sm:text-lg text-slate-600 space-y-1">
                <p>Choosing a professional training programme is an important decision.</p>
                <p className="font-semibold text-slate-800">You probably have questions:</p>
              </div>
            </div>

            {/* 6 Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                "What exactly does solar installation involve?",
                "What skills do I need to become a solar professional?",
                "Can I build a career or business in the solar industry?",
                "What is the difference between basic solar installation and professional solar engineering?",
                "Where should I begin if I have little or no experience?",
                "How can I improve my existing electrical or technical skills?",
              ].map((question, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                    {question}
                  </p>
                </div>
              ))}
            </div>

            {/* Positioning & Free Offer Block */}
            <div className="bg-white border-2 border-slate-300/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg max-w-3xl mx-auto text-center space-y-5">
              <p className="text-base sm:text-lg text-slate-700 font-medium">
                We understand these concerns.
              </p>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                That&apos;s why Subway Schools is inviting you to a special solar energy webinar designed to introduce you to the industry, help you understand the available opportunities, and show you the skills required to build a future in this field and make a fortune for yourself.
              </p>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                This is an opportunity to learn, ask questions, and gain clarity before deciding on your next step.
              </p>

              {/* Bold and Red Highlight */}
              <div className="py-2">
                <span className="font-bold text-red-600 text-lg sm:text-xl md:text-2xl tracking-wide uppercase block">
                  And I can tell you that it&apos;s absolutely FREE.
                </span>
              </div>

              <div className="space-y-2 text-base sm:text-lg text-slate-700">
                <p>You don&apos;t have to enroll in a course to attend the webinar.</p>
                <p className="font-semibold text-slate-900">
                  Come with your questions. Leave with a better understanding of the opportunities ahead.
                </p>
              </div>

              {/* CTA & Urgency */}
              <div className="pt-4 space-y-3">
                <WhatsAppCTAButton size="large" className="w-full sm:w-auto" />
                <p className="text-xs sm:text-sm font-bold text-amber-600 flex items-center justify-center gap-1.5">
                  <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>We are starting the webinar soonest…. Don&apos;t miss it…</span>
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            E. SECTION 4 — WHAT YOU WILL GAIN
           ═════════════════════════════════════════════ */}
        <section className="bg-white text-slate-900 py-16 sm:py-24 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

            {/* Headline */}
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                What Will You Gain From Attending This Webinar?
              </h2>
            </div>

            {/* 6 Numbered Cards Grid (01–06) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  num: "01",
                  title: "Discover Opportunities in the Solar Energy Industry:",
                  desc: "Understand the different areas of the solar energy industry and the opportunities available to skilled individuals.",
                },
                {
                  num: "02",
                  title: "Understand the Skills Required to Become a Solar Professional:",
                  desc: "Discover the technical knowledge involved in solar system design, installation, maintenance, troubleshooting, and energy storage.",
                },
                {
                  num: "03",
                  title: "Explore Career and Business Opportunities:",
                  desc: "Learn how solar energy skills can create opportunities in employment, contracting, freelance projects, entrepreneurship, and business expansion.",
                },
                {
                  num: "04",
                  title: "Understand How Solar Systems Work:",
                  desc: "Get introduced to the major components of solar energy systems, including solar panels, inverters, batteries, charge controllers, Earthing and other essential equipment.",
                },
                {
                  num: "05",
                  title: "Discover the Right Learning Path for You:",
                  desc: "Whether you are a beginner, electrician, technician, engineer, or business owner, understand the training areas that may suit your background and goals.",
                },
                {
                  num: "06",
                  title: "Interact With Experienced Professionals:",
                  desc: "Get the opportunity to ask questions, clarify your concerns, and gain insights into the realities of working in the solar energy industry.",
                },
              ].map((card) => (
                <div
                  key={card.num}
                  className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-500 block">
                      {card.num}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mid-Page Conversion Banner */}
            <div className="rounded-3xl bg-[#0a152d] text-white p-8 sm:p-12 border border-blue-900/50 shadow-2xl max-w-4xl mx-auto text-center space-y-6 relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 max-w-2xl mx-auto relative z-10">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug">
                  One webinar could give you the clarity you need to take your next professional step.
                </p>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Join Subway Schools for an insightful webinar where you will discover the opportunities, essential technical skills, business possibilities, and professional training pathways available in the solar energy industry.
                </p>
              </div>

              <div className="pt-2 space-y-3 relative z-10">
                <WhatsAppCTAButton size="default" className="w-full sm:w-auto" />
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Join our WhatsApp group to receive your webinar date, time, access link, and important announcements.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            F. SECTION 5 — ABOUT SUBWAY SCHOOLS
           ═════════════════════════════════════════════════════════════════════ */}
        <section className="bg-slate-50 text-slate-900 py-16 sm:py-24 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

            {/* Header / Eyebrow / Headlines */}
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                ABOUT SUBWAY SCHOOLS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                THE BIGGER DREAM:
              </h2>
              <h3 className="text-lg sm:text-xl font-bold text-blue-700 tracking-wide">
                A GLOBAL HOME FOR LEARNING, GROWTH AND OPPORTUNITY
              </h3>
            </div>

            {/* Supporting Real Solar Image */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-md">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full">
                <Image
                  src="/images/webinar/webinar-rooftop-array.jpg"
                  alt="Subway Schools Clean Energy Vision"
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Exact Verbatim Paragraphs (1–13) */}
            <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              <p>Every great institution begins with a dream.</p>
              <p>But some dreams are too big to be restricted by geographical boundaries, industries or professional limitations.</p>
              <p>At Subway Schools, we started with a passion for technical education, particularly in the power and renewable energy sector.</p>
              <p>However, as our vision continues to grow, we have come to realise that our responsibility and potential impact must go far beyond one industry.</p>
              <p>We dream of a future where a young person searching for direction, a professional seeking career advancement, an entrepreneur looking to acquire new skills, or an individual simply passionate about learning can find a place at Subway Schools.</p>
              <p>We want to build a platform where people can access courses in virtually every field of human endeavour, learn from knowledgeable instructors, develop practical skills and discover opportunities they may never have imagined possible.</p>
              <p>Our ambition is to make Subway Schools a global destination for learning, where geographical location, professional background or previous experience does not determine how far someone can go.</p>
              <p>We understand that behind every person seeking education is a dream, a challenge, a family, a responsibility or a future waiting to be transformed.</p>
              <p>That is why we do not see education merely as the transfer of knowledge.</p>
              <p>We see it as an opportunity to unlock human potential, create possibilities, empower generations and give people the confidence to pursue bigger dreams.</p>
              <p>We want to be remembered not just for the courses we offer, but for the lives we touch, the opportunities we create, the professionals we develop and the generations we inspire.</p>
              <p>Our dream is simple but powerful: to build an educational institution whose impact will be felt across industries, communities, countries and generations.</p>
              <p>Subway Schools is not just preparing people for today&apos;s opportunities; we are building a platform to prepare generations for the opportunities of tomorrow.</p>
            </div>

            {/* Styled Signature Block */}
            <div className="pt-6 border-t border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="text-lg font-extrabold text-slate-900">
                  Subway Schools
                </div>

                <div className="text-xs sm:text-sm italic font-serif text-slate-500">
                  Changing Lives, One Student at a Time.
                </div>
              </div>

              {/* Final Section CTA */}
              <div>
                <WhatsAppCTAButton size="default" className="w-full sm:w-auto" />
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* ═════════════════════════════════════════════════════════════════════
          G. CLEAN BRANDED FOOTER
         ═════════════════════════════════════════════ */}
      <footer className="bg-[#070e1b] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
              <Image
                src="/images/subway-logo.png"
                alt="Subway Schools Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-white text-xs sm:text-sm font-bold">
                Subway Schools • Subway Energy Limited (RC: 1837154)
              </p>
              <p className="text-slate-400 text-xs italic font-serif">
                Changing Lives, One Student at a Time.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            © 2026 Subway Energy Limited. All Rights Reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
