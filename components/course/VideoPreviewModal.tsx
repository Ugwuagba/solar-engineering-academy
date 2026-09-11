"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
  courseTitle: string;
}

export default function VideoPreviewModal({
  isOpen,
  onClose,
  title,
  videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  courseTitle,
}: VideoPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/15 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80">
            <div>
              <span className="text-[11px] font-mono text-[#2B82C9] font-bold uppercase tracking-wider block">
                Course Video Preview
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                {title || courseTitle}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video w-full bg-black">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Footer Info */}
          <div className="p-5 bg-slate-950/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
            <div>
              <p className="font-semibold text-white">{courseTitle}</p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Full course includes comprehensive HD video lectures, worksheets, and textbooks.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#2B82C9] hover:bg-sky-600 text-white font-bold transition-all shrink-0 cursor-pointer text-center"
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
