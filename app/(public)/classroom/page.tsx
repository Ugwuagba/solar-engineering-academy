import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import Link from "next/link";
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  Clock, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  User, 
  Sparkles 
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Classroom | Subway Schools",
  description: "Access your enrolled solar engineering masterclasses, track lesson progress, and continue hands-on training.",
};

export default async function ClassroomDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?redirect=/classroom");
  }

  const userId = session.user.id;

  // 1. Fetch all ACTIVE enrollments with courses, modules and lessons
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId,
      status: "ACTIVE",
    },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { sortOrder: "asc" },
            include: {
              lessons: { orderBy: { sortOrder: "asc" } },
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  // 2. Fetch all lesson progress records for this student
  const lessonProgresses = await prisma.lessonProgress.findMany({
    where: { userId },
  });

  const progressMap = new Map<string, { completed: boolean; lastPosition: number }>();
  lessonProgresses.forEach((lp) => {
    progressMap.set(lp.lessonId, {
      completed: lp.completed,
      lastPosition: lp.lastPosition,
    });
  });

  // 3. Process courses with computed progress metrics
  const enrolledCourses = enrollments.map((enrollment) => {
    const course = enrollment.course;
    const allLessons: any[] = [];
    (course.modules || []).forEach((m) => {
      (m.lessons || []).forEach((l) => {
        allLessons.push({
          ...l,
          moduleTitle: m.title,
        });
      });
    });

    const totalLessons = allLessons.length;
    let completedLessons = 0;
    let nextLessonSlug = "";
    let resumeLesson = allLessons[0] || null;

    allLessons.forEach((l) => {
      const prog = progressMap.get(l.id);
      if (prog?.completed) {
        completedLessons++;
      } else if (!nextLessonSlug) {
        nextLessonSlug = l.id;
        resumeLesson = l;
      }
    });

    const progressPercentage = totalLessons > 0 
      ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
      : 0;

    return {
      enrollmentId: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      courseId: course.id,
      code: course.code,
      title: course.title,
      slug: course.slug,
      instructor: course.instructorName || "Engr. Asanga (Certified Solar Professional)",
      thumbnailUrl: course.thumbnailUrl || "/images/courses/course-1-solar-intro.jpg",
      contactHours: course.contactHours || 40,
      totalLessons,
      completedLessons,
      progressPercentage,
      resumeLessonId: resumeLesson?.id || "",
      resumeLessonTitle: resumeLesson?.title || "Lesson 1",
    };
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* 1. Classroom Top Banner */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>STUDENT LEARNING DASHBOARD</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                My Classroom
              </h1>
              <p className="text-slate-300 text-sm max-w-xl font-normal leading-relaxed">
                Welcome back, <strong className="text-white">{session.user.name || session.user.email}</strong>. Continue where you left off in your technical solar masterclass.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-center">
                <span className="text-xs font-mono uppercase text-slate-400 block">Enrolled Tracks</span>
                <span className="text-xl font-bold font-mono text-sky-400">{enrolledCourses.length}</span>
              </div>
              <Link
                href="/courses"
                className="px-4 py-3 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Catalog</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {enrolledCourses.length > 0 ? (
          /* Enrolled Courses Grid (Udemy Style) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {enrolledCourses.map((c) => {
              const continueLink = `/learn/${c.slug}${c.resumeLessonId ? `?lesson=${c.resumeLessonId}` : ""}`;

              return (
                <div
                  key={c.enrollmentId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#2B82C9]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Course Thumbnail with Quick-Play Overlay */}
                    <Link href={continueLink} className="block relative w-full h-48 overflow-hidden bg-slate-900 group">
                      <img
                        src={c.thumbnailUrl}
                        alt={c.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                      
                      {/* Code Badge */}
                      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-mono font-bold text-white border border-white/10">
                        {c.code}
                      </div>

                      {/* Play Hover Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-[#2B82C9] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Duration Tag */}
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{c.contactHours}h Track</span>
                      </div>
                    </Link>

                    {/* Content Body */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2B82C9] transition-colors leading-snug line-clamp-2">
                          <Link href={continueLink}>{c.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{c.instructor}</span>
                        </p>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-500 font-medium">
                            {c.completedLessons} of {c.totalLessons} lessons
                          </span>
                          <span className="font-bold text-[#2B82C9]">
                            {c.progressPercentage}% complete
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-gradient-to-r from-[#2B82C9] to-sky-400 rounded-full transition-all duration-500"
                            style={{ width: `${c.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Next Lesson Indicator */}
                      {c.resumeLessonTitle && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#2B82C9] shrink-0" />
                          <span className="truncate">
                            Next: <strong className="text-slate-800">{c.resumeLessonTitle}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-5 pt-0">
                    <Link
                      href={continueLink}
                      className="w-full py-2.5 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] active:scale-[0.98] text-white font-bold text-xs shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Continue Learning</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State (Zero Enrolled Courses) */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 sm:p-16 text-center max-w-2xl mx-auto my-12 space-y-6">
            <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 text-[#2B82C9] flex items-center justify-center mx-auto shadow-inner">
              <GraduationCap className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                You have not enrolled in any programs yet.
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Start your journey into certified solar installation, industrial power auditing, and battery energy storage engineering today.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-[#2B82C9]/25 transition-all cursor-pointer"
              >
                <span>Browse Solar Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
