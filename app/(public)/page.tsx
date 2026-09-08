import HeroSection from "@/components/landing/HeroSection";
import IndustrialPillars from "@/components/landing/IndustrialPillars";
import FeaturedSpotlight from "@/components/landing/FeaturedSpotlight";
import SolarCompanionSection from "@/components/landing/SolarCompanionSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, PhoneCall } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative">
      {/* 1. Hero Section with Framer Motion */}
      <HeroSection />

      {/* 2. Industrial Engineering Pillars */}
      <IndustrialPillars />

      {/* 3. Featured Masterclass: Solar Installation 101 by Engr. Asanga */}
      <FeaturedSpotlight />

      {/* 4. Solar Companion Technical Reference Handbook */}
      <SolarCompanionSection />

      {/* 5. Social Proof & Corporate Testimonials */}
      <SocialProofSection />

      {/* 6. Corporate CTA Banner */}
      <section id="about" className="py-16 bg-[#0F172A] text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            Subway Energy Limited (RC: 1837154)
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Light Up Your World or Advance Your Solar Career?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Whether you need a turn-key commercial rooftop solar system or wish to enroll in the next physical field attachment cohort with Engr. Asanga, our engineering team is standing by.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All Academy Tracks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+2348000000000"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/80 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#E13B2B]" />
              <span>Speak with an Engineer</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
