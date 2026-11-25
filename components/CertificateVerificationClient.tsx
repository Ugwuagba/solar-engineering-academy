"use client";

import { useState } from "react";
import { Search, CheckCircle2, AlertCircle, Loader2, Award, Clock, BookOpen } from "lucide-react";

interface VerifiedCertificate {
  certificateCode: string;
  holderName: string;
  courseTitle: string;
  courseCode: string;
  contactHours: number;
  issuedAt: string;
}

export default function CertificateVerificationClient() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifiedCertificate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      setErrorMessage("Please enter a certificate verification code.");
      setResult(null);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const res = await fetch(`/api/certificates/verify?code=${encodeURIComponent(trimmed)}`);
      const data = await res.json().catch(() => null);

      if (res.ok && data?.found && data?.certificate) {
        setResult(data.certificate);
      } else {
        setErrorMessage(
          data?.message ||
            "No digital certificate record matched that code. For manual verification, please contact Admissions."
        );
      }
    } catch {
      setErrorMessage("Could not connect to verification service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleVerify} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <label htmlFor="certificateCode" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Certificate Verification Code
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="certificateCode"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter Certificate Code (e.g., SUBWAY-2026-...)"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2B82C9] font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#2B82C9] hover:bg-[#226ba8] text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <span>Verify Credential</span>
            )}
          </button>
        </div>
      </form>

      {result && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Verified Subway Schools Credential</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm">
            <div>
              <span className="text-xs font-mono uppercase text-slate-500 block">Graduate Name</span>
              <span className="font-bold text-slate-900">{result.holderName}</span>
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-slate-500 block">Certificate Code</span>
              <span className="font-mono font-bold text-slate-900">{result.certificateCode}</span>
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-slate-500 block">Accredited Program</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#2B82C9] shrink-0" />
                {result.courseTitle} {result.courseCode ? `(${result.courseCode})` : ""}
              </span>
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-slate-500 block">Training Hours &amp; Issue Date</span>
              <span className="font-medium text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                {result.contactHours}h • Issued{" "}
                {new Date(result.issuedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-800 font-medium">
            <Award className="w-4 h-4" />
            <span>Issued by Subway Schools / Subway Energy Limited (RC: 1837154).</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3 text-sm text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}

