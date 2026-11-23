"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2, X, Lock } from "lucide-react";
import { deleteInstructorCourse } from "./actions/course-actions";

interface DeleteCourseButtonProps {
  courseId: string;
  courseTitle: string;
  isApproved?: boolean;
}

export default function DeleteCourseButton({
  courseId,
  courseTitle,
  isApproved = false,
}: DeleteCourseButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If approved by administrator, render muted disabled lock badge
  if (isApproved) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 text-slate-500 text-xs font-semibold border border-slate-800 cursor-not-allowed select-none"
        title="Course deletion is disabled after admin approval"
      >
        <Lock className="w-3.5 h-3.5 text-slate-500" />
        <span>Approved • Locked</span>
      </span>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const res = await deleteInstructorCourse(courseId);

      if (!res.success) {
        setErrorMessage(res.error || "Failed to delete course.");
        setIsDeleting(false);
        return;
      }

      setIsOpen(false);
      setIsDeleting(false);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setErrorMessage(null);
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 font-semibold text-xs border border-slate-700/80 hover:border-rose-500/30 transition cursor-pointer"
        title="Delete course draft"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-[#0b1528] border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                if (!isDeleting) setIsOpen(false);
              }}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon & Title */}
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-6">
                <h3 className="text-base font-bold text-white">Delete Course Curriculum?</h3>
                <p className="text-xs text-slate-400">
                  This will permanently remove the course syllabus, all lessons, video streams, and quiz assessments.
                </p>
              </div>
            </div>

            {/* Target Course Info Box */}
            <div className="p-3 bg-[#070e1b] rounded-xl border border-slate-800 mb-4">
              <span className="text-[11px] font-mono uppercase text-slate-500 block">Target Course</span>
              <span className="text-sm font-semibold text-white truncate block">{courseTitle}</span>
            </div>

            {/* Error Feedback Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20 active:scale-95 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Course</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

