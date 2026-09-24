import prisma from "@/lib/db";
import HeroSection from "@/components/landing/HeroSection";
import CourseCarouselSection from "@/components/landing/CourseCarouselSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import Link from "next/link";
import { ArrowRight, BookOpen, PhoneCall } from "lucide-react";

export const revalidate = 60;

function parseJsonArray<T = string>(raw: any, fallback: T[] = []): T[] {
  if (!raw) return fallback;
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  let dbCourses: any[] = [];
  try {
    dbCourses = await prisma.course.findMany({
      where: {
        OR: [
          { status: "PUBLISHED" },
          { isPublished: true },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        modules: {
          orderBy: { sortOrder: "asc" },
          include: {
            lessons: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    });
  } catch (err) {
    console.error("Database connection issue in HomePage, continuing gracefully:", err);
  }

  const courses = dbCourses.map((c: any) => {
    const whatYouWillLearn = parseJsonArray<string>(c.whatYoullLearn, [
      "Scientific solar PV design according to international IEC/IEEE standards",
      "Sizing battery energy storage systems (BESS) for continuous operation",
      "Comprehensive single-line diagrams (SLD) and protective earthing",
      "Hands-on equipment commissioning, hybrid inverter programming, and fault diagnostics",
    ]);

    const totalLessons = (c.modules || []).reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0);
    const priceNgn = `₦${Number(c.price || 0).toLocaleString()}`;
    const originalPriceNgn = c.originalPrice ? `₦${Number(c.originalPrice).toLocaleString()}` : undefined;

    return {
      id: c.id,
      code: c.code,
      title: c.title,
      subtitle: c.subtitle,
      slug: c.slug,
      description: c.description || "Practical, industry-standard engineering training paired with verified official accreditation.",
      shortDescription:
        c.code === "SI102"
          ? "Professional solar training designed to master photovoltaic component selection, inverter configurations, battery sizing, and certified system design."
          : (c.subtitle || "A comprehensive foundational program covering solar PV design, load auditing, balance of system components, and safe installation practices."),
      level: (c.level as "INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED") || "INTRODUCTORY",
      deliveryType: (c.deliveryType as "SELF_PACED" | "COHORT") || "SELF_PACED",
      contactHours: c.contactHours || 40,
      price: c.price,
      priceNgn,
      originalPriceNgn,
      rating: 4.9,
      ratingCount: 120,
      thumbnailImage: c.thumbnailUrl || "/images/courses/course-1-solar-intro.jpg",
      thumbnailUrl: c.thumbnailUrl || "/images/courses/course-1-solar-intro.jpg",
      badge: c.badge || (c.code === "SI101" ? "Bestseller" : "New Masterclass"),
      instructor: c.instructorName || "Engr. Asanga (Certified Solar Professional)",
      fieldAttachment: "Official Accredited Certificate",
      isPublished: true,
      whatYouWillLearn,
      learningOutcomes: whatYouWillLearn,
      outcomes: whatYouWillLearn,
      modules: (c.modules || []).map((m: any) => ({
        title: m.title,
        sortOrder: m.sortOrder,
        lessons: (m.lessons || []).map((l: any) => ({
          title: l.title,
          sortOrder: l.sortOrder,
          videoUrl: l.videoUrl || "",
          durationSec: l.durationSec || 1800,
          contentMarkdown: l.contentMarkdown || "",
          isFreePreview: l.isFreePreview ?? false,
        })),
      })),
      totalLessons,
    };
  });

  // Ensure Solar Installation 101 is first (left) and Solar Installation 102 is second (right)
  courses.sort((a, b) => {
    if (a.code === "SI101" || a.slug.includes("101")) return -1;
    if (b.code === "SI101" || b.slug.includes("101")) return 1;
    if (a.code === "SI102" || a.slug.includes("102")) return 1;
    if (b.code === "SI102" || b.slug.includes("102")) return -1;
    return 0;
  });

  const primaryCourse =
    courses.find((c) => c.code === "SI101" || c.slug.includes("101")) ||
    courses[0] ||
    null;

  return (
    <div className="relative bg-white">
      {/* 1. Full-Bleed Cinematic Hero Section with Framer Motion */}
      <HeroSection courses={courses} primaryCourse={primaryCourse} />

      {/* 2. Dynamic Course Showcase & Infinite Scrolling Marquee */}
      <CourseCarouselSection courses={courses} />

      {/* 3. Social Proof & Verified Testimonials */}
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
