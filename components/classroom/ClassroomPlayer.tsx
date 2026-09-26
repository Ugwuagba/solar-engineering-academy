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
  Award,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { SeedCourse, SeedLesson, SeedModule } from "@/lib/seed-data";
import { formatDuration } from "@/lib/utils";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2C6.505 2 2.012 6.484 2.009 12.008c-.001 1.764.461 3.488 1.339 5.008L2 22l5.127-1.325c1.472.802 3.13 1.226 4.819 1.227h.005c5.524 0 10.017-4.484 10.02-10.009A9.957 9.957 0 0 0 19.08 4.93 9.943 9.943 0 0 0 12.031 2zm0 18.232h-.004a8.238 8.238 0 0 1-4.204-1.155l-.302-.179-3.123.807.832-3.042-.197-.313a8.194 8.194 0 0 1-1.258-4.341c.002-4.551 3.708-8.254 8.263-8.254 2.207.001 4.28 1.05 5.84 2.61a8.212 8.212 0 0 1 2.418 5.836c-.002 4.552-3.708 8.256-8.268 8.256zm4.53-6.182c-.248-.124-1.468-.724-1.696-.807-.228-.083-.394-.124-.56.124-.166.248-.642.807-.787.973-.145.166-.29.186-.538.062-.248-.124-1.047-.386-1.995-1.23-.738-.658-1.237-1.47-1.382-1.718-.145-.248-.015-.382.109-.505.112-.111.248-.29.373-.435.124-.145.166-.248.248-.414.083-.166.042-.311-.02-.435-.063-.124-.56-1.349-.767-1.848-.202-.486-.407-.42-.56-.428l-.477-.009c-.166 0-.435.062-.663.311-.228.249-.87 0.85-.87 2.073s.891 2.404 1.015 2.57c.125.166 1.753 2.677 4.248 3.754.593.256 1.057.409 1.418.524.597.19 1.141.163 1.571.099.479-.072 1.468-.6 1.675-1.18.207-.58.207-1.077.145-1.18-.062-.104-.228-.166-.477-.29z"/>
    </svg>
  );
}

interface ClassroomPlayerProps {
  course: SeedCourse;
  initialProgress?: Record<string, { completed: boolean; lastPosition: number }>;
  requestedLessonId?: string;
  userId?: string;
  paymentStatus?: string;
  txRef?: string;
  studentName?: string;
  studentEmail?: string;
}

export default function ClassroomPlayer({
  course,
  initialProgress = {},
  requestedLessonId,
  userId,
  paymentStatus,
  txRef,
  studentName,
  studentEmail,
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
  const [isAttachmentExpanded, setIsAttachmentExpanded] = useState(false);
  const [resumeNotification, setResumeNotification] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  // Payment onboarding and celebration modal state
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(paymentStatus === "success");
  const [showPaymentSuccessBanner, setShowPaymentSuccessBanner] = useState(paymentStatus === "success");
  const [activeTxRef, setActiveTxRef] = useState(txRef || "");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const isSuccess = urlParams.get("payment") === "success" || paymentStatus === "success";
      const ref = urlParams.get("tx_ref") || txRef || "";
      if (isSuccess) {
        setShowPaymentSuccessModal(true);
        setShowPaymentSuccessBanner(true);
      }
      if (ref) {
        setActiveTxRef(ref);
      }
    }
  }, [paymentStatus, txRef]);

  // Clean WhatsApp phone number & prefilled message generator
  const rawPhone = process.env.NEXT_PUBLIC_INSTRUCTOR_WHATSAPP || "2347012715632";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const studentIdentifier = studentName || studentEmail || (userId ? `Student (${userId.slice(0, 8)})` : "Enrolled Student");
  const rawMessage = `Hi, I paid for ${course.title}. I'd like to get access to the videos.\n\nStudent: ${studentIdentifier}\nRef: ${activeTxRef || "Enrolled"}`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rawMessage)}`;

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
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Top Classroom Bar */}
      <header className="h-16 border-b border-slate-200/80 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs z-20 sticky top-0 lg:static">
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
      <div className="w-full flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 lg:h-[calc(100vh-64px)] overflow-visible lg:overflow-hidden">
        {/* Left Column (Video & Lesson info) */}
        <main className="w-full lg:col-span-8 overflow-visible lg:h-full lg:overflow-y-auto p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 custom-scrollbar">
          {/* Celebratory Post-Payment Banner */}
          {showPaymentSuccessBanner && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Payment Confirmed
                    </span>
                    {activeTxRef && (
                      <span className="text-[11px] font-mono text-slate-500">Ref: {activeTxRef}</span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                    Welcome to {course.title}!
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 max-w-xl leading-relaxed">
                    Your tuition payment has been verified. Connect directly with the lead instructor on WhatsApp to get access to offline video downloads and private masterclass support.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 text-xs font-bold rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Reach Out to Instructor for Videos</span>
                </a>
                <button
                  onClick={() => setShowPaymentSuccessBanner(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {!isQuizMode ? (
            /* Video Lecture Mode */
            <div className="max-w-4xl mx-auto space-y-4">
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
              <div className="deye-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <span className="text-[11px] font-mono text-[#2B82C9] font-bold uppercase tracking-wider block mb-0.5">
                    {currentModule.title}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
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
                      className="px-4 py-2.5 text-xs font-bold rounded-xl bg-[#2B82C9] hover:bg-blue-700 text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Take Module Quiz ({currentQuiz.passingScore}% Pass)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Refined Collapsible Field Attachment Requirement Notice */}
              {course.fieldAttachment && (
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-800/40 p-3 sm:p-3.5 transition-all text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-amber-900 dark:text-amber-200">
                          Subway Energy Practical Field Attachment Requirement
                        </span>
                        <span className="hidden sm:inline text-amber-800/80 dark:text-amber-300/80 ml-2">
                          (70%+ quiz score required for 2–4 months placement)
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAttachmentExpanded((prev) => !prev)}
                      className="p-1 rounded-md text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors shrink-0 flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                    >
                      <span>{isAttachmentExpanded ? "Hide Details" : "View Details"}</span>
                      {isAttachmentExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {isAttachmentExpanded && (
                    <div className="mt-2.5 pt-2.5 border-t border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300/90 leading-relaxed text-xs">
                      Remember: to qualify for the 2–4 months partner field attachment at Subway Energy partner installation sites, complete all module quizzes with an assessment score of 70% or higher.
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Interactive Quiz Mode */
            <div className="max-w-3xl mx-auto space-y-4">
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
        <aside className="w-full lg:col-span-4 overflow-visible lg:h-full lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 p-4 sm:p-5 custom-scrollbar bg-white shadow-xs">
          {/* Pinned Curriculum Header */}
          <div className="sticky top-0 lg:-top-5 -mx-4 sm:-mx-5 px-4 sm:px-5 pt-3.5 pb-3 bg-white border-b border-slate-200 dark:border-slate-800 z-10 mb-3.5 shadow-2xs">
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

          {/* Persistent Instructor Assistance & Video Access Card in Sidebar */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-2xs space-y-2.5 mb-4">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                <WhatsAppIcon className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Instructor Assistance</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  Need direct video access or technical guidance from Engr. Asanga?
                </p>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Reach Out to Instructor for Videos</span>
            </a>
          </div>

          <div className="space-y-3.5">
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

      {/* Celebratory Welcome Modal when arriving directly from checkout (?payment=success) */}
      {showPaymentSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowPaymentSuccessModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#25D366] border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
              <WhatsAppIcon className="w-9 h-9 fill-current" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>ENROLLMENT ACTIVATED</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Welcome to the Academy!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Your tuition for <strong>{course.title}</strong> is confirmed. Reach out directly to your instructor on WhatsApp to receive video access, engineering files, and your cohort orientation:
              </p>
              {activeTxRef && (
                <div className="text-[11px] font-mono text-slate-500 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200/80">
                  Payment Ref: <strong className="text-slate-800">{activeTxRef}</strong>
                </div>
              )}
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md shadow-[#25D366]/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 fill-current" />
                <span>Reach Out to Instructor for Videos</span>
              </a>
              <button
                onClick={() => setShowPaymentSuccessModal(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Continue to Course Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
