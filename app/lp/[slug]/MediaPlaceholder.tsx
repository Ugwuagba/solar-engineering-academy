"use client";

import React from "react";
import { Image as ImageIcon, Video as VideoIcon, UploadCloud } from "lucide-react";

interface MediaPlaceholderProps {
  label: string;
  subtitle?: string;
  type?: "image" | "video";
  theme?: "dark" | "light";
  aspect?: string;
  className?: string;
}

export default function MediaPlaceholder({
  label,
  subtitle,
  type = "image",
  theme = "dark",
  aspect = "aspect-[4/3]",
  className = "",
}: MediaPlaceholderProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`relative w-full ${aspect} rounded-2xl sm:rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all select-none ${
        isDark
          ? "border-slate-700/80 bg-slate-900/60 text-slate-300 shadow-xl shadow-blue-950/20"
          : "border-slate-300 bg-slate-50/80 text-slate-600 shadow-sm"
      } ${className}`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-inner ${
          isDark
            ? "bg-slate-800 border border-slate-700 text-amber-400"
            : "bg-white border border-slate-200 text-blue-600"
        }`}
      >
        {type === "video" ? (
          <VideoIcon className="w-6 h-6" />
        ) : (
          <ImageIcon className="w-6 h-6" />
        )}
      </div>

      <div className="space-y-1 max-w-sm">
        <span
          className={`inline-block text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full font-bold mb-1 ${
            isDark
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          {type === "video" ? "Video Slot" : "Media Slot"}
        </span>
        <h4
          className={`text-sm sm:text-base font-bold ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {label}
        </h4>
        {subtitle && (
          <p
            className={`text-xs ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        className={`mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium ${
          isDark ? "text-slate-500" : "text-slate-400"
        }`}
      >
        <UploadCloud className="w-3.5 h-3.5" />
        <span>Configurable in Landing Page CMS</span>
      </div>
    </div>
  );
}

