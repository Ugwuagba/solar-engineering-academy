import Link from "next/link";
import { 
  Building2, 
  ShieldCheck, 
  Zap, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Mail, 
  MapPin
} from "lucide-react";

export const metadata = {
  title: "Subway Energy Business & Enterprise Solutions | Commercial Solar EPC",
  description: "Commercial and industrial solar installations, high-voltage battery storage, power audits, and corporate workforce accreditation.",
};

export default function AboutBusinessPage() {
  const capabilities = [
    {
      title: "Commercial & Industrial (C&I) EPC",
      description: "Turn-key rooftop and ground solar arrays engineered for manufacturing facilities, healthcare complexes, and corporate headquarters.",
      icon: <Building2 className="w-6 h-6 text-[#2B82C9]" />
    },
    {
      title: "High-Voltage BESS & Storage Racks",
      description: "Modular LiFePO4 battery energy storage systems engineered for peak shaving, diesel displacement, and zero-flicker UPS backup.",
      icon: <Zap className="w-6 h-6 text-amber-500" />
    },
    {
      title: "Scientific Power Audits & Sizing",
      description: "Comprehensive power logging, harmonic distortion profiling, and investment-grade financial ROI modeling for facility directors.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />
    },
    {
      title: "Workforce Training & Corporate Upskilling",
      description: "Accredited solar engineering training programs, technical field attachments, and engineering certifications for maintenance teams.",
      icon: <Users className="w-6 h-6 text-[#E13B2B]" />
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-slate-950 text-white overflow-hidden">
        <img
          src="/images/hero/hero-commercial.jpg"
          alt="Commercial Solar Array"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
            Enterprise Power Engineering & Accredited Workforce Solutions
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
            We engineer utility-grade solar infrastructure for businesses and train Africa&apos;s next generation of clean energy engineers through Subway Schools.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/courses"
              className="px-6 py-3 rounded-lg bg-[#2B82C9] hover:bg-[#226ba8] text-white font-bold text-sm shadow-lg shadow-[#2B82C9]/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore Corporate Academy</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:+2348000000000"
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#E13B2B]" />
              <span>Contact Engineering Desk</span>
            </a>
          </div>
        </div>
      </section>

      {/* Enterprise Capabilities */}
      <section className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B82C9] block mb-2">
              ENGINEERED SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Enterprise Energy Services
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Deploying industrial-grade clean energy infrastructure designed for maximum uptime and ROI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {cap.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {cap.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Overview & Accreditation */}
      <section className="py-20 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E13B2B] block">
                ABOUT SUBWAY ENERGY & SUBWAY SCHOOLS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Pioneering Clean Energy Generation & Technical Education
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Subway Energy Limited operates as a registered commercial EPC and power engineering provider, backed by our proprietary academy — Subway Schools. Led by Engr. Asanga with over 20 years of field engineering expertise, we combine physical system deployment with world-class curriculum design.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Registered with Corporate Affairs Commission (RC: 1837154)",
                  "Over 120+ Megawatts of solar PV systems designed across West Africa",
                  "2–4 months practical partner field attachments for all enrolled students",
                  "OEM-certified installation practices adhering to Deye, Growatt, and CATL standards"
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-800">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img
                src="/images/solutions/factory-roof.jpg"
                alt="Subway Energy Industrial Array"
                className="w-full h-80 lg:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Inquiry Box */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Partner With Subway Energy
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Discuss commercial energy procurement, facility power audits, or corporate workforce training with our engineering directorate.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-sm text-slate-700 font-medium">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#2B82C9]" />
              <span>info@subwayschools.com</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#E13B2B]" />
              <span>+234 (0) 800-SUBWAY-ENG</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Lagos & Abuja, Nigeria</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
