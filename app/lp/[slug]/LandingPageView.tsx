"use client";

import React from "react";
import Image from "next/image";
import Script from "next/script";
import {
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  Shield,
  Play,
} from "lucide-react";
import { SerializedLandingPage } from "@/lib/landing-page-types";
import VideoEmbedPlayer from "./VideoEmbedPlayer";

declare global {
  interface Window {
    fbq?: (
      command: string,
      eventName: string,
      params?: Record<string, string>
    ) => void;
  }
}

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
  url,
  label = "JOIN THE FREE WEBINAR",
  className = "",
  size = "default",
  pageTitle,
}: {
  url: string;
  label?: string;
  className?: string;
  size?: "compact" | "default" | "large";
  pageTitle?: string;
}) {
  const sizeClasses = {
    compact: "px-4 py-2 text-xs sm:text-sm gap-2",
    default: "px-6 py-3 text-xs sm:text-sm md:text-base gap-2.5",
    large: "px-8 py-4 sm:py-4.5 text-base sm:text-lg gap-3",
  }[size];

  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.fbq?.("track", "Lead", {
        content_name: pageTitle || "Solar Webinar",
        content_category: "Webinar Landing Page",
      });
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center justify-center font-extrabold uppercase tracking-wide rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/45 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${sizeClasses} ${className}`}
    >
      <WhatsAppIcon className={size === "compact" ? "w-4 h-4 shrink-0" : "w-5 h-5 shrink-0"} />
      <span className="whitespace-nowrap">{label}</span>
    </a>
  );
}

interface LandingPageViewProps {
  page: SerializedLandingPage;
}

export default function LandingPageView({ page }: LandingPageViewProps) {
  const { content, media, whatsappUrl, metaPixelId } = page;

  const hasHeroImage =
    media.showHeroImage !== false && Boolean(media.heroImageUrl?.trim());
  const hasVideo =
    media.showVideo !== false && Boolean(media.videoEmbedUrl?.trim());
  const hasSection2Image1 =
    media.showSection2Image1 !== false &&
    Boolean(media.section2Image1Url?.trim());
  const hasSection2Image2 =
    media.showSection2Image2 !== false &&
    Boolean(media.section2Image2Url?.trim());
  const hasAnySection2Image = hasSection2Image1 || hasSection2Image2;
  const hasAboutImage =
    media.showAboutImage !== false && Boolean(media.aboutImageUrl?.trim());

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      
      {/* ─── Optional Meta Pixel Tracking ─── */}
      {metaPixelId && (
        <Script id={`meta-pixel-${page.id}`} strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          A. MINIMAL BRANDED HEADER (STICKY)
         ═════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#070e1b]/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center">
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
                {content.header?.brandName || "SUBWAY SCHOOLS"}
              </span>
              <span className="text-slate-400 text-[10px] sm:text-xs font-medium tracking-tight">
                {content.header?.brandTagline || "Subway Energy Limited • RC: 1837154"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ═════════════════════════════════════════════════════════════════════
            B. SECTION 1 — HERO / FIRST IMPRESSION
           ═════════════════════════════════════════════ */}
        <section className="relative bg-[#070e1b] text-white pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-slate-800/80 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {hasHeroImage ? (
              /* Two-Column Hero Layout when Media IS Present (100% Unchanged UI) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                {/* Left Column: Headlines & CTA */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                  {/* Eyebrow & Highlight Pill */}
                  <div className="space-y-3">
                    <div className="text-sm sm:text-base font-extrabold tracking-widest text-amber-400 uppercase">
                      {content.hero.eyebrow}
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-500/10 text-sky-400 border border-blue-500/25 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        {content.hero.badge}
                      </span>
                    </div>
                  </div>

                  {/* Main H1 Headline with Amber Market Value Highlight */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] font-black text-white tracking-tight leading-[1.15]">
                    {content.hero.headline.includes("$268.93 BILLION") ? (
                      <>
                        {content.hero.headline.split("$268.93 BILLION")[0]}
                        <span className="text-amber-400 underline decoration-amber-500/40 underline-offset-8 decoration-4">
                          $268.93 BILLION
                        </span>
                        {content.hero.headline.split("$268.93 BILLION")[1]}
                      </>
                    ) : (
                      content.hero.headline
                    )}
                  </h1>

                  {/* Subheadline */}
                  <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {content.hero.subheadline}
                  </p>

                  {/* Hero CTA & Urgency */}
                  <div className="pt-2 sm:pt-4 space-y-3">
                    <div>
                      <WhatsAppCTAButton
                        url={whatsappUrl} pageTitle={page.title}
                        label={content.hero.ctaText}
                        size="default"
                        className="w-full sm:w-auto"
                      />
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
                      <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{content.hero.urgencyText}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Hero Image */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-blue-950/60 group">
                    <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full">
                      <Image
                        src={media.heroImageUrl!}
                        alt="Subway Schools Real Field Solar Engineering Installation"
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070e1b] via-transparent to-transparent opacity-60" />
                    </div>
                    {media.heroCaption && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#070e1b]/90 backdrop-blur-md border-t border-slate-800 text-left">
                        <div className="flex items-center gap-2 text-xs font-semibold text-white">
                          <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{media.heroCaption}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Centered Adaptive Layout when Hero Media is Empty or Disabled */
              <div className="max-w-4xl mx-auto text-center space-y-6">
                {/* Eyebrow & Highlight Pill */}
                <div className="space-y-3">
                  <div className="text-sm sm:text-base font-extrabold tracking-widest text-amber-400 uppercase">
                    {content.hero.eyebrow}
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-500/10 text-sky-400 border border-blue-500/25 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      {content.hero.badge}
                    </span>
                  </div>
                </div>

                {/* Main H1 Headline with Amber Market Value Highlight */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] font-black text-white tracking-tight leading-[1.15]">
                  {content.hero.headline.includes("$268.93 BILLION") ? (
                    <>
                      {content.hero.headline.split("$268.93 BILLION")[0]}
                      <span className="text-amber-400 underline decoration-amber-500/40 underline-offset-8 decoration-4">
                        $268.93 BILLION
                      </span>
                      {content.hero.headline.split("$268.93 BILLION")[1]}
                    </>
                  ) : (
                    content.hero.headline
                  )}
                </h1>

                {/* Subheadline */}
                <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
                  {content.hero.subheadline}
                </p>

                {/* Hero CTA & Urgency */}
                <div className="pt-2 sm:pt-4 space-y-3 flex flex-col items-center justify-center">
                  <div>
                    <WhatsAppCTAButton
                      url={whatsappUrl} pageTitle={page.title}
                      label={content.hero.ctaText}
                      size="default"
                      className="w-full sm:w-auto"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
                    <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>{content.hero.urgencyText}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            VIDEO EMBED SECTION (Between Hero and Section 2) - Only if Active
           ═════════════════════════════════════════════ */}
        {hasVideo && (
          <section className="bg-[#050b16] py-12 sm:py-16 border-b border-slate-800/80">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold font-mono uppercase tracking-widest text-sky-400">
                  FEATURED PRESENTATION
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {media.videoTitle || "Interactive Webinar Preview & Practical Demonstration"}
                </h3>
              </div>

              <VideoEmbedPlayer
                url={media.videoEmbedUrl!}
                title={media.videoTitle || "Webinar Video"}
              />
            </div>
          </section>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            C. SECTION 2 — THE OPPORTUNITY
           ═════════════════════════════════════════════ */}
        <section className="bg-white text-slate-900 py-16 sm:py-24 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {hasAnySection2Image ? (
              /* Two-Column Layout when Section 2 Photos ARE Present */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Column: Editorial & Checklist */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed">
                    <p>{content.opportunity.introP1}</p>
                    <p>{content.opportunity.introP2}</p>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-2">
                    {content.opportunity.subLead}
                  </h3>

                  {/* Styled Checklist */}
                  <div className="space-y-3 pt-1">
                    {content.opportunity.checklist.map((item, idx) => (
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

                  <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed pt-2">
                    <p>{content.opportunity.followUpP1}</p>
                    <p>{content.opportunity.followUpP2}</p>
                    <p>{content.opportunity.followUpP3}</p>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border-l-4 border-amber-500 shadow-sm">
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                      {content.opportunity.calloutBox}
                    </p>
                  </div>
                </div>

                {/* Right Column: Render ONLY active images (never empty boxes) */}
                <div className="lg:col-span-5 space-y-6">
                  {hasSection2Image1 && (
                    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={media.section2Image1Url!}
                          alt="Commercial Inverter Integration and Power Systems"
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {hasSection2Image2 && (
                    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
                      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full">
                        <Image
                          src={media.section2Image2Url!}
                          alt="Field Technical Skills in Action"
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Centered Adaptive Layout when No Section 2 Photos are Active */
              <div className="max-w-4xl mx-auto space-y-6 text-slate-700">
                <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed">
                  <p>{content.opportunity.introP1}</p>
                  <p>{content.opportunity.introP2}</p>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight pt-2">
                  {content.opportunity.subLead}
                </h3>

                {/* Checklist arranged into responsive 2-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {content.opportunity.checklist.map((item, idx) => {
                    const isLastSingle =
                      idx === content.opportunity.checklist.length - 1 &&
                      content.opportunity.checklist.length % 2 === 1;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-sm ${
                          isLastSingle ? "md:col-span-2" : ""
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed pt-2">
                  <p>{content.opportunity.followUpP1}</p>
                  <p>{content.opportunity.followUpP2}</p>
                  <p>{content.opportunity.followUpP3}</p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 border-l-4 border-amber-500 shadow-sm">
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {content.opportunity.calloutBox}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            D. SECTION 3 — CLARITY BEFORE YOU INVEST
           ═════════════════════════════════════════════ */}
        <section className="bg-slate-50 text-slate-900 py-16 sm:py-24 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {content.clarity.headline}
              </h2>
              <div className="text-base sm:text-lg text-slate-600 space-y-1">
                <p>{content.clarity.leadP1}</p>
                <p className="font-semibold text-slate-800">{content.clarity.leadP2}</p>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {content.clarity.questions.map((question, idx) => (
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
                {content.clarity.offerP1}
              </p>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                {content.clarity.offerP2}
              </p>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                {content.clarity.offerP3}
              </p>

              {/* Bold and Red Highlight */}
              <div className="py-2">
                <span className="font-bold text-red-600 text-lg sm:text-xl md:text-2xl tracking-wide uppercase block">
                  {content.clarity.freeHighlight}
                </span>
              </div>

              <div className="space-y-2 text-base sm:text-lg text-slate-700">
                <p>{content.clarity.offerP4}</p>
                <p className="font-semibold text-slate-900">
                  {content.clarity.offerP5}
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <WhatsAppCTAButton
                  url={whatsappUrl} pageTitle={page.title}
                  label={content.clarity.ctaText}
                  size="default"
                  className="w-full sm:w-auto"
                />
                <p className="text-xs sm:text-sm font-bold text-amber-600 flex items-center justify-center gap-1.5">
                  <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{content.clarity.urgencyText}</span>
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
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                {content.webinarGains.headline}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {content.webinarGains.cards.map((card) => (
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
                  {content.webinarGains.bannerHeading}
                </p>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {content.webinarGains.bannerSubheading}
                </p>
              </div>

              <div className="pt-2 space-y-3 relative z-10">
                <WhatsAppCTAButton
                  url={whatsappUrl} pageTitle={page.title}
                  label={content.webinarGains.bannerCtaText}
                  size="default"
                  className="w-full sm:w-auto"
                />
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  {content.webinarGains.bannerSubtext}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            F. SECTION 5 — ABOUT SUBWAY SCHOOLS
           ═════════════════════════════════════════════ */}
        <section className="bg-slate-50 text-slate-900 py-16 sm:py-24 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                {content.about.eyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {content.about.headline}
              </h2>
              <h3 className="text-lg sm:text-xl font-bold text-blue-700 tracking-wide">
                {content.about.subheadline}
              </h3>
            </div>

            {/* Supporting Real Solar Image (Only when Active) */}
            {hasAboutImage ? (
              <div>
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full">
                    <Image
                      src={media.aboutImageUrl!}
                      alt="Subway Schools Clean Energy Vision"
                      fill
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Clean branded accent divider bar when about image is disabled or empty */
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mx-auto my-2" />
            )}

            {/* Paragraphs */}
            <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              {content.about.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Signature Block */}
            <div className="pt-6 border-t border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="text-lg font-extrabold text-slate-900">
                  {content.about.signatureTitle}
                </div>
                <div className="text-xs sm:text-sm italic font-serif text-slate-500">
                  {content.about.signatureMotto}
                </div>
              </div>

              <div>
                <WhatsAppCTAButton
                  url={whatsappUrl} pageTitle={page.title}
                  label={content.about.ctaText}
                  size="default"
                  className="w-full sm:w-auto"
                />
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
                {content.footer?.brandLine || "Subway Schools • Subway Energy Limited (RC: 1837154)"}
              </p>
              <p className="text-slate-400 text-xs italic font-serif">
                {content.footer?.motto || "Changing Lives, One Student at a Time."}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            {content.footer?.copyright || "© 2026 Subway Energy Limited. All Rights Reserved."}
          </div>
        </div>
      </footer>

    </div>
  );
}

