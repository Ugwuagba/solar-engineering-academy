"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Cpu, 
  BatteryCharging, 
  Sun, 
  Sliders, 
  CheckCircle2, 
  Download,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function SolarCompanionSection() {
  const calculations = [
    {
      icon: <Cpu className="w-5 h-5 text-[#2B82C9]" />,
      title: "Inverter Sizing & Power Factor",
      formula: "Inverter VA = (Continuous W / PF) × 1.25",
      description: "Apparent power adjustments for inductive motor compressors and reactive power headroom."
    },
    {
      icon: <BatteryCharging className="w-5 h-5 text-emerald-600" />,
      title: "Battery Autonomy & DoD Limits",
      formula: "Capacity Ah = (Daily Wh × Days) / (V × DoD × η)",
      description: "Depth of discharge deratings for LFP (85-90%) and Lead-Acid (50%) to guarantee multi-year cycle life."
    },
    {
      icon: <Sun className="w-5 h-5 text-[#E13B2B]" />,
      title: "Module Temperature Coefficients",
      formula: "Voc-max = Voc-stc × [1 + βVoc × (Tmin - 25°C)]",
      description: "Preventing cold-temperature inverter overvoltage and hot-summer MPPT voltage clipping."
    },
    {
      icon: <Sliders className="w-5 h-5 text-amber-500" />,
      title: "MPPT vs PWM Efficiency Matching",
      formula: "I_charge = (V_pv × I_pv × η) / V_battery",
      description: "Harvesting up to 30% surplus energy by decoupling solar string voltage from battery terminal voltage."
    }
  ];

  return (
    <section id="companion" className="py-24 lg:py-28 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-20 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#2B82C9] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Engineers' Field Reference</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The Solar Companion Technical Reference
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed font-normal">
              Included as the authoritative engineering reference module in Engr. Asanga's curriculum. Master mathematical derivations for actual field installations.
            </p>
          </div>

          <Link
            href="/courses/solar-installation-101"
            className="px-6 py-3 rounded-xl border border-slate-200 bg-white hover:border-[#2B82C9] hover:bg-slate-50 text-slate-700 hover:text-[#2B82C9] text-xs font-bold self-start lg:self-auto flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <span>Access Complete Companion</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {calculations.map((calc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#2B82C9]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 w-fit mb-4">
                  {calc.icon}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {calc.title}
                </h4>
                <div className="p-2 rounded-lg bg-slate-100 font-mono text-[11px] font-semibold text-slate-800 mb-3 break-words">
                  {calc.formula}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {calc.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-[#2B82C9]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standard Subway Sizing Rule</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
