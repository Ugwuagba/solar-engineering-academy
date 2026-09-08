"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  Cpu, 
  Activity, 
  Briefcase, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function IndustrialPillars() {
  const pillars = [
    {
      icon: <Building2 className="w-6 h-6 text-[#2B82C9]" />,
      tag: "C&I Infrastructure",
      title: "Commercial & Industrial Mini-Grids",
      description:
        "Engineered multi-kilowatt and megawatt hybrid solar architectures designed to displace expensive diesel generation for manufacturing plants, hospitals, and educational estates.",
      features: ["Diesel generator synchronization", "Zero-export utility compliance", "Levelized Cost of Energy < $0.10/kWh"],
      cta: "Explore C&I Solutions",
      href: "/courses/pvol101"
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#E13B2B]" />,
      tag: "Power Conversion",
      title: "Solar Inverter & Battery Storage (BESS)",
      description:
        "High-voltage hybrid inverter deployment paired with Lithium Iron Phosphate (LFP) battery chemistry. Specializing in peak shaving, demand charge mitigation, and microgrid islanding.",
      features: ["Deye / Tier-1 hybrid inverter architecture", "UL 9540A thermal safety standards", "6,000+ cycle life warranty modeling"],
      cta: "View BESS Masterclass",
      href: "/courses/bess201"
    },
    {
      icon: <Activity className="w-6 h-6 text-amber-500" />,
      tag: "Energy Diagnostics",
      title: "Comprehensive Site & Roof Power Audits",
      description:
        "Step-by-step scientific audit procedures to analyze true appliance nameplates, eliminate 24/7 phantom loads, correct lagging power factors, and prevent costly oversizing.",
      features: ["True-RMS power harmonic measurement", "Thermal infrared hotspot inspection", "Automated 8760 load profiling"],
      cta: "Learn Audit Techniques",
      href: "/courses/solar-installation-101"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
      tag: "Practical Deployment",
      title: "Hands-on Partner Field Attachment",
      description:
        "All Subway Schools trainees gain 2 to 4 months of intensive physical field placement on live commercial installations under the mentorship of licensed lead solar engineers.",
      features: ["Real-world roof mounting & HSE rigging", "Inverter commissioning & cable crimping", "Direct corporate contractor job placement"],
      cta: "Enroll For Attachment",
      href: "/courses/solar-installation-101"
    }
  ];

  return (
    <section id="solutions" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B82C9] block mb-2">
            Industrial Engineering Pillars
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Integrated Solar Technology & Field Competency
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Subway Energy Limited bridges the gap between high-precision industrial hardware and field-certified solar craftsmanship.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="deye-card p-6 flex flex-col justify-between border border-slate-200 bg-white hover:border-[#2B82C9]/50"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5 leading-snug">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {pillar.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 mb-6">
                  {pillar.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-[11px] text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2B82C9] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={pillar.href}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B82C9] hover:text-[#226ba8] transition-colors"
              >
                <span>{pillar.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
