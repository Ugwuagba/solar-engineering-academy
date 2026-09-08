"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  DownloadCloud, 
  Award, 
  Zap, 
  ArrowRight,
  Clock,
  Check
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SeedCourse } from "@/lib/seed-data";

export default function EnrollmentWidget({ course }: { course: SeedCourse }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedCohort, setSelectedCohort] = useState<string>(
    course.cohorts && course.cohorts.length > 0 ? course.cohorts[0].name : ""
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEnroll = async () => {
    setIsProcessing(true);
    // Simulate instant enrollment pipeline
    setTimeout(() => {
      setIsProcessing(false);
      router.push(`/learn/${course.slug}`);
    }, 600);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-800 shadow-2xl relative sticky top-24">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Price Header */}
      <div className="mb-6 pb-6 border-b border-slate-800">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-3xl lg:text-4xl font-black text-white font-mono tracking-tight">
            {formatCurrency(course.price)}
          </span>
          <span className="text-xs text-slate-400 font-mono">USD / Full Tuition</span>
        </div>
        <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>NABCEP Certified Contact Hours Included</span>
        </p>
      </div>

      {/* Cohort Selector if applicable */}
      {course.cohorts && course.cohorts.length > 0 && (
        <div className="mb-6 space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Select Your Cohort Schedule:
          </label>
          <div className="space-y-2">
            {course.cohorts.map((cohort) => {
              const isSelected = selectedCohort === cohort.name;
              const formattedStart = new Date(cohort.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const formattedEnd = new Date(cohort.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={cohort.name}
                  onClick={() => setSelectedCohort(cohort.name)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 text-white shadow-sm"
                      : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-200">{cohort.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formattedStart} – {formattedEnd}
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-amber-400 bg-amber-400 text-slate-950" : "border-slate-700"}`}>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Primary CTA */}
      <div className="space-y-3 mb-6">
        <button
          onClick={handleEnroll}
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.99] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all cursor-pointer"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              Enrolling Candidate...
            </span>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Enroll Now — Instant Classroom Access</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <Link
          href={`/learn/${course.slug}`}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <span>Preview Free Lessons</span>
        </Link>
      </div>

      {/* Features Checklist */}
      <div className="space-y-3 pt-6 border-t border-slate-800 text-xs text-slate-300">
        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block">{course.contactHours} Certified Contact Hours</strong>
            <span className="text-[11px] text-slate-400">NABCEP Continuing Education credit</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block">Official Verifiable Certificate</strong>
            <span className="text-[11px] text-slate-400">Instant PDF & permanent verification URL</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <DownloadCloud className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block">Engineering CAD & Sizing Sheets</strong>
            <span className="text-[11px] text-slate-400">Lifetime access to downloadable assets</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block">14-Day Academic Guarantee</strong>
            <span className="text-[11px] text-slate-400">100% money-back if not fully satisfied</span>
          </div>
        </div>
      </div>
    </div>
  );
}
