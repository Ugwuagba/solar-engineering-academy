"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  PlayCircle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowLeft, 
  Briefcase,
  Check,
  RotateCcw,
  Sparkles,
  Award
} from "lucide-react";
import { SeedCourse, SeedLesson, SeedModule } from "@/lib/seed-data";
import { formatDuration } from "@/lib/utils";

interface ClassroomPlayerProps {
  course: SeedCourse;
  initialProgress?: Record<string, { completed: boolean; lastPosition: number }>;
  requestedLessonId?: string;
  userId?: string;
}

export default function ClassroomPlayer({
  course,
  initialProgress = {},
  requestedLessonId,
  userId,
}: ClassroomPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSavedTimeRef = useRef<number>(0);
  const hasSeekedInitialRef = useRef<boolean>(false);

  // Flatten all lessons with their module and lesson indices
  const flattenedLessons: {
    lesson: SeedLesson;
    moduleIdx: number;
    lessonIdx: number;
    identifier: string;
  }[] = [];

  course.modules.forEach((mod, mIdx) => {
    mod.lessons.forEach((l, lIdx) => {
      const identifier = l.id || `${course.code}-m${mod.sortOrder}-l${l.sortOrder}`;
      flattenedLessons.push({
        lesson: l,
        moduleIdx: mIdx,
        lessonIdx: lIdx,
        identifier,
      });
    });
  });

  const totalLessons = flattenedLessons.length;

  // Local state for lesson progress: map identifier / id -> { completed, lastPosition }
  const [progressMap, setProgressMap] = useState<
    Record<string, { completed: boolean; lastPosition: number }>
  >(initialProgress);

  // Determine initial active module and lesson
  let initialMIdx = 0;
  let initialLIdx = 0;

  if (requestedLessonId) {
    const match = flattenedLessons.find(
      (fl) =>
        fl.identifier === requestedLessonId ||
        fl.lesson.id === requestedLessonId ||
        fl.lesson.title.toLowerCase() === requestedLessonId.toLowerCase()
    );
    if (match) {
      initialMIdx = match.moduleIdx;
      initialLIdx = match.lessonIdx;
    }
  } else {
    // Pick the first incomplete lesson, or default to first
    const firstIncomplete = flattenedLessons.find((fl) => {
      const key = fl.lesson.id || fl.identifier;
      return !progressMap[key]?.completed;
    });
    if (firstIncomplete) {
      initialMIdx = firstIncomplete.moduleIdx;
      initialLIdx = firstIncomplete.lessonIdx;
    }
  }

  const [activeModuleIdx, setActiveModuleIdx] = useState(initialMIdx);
  const [activeLessonIdx, setActiveLessonIdx] = useState(initialLIdx);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [resumeNotification, setResumeNotification] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const currentModule = course.modules[activeModuleIdx] || course.modules[0];
  const currentLesson = currentModule.lessons[activeLessonIdx] || currentModule.lessons[0];
  const currentQuiz = currentModule.quiz;

  const currentLessonIdentifier =
    currentLesson?.id || `${course.code}-m${currentModule?.sortOrder}-l${currentLesson?.sortOrder}`;

  const isCurrentLessonCompleted = Boolean(
    progressMap[currentLesson?.id || ""]?.completed ||
    progressMap[currentLessonIdentifier]?.completed
  );

  // Calculate dynamic completed lessons count
  const completedLessonsCount = flattenedLessons.filter((fl) => {
    const idKey = fl.lesson.id || "";
    const identKey = fl.identifier;
    return progressMap[idKey]?.completed || progressMap[identKey]?.completed;
  }).length;

  const progressPct = totalLessons > 0
    ? Math.min(100, Math.round((completedLessonsCount / totalLessons) * 100))
    : 0;

  // Global lesson number
  const currentLessonGlobalNumber =
    course.modules.slice(0, activeModuleIdx).reduce((sum, m) => sum + m.lessons.length, 0) +
    activeLessonIdx +
    1;

  // Persist progress to server API
  const saveProgressToServer = useCallback(
    async (lessonId: string, completed: boolean, position: number) => {
      try {
        setIsSavingProgress(true);
        await fetch("/api/lessons/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            courseId: course.id || course.slug,
            completed,
            lastPosition: Math.round(position),
          }),
        });
      } catch (err) {
        console.warn("Failed to persist progress:", err);
      } finally {
        setIsSavingProgress(false);
      }
    },
    [course.id, course.slug]
  );

  // Handle video loaded metadata to auto-seek if lastPosition > 5s
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    const savedProgress =
      progressMap[currentLesson?.id || ""] || progressMap[currentLessonIdentifier];
    const lastPos = savedProgress?.lastPosition || 0;

    if (lastPos > 5 && lastPos < video.duration - 5) {
      video.currentTime = lastPos;
      const mins = Math.floor(lastPos / 60);
      const secs = Math.floor(lastPos % 60);
      const formatted = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      setResumeNotification(`Resumed playback at ${formatted}`);
      setTimeout(() => setResumeNotification(null), 4000);
    }
    hasSeekedInitialRef.current = true;
  };

  // Reset seek ref when switching lesson
  useEffect(() => {
    hasSeekedInitialRef.current = false;
    setResumeNotification(null);
  }, [activeModuleIdx, activeLessonIdx]);

  // Periodic progress tracking and auto-complete at >= 90%
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const currentTime = video.currentTime;
    const duration = video.duration;
    const targetKey = currentLesson?.id || currentLessonIdentifier;

    // 1. Auto-complete when >= 90% completion
    if (currentTime / duration >= 0.9 && !isCurrentLessonCompleted) {
      setProgressMap((prev) => ({
        ...prev,
        [targetKey]: {
          completed: true,
          lastPosition: Math.round(currentTime),
        },
      }));
      saveProgressToServer(targetKey, true, currentTime);
    }

    // 2. Periodic position update every 12 seconds
    if (Math.abs(currentTime - lastSavedTimeRef.current) >= 12) {
      lastSavedTimeRef.current = currentTime;
      setProgressMap((prev) => ({
        ...prev,
        [targetKey]: {
          completed: prev[targetKey]?.completed || isCurrentLessonCompleted,
          lastPosition: Math.round(currentTime),
        },
      }));
      saveProgressToServer(
        targetKey,
        isCurrentLessonCompleted || currentTime / duration >= 0.9,
        currentTime
      );
    }
  };

  // Toggle or mark lesson complete manually
  const handleToggleComplete = () => {
    const video = videoRef.current;
    const currentTime = video ? video.currentTime : 0;
    const targetKey = currentLesson?.id || currentLessonIdentifier;
    const newCompletedState = !isCurrentLessonCompleted;

    setProgressMap((prev) => ({
      ...prev,
      [targetKey]: {
        completed: newCompletedState,
        lastPosition: Math.round(currentTime),
      },
    }));

    saveProgressToServer(targetKey, newCompletedState, currentTime);
  };

  // Auto-advance to next lesson upon finishing the video
  const handleVideoEnded = () => {
    const targetKey = currentLesson?.id || currentLessonIdentifier;
    // Ensure marked complete
    setProgressMap((prev) => ({
      ...prev,
      [targetKey]: {
        completed: true,
        lastPosition: 0,
      },
    }));
    saveProgressToServer(targetKey, true, 0);

    // Find next lesson
    if (activeLessonIdx + 1 < currentModule.lessons.length) {
      setActiveLessonIdx((prev) => prev + 1);
    } else if (activeModuleIdx + 1 < course.modules.length) {
      setActiveModuleIdx((prev) => prev + 1);
      setActiveLessonIdx(0);
    } else {
      // Completed all modules! If quiz exists, prompt quiz
      if (currentQuiz) {
        setIsQuizMode(true);
      }
    }
  };

  // Quiz handlers
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

  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Classroom Bar */}
      <header className="h-16 border-b border-slate-200/80 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/classroom"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 font-medium text-xs"
            title="Return to My Classroom Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">My Classroom</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

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
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-500 block leading-none">
                Course Progress
              </span>
              <span className="text-xs font-bold font-mono text-[#2B82C9]">
                {completedLessonsCount} of {totalLessons} completed ({progressPct}%)
              </span>
            </div>
            <div className="w-20 sm:w-28 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <Link
            href={`/courses/${course.slug}`}
            className="hidden md:inline-flex px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            Course Details
          </Link>
        </div>
      </header>

      {/* Main Split Player Layout */}
      <div className="w-full flex-1 min-h-0 h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column (Video & Lesson info) */}
        <main className="w-full lg:col-span-8 h-full overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-6">
          {!isQuizMode ? (
            /* Video Lecture Mode */
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Responsive Video Container with Dark Bezel */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg relative group">
                <video
                  ref={videoRef}
                  key={currentLesson.videoUrl || currentLessonIdentifier}
                  controls
                  className="w-full h-full object-cover"
                  src={currentLesson.videoUrl || "/videos/sample-solar.mp4"}
                  poster="/images/hero/hero-commercial.jpg"
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                />

                {/* Resume Toast */}
                {resumeNotification && (
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-xs border border-sky-500/40 text-sky-300 px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 shadow-lg animate-fade-in pointer-events-none">
                    <RotateCcw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                    <span>{resumeNotification}</span>
                  </div>
                )}
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
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>
                      Duration: <strong className="text-slate-700 font-mono">{formatDuration(currentLesson.durationSec)}</strong>
                    </span>
                    {currentLesson.isFreePreview && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Open Preview
                      </span>
                    )}
                  </p>
                </div>

                {/* Action Buttons: Mark Complete & Quiz */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleToggleComplete}
                    className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                      isCurrentLessonCompleted
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {isCurrentLessonCompleted ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        <span>Mark as Complete</span>
                      </>
                    )}
                  </button>

                  {currentQuiz && (
                    <button
                      onClick={() => setIsQuizMode(true)}
                      className="px-4 py-2.5 text-xs font-bold rounded-xl bg-[#2B82C9] hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Take Module Quiz ({currentQuiz.passingScore}% Pass)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Field Attachment Note */}
              {course.fieldAttachment && (
                <div className="deye-card p-5 border-l-4 border-l-[#E13B2B] flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-[#E13B2B] shrink-0" />
                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-900 font-bold block mb-0.5">
                      Subway Energy Practical Field Attachment Requirement:
                    </strong>
                    Remember: to qualify for the 2–4 months partner field attachment, complete all module quizzes with a score of 70% or higher.
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

        {/* Right Column (Course Curriculum & Modules) */}
        <aside className="w-full lg:col-span-4 h-full overflow-y-auto border-l border-slate-200 dark:border-slate-800 p-4 custom-scrollbar bg-white shadow-xs">
          {/* Pinned Curriculum Header */}
          <div className="sticky -top-4 -mx-4 px-4 pt-4 pb-3 bg-white border-b border-slate-200 dark:border-slate-800 z-10 mb-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Course Curriculum
                </h3>
                <p className="text-[11px] text-slate-500">
                  {course.modules.length} Modules • {completedLessonsCount}/{totalLessons} Completed
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-[#2B82C9] border border-blue-200">
                70% Gated
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {course.modules.map((mod, mIdx) => {
              const isActiveMod = mIdx === activeModuleIdx;

              // Check module progress
              const modCompletedCount = mod.lessons.filter((l) => {
                const k1 = l.id || "";
                const k2 = `${course.code}-m${mod.sortOrder}-l${l.sortOrder}`;
                return progressMap[k1]?.completed || progressMap[k2]?.completed;
              }).length;

              return (
                <div key={mod.sortOrder} className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {mod.sortOrder}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 truncate" title={mod.title}>
                        {mod.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {modCompletedCount}/{mod.lessons.length}
                    </span>
                  </div>

                  <div className="space-y-1 pl-6">
                    {mod.lessons.map((lesson, lIdx) => {
                      const isCurrent = isActiveMod && lIdx === activeLessonIdx && !isQuizMode;
                      const lessonIdKey = lesson.id || "";
                      const lessonIdentKey = `${course.code}-m${mod.sortOrder}-l${lesson.sortOrder}`;
                      const isCompleted = Boolean(
                        progressMap[lessonIdKey]?.completed ||
                        progressMap[lessonIdentKey]?.completed
                      );

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
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : isCurrent ? (
                              <PlayCircle className="w-3.5 h-3.5 text-[#2B82C9] shrink-0" />
                            ) : (
                              <PlayCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className={`truncate ${isCompleted && !isCurrent ? "text-slate-600" : ""}`}>
                              {lesson.title}
                            </span>
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
