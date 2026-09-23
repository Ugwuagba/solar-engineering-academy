"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function IndustrialPillars({ courses = [] }: { courses?: any[] }) {
  const course101 = courses.find((c) => c.code === "SI101" || c.slug.includes("101")) || courses[0];
  const course102 = courses.find((c) => c.code === "SI102" || c.slug.includes("102")) || courses[1] || courses[0];

  const slug101 = course101?.slug || "solar-installation-101-6402";
  const slug102 = course102?.slug || "solar-installation-102";

  const programs = [
    {
      title: course101?.title || "Solar Installation 101",
      code: course101?.code || "SI101",
      tag: "Introductory / Foundational",
      level: "Professional Foundation",
      description:
        "A comprehensive foundational program covering solar PV design, load auditing, balance of system components, and safe installation practices.",
      image: course101?.thumbnailImage || course101?.thumbnailUrl || "/images/hero/hero-academy.jpg",
      href: `/courses/${slug101}`,
      hours: `${course101?.contactHours || 40} Contact Hours`,
      price: course101?.priceNgn || "₦5,000",
      highlights: [
        "Solar PV physics & precision power audits",
        "Battery sizing & inverter selection",
        "Includes practical partner attachment",
      ],
    },
    {
      title: course102?.title || "SOLAR INSTALLATION 102",
      code: course102?.code || "SI102",
      tag: "Intermediate / Advanced",
      level: "Commercial & Industrial C&I",
      description:
        "Advanced commercial and industrial microgrid design, battery energy storage systems (BESS), and hybrid system commissioning.",
      image: course102?.thumbnailImage || course102?.thumbnailUrl || "/images/solutions/solutions-inverters.jpg",
      href: `/courses/${slug102}`,
      hours: `${course102?.contactHours || 40} Contact Hours`,
      price: course102?.priceNgn || "₦15,000",
      highlights: [
        "Utility-scale C&I solar arrays & single-line diagrams",
        "Battery Energy Storage Systems (BESS) integration",
        "High-voltage safety & hybrid inverter commissioning",
      ],
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

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {programs.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 hover:border-sky-500/50 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div>
                {/* Image Preview Container */}
                <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm font-mono">
                      {item.code}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#2B82C9]/90 backdrop-blur-md text-white border border-white/10 shadow-sm">
                      {item.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-white text-slate-900 shadow-md">
                      {item.price}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#2B82C9] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                    {item.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2B82C9] shrink-0" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {item.hours}
                </span>

                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#2B82C9] text-white text-xs font-bold transition-all shadow-xs group-hover:shadow-md cursor-pointer"
                >
                  <span>Explore Course</span>
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
