import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ChevronRight, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  FileCheck, 
  HardHat,
  Briefcase,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
  Sparkles
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
    <div className="relative min-h-screen bg-[#F8FAFC] py-8 lg:py-12">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 deye-grid-bg pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link href="/" className="hover:text-[#2B82C9] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/courses" className="hover:text-[#2B82C9] transition-colors">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">{course.code}</span>
        </div>

        {/* Hero Header Section & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Left Content: Course Details & Syllabus */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Card */}
            <div className="deye-card p-6 sm:p-8 space-y-6">
              <div className="flex items-center flex-wrap gap-2.5">
                <span className="px-3 py-1 rounded-md bg-blue-50 text-[#2B82C9] border border-blue-200/80 font-mono text-xs font-bold tracking-wider">
                  {course.code}
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                  {course.level} Level
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Subway Energy Accredited
                </span>
                {course.fieldAttachment && (
                  <span className="px-2.5 py-1 rounded text-xs font-semibold bg-red-50 text-[#E13B2B] border border-red-200 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#E13B2B]" />
                    {course.fieldAttachment}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {course.title}
                </h1>
                <p className="text-base text-slate-600 leading-relaxed font-normal mt-3">
                  {course.description}
                </p>
              </div>

              {/* Fast Facts Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#2B82C9] shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">Training Hours</span>
                    <strong className="text-slate-900 font-bold">{course.contactHours} Contact Hours</strong>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">Curriculum Depth</span>
                    <strong className="text-slate-900 font-bold">{course.modules.length} Modules ({totalLessons} Lessons)</strong>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-center gap-3 col-span-2 sm:col-span-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">Pass Threshold</span>
                    <strong className="text-slate-900 font-bold">70% Milestone Exam</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Attachment Highlight Card */}
            {course.fieldAttachment && (
              <div className="deye-card p-6 border-l-4 border-l-[#E13B2B] relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#E13B2B]" />
                      <h3 className="text-base font-bold text-slate-900">
                        Practical Partner Field Attachment Included
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-50 text-[#E13B2B] font-bold">
                        2–4 MONTHS
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      Students completing all modules with ≥70% score are deployed to Subway Energy Limited industrial partner sites across Nigeria. Gain hands-on field experience wiring high-capacity string inverters, commissioning commercial BESS racks, and synchronizing with the grid.
                    </p>
                  </div>
                  <div className="shrink-0 bg-slate-50 border border-slate-200 p-3 rounded-xl text-center min-w-[140px]">
                    <span className="text-[11px] font-mono uppercase text-slate-500 block">Placement Rate</span>
                    <span className="text-xl font-black text-slate-900">100% Guaranteed</span>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Partner Sites</span>
                  </div>
                </div>
              </div>
            )}

            {/* Lead Instructor Section */}
            {course.instructor && (
              <div className="deye-card p-6 sm:p-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2B82C9] font-bold">
                  <HardHat className="w-4 h-4" />
                  <span>Lead Course Instructor & Engineering Director</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-slate-800 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                    EA
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>{course.instructor}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-[#2B82C9] border border-blue-200 font-semibold">
                        Lead PV & Storage Engineer
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      Author of the <em className="text-slate-900 font-semibold">Solar Companion Technical Reference</em> and Director of Engineering at Subway Energy Limited (RC: 1837154). Over 15 years designing utility-scale PV plants, mini-grids, and commercial BESS systems throughout West Africa.
                    </p>
                    <div className="flex items-center flex-wrap gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                      <span>• COREN Registered Engineer</span>
                      <span>• 120+ MW Designed Capacity</span>
                      <span>• Master Technical Trainer</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Technical Syllabus Accordion */}
            <div className="deye-card p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Full Technical Syllabus & Modules
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Structured into step-by-step engineering lectures with accompanying quizzes (70% pass requirement).
                </p>
              </div>

              <SyllabusAccordion modules={course.modules} courseSlug={course.slug} />
            </div>

            {/* Engineering Tools & Downloads Section */}
            {course.tools && course.tools.length > 0 && (
              <div className="deye-card p-6 sm:p-8">
                <ToolDownloads tools={course.tools} />
              </div>
            )}

            {/* Learning Outcomes Checklist */}
            <div className="deye-card p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#2B82C9]" />
                <span>Professional Engineering Competencies Acquired</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-[#2B82C9] shrink-0 mt-0.5" />
                  <span>Master solar radiation calculations, peak sun hours, and tilt angle optimization.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-[#2B82C9] shrink-0 mt-0.5" />
                  <span>Execute precise load audits, continuous vs surge wattage, and daily Wh demand calculations.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-[#2B82C9] shrink-0 mt-0.5" />
                  <span>Size battery banks (Lead-Acid & LiFePO4), DOD safety margins, and series-parallel wiring.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-[#2B82C9] shrink-0 mt-0.5" />
                  <span>Design PWM and MPPT charge controller arrays adhering to Voc temperature extremes.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-[#2B82C9] shrink-0 mt-0.5" />
                  <span>Calculate AC & DC cable ampacity, voltage drop (&lt;3%), breaker sizing, and SPD grounding.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-[#2B82C9] shrink-0 mt-0.5" />
                  <span>Utilize the Solar Companion Technical Reference manual and quick lookup tables.</span>
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
