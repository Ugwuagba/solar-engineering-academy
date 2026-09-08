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
    if (format.includes(".DWG")) return <FileCode className="w-5 h-5 text-[#2B82C9]" />;
    if (format.includes(".XLSX")) return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    return <FileText className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>Included Engineering Deliverables</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#2B82C9] border border-blue-200">
            Subway Energy Standard
          </span>
        </h3>
      </div>
      <p className="text-xs text-slate-600">
        Enrolled engineers gain commercial licensing to utilize these templates, load profile sheets, and single-line schematics in their customer proposals and electrical permits.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="deye-card p-5 border border-slate-200 bg-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  {getIcon(tool.format)}
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">{tool.format}</span>
                  <span>•</span>
                  <span>{tool.fileSize}</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-2">
                {tool.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                {tool.description}
              </p>
            </div>

            <button
              onClick={() => alert(`Download started for: ${tool.title}`)}
              className="w-full py-2.5 px-3 rounded-lg border border-slate-200 hover:border-[#2B82C9] bg-slate-50 hover:bg-blue-50/60 text-slate-700 hover:text-[#2B82C9] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Asset</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
