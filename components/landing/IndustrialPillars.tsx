"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function IndustrialPillars() {
  const solutions = [
    {
      title: "C&I Mini-Grids & Solar Farms",
      description: "Utility-scale and rooftop solar arrays delivering reliable megawatts and displacing costly diesel generation.",
      image: "/images/solutions/solutions-rooftop-sunset.jpg",
      tag: "Solar Systems",
      href: "/courses/pvol101",
    },
    {
      title: "Hybrid Inverters & Energy Storage",
      description: "Smart high-yield hybrid inverters and modular LiFePO4 battery storage banks engineered for seamless UPS backup.",
      image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80",
      tag: "Power Conversion",
      href: "/courses/bess201",
    },
    {
      title: "Solar System Design & Power Audits",
      description: "Scientific load analysis, harmonic power factor profiling, and precision economic ROI modeling for facilities.",
      image: "https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=1200&q=80",
      tag: "Engineering Audits",
      href: "/courses/solar-installation-101",
    },
    {
      title: "Hands-On Field Attachments (2-4 Months)",
      description: "Verified on-site technical deployment with partner EPC contractors, live inverter commissioning, and mentored hours.",
      image: "/images/solutions/solutions-installation.jpg",
      tag: "Academy Placement",
      href: "/courses/solar-installation-101",
    },
  ];

  return (
    <section id="solutions" className="py-24 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B82C9] block mb-2.5">
            ENGINEERED SYSTEMS & CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Integrated Solar Technologies & Solutions
          </h2>
          <p className="text-base text-slate-600 mt-3 font-normal">
            Deye-class efficiency, advanced battery storage architecture, and certified engineering standards for every project scale.
          </p>
        </div>

        {/* 4 Large Visual Product Cards Grid (Deye Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {solutions.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-[#2B82C9]/40 transition-all duration-300 overflow-hidden"
            >
              <div>
                {/* Full-Bleed Top Image Container */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/90 backdrop-blur-xs text-slate-900 shadow-2xs">
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2B82C9] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 line-clamp-2 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B82C9] hover:text-blue-700 transition-colors"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
