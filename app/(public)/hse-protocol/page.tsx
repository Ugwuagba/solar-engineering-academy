import Link from "next/link";
import { ShieldAlert, ArrowLeft, HardHat, Zap, BatteryCharging, Phone, Mail } from "lucide-react";

export const metadata = {
  title: "HSE Protocol | Subway Schools & Subway Energy Limited",
  description:
    "Health, Safety & Environment (HSE) standards for solar PV installations, high-voltage battery storage handling, and field training.",
};

export default function HseProtocolPage() {
  const protocols = [
    {
      title: "1. Personal Protective Equipment (PPE)",
      description:
        "All trainees and field engineers must wear insulated electrical safety boots, Class 0/00 voltage-rated gloves during live DC/AC terminations, safety eyewear, and full-body fall-arrest harnesses on elevated rooftops.",
      icon: <HardHat className="w-5 h-5 text-amber-500" />,
    },
    {
      title: "2. DC & AC Isolation & Lockout/Tagout (LOTO)",
      description:
        "Before touching any inverter busbar, combiner box, or array string, verify zero voltage using a calibrated CAT III/CAT IV multimeter. Apply physical DC isolator lockouts and clearly tag active circuits.",
      icon: <Zap className="w-5 h-5 text-[#2B82C9]" />,
    },
    {
      title: "3. Lithium (LiFePO4) & Lead-Acid Battery Safety",
      description:
        "Use insulated torque tools exclusively when assembling battery banks. Never bridge cell terminals, always verify BMS polarity prior to inverter connection, and keep Class ABC/D fire suppression equipment nearby.",
      icon: <BatteryCharging className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: "4. Rooftop & Weather Hazard Clearance",
      description:
        "Roof array mounting and high-voltage string testing are strictly suspended during rain, lightning activity, or high wind gusts. Safe roof walkways and structural load checks must be logged prior to panel hoisting.",
      icon: <ShieldAlert className="w-5 h-5 text-[#E13B2B]" />,
    },
  ];

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
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Safety &amp; Site Engineering Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Health, Safety &amp; Environment (HSE) Protocol
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Mandatory electrical, rooftop, and battery storage safety protocols enforced across all Subway Energy Limited sites and Subway Schools practical training workshops.
          </p>
        </div>
      </section>

      {/* Protocol Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {protocols.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 p-6 bg-white shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  {item.icon}
                </div>
                <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Report a Site Safety Concern</h3>
              <p className="text-xs text-slate-600">
                Contact the Subway Energy Limited Engineering Safety Desk immediately for site incidents or protocol inquiries.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700 shrink-0">
              <a href="tel:+2347012715632" className="flex items-center gap-1.5 hover:text-[#2B82C9] transition-colors">
                <Phone className="w-4 h-4 text-[#E13B2B]" />
                <span>+234 701 271 5632</span>
              </a>
              <a href="mailto:subwayschoolsadmin@gmail.com" className="flex items-center gap-1.5 hover:text-[#2B82C9] transition-colors">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>subwayschoolsadmin@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

