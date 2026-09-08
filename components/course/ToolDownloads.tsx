"use client";

import { FileCode, FileSpreadsheet, FileText, Download } from "lucide-react";

export interface EngineeringTool {
  title: string;
  format: string;
  fileSize: string;
  description: string;
}

export default function ToolDownloads({ tools }: { tools: EngineeringTool[] }) {
  const getIcon = (format: string) => {
    if (format.includes(".DWG")) return <FileCode className="w-5 h-5 text-cyan-400" />;
    if (format.includes(".XLSX")) return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    return <FileText className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Included Engineering Deliverables</span>
          <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Professional Grade
          </span>
        </h3>
      </div>
      <p className="text-xs text-slate-400">
        Enrolled engineers gain unrestricted commercial licensing to utilize these templates in their actual permit submissions and client proposals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                  {getIcon(tool.format)}
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">{tool.format}</span>
                  <span>•</span>
                  <span>{tool.fileSize}</span>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-slate-200 mb-1.5 line-clamp-2">
                {tool.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                {tool.description}
              </p>
            </div>

            <button
              onClick={() => alert(`Download started for: ${tool.title}`)}
              className="w-full py-2 px-3 rounded-lg border border-slate-700 hover:border-amber-500/40 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-amber-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
