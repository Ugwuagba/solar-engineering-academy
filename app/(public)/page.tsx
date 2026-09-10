import HeroSection from "@/components/landing/HeroSection";
import CourseCarouselSection from "@/components/landing/CourseCarouselSection";
import IndustrialPillars from "@/components/landing/IndustrialPillars";
import FeaturedSpotlight from "@/components/landing/FeaturedSpotlight";
import SocialProofSection from "@/components/landing/SocialProofSection";
import Link from "next/link";
import { ArrowRight, BookOpen, PhoneCall } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative bg-white">
      {/* 1. Full-Bleed Cinematic Hero Section with Framer Motion */}
      <HeroSection />

      {/* 2. Udemy-Style Interactive Course Carousel Section */}
      <CourseCarouselSection />

      {/* 3. Flagship Course Spotlight ("ACADEMY FLAGSHIP PROGRAM" - Solar Installation 101 by Engr. Asanga) */}
      <FeaturedSpotlight />

      {/* 4. Engineered Systems & Capabilities ("Integrated Solar Technologies & Solutions" 4-card grid) */}
      <IndustrialPillars />

      {/* 5. Social Proof & Verified Testimonials */}
      <SocialProofSection />

      {/* 6. Photo-Driven Industrial CTA Banner */}
      <section id="about" className="relative py-24 lg:py-32 bg-slate-950 text-white overflow-hidden">
        {/* Full-bleed background photo */}
        <img
          src="/images/hero/hero-commercial.jpg"
          alt="Commercial Rooftop Solar Installation"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/60" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Ready to Light Up Your World or Advance Your Solar Career?
          </h2>

          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Whether you need a turn-key commercial rooftop solar system or wish to enroll in the next physical field attachment cohort with Engr. Asanga, our engineering team is standing by.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#2B82C9]/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All Academy Tracks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:+2348000000000"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] backdrop-blur-md border border-white/30 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer"
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
