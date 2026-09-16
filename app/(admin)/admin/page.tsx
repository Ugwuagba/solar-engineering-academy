"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Plus, 
  ArrowLeft, 
  Briefcase, 
  ExternalLink,
  Trash2,
  AlertTriangle,
  Loader2,
  X
} from "lucide-react";
import { SEED_COURSES } from "@/lib/seed-data";

export default function AdminStudioPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [courses, setCourses] = useState<any[]>(SEED_COURSES);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; course: any | null }>({
    isOpen: false,
    course: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" } | null>(null);

  // Load courses from database and merge with seed inventory
  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          const dbCodes = new Set(data.courses.map((c: any) => c.code));
          const remainingSeed = SEED_COURSES.filter((s) => !dbCodes.has(s.code));
          setCourses([...data.courses, ...remainingSeed]);
          return;
        }
      }
    } catch (err) {
      console.error("Error fetching courses in Admin Studio:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const openDeleteModal = (course: any) => {
    setDeleteModal({ isOpen: true, course });
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModal({ isOpen: false, course: null });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.course) return;
    const target = deleteModal.course;
    const targetId = target.id || target.slug;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/courses/${targetId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete course");
      }

      // Remove course from local state immediately
      setCourses((prev) =>
        prev.filter((c) => {
          if (target.id && c.id === target.id) return false;
          if (target.slug && c.slug === target.slug) return false;
          if (target.code && c.code === target.code) return false;
          return true;
        })
      );

      closeDeleteModal();
      router.refresh();
      showToast("Course deleted successfully", "success");
    } catch (err: any) {
      console.error("Failed to delete course:", err);
      showToast(err.message || "Failed to delete course", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                href="/courses"
                className="text-xs font-semibold text-slate-500 hover:text-[#2B82C9] flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Catalog</span>
              </Link>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#2B82C9] border border-blue-200 font-mono text-xs font-bold">
                DIRECTORATE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Subway Energy Faculty & Curriculum Studio
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Lead Administrator: <strong className="text-slate-900">{session?.user?.name || session?.user?.email || "Lead Solar Engineer"}</strong> • Authority Level: <span className="font-mono text-[#2B82C9] font-bold">ADMIN / DIRECTOR</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/students"
              className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center gap-2 shadow-2xs transition-all cursor-pointer bg-white"
            >
              <Users className="w-4 h-4 text-[#2B82C9]" />
              <span>Students &amp; Payments</span>
            </Link>
            <Link
              href="/admin/courses/new"
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#2B82C9] hover:bg-blue-600 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Program</span>
            </Link>
          </div>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Active Tracks</span>
              <BookOpen className="w-5 h-5 text-[#2B82C9]" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">{courses.length}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Gated & Field-Attached</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Scheduled Cohorts</span>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">3</p>
            <p className="text-xs text-slate-500 mt-1">Q2 & Q3 2026 Academic Calendar</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Total Candidates</span>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">1,480</p>
            <p className="text-xs text-emerald-600 mt-1">+18% enrollment rate</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">Milestone Pass Rate</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 font-mono">84.2%</p>
            <p className="text-xs text-slate-500 mt-1">70% Milestone Benchmark</p>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                Curriculum & Program Inventory
              </h3>
              <p className="text-xs text-slate-500">
                Managed courses, milestone assessment thresholds, and partner placements
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#2B82C9] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              {courses.length} Programs Live
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {courses.map((course) => {
              const moduleCount = course.moduleCount ?? course.modules?.length ?? 0;
              const lessonCount = course.lessonCount ?? course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) ?? 0;
              const instructor = course.instructorName || course.instructor || "Subway Engineering Faculty";

              return (
                <div
                  key={course.id || course.code || course.slug}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-[#2B82C9] border border-blue-200">
                        {course.code}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                        {course.level}
                      </span>
                      {course.fieldAttachment && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-[#E13B2B] border border-red-200 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {course.fieldAttachment}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{course.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {course.description}
                    </p>
                    <div className="flex items-center flex-wrap gap-4 text-xs text-slate-500 pt-1 font-mono">
                      <span>{course.contactHours} Contact Hours</span>
                      <span>•</span>
                      <span>{moduleCount} Modules ({lessonCount} Lessons)</span>
                      <span>•</span>
                      <span>{instructor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:text-slate-900 shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Public View</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                    <Link
                      href={`/learn/${course.slug}`}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#2B82C9] hover:bg-blue-600 text-white shadow-sm transition-colors"
                    >
                      Enter Classroom
                    </Link>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(course)}
                      className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg px-3 py-2 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                      title={`Delete ${course.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partner Attachment Placement Log */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#E13B2B]" />
                <span>Partner Field Attachment Deployments</span>
              </h3>
              <p className="text-xs text-slate-500">
                Candidates matched with commercial EPC contractors and industrial solar farms
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              100% Placement Rate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Industrial Rooftop Inverter Commissioning</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2B82C9] font-bold text-[10px] font-mono">
                  Active Deployment
                </span>
              </div>
              <p className="text-slate-600">Partner: Apex Industrial Energy EPC Ltd • Lagos, Nigeria</p>
              <p className="text-slate-500">Lead Mentor: Engr. Asanga (Direct Sign-Off on Safety Logbook)</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">High-Voltage Battery Energy Storage (BESS)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] font-mono">
                  Upcoming Cohort Match
                </span>
              </div>
              <p className="text-slate-600">Partner: Prime Grid Mini-Grid Utility • Abuja, Nigeria</p>
              <p className="text-slate-500">Focus: Rack Balancing, UL9540A Thermal Protocols, SCADA Integration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.course && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Delete Program
                </h3>
                <p className="text-xs text-slate-500">
                  Irreversible Administrative Action
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 font-bold">{deleteModal.course.title}</strong>? This action cannot be undone.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-xs sm:text-sm font-semibold animate-in slide-in-from-bottom-5 duration-200 bg-slate-900 text-white border-slate-700">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
