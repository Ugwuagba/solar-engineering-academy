import Link from "next/link";
import { Sun, Award, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060910] text-slate-400 text-sm">
      {/* Accreditation Banner */}
      <div className="border-b border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">NABCEP Aligned</p>
                <p className="text-[11px] text-slate-400">PVA & PVIP Contact Hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">UL 9540/9540A</p>
                <p className="text-[11px] text-slate-400">BESS Safety Verification</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">NEC 690 / 705</p>
                <p className="text-[11px] text-slate-400">Code-Compliant Engineering</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">SEI Pedagogy</p>
                <p className="text-[11px] text-slate-400">Technical Rigor & Mastery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Sun className="w-6 h-6 text-amber-400" />
              <span className="font-extrabold text-lg tracking-tight text-white font-mono">SOLAR ACADEMY</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Modeled after the rigorous standards of Solar Energy International (SEI). We empower electrical engineers, contractors, and project developers with advanced technical skills in commercial solar PV modeling, single-line diagrams, and stationary battery energy storage systems.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span>EST. 2026</span>
              <span>•</span>
              <span>40+ CONTACT HOURS ACCREDITED</span>
              <span>•</span>
              <span>IEEE / NFPA 855</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-slate-200 tracking-wider mb-3">Flagship Programs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses/pvol101" className="hover:text-amber-400 transition-colors">
                  PVOL101: Commercial Solar PV Design (40h)
                </Link>
              </li>
              <li>
                <Link href="/courses/bess201" className="hover:text-amber-400 transition-colors">
                  BESS201: Industrial Battery Energy Storage (24h)
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-amber-400 transition-colors">
                  Complete Course Catalog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-slate-200 tracking-wider mb-3">Institutional Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-amber-400 transition-colors">
                  New Candidate Enrollment
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">
                  Faculty Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Solar Engineering Academy. All rights reserved. Inspired by Solar Energy International.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">NABCEP Credential Verification</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
