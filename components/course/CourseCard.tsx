"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Clock, ArrowRight, Award, Users, CheckCircle, User, Check, Sparkles, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SeedCourse } from "@/lib/seed-data";

export default function CourseCard({ course }: { course: SeedCourse | any }) {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (authStatus === "loading") return;

    if (!session?.user) {
      router.push(`/login?redirect=/courses/${course.slug}`);
      return;
    }

    try {
      setIsProcessing(true);
      const res = await fetch("/api/payments/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id || course.code,
          courseSlug: course.slug,
          amount: course.price !== undefined ? Number(course.price) : 5000,
          email: session.user.email,
          name: session.user.name,
          userId: session.user.id,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.status === "success" && data?.link) {
        window.location.href = data.link;
      } else {
        alert(data?.message || "Failed to initialize payment gateway. Please try again.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("[Card Enrollment Error]:", err);
      alert("Could not connect to payment gateway. Please check your internet connection.");
      setIsProcessing(false);
    }
  };

  const levelBadge = {
    INTRODUCTORY: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INTERMEDIATE: "bg-blue-50 text-[#2B82C9] border-blue-200",
    ADVANCED: "bg-purple-50 text-purple-700 border-purple-200",
  }[course.level as "INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED"] || "bg-blue-50 text-[#2B82C9] border-blue-200";

  const trainingHours =
    course.code === "SI101" || course.slug?.includes("101")
      ? 8
      : course.code === "SI102" || course.slug?.includes("102")
      ? 15
      : (course.contactHours || 40);

  const outcomes: string[] =
    (Array.isArray(course.learningOutcomes) && course.learningOutcomes.length > 0 && course.learningOutcomes) ||
    (Array.isArray(course.whatYouWillLearn) && course.whatYouWillLearn.length > 0 && course.whatYouWillLearn) ||
    (Array.isArray(course.outcomes) && course.outcomes.length > 0 && course.outcomes) ||
    [
      "Master scientific solar PV design according to international standards",
      "Sizing battery energy storage systems (BESS) for continuous operation",
      "Equipment commissioning, hybrid inverter programming, and fault diagnostics",
    ];

  const priceFormatted = `₦${Number(course.price || 0).toLocaleString()}`;

  return (
    <div className="deye-card relative group bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-2xl hover:border-[#2B82C9]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Blue Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#2B82C9] opacity-70 group-hover:opacity-100 transition-opacity z-10" />

      {/* --- 1. DEFAULT COMPACT CARD SURFACE --- */}
      <div className="flex flex-col h-full justify-between">
        {/* Course Thumbnail Image Banner */}
        <Link href={`/courses/${course.slug}`} className="block relative w-full h-48 sm:h-52 overflow-hidden bg-slate-900 shrink-0">
          <img
            src={course.thumbnailImage || course.thumbnailUrl || "/images/courses/course-1-solar-intro.jpg"}
            alt={course.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />
          
          {/* Top Badges over image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="font-mono text-[11px] font-black px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-xs text-white tracking-wide border border-white/10 shadow-sm">
              {course.code}
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider shadow-sm bg-white/95 backdrop-blur-xs ${levelBadge}`}>
              {course.level}
            </span>
          </div>

          {/* Institution Badge on image bottom-left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-white text-[11px] font-medium shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Subway Schools</span>
          </div>
        </Link>

        {/* Compact Card Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            {/* Rating & Delivery Badges */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold font-mono">
                <span>★ {course.rating || 4.9}</span>
                <span className="text-slate-400 font-normal">({(course.ratingCount || 120).toLocaleString()})</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {course.deliveryType === "COHORT" ? (
                  <>
                    <Users className="w-3 h-3 text-[#2B82C9]" />
                    <span>Scheduled Cohort</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Self-Paced</span>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2B82C9] transition-colors leading-snug line-clamp-2">
              <Link href={`/courses/${course.slug}`}>
                {course.title}
              </Link>
            </h3>

            {/* Instructor Name */}
            {course.instructor && (
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 line-clamp-1">
                <User className="w-3.5 h-3.5 text-[#2B82C9] shrink-0" />
                <span>Instructor: {course.instructor}</span>
              </p>
            )}

            {/* Total Training Hours */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold pt-1">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{trainingHours} Training Hours</span>
            </div>
          </div>

          {/* Pricing & Syllabus CTA */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 tracking-wider block">
                Tuition
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {priceFormatted}
              </span>
            </div>

            <Link
              href={`/courses/${course.slug}`}
              className="px-4 py-2 text-xs font-bold text-[#2B82C9] bg-blue-50 hover:bg-blue-100 active:scale-98 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <span>View Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* --- 2. UDEMY-STYLE DESKTOP HOVER POPOVER OVERLAY --- */}
      <div className="hidden lg:flex absolute inset-0 z-30 bg-white/98 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-2 border-[#2B82C9] flex-col justify-between opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform scale-98 group-hover:scale-100">
        <div className="space-y-3">
          {/* Header Tag */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2B82C9] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {course.code} • MASTERCLASS
            </span>
            <span className="text-[10px] font-medium text-slate-400 font-mono">
              Updated September 2026
            </span>
          </div>

          {/* Course Title */}
          <h4 className="text-base font-bold text-slate-900 leading-snug">
            {course.title}
          </h4>

          {/* Duration & Level Meta */}
          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
            <span className="text-emerald-700 font-bold">{course.level}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {trainingHours} Training Hours
            </span>
          </div>

          {/* What You'll Learn Checklist */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#2B82C9]" />
              <span>What You&apos;ll Learn</span>
            </p>
            <div className="space-y-1.5">
              {outcomes.slice(0, 4).map((outcome: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-relaxed">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Popover Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">Tuition Fee</span>
            <span className="text-xl font-mono font-black text-slate-900">{priceFormatted}</span>
          </div>

          <button
            onClick={handleEnroll}
            disabled={isProcessing}
            className="w-full py-2.5 bg-[#2B82C9] hover:bg-[#226ba8] active:scale-[0.98] text-white text-xs font-bold rounded-xl text-center shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Connecting to Gateway...</span>
              </>
            ) : (
              <>
                <span>Enroll in Academy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <Link
            href={`/courses/${course.slug}#curriculum`}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 text-xs font-semibold rounded-xl text-center transition-all block cursor-pointer"
          >
            View Course Syllabus
          </Link>
        </div>
      </div>
    </div>
  );
}
