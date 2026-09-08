import Link from "next/link";
import { Clock, BookOpen, ArrowRight, Award, Users, CheckCircle, Briefcase, User } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SeedCourse } from "@/lib/seed-data";

export default function CourseCard({ course }: { course: SeedCourse }) {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  const levelBadge = {
    INTRODUCTORY: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INTERMEDIATE: "bg-blue-50 text-[#2B82C9] border-blue-200",
    ADVANCED: "bg-purple-50 text-purple-700 border-purple-200",
  }[course.level];

  return (
    <div className="deye-card p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group">
      {/* Top Blue Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#2B82C9] opacity-70 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white tracking-wide">
              {course.code}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${levelBadge}`}>
              {course.level}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            {course.deliveryType === "COHORT" ? (
              <>
                <Users className="w-3.5 h-3.5 text-[#2B82C9]" />
                <span>Scheduled Cohort</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Self-Paced + Field Attachment</span>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#2B82C9] transition-colors mb-2 leading-snug">
          <Link href={`/courses/${course.slug}`}>
            {course.title}
          </Link>
        </h3>

        {/* Instructor Lead */}
        {course.instructor && (
          <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-3">
            <User className="w-3.5 h-3.5 text-[#2B82C9]" />
            <span>Instructor: {course.instructor}</span>
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-5 leading-relaxed">
          {course.description}
        </p>

        {/* Practical Field Attachment Highlight */}
        {course.fieldAttachment && (
          <div className="mb-5 p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-[#2B82C9] font-medium flex items-center gap-2">
            <Briefcase className="w-4 h-4 shrink-0 text-[#2B82C9]" />
            <span className="text-[11px] leading-tight">{course.fieldAttachment}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 mb-5 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong className="text-slate-900">{course.contactHours}</strong> Contact Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#2B82C9] shrink-0" />
            <span><strong className="text-slate-900">{course.modules.length}</strong> Modules ({totalLessons} Lessons)</span>
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <div>
          <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 tracking-wider block">
            Academy Tuition
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {formatCurrency(course.price)}
            </span>
            {course.priceNgn && (
              <span className="text-xs font-bold text-slate-500 font-mono">
                / {course.priceNgn}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${course.slug}`}
            className="px-4 py-2.5 text-xs font-bold text-white bg-[#2B82C9] hover:bg-[#226ba8] rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all"
          >
            <span>View Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
