"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ShieldAlert, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to process request. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-4">
        <Link href="/" className="inline-flex flex-col items-center gap-3 group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-700/60 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-xl shadow-black/40 group-hover:scale-105 transition-transform duration-200">
            <img 
              src="/images/subway-logo.png" 
              alt="Subway Schools Official Logo" 
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="font-black text-xl sm:text-2xl tracking-wider text-white uppercase block leading-tight">
              SUBWAY SCHOOLS
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-normal block leading-tight mt-1.5 tracking-tight max-w-xs sm:max-w-sm">
              Building Africa&apos;s Next Generation of Energy Professionals
            </span>
          </div>
        </Link>
        <h2 className="text-2xl font-black text-white tracking-tight pt-2">
          Reset Candidate Password
        </h2>
        <p className="text-xs text-slate-400">
          Enter your academic email address and we will dispatch a secure password reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="glass-panel py-8 px-6 sm:px-8 rounded-2xl border border-slate-800 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                Check Your Inbox
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                If an account exists for <strong className="text-white">{email}</strong>, a password reset link has been dispatched. The link will expire in 15 minutes.
              </p>
              <div className="pt-4 border-t border-slate-800">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Academic Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@solaracademy.org"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    Dispatching Link...
                  </span>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-6 flex flex-col items-center space-y-2 text-center text-sm pt-2">
                <p className="text-slate-400 text-xs">
                  Remember password?{" "}
                  <Link href="/login" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
