"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, CheckCircle2, ArrowRight, RefreshCw, Mail, ArrowLeft, KeyRound } from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = searchParams.get("email") || "";
  const isJustRegistered = searchParams.get("registered") === "true";

  const [email, setEmail] = useState(initialEmail);
  const [editingEmail, setEditingEmail] = useState(!initialEmail);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    isJustRegistered ? "A 6-digit verification code has been dispatched to your email." : null
  );
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second cooldown timer for resending code
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus the first empty digit input on mount
  useEffect(() => {
    if (!editingEmail && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [editingEmail]);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, "");

    // Handle multi-digit entry (e.g. paste or rapid typing)
    if (cleanVal.length > 1) {
      const newDigits = [...digits];
      for (let i = 0; i < cleanVal.length && index + i < 6; i++) {
        newDigits[index + i] = cleanVal[i];
      }
      setDigits(newDigits);
      const nextFocus = Math.min(index + cleanVal.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const singleDigit = cleanVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleDigit;
    setDigits(newDigits);

    // Auto-advance to next input if digit entered
    if (singleDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || "";
    }
    setDigits(newDigits);

    const focusIdx = Math.min(pastedData.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const fullCode = digits.join("").trim();
    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits of your verification code.");
      return;
    }

    if (!email.trim()) {
      setError("Please provide your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: fullCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to verify code. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("Verification successful! Redirecting to sign in...");
      setTimeout(() => {
        router.push(`/login?verified=true&email=${encodeURIComponent(email.trim())}`);
      }, 1200);
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    if (!email.trim()) {
      setError("Please enter your email address to resend the code.");
      return;
    }

    setError(null);
    setResending(true);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend code.");
        setResending(false);
        return;
      }

      setSuccess("A fresh 6-digit code has been dispatched to your email.");
      setCooldown(60);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setResending(false);
    } catch {
      setError("Failed to resend verification code. Please try again.");
      setResending(false);
    }
  };

  return (
    <div className="glass-panel py-8 px-6 sm:px-8 rounded-2xl border border-slate-800 space-y-6">
      {/* Target Email Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300 truncate mr-2">
          <Mail className="w-4 h-4 text-amber-400 shrink-0" />
          {editingEmail ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@firm.com"
              className="bg-slate-950 border border-slate-700 px-2 py-1 rounded text-white text-xs focus:outline-none focus:border-amber-400 w-full"
            />
          ) : (
            <span className="font-mono text-slate-200 truncate">{email || "No email specified"}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setEditingEmail(!editingEmail)}
          className="text-amber-400 hover:text-amber-300 text-[11px] font-semibold uppercase tracking-wider shrink-0 cursor-pointer"
        >
          {editingEmail ? "Done" : "Change"}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider text-center mb-3">
            Enter 6-Digit PIN Code
          </label>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl bg-slate-900 border border-slate-700 text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner"
              />
            ))}
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2.5">
            Check your inbox or spam folder. Codes expire after 15 minutes.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || digits.some((d) => !d)}
          className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              Verifying Candidate Credentials...
            </span>
          ) : (
            <>
              <span>Verify & Activate Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Resend Cooldown Action */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px]">Didn&apos;t receive a code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className={`flex items-center gap-1.5 font-semibold text-xs transition-colors cursor-pointer ${
            cooldown > 0 || resending
              ? "text-slate-600 cursor-not-allowed"
              : "text-amber-400 hover:text-amber-300"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
          <span>{cooldown > 0 ? `Resend Code in ${cooldown}s` : "Resend Code"}</span>
        </button>
      </div>

      <div className="text-center pt-1 text-xs">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Candidate Security Verification</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight pt-1">
          Verify Your Academic Email
        </h2>
        <p className="text-xs text-slate-400">
          Enter the 6-digit security code issued to your institutional email to complete registration.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <Suspense fallback={<div className="text-center text-slate-400 text-xs py-8">Loading Verification Screen...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
