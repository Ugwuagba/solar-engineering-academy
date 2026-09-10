"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Infinity as InfinityIcon, 
  Smartphone, 
  Award, 
  BookOpen, 
  Briefcase, 
  Share2, 
  Gift, 
  Clock, 
  Zap,
  Calendar,
  Check
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SeedCourse } from "@/lib/seed-data";
import VideoPreviewModal from "./VideoPreviewModal";

export default function EnrollmentWidget({ course }: { course: SeedCourse }) {
  const router = useRouter();
  const [selectedCohort, setSelectedCohort] = useState<string>(
    course.cohorts && course.cohorts.length > 0 ? course.cohorts[0].name : ""
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEnroll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router.push(`/learn/${course.slug}`);
    }, 600);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden sticky top-24 z-30">
        {/* 1. Video Preview Area (Udemy Exact Style) */}
        <div 
          onClick={() => setPreviewOpen(true)}
          className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer group"
        >
          <img
            src={course.thumbnailImage || "/images/courses/course-1-solar-intro.jpg"}
            alt={course.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/40 to-black/30 group-hover:bg-black/40 transition-colors" />

          {/* Centered Circular Play Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-transform">
              <Play className="w-7 h-7 fill-current ml-1 text-slate-900" />
            </div>
            <span className="text-white font-bold text-sm tracking-wide drop-shadow-md">
              Preview this course
            </span>
          </div>

          {/* Top subtle overlay badge */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono font-bold text-white">
            {course.contactHours}h On-Demand
          </div>
        </div>

        {/* 2. Pricing & CTAs */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Price Heading */}
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                {course.priceNgn || formatCurrency(course.price)}
              </span>
              {course.originalPriceNgn && (
                <span className="text-base font-semibold text-slate-400 line-through font-mono">
                  {course.originalPriceNgn}
                </span>
              )}
              {course.discountPercentage && (
                <span className="text-xs font-bold text-[#D74000] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {course.discountPercentage}% off
                </span>
              )}
            </div>

            {/* Urgency Callout */}
            <div className="flex items-center gap-1.5 text-xs text-[#E13B2B] font-semibold mt-2">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>2 days left at this price!</span>
            </div>
          </div>

          {/* Scheduled Cohort Picker if applicable */}
          {course.cohorts && course.cohorts.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2B82C9]" />
                Select Cohort Schedule:
              </label>
              <div className="space-y-1.5">
                {course.cohorts.map((ch) => {
                  const isSelected = selectedCohort === ch.name;
                  return (
                    <div
                      key={ch.name}
                      onClick={() => setSelectedCohort(ch.name)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-[#2B82C9] bg-blue-50/70 text-slate-900 font-semibold"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <div className="line-clamp-1 pr-2">
                        <span>{ch.name}</span>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-[#2B82C9] bg-[#2B82C9] text-white" : "border-slate-300"}`}>
                        {isSelected && <Check className="w-2 h-2 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleEnroll}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#2B82C9]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isProcessing ? "Processing Enrollment..." : "Add to cart"}</span>
            </button>

            <button
              onClick={handleEnroll}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl border-2 border-slate-900 hover:bg-slate-900 hover:text-white active:scale-[0.98] text-slate-900 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>Buy now</span>
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="text-center text-xs text-slate-500 pt-1 space-y-1">
            <p className="flex items-center justify-center gap-1.5 font-medium text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>30-Day Money-Back Guarantee</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Full Lifetime Access • Learn at your own pace
            </p>
          </div>

          {/* This Course Includes Checklist */}
          <div className="pt-5 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              This course includes:
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{course.contactHours} hours on-demand video</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{course.modules.length} modules ({totalLessons} technical lessons)</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Two hard copies official textbooks included</span>
              </div>
              {course.fieldAttachment && (
                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-[#E13B2B] shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-800">{course.fieldAttachment}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Access on mobile, tablet and desktop</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Certificate of completion</span>
              </div>
            </div>
          </div>

          {/* Share / Gift links */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-around text-xs font-semibold text-slate-600">
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-[#2B82C9] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
            <span className="text-slate-200">|</span>
            <button 
              onClick={handleEnroll}
              className="flex items-center gap-1.5 hover:text-[#2B82C9] transition-colors cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Gift this course</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      <VideoPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={course.title}
        courseTitle={course.title}
      />
    </>
  );
}
