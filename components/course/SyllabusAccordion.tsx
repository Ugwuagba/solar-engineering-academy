"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  Lock, 
  CheckCircle2 
} from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { SeedModule } from "@/lib/seed-data";
import VideoPreviewModal from "./VideoPreviewModal";

export default function SyllabusAccordion({ 
  modules,
  courseSlug,
  courseTitle = "Technical Course"
}: { 
  modules: SeedModule[];
  courseSlug: string;
  courseTitle?: string;
}) {
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({ 0: true });
  const [previewLesson, setPreviewLesson] = useState<{ title: string; videoUrl: string } | null>(null);

  const toggleModule = (index: number) => {
    setOpenModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<number, boolean> = {};
    modules.forEach((_, idx) => (allOpen[idx] = true));
    setOpenModules(allOpen);
  };

  const collapseAll = () => {
    setOpenModules({});
  };

  return (
    <div className="space-y-4">
      {/* Video Preview Modal */}
      {previewLesson && (
        <VideoPreviewModal
          isOpen={!!previewLesson}
          onClose={() => setPreviewLesson(null)}
          title={previewLesson.title}
          videoUrl={previewLesson.videoUrl}
          courseTitle={courseTitle}
        />
      )}
      {/* Controls Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <p className="text-xs font-mono text-slate-600">
          Curriculum Depth: <strong className="text-slate-900">{modules.length} Modules</strong> •{" "}
          <strong className="text-slate-900">
            {modules.reduce((sum, m) => sum + m.lessons.length, 0)} Technical Lessons
          </strong>
        </p>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={expandAll}
            className="text-[#2B82C9] hover:underline font-semibold transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={collapseAll}
            className="text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {modules.map((module, mIdx) => {
          const isOpen = !!openModules[mIdx];
          const totalModuleSecs = module.lessons.reduce((acc, l) => acc + l.durationSec, 0);

          return (
            <div
              key={module.sortOrder}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-all"
            >
              {/* Module Header Trigger */}
              <button
                onClick={() => toggleModule(mIdx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2B82C9] font-mono text-xs font-bold mt-0.5 shrink-0">
                    {module.sortOrder}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      {module.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{module.lessons.length} Lessons</span>
                      <span>•</span>
                      <span>{formatDuration(totalModuleSecs)} Runtime</span>
                      <span>•</span>
                      <span className="text-[#E13B2B] font-semibold">End-of-Module Quiz (70% Pass)</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-700" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Module Content */}
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/50 divide-y divide-slate-100">
                  {/* Lessons */}
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.sortOrder}
                      className="px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm hover:bg-slate-100/60 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-[#2B82C9] transition-colors shrink-0" />
                        <div>
                          <span className="text-slate-800 font-medium group-hover:text-slate-900 transition-colors">
                            {lesson.title}
                          </span>
                          {lesson.downloadableUrl && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#2B82C9] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              <FileText className="w-2.5 h-2.5" />
                              Technical Sheet
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-xs">
                        {lesson.isFreePreview ? (
                          <button
                            onClick={() => setPreviewLesson({
                              title: lesson.title,
                              videoUrl: lesson.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                            })}
                            className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-[#2B82C9] hover:bg-[#2B82C9] hover:text-white border border-blue-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <PlayCircle className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                            <Lock className="w-3 h-3" />
                            Enrolled
                          </span>
                        )}
                        <span className="font-mono text-slate-500">
                          {formatDuration(lesson.durationSec)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* End-of-Module Quiz Milestone */}
                  {module.quiz && (
                    <div className="px-5 py-3 bg-amber-50/60 flex items-center justify-between text-xs border-t border-amber-100">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-amber-100 text-amber-800">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {module.quiz.title}
                          </span>
                          <span className="text-[11px] text-slate-600">
                            {module.quiz.questions.length} Technical Calculation Questions • Minimum Passing Score: {module.quiz.passingScore}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[#E13B2B] font-mono text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Progression Lock</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
