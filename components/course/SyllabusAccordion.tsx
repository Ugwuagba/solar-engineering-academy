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

export default function SyllabusAccordion({ 
  modules,
  courseSlug 
}: { 
  modules: SeedModule[];
  courseSlug: string;
}) {
  // Default open first module
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({ 0: true });

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
      {/* Controls Bar */}
      <div className="flex items-center justify-between pb-2">
        <p className="text-xs font-mono text-slate-400">
          Curriculum Breakdown: <strong className="text-white">{modules.length} Modules</strong> •{" "}
          <strong className="text-white">
            {modules.reduce((sum, m) => sum + m.lessons.length, 0)} Technical Lessons
          </strong>
        </p>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={expandAll}
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            Expand All
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={collapseAll}
            className="text-slate-400 hover:text-slate-300 transition-colors"
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
              className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40 transition-colors"
            >
              {/* Module Header Trigger */}
              <button
                onClick={() => toggleModule(mIdx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs font-bold mt-0.5 shrink-0">
                    {module.sortOrder}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-white">
                      {module.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{module.lessons.length} Lessons</span>
                      <span>•</span>
                      <span>{formatDuration(totalModuleSecs)} Video Runtime</span>
                      <span>•</span>
                      <span className="text-amber-400/90 font-medium">End-of-Module Quiz (70% Pass)</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Module Content */}
              {isOpen && (
                <div className="border-t border-slate-800/80 bg-slate-950/40 divide-y divide-slate-800/50">
                  {/* Lessons */}
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.sortOrder}
                      className="px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm hover:bg-slate-900/40 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0" />
                        <div>
                          <span className="text-slate-200 group-hover:text-white transition-colors">
                            {lesson.title}
                          </span>
                          {lesson.downloadableUrl && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                              <FileText className="w-2.5 h-2.5" />
                              Datasheet / CAD
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-xs">
                        {lesson.isFreePreview ? (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                            Free Preview
                          </span>
                        ) : (
                          <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                            <Lock className="w-3 h-3" />
                            Enrolled
                          </span>
                        )}
                        <span className="font-mono text-slate-400">
                          {formatDuration(lesson.durationSec)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* End-of-Module Quiz Milestone */}
                  {module.quiz && (
                    <div className="px-5 py-3 bg-amber-500/5 flex items-center justify-between text-xs border-t border-amber-500/10">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 rounded bg-amber-500/20 text-amber-400">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold text-amber-300 block">
                            {module.quiz.title}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {module.quiz.questions.length} Technical Calculation Questions • Minimum Passing Score: {module.quiz.passingScore}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Gated Progression</span>
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
