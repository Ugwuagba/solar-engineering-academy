import Link from "next/link";
import { Clock, BookOpen, ArrowRight, Award, Users, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SeedCourse } from "@/lib/seed-data";

export default function CourseCard({ course }: { course: SeedCourse }) {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  const levelColor = {
    INTRODUCTORY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    INTERMEDIATE: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    ADVANCED: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  }[course.level];

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 opacity-60 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wide">
              {course.code}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${levelColor}`}>
              {course.level}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
            {course.deliveryType === "COHORT" ? (
              <>
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Scheduled Cohort</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Self-Paced / On-Demand</span>
              </>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors mb-2.5 leading-snug">
          <Link href={`/courses/${course.slug}`}>
            {course.title}
          </Link>
        </h3>

        <p className="text-sm text-slate-400 line-clamp-3 mb-5 leading-relaxed">
          {course.description}
        </p>

        {/* Meta Stats */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800/80 mb-5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span><strong className="text-white">{course.contactHours}</strong> Contact Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span><strong className="text-white">{course.modules.length}</strong> Modules ({totalLessons} Lessons)</span>
          </div>
        </div>

        {/* Tools Included Highlight */}
        {course.tools && course.tools.length > 0 && (
          <div className="mb-5 p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/60">
            <p className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Includes Engineering Deliverables:
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {course.tools[0].title}
            </p>
          </div>
        )}
      </div>

      {/* Pricing and Action CTAs */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-800/50">
        <div>
          <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider block">Tuition Fee</span>
          <span className="text-2xl font-extrabold text-white font-mono">
            {formatCurrency(course.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${course.slug}`}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/10 hover:shadow-amber-500/25 transition-all"
          >
            <span>View Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
