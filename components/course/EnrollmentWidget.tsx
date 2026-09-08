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
  Check, 
  Briefcase 
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
    setTimeout(() => {
      setIsProcessing(false);
      router.push(`/learn/${course.slug}`);
    }, 600);
  };

  return (
    <div className="deye-card p-6 lg:p-8 relative sticky top-24 shadow-sm border border-slate-200">
      {/* Price Header */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
          Complete Certification & Attachment
        </span>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl lg:text-4xl font-black text-slate-900 font-mono tracking-tight">
            {formatCurrency(course.price)}
          </span>
          {course.priceNgn && (
            <span className="text-sm font-bold text-slate-600 font-mono">
              / {course.priceNgn}
            </span>
          )}
        </div>
        <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 mt-2 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Includes 2–4 Months Physical Field Attachment</span>
        </p>
      </div>

      {/* Cohort Selector if applicable */}
      {course.cohorts && course.cohorts.length > 0 && (
        <div className="mb-6 space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#2B82C9]" />
            Select Cohort Schedule:
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
                      ? "border-[#2B82C9] bg-blue-50/70 text-slate-900 shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-900">{cohort.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {formattedStart} – {formattedEnd}
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-[#2B82C9] bg-[#2B82C9] text-white" : "border-slate-300"}`}>
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
          className="w-full py-3.5 px-6 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Registering Candidate...
            </span>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>Enroll Now — Immediate Access</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <Link
          href={`/learn/${course.slug}`}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <span>Preview Free Introduction Lessons</span>
        </Link>
      </div>

      {/* Features Checklist */}
      <div className="space-y-3 pt-6 border-t border-slate-200 text-xs text-slate-600">
        <div className="flex items-start gap-2.5">
          <Briefcase className="w-4 h-4 text-[#2B82C9] shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 block">Practical Field Attachment</strong>
            <span className="text-[11px] text-slate-500">2–4 months deployment on real partner solar projects</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 block">{course.contactHours} Accredited Contact Hours</strong>
            <span className="text-[11px] text-slate-500">Certified by Subway Schools & Engr. Asanga</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 block">Official Verifiable Certificate</strong>
            <span className="text-[11px] text-slate-500">Permanent credential with digital verification link</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <DownloadCloud className="w-4 h-4 text-[#2B82C9] shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 block">Subway Energy Sizing & Audit Toolkit</strong>
            <span className="text-[11px] text-slate-500">Includes field load profile spreadsheets and SLD schematics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
