"use client";

import Link from "next/link";
import { 
  Sun, 
  Award, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Mail, 
  Send, 
  MapPin, 
  Phone, 
  Briefcase 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#0F172A] text-slate-300 text-sm">
      {/* 1. Industrial Credential & Assurance Banner */}
      <div className="border-b border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-[#2B82C9] border border-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">RC: 1837154</p>
                <p className="text-[11px] text-slate-400">Subway Energy Limited</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Partner Attachment</p>
                <p className="text-[11px] text-slate-400">2–4 Months Practical Field Site</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Engr. Asanga Certified</p>
                <p className="text-[11px] text-slate-400">20+ Years Direct Engineering</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-[#E13B2B] border border-rose-500/20">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Deye / Tier-1 Aligned</p>
                <p className="text-[11px] text-slate-400">Commercial & Industrial Systems</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Company Summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-sm shrink-0 overflow-hidden">
                <img 
                  src="/images/subway-logo.png" 
                  alt="Subway Energy Limited Official Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-white font-sans">
                  SUBWAY <span className="text-[#2B82C9]">ENERGY</span>
                </span>
                <span className="text-[10px] text-amber-400 font-mono italic">
                  ...light up your world
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Subway Energy Limited (RC: 1837154) delivers premier commercial & industrial solar engineering, power auditing, and high-yield mini-grid installations. Through <strong>Subway Schools</strong>, we train and field-deploy certified solar engineers across Nigeria and West Africa.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2B82C9] shrink-0" />
                <span>Headquarters: Commercial Industrial Hub, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E13B2B] shrink-0" />
                <span>Client & Trainee Hotline: +234 800 SUBWAY ENERGY</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Admissions: info@subwayenergy.com</span>
              </div>
            </div>
          </div>

          {/* Academy Tracks */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-4 border-b border-slate-800 pb-2">
              Subway Schools Academy
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/courses/solar-installation-101" className="hover:text-[#2B82C9] transition-colors font-medium text-slate-200">
                  Solar Installation 101 (Engr. Asanga)
                </Link>
              </li>
              <li>
                <Link href="/courses/pvol101" className="hover:text-[#2B82C9] transition-colors">
                  Commercial PV Design (PVOL101)
                </Link>
              </li>
              <li>
                <Link href="/courses/bess201" className="hover:text-[#2B82C9] transition-colors">
                  Battery Storage Sizing (BESS201)
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#2B82C9] transition-colors">
                  Full Technical Catalog
                </Link>
              </li>
              <li>
                <Link href="/courses/solar-installation-101#companion" className="hover:text-amber-400 transition-colors">
                  Solar Companion Handbook
                </Link>
              </li>
            </ul>
          </div>

          {/* Commercial Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-4 border-b border-slate-800 pb-2">
              Industrial Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="text-slate-300">Commercial & Industrial Mini-Grids</span>
              </li>
              <li>
                <span className="text-slate-300">Deye Hybrid Inverter Installations</span>
              </li>
              <li>
                <span className="text-slate-300">Industrial Facility Power Auditing</span>
              </li>
              <li>
                <span className="text-slate-300">Preventative Solar O&M Contracts</span>
              </li>
              <li>
                <span className="text-slate-300">Corporate Technician Deployment</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Bulletin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-2 border-b border-slate-800 pb-2">
              Engineering Bulletin
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive quarterly technical briefs on Deye inverters, NEC revisions, and cohort enrollment openings.
            </p>
            <div className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="engineer@firm.com"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#2B82C9]"
              />
              <button
                onClick={() => alert("Subscribed to Subway Energy Bulletin!")}
                className="p-2 rounded-lg bg-[#2B82C9] hover:bg-[#226ba8] text-white shrink-0 cursor-pointer"
                title="Subscribe"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Subway Energy Limited (RC: 1837154). All rights reserved. "...light up your world"</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Attachment</span>
            <span className="hover:text-slate-400 cursor-pointer">Certificate Verification</span>
            <span className="hover:text-slate-400 cursor-pointer">HSE Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
