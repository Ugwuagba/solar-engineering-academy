import Link from "next/link";
import { Award, ArrowLeft, Phone, Mail, ShieldCheck } from "lucide-react";
import CertificateVerificationClient from "@/components/CertificateVerificationClient";

export const metadata = {
  title: "Certificate Verification | Subway Schools",
  description:
    "Verify official Subway Schools and Subway Energy Limited (RC: 1837154) engineering certificates and accredited graduate credentials.",
};

export default function CertificateVerificationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-[#080f1e] text-white py-14 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
            <Award className="w-4 h-4" />
            <span>Official Credential Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Certificate Verification Portal
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Employers, EPC partners, and institutions can verify the authenticity of Subway Schools solar engineering certificates below.
          </p>
        </div>
      </section>

      {/* Main Verification Lookup */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <CertificateVerificationClient />

          {/* Manual Verification Support Card */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-[#2B82C9]" />
              <span>Need Manual or Legacy Credential Confirmation?</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              For alumni trained prior to our digital registry or corporate background checks, please reach our Admissions &amp; Records Desk directly with the graduate&apos;s full name and program title:
            </p>
            <div className="flex flex-wrap gap-6 pt-1 text-xs font-semibold text-slate-700">
              <a href="mailto:subwayschoolsadmin@gmail.com" className="flex items-center gap-2 hover:text-[#2B82C9] transition-colors">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>subwayschoolsadmin@gmail.com</span>
              </a>
              <a href="tel:+2347012715632" className="flex items-center gap-2 hover:text-[#2B82C9] transition-colors">
                <Phone className="w-4 h-4 text-[#E13B2B]" />
                <span>+234 701 271 5632</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

