import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ChevronRight, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  FileCheck, 
  Sparkles,
  Users
} from "lucide-react";
import { getCourseBySlug } from "@/lib/courses";
import SyllabusAccordion from "@/components/course/SyllabusAccordion";
import EnrollmentWidget from "@/components/course/EnrollmentWidget";
import ToolDownloads from "@/components/course/ToolDownloads";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="relative min-h-screen py-10 lg:py-14">
      {/* Background Grid */}
      <div className="absolute inset-0 solar-grid-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/courses" className="hover:text-amber-400 transition-colors">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-amber-400">{course.code}</span>
        </div>

        {/* Hero Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Main Left Content: Course Details & Syllabus */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header Area */}
            <div className="space-y-4">
              <div className="flex items-center flex-wrap gap-2">
                <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold tracking-wider">
                  {course.code}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                  {course.level} Level
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  NABCEP Accredited
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-base text-slate-300 leading-relaxed font-normal">
                {course.description}
              </p>

              {/* Fast Facts Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
                <div className="glass-panel p-3 rounded-xl flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono block">Training Hours</span>
                    <strong className="text-white">{course.contactHours} Contact Hours</strong>
                  </div>
                </div>

                <div className="glass-panel p-3 rounded-xl flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono block">Curriculum Depth</span>
                    <strong className="text-white">{course.modules.length} Modules ({totalLessons} Lessons)</strong>
                  </div>
                </div>

                <div className="glass-panel p-3 rounded-xl flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono block">Pass Threshold</span>
                    <strong className="text-white">70% Milestone Exam</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Syllabus Section */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Full Technical Syllabus & Modules
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click each module to view individual technical lectures, duration, and quizzes.
                  </p>
                </div>
              </div>

              <SyllabusAccordion modules={course.modules} courseSlug={course.slug} />
            </div>

            {/* Engineering Tools & Downloads Section */}
            {course.tools && course.tools.length > 0 && (
              <div className="pt-6 border-t border-slate-800">
                <ToolDownloads tools={course.tools} />
              </div>
            )}

            {/* Learning Outcomes Checklist */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>Professional Engineering Competencies Acquired</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">✓</span>
                  <span>Calculate extreme temperature open-circuit voltage string limits under NEC 690.7</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">✓</span>
                  <span>Size commercial AC/DC overcurrent protection and conductor ampacity deratings</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">✓</span>
                  <span>Engineer 120% rule busbar calculations and supply-side interconnection taps (NEC 705)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">✓</span>
                  <span>Model battery C-rate degradation, DoD limits, and peak shaving ROI payback</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Checkout / Enrollment Sidebar */}
          <div className="lg:col-span-4">
            <EnrollmentWidget course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}
