"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createStaffAccount } from "../actions/user-actions";

export default function ProvisionStaffForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("PROGRAM_ADMIN");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    const formData = new FormData();
    formData.set("email", email);
    formData.set("role", role);

    startTransition(async () => {
      const result = await createStaffAccount(formData);
      if (result?.success) {
        setFeedback({
          type: "success",
          text: result.message || "Staff account updated successfully.",
        });
        setEmail("");
        router.refresh();
      } else {
        setFeedback({
          type: "error",
          text: result?.error || "Failed to provision staff account.",
        });
      }
    });
  };

  return (
    <div className="bg-[#0b1528] border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Provision New Staff Account</h2>
          <p className="text-xs text-slate-400">
            Create an institutional Program Admin or Instructor account. An immutable audit trail is logged automatically.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Email Field */}
        <div className="md:col-span-6 space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
            Staff Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              placeholder="staff@subwayschools.com"
              className="w-full pl-10 pr-3.5 py-2.5 bg-[#070e1b] border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition disabled:opacity-60"
            />
          </div>
        </div>

        {/* Role Select */}
        <div className="md:col-span-4 space-y-1.5">
          <label htmlFor="role" className="block text-xs font-semibold text-slate-300">
            Assigned Role <span className="text-rose-500">*</span>
          </label>
          <select
            id="role"
            name="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isPending}
            className="w-full px-3.5 py-2.5 bg-[#070e1b] border border-slate-700/80 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition disabled:opacity-60"
          >
            <option value="PROGRAM_ADMIN">Program Admin (Curriculum & Ops)</option>
            <option value="INSTRUCTOR">Instructor (Faculty / Lead)</option>
            <option value="LP_EDITOR">Landing Page Editor (LP_EDITOR)</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex items-end">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Provision Staff</span>
              </>
            )}
          </button>
        </div>
      </form>

      {feedback && (
        <div
          className={`mt-4 px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}

