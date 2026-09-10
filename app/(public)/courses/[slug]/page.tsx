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
  Star, 
  Globe, 
  MessageSquare, 
  Calendar, 
  Check, 
  Sparkles,
  Info,
  UserCheck,
  GraduationCap
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
  const totalDurationSecs = course.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((lSum, l) => lSum + l.durationSec, 0),
    0
  );
  const totalHours = Math.round(totalDurationSecs / 3600) || course.contactHours;

  return (
    <div className="relative min-h-screen bg-slate-50/50 pb-20">
      {/* 1. Udemy Dark Hero Banner Header */}
      <section className="bg-[#0B1528] text-white py-10 lg:py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Header Column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Breadcrumb Path */}
              <div className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-300">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-sky-400 font-mono">{course.code}</span>
              </div>

              {/* Course Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              {/* Subtitle */}
              {course.subtitle && (
                <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                  {course.subtitle}
                </p>
              )}

              {/* Ratings, Students & Badges */}
              <div className="flex items-center flex-wrap gap-3 pt-1 text-xs sm:text-sm">
                {/* Bestseller Badge */}
                <span className="px-2.5 py-0.5 rounded font-black text-xs uppercase tracking-wide bg-[#ECEB98] text-[#3D3C0A]">
                  {course.badge || "Bestseller"}
                </span>

                {/* Star Rating */}
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span>{course.rating || 4.9}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <span className="text-sky-300 underline cursor-pointer">
                  ({(course.ratingCount || 2450).toLocaleString()} ratings)
                </span>

                <span className="text-slate-300">
                  {(course.studentsCount || 14200).toLocaleString()} students enrolled
                </span>
              </div>

              {/* Instructor attribution */}
              <p className="text-xs sm:text-sm text-slate-300">
                Created by{" "}
                <span className="text-white font-bold underline cursor-pointer">
                  {course.instructor || "Engr. Asanga (Certified Solar Professional, 20+ Years Experience)"}
                </span>
              </p>

              {/* Metadata Row */}
              <div className="flex items-center flex-wrap gap-4 pt-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Last updated 8/2026</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>English</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>English [Auto]</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Award className="w-4 h-4" />
                  <span>Subway Schools Certificate</span>
                </div>
              </div>
            </div>

            {/* Empty space for grid alignment on desktop (Widget sticks in the column below) */}
            <div className="hidden lg:block lg:col-span-4" />
          </div>
        </div>
      </section>

      {/* 2. Main Body Container with Left Column (Content) and Right Column (Floating Sticky Sidebar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Left Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* "What you'll learn" Box (Exact Udemy Box Layout) */}
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  What you&apos;ll learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-slate-700">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#2B82C9] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Field Attachment Guarantee Banner */}
            {course.fieldAttachment && (
              <div className="bg-white rounded-2xl p-6 border-l-4 border-l-[#E13B2B] border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#E13B2B]" />
                    <h3 className="text-base font-bold text-slate-900">
                      2–4 Months Practical Field Attachment Included
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                    Students completing all modules with ≥70% score are deployed to Subway Energy Limited industrial partner sites across Nigeria for physical hands-on installation and commissioning.
                  </p>
                </div>
                <div className="shrink-0 bg-red-50 border border-red-200/80 p-3 rounded-xl text-center min-w-[140px]">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#E13B2B] block">Field Placement</span>
                  <span className="text-lg font-black text-slate-900">100% Guaranteed</span>
                </div>
              </div>
            )}

            {/* Explore Related Topics / Skills */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Explore related topics
              </h3>
              <div className="flex items-center flex-wrap gap-2">
                {[
                  "Solar PV System Design",
                  "Electrical Load Auditing",
                  "LiFePO4 Battery Storage",
                  "Pure Sine Wave Inverters",
                  "Charge Controllers (MPPT)",
                  "Commercial Rooftop HSE",
                  "Solar Entrepreneurship"
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-[#2B82C9] hover:text-[#2B82C9] transition-colors cursor-pointer shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Course Content / Curriculum Accordion (Exact Udemy Screenshot Layout) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Course content
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {course.modules.length} sections • {totalLessons} lectures • {totalHours}h total length
                </p>
              </div>

              <SyllabusAccordion 
                modules={course.modules} 
                courseSlug={course.slug} 
                courseTitle={course.title}
              />
            </div>

            {/* Requirements Section (Direct from PDF Section 5) */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Requirements
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc list-inside">
                  {course.requirements.map((req, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description Section (Direct from PDF Section 2 & 3) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Description
              </h2>
              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
                <p>{course.description}</p>
                <p>
                  The course takes students from the fundamentals of solar energy and photovoltaic technology through the identification and application of major solar-system components, electrical load assessment, power auditing, roof characteristics, and the factors that influence solar-system design and installation.
                </p>
                <p>
                  A dedicated <strong>Solar Companion Technical Reference</strong> provides additional high-level engineering knowledge covering solar inverters, batteries, solar panels, and solar charge controllers, including their ratings, characteristics, sizing considerations, configurations, and applications.
                </p>
              </div>
            </div>

            {/* Who this course is for Section (Direct from PDF Section 4) */}
            {course.targetAudience && course.targetAudience.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Who this course is for:
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc list-inside">
                  {course.targetAudience.map((aud, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {aud}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor Profile (Direct from PDF Section 17 & 18) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Instructor
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 text-[#2B82C9]">
                    Engr. Asanga
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Certified Solar Professional • Director of Engineering at Subway Energy Limited
                  </p>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span><strong>4.9</strong> Instructor Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#2B82C9]" />
                    <span><strong>20+ Years</strong> Experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span><strong>10,000+</strong> Technicians Trained</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Engr. Asanga is the course creator and lead instructor for Subway Schools. A professional Solar Consultant for more than 15 years with over 20 years of practical electrical and power engineering experience. The course is structured to provide students with a practical and systematic understanding of solar-energy systems, from fundamental concepts and component identification through power auditing, electrical-load assessment, system-sizing principles, roof assessment, and solar entrepreneurship.
                </p>
              </div>
            </div>

            {/* Technical Sizing Tools & Downloads Section */}
            {course.tools && course.tools.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                <ToolDownloads tools={course.tools} />
              </div>
            )}

          </div>

          {/* Right Column: Floating Sticky Udemy-Style Enrollment Sidebar Card */}
          <div className="lg:col-span-4 -mt-6 lg:-mt-48 relative z-20">
            <EnrollmentWidget course={course} />
          </div>

        </div>
      </div>
    </div>
  );
}
