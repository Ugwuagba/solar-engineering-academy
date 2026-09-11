"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function SocialProofSection() {
  const testimonials = [
    {
      name: "Tunde Balogun, MNSE",
      role: "Lead Electrical Engineer, Apex Power Solutions",
      course: "Solar Installation 101 & Field Attachment",
      content:
        "Engr. Asanga's breakdown of equipment nameplate surge currents and phantom load management saved our company over ₦4.2M on an oversized inverter quotation for a beverage packaging plant. The 3 months field attachment is unparalleled.",
      rating: 5,
      avatarBg: "bg-blue-600"
    },
    {
      name: "Chidinma Okafor",
      role: "Renewable Energy Project Developer",
      course: "Subway Schools Alumna (Cohort 2025)",
      content:
        "Before Subway Schools, I only understood panels in series. This academy taught me actual mathematical deratings for ambient temperature, inverter clipping limits, and Deye hybrid wiring. I secured an EPC role right after my field attachment.",
      rating: 5,
      avatarBg: "bg-emerald-600"
    },
    {
      name: "Engr. Ibrahim Sanusi",
      role: "Facility Director, Prime Care Clinics",
      course: "Commercial Power Audit & BESS",
      content:
        "Subway Energy performed a comprehensive power audit on our 24/7 medical center and deployed a 60kW hybrid system with zero-export control. Their engineers are top tier and technically immaculate.",
      rating: 5,
      avatarBg: "bg-slate-900"
    }
  ];

  return (
    <section id="success-stories" className="py-24 lg:py-28 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B82C9] block mb-2">
            Industry Recognition
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Endorsed by Practicing Engineers & Corporate Clients
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Over 10,000 technicians and engineers have trained under Engr. Asanga across West Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 hover:border-[#2B82C9]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${item.avatarBg} text-white font-bold flex items-center justify-center text-xs shrink-0`}>
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">{item.role}</p>
                  <p className="text-[10px] text-[#2B82C9] font-medium mt-0.5">
                    Verified: {item.course}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
