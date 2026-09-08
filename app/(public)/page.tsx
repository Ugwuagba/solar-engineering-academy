import Link from "next/link";
import { 
  Sun, 
  Zap, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  FileCode, 
  BookOpen, 
  Layers, 
  Activity 
} from "lucide-react";
import CourseCard from "@/components/course/CourseCard";
import { getAllCourses } from "@/lib/courses";

export default async function HomePage() {
  const courses = await getAllCourses();

  return (
    <div className="relative">
      {/* Background Engineering Grid */}
      <div className="absolute inset-0 solar-grid-bg pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>NABCEP & SEI-Aligned Continuing Education</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Master Advanced <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                Solar PV & Battery Energy Storage
              </span>{" "}
              Engineering.
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Rigorous, code-compliant training for electrical engineers, EPC contractors, and solar designers. Master extreme string sizing, NEC 690/705, and NFPA 855 stationary storage.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Course Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/courses/pvol101"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>View PVOL101 Design Syllabus</span>
              </Link>
            </div>

            {/* Technical Proof Points */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-slate-800/80 text-left">
              <div className="glass-panel p-4 rounded-xl border border-slate-800/60">
                <p className="text-2xl font-black text-white font-mono">64 Hours</p>
                <p className="text-xs text-slate-400 mt-1">Accredited Contact Hours</p>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-slate-800/60">
                <p className="text-2xl font-black text-white font-mono">100%</p>
                <p className="text-xs text-slate-400 mt-1">NEC 2023 / NFPA 855 Aligned</p>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-slate-800/60">
                <p className="text-2xl font-black text-white font-mono">70%</p>
                <p className="text-xs text-slate-400 mt-1">Quiz Progression Gating</p>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-slate-800/60">
                <p className="text-2xl font-black text-white font-mono">CAD & SLD</p>
                <p className="text-xs text-slate-400 mt-1">Commercial Tools Takeoff</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Technical Programs Section */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4" />
                <span>Core Curriculum</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Accredited Solar & Storage Programs
              </h2>
            </div>
            <Link
              href="/courses"
              className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>View All Programs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.code} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Pedagogy Comparison */}
      <section className="py-20 border-t border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Why Solar Engineers Train With Us
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Standard online courses offer passive video watching. We require demonstrated technical competence through mathematical modeling and calculation gating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                70% Progression Lock Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Students cannot advance to subsequent modules without passing rigorous calculation-based assessments reflecting actual code limits.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Real Single-Line Diagrams & CAD
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Learn from actual 480V 3-phase commercial drawings, rapid shutdown configurations, and utility interconnection single-line schematics.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Verifiable Digital Credentials
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive permanent accredited certificates with verifiable QR codes and contact hour transcripts for employer and NABCEP audit compliance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
