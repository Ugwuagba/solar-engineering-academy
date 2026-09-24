"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowRight, Lock, Mail, ShieldCheck, CheckCircle2, KeyRound } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("redirect") || "/courses";
  const verifiedSuccess = searchParams.get("verified") === "true";
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred during sign in.");
      setLoading(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail("admin@solaracademy.org");
    setPassword("SolarAdmin2026!");
  };

  const isEmailUnverified = error?.toLowerCase().includes("verify your email");

  return (
    <div className="glass-panel py-8 px-6 sm:px-8 rounded-2xl border border-slate-800 space-y-6">
      {/* Quick 1-Click Demo Fillers */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
        <span className="text-[11px] font-mono text-slate-400 block text-center uppercase tracking-wider">
          Quick 1-Click Evaluation Credentials:
        </span>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleQuickFillAdmin}
            className="py-1.5 px-4 text-xs font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Fast-Fill</span>
          </button>
        </div>
      </div>

      {verifiedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Email verified successfully! You can now sign in with your credentials.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          {isEmailUnverified && (
            <div className="pt-1">
              <Link
                href={`/verify-email?email=${encodeURIComponent(email)}`}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Verify Email Now →</span>
              </Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              Authenticating...
            </span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 text-xs text-slate-400">
        <span>New candidate? </span>
        <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium">
          Create an academic account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
          Student & Faculty Portal
        </h2>
        <p className="text-xs text-slate-400">
          Sign in with your institutional credentials to access gated classrooms and administrative studios.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <Suspense fallback={<div className="text-center text-slate-400 text-xs py-8">Loading Portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
