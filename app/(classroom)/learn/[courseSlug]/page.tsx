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
  Download
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

  const currentModule = course.modules[activeModuleIdx];
  const currentLesson = currentModule.lessons[activeLessonIdx];
  const currentQuiz = currentModule.quiz;

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
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

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Top Classroom Bar */}
      <header className="h-14 border-b border-slate-800 bg-[#090d16] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.slug}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Classroom"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                {course.code}
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                {course.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 font-mono text-slate-400">
            <span>Overall Progress:</span>
            <span className="text-amber-400 font-bold">25%</span>
          </div>
          <Link
            href="/courses"
            className="px-3 py-1 text-xs rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            Catalog
          </Link>
        </div>
      </header>

      {/* Main Split Player Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center: Active Player or Quiz View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {!isQuizMode ? (
            /* Video Lecture Mode */
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Responsive Video Container */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl relative group">
                <video
                  controls
                  className="w-full h-full object-cover"
                  src={currentLesson.videoUrl}
                  poster="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80"
                />
              </div>

              {/* Lesson Title & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider block mb-1">
                    {currentModule.title}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {currentLesson.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Duration: {formatDuration(currentLesson.durationSec)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsQuizMode(true)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Module Quiz (70% Pass)</span>
                  </button>
                </div>
              </div>

              {/* Lesson Engineering Content Markdown */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Technical Lecture Notes & Formula Sheet</span>
                </h3>

                <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-sans">
                  <pre className="whitespace-pre-wrap font-sans text-slate-300 bg-transparent p-0">
                    {currentLesson.contentMarkdown}
                  </pre>
                </div>

                {currentLesson.downloadableUrl && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/60 p-3 rounded-xl">
                    <div className="flex items-center gap-2 text-xs">
                      <Download className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300 font-medium">Supplementary Technical Calculation Asset</span>
                    </div>
                    <button
                      onClick={() => alert(`Downloading: ${currentLesson.downloadableUrl}`)}
                      className="px-3 py-1 text-xs font-medium text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded-lg hover:bg-amber-500/10"
                    >
                      Download Asset
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Interactive Quiz Mode */
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider block mb-1">
                    {currentModule.title}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {currentQuiz.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Passing Threshold: <strong className="text-amber-400">{currentQuiz.passingScore}%</strong> • Total Questions: {currentQuiz.questions.length}
                  </p>
                </div>

                <button
                  onClick={() => setIsQuizMode(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300"
                >
                  Return to Video
                </button>
              </div>

              {/* Quiz Result Banner */}
              {quizSubmitted && (
                <div
                  className={`p-6 rounded-2xl border ${
                    quizScore !== null && quizScore >= currentQuiz.passingScore
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold">
                        {quizScore !== null && quizScore >= currentQuiz.passingScore
                          ? "✓ Assessment Passed — Module Unlocked!"
                          : "✕ Passing Score Not Reached"}
                      </h4>
                      <p className="text-xs mt-1 text-slate-300">
                        You scored <strong className="text-white font-mono">{quizScore}%</strong> (Minimum required: {currentQuiz.passingScore}%).
                      </p>
                    </div>

                    <button
                      onClick={handleResetQuiz}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    >
                      Retake Assessment
                    </button>
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-6">
                {currentQuiz.questions.map((q, qIdx) => {
                  const isSelected = selectedAnswers[qIdx] !== undefined;
                  const isCorrect = selectedAnswers[qIdx] === q.correctOptionIndex;

                  return (
                    <div
                      key={qIdx}
                      className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <p className="text-sm font-semibold text-white leading-relaxed">
                          {q.text}
                        </p>
                      </div>

                      <div className="space-y-2 pl-9">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedAnswers[qIdx] === optIdx;
                          let optionClasses = "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700";

                          if (quizSubmitted) {
                            if (optIdx === q.correctOptionIndex) {
                              optionClasses = "border-emerald-500 bg-emerald-500/20 text-emerald-200 font-semibold";
                            } else if (isOptionSelected && !isCorrect) {
                              optionClasses = "border-rose-500 bg-rose-500/20 text-rose-200";
                            }
                          } else if (isOptionSelected) {
                            optionClasses = "border-amber-400 bg-amber-500/15 text-white font-semibold";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectAnswer(qIdx, optIdx)}
                              className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${optionClasses}`}
                            >
                              <span>{opt}</span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  isOptionSelected ? "border-amber-400 bg-amber-400 text-slate-950" : "border-slate-700"
                                }`}
                              >
                                {isOptionSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Feedback */}
                      {quizSubmitted && (
                        <div className="pl-9 pt-2">
                          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                            <strong className="text-amber-400 block mb-1">Technical Explanation:</strong>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted && (
                <div className="pt-4">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < currentQuiz.questions.length}
                    className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    Submit Assessment For Grading
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Collapsible Modules & Lessons Drawer */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#090d16] p-4 shrink-0 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Course Syllabus
            </h3>
            <span className="text-[11px] font-mono text-amber-400">
              {course.modules.length} Modules
            </span>
          </div>

          <div className="space-y-4">
            {course.modules.map((mod, mIdx) => {
              const isActiveMod = mIdx === activeModuleIdx;

              return (
                <div key={mod.sortOrder} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {mod.sortOrder}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-300 truncate">
                      {mod.title}
                    </h4>
                  </div>

                  <div className="space-y-1 pl-7">
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
                          className={`w-full p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                            isCurrent
                              ? "bg-amber-500/20 text-amber-300 font-semibold"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">
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
                        className={`w-full p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                          isActiveMod && isQuizMode
                            ? "bg-amber-400 text-slate-950 font-bold"
                            : "text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Module {mod.sortOrder} Quiz</span>
                        </div>
                        <span className="text-[10px] font-mono shrink-0">70% Pass</span>
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
