"use client";

import { useState, use } from "react";
import Link from "next/link";
import { 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  HelpCircle, 
  ArrowLeft, 
  FileText, 
  Award, 
  ChevronRight,
  Sparkles,
  Download,
  BookOpen,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { SEED_COURSES } from "@/lib/seed-data";
import { formatDuration } from "@/lib/utils";

export default function ClassroomPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = use(params);
  const course = SEED_COURSES.find((c) => c.slug.toLowerCase() === courseSlug.toLowerCase()) || SEED_COURSES[0];

  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const currentModule = course.modules[activeModuleIdx] || course.modules[0];
  const currentLesson = currentModule.lessons[activeLessonIdx] || currentModule.lessons[0];
  const currentQuiz = currentModule.quiz;

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz?.questions) return;
    let correctCount = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / currentQuiz.questions.length) * 100);
    setQuizScore(scorePct);
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  // Calculate approximate progress
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const currentLessonGlobalNumber = 
    course.modules.slice(0, activeModuleIdx).reduce((sum, m) => sum + m.lessons.length, 0) + activeLessonIdx + 1;
  const progressPct = Math.min(100, Math.round((currentLessonGlobalNumber / totalLessons) * 100));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Classroom Bar */}
      <header className="h-16 border-b border-slate-200/80 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs z-20">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.slug}`}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Exit Classroom"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded bg-blue-50 text-[#2B82C9] border border-blue-200 font-mono text-xs font-bold">
              {course.code}
            </span>
            <div className="hidden sm:block">
              <span className="text-[10px] font-mono uppercase text-slate-400 block leading-none mb-0.5">
                Subway Schools LMS Portal
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                {course.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-500 block leading-none">Course Progress</span>
              <span className="text-xs font-bold font-mono text-[#2B82C9]">
                Lesson {currentLessonGlobalNumber} of {totalLessons} ({progressPct}%)
              </span>
            </div>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-[#2B82C9] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <Link
            href="/courses"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            Course Catalog
          </Link>
        </div>
      </header>

      {/* Main Split Player Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center: Active Player or Quiz View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {!isQuizMode ? (
            /* Video Lecture Mode */
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Responsive Video Container with Dark Bezel */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg relative group">
                <video
                  controls
                  className="w-full h-full object-cover"
                  src={currentLesson.videoUrl}
                  poster="/images/hero/hero-commercial.jpg"
                />
              </div>

              {/* Lesson Title & Controls Bar */}
              <div className="deye-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#2B82C9] font-bold uppercase tracking-wider block mb-1">
                    {currentModule.title}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {currentLesson.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Lesson Duration: <strong className="text-slate-700 font-mono">{formatDuration(currentLesson.durationSec)}</strong>
                    {currentLesson.isFreePreview && (
                      <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Open Preview
                      </span>
                    )}
                  </p>
                </div>

                {currentQuiz && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsQuizMode(true)}
                      className="px-4 py-2.5 text-xs font-bold rounded-xl bg-[#2B82C9] hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Take Module Quiz ({currentQuiz.passingScore}% Pass)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Technical Lecture Notes & Reference Guide */}
              <div className="deye-card p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#2B82C9]" />
                    <span>Technical Lecture Notes & Solar Companion Formulations</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    Subway Energy Reference
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-sans">
                  <pre className="whitespace-pre-wrap font-sans text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs sm:text-sm overflow-x-auto leading-relaxed">
                    {currentLesson.contentMarkdown}
                  </pre>
                </div>

                {currentLesson.downloadableUrl && (
                  <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2.5 text-xs">
                      <Download className="w-5 h-5 text-[#2B82C9]" />
                      <div>
                        <span className="text-slate-900 font-bold block">Supplementary Engineering Asset</span>
                        <span className="text-slate-500 text-[11px] font-mono">{currentLesson.downloadableUrl}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading engineering reference: ${currentLesson.downloadableUrl}`)}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#2B82C9] hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Download Asset
                    </button>
                  </div>
                )}
              </div>

              {/* Field Attachment Note */}
              {course.fieldAttachment && (
                <div className="deye-card p-5 border-l-4 border-l-[#E13B2B] flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-[#E13B2B] shrink-0" />
                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-900 font-bold block mb-0.5">
                      Subway Energy Practical Field Attachment Requirement:
                    </strong>
                    Remember: to qualify for the 2–4 months partner field attachment, complete all 11 module quizzes with a score of 70% or higher.
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Interactive Quiz Mode */
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="deye-card p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[#2B82C9] font-bold uppercase tracking-wider block mb-1">
                    {currentModule.title}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {currentQuiz?.title || "Module Quiz"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Passing Threshold: <strong className="text-[#2B82C9]">{currentQuiz?.passingScore || 70}%</strong> • Total Questions: {currentQuiz?.questions.length || 0}
                  </p>
                </div>

                <button
                  onClick={() => setIsQuizMode(false)}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  Return to Video
                </button>
              </div>

              {/* Quiz Result Banner */}
              {quizSubmitted && (
                <div
                  className={`p-6 rounded-2xl border ${
                    quizScore !== null && quizScore >= (currentQuiz?.passingScore || 70)
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-red-50 border-red-200 text-red-900"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        {quizScore !== null && quizScore >= (currentQuiz?.passingScore || 70) ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Assessment Passed — Module Competency Verified!</span>
                          </>
                        ) : (
                          <span>✕ Minimum 70% Score Not Met</span>
                        )}
                      </h4>
                      <p className="text-xs mt-1.5 opacity-90 leading-relaxed">
                        You achieved <strong className="font-mono font-bold">{quizScore}%</strong>. A minimum of {currentQuiz?.passingScore || 70}% is required to unlock subsequent modules and maintain certification eligibility.
                      </p>
                    </div>

                    <button
                      onClick={handleResetQuiz}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 shadow-2xs shrink-0 cursor-pointer"
                    >
                      Retake Assessment
                    </button>
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-6">
                {currentQuiz?.questions.map((q, qIdx) => {
                  const isSelected = selectedAnswers[qIdx] !== undefined;
                  const isCorrect = selectedAnswers[qIdx] === q.correctOptionIndex;

                  return (
                    <div
                      key={qIdx}
                      className="deye-card p-6 space-y-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-[#2B82C9] text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <p className="text-sm font-bold text-slate-900 leading-relaxed">
                          {q.text}
                        </p>
                      </div>

                      <div className="space-y-2.5 pl-9">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedAnswers[qIdx] === optIdx;
                          let optionClasses = "border-slate-200 bg-white text-slate-700 hover:border-[#2B82C9] hover:bg-blue-50/20";

                          if (quizSubmitted) {
                            if (optIdx === q.correctOptionIndex) {
                              optionClasses = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                            } else if (isOptionSelected && !isCorrect) {
                              optionClasses = "border-red-400 bg-red-50 text-red-900";
                            }
                          } else if (isOptionSelected) {
                            optionClasses = "border-[#2B82C9] bg-blue-50/60 text-[#2B82C9] font-bold ring-1 ring-[#2B82C9]";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectAnswer(qIdx, optIdx)}
                              className={`w-full p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${optionClasses}`}
                            >
                              <span>{opt}</span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  isOptionSelected ? "border-[#2B82C9] bg-[#2B82C9] text-white" : "border-slate-300"
                                }`}
                              >
                                {isOptionSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Feedback */}
                      {quizSubmitted && (
                        <div className="pl-9 pt-2">
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                            <strong className="text-[#2B82C9] block mb-1 font-mono">Technical Explanation:</strong>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted && currentQuiz && (
                <div className="pt-2 pb-8">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < currentQuiz.questions.length}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#2B82C9] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Submit Assessment For Technical Grading
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right Sidebar: Modules & Lessons Drawer */}
        <aside className="w-full lg:w-88 border-t lg:border-t-0 lg:border-l border-slate-200/80 bg-white p-4 shrink-0 overflow-y-auto space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                Course Curriculum
              </h3>
              <p className="text-[11px] text-slate-500">
                {course.modules.length} Modules • {totalLessons} Lessons
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-[#2B82C9] border border-blue-200">
              70% Gated
            </span>
          </div>

          <div className="space-y-4">
            {course.modules.map((mod, mIdx) => {
              const isActiveMod = mIdx === activeModuleIdx;

              return (
                <div key={mod.sortOrder} className="space-y-1.5">
                  <div className="flex items-center gap-2 px-1">
                    <span className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {mod.sortOrder}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate" title={mod.title}>
                      {mod.title}
                    </h4>
                  </div>

                  <div className="space-y-1 pl-6">
                    {mod.lessons.map((lesson, lIdx) => {
                      const isCurrent = isActiveMod && lIdx === activeLessonIdx && !isQuizMode;

                      return (
                        <button
                          key={lesson.sortOrder}
                          onClick={() => {
                            setActiveModuleIdx(mIdx);
                            setActiveLessonIdx(lIdx);
                            setIsQuizMode(false);
                          }}
                          className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                            isCurrent
                              ? "bg-blue-50 text-[#2B82C9] font-bold border border-blue-200/80"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {formatDuration(lesson.durationSec)}
                          </span>
                        </button>
                      );
                    })}

                    {/* Quiz Button in Sidebar */}
                    {mod.quiz && (
                      <button
                        onClick={() => {
                          setActiveModuleIdx(mIdx);
                          setIsQuizMode(true);
                        }}
                        className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isActiveMod && isQuizMode
                            ? "bg-[#2B82C9] text-white font-bold shadow-xs"
                            : "text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-[#2B82C9] border border-slate-200/60"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate font-semibold">Quiz: {mod.quiz.title}</span>
                        </div>
                        <span className="text-[10px] font-mono shrink-0 font-bold">
                          70% Pass
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
