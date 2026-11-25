import Link from "next/link";
import { FileCheck2, ShieldCheck, ArrowLeft, Phone, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Terms of Attachment | Subway Schools & Subway Energy Limited",
  description:
    "Practical field training, workshop conduct, and academy enrollment terms for Subway Schools and Subway Energy Limited (RC: 1837154).",
};

export default function TermsOfAttachmentPage() {
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
            <ShieldCheck className="w-4 h-4" />
            <span>Subway Energy Limited • RC: 1837154</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Terms of Attachment &amp; Training Enrollment
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Governing standards for online curriculum access, workshop evaluations, and supervised solar PV field attachments under Subway Schools.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-sm text-slate-700 leading-relaxed">
          <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#2B82C9]" />
                1. Academy Enrollment &amp; Curriculum Access
              </h2>
              <p>
                Enrolled learners receive self-paced digital access to course modules, technical documentation, and assessment portals operated by Subway Schools (a training division of Subway Energy Limited, RC: 1837154). Account credentials are strictly personal and non-transferable.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">
                2. Practical Field Attachment Eligibility
              </h2>
              <p>
                Learners enrolled in eligible engineering tracks may participate in supervised practical installations and workshop builds upon fulfilling prerequisite module assessments (minimum 70% assessment threshold where applicable) and completing mandatory HSE orientation.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">
                3. Field Conduct, Tools &amp; Site Compliance
              </h2>
              <p>
                Trainees deployed to partner or company engineering sites must comply with all supervisor directives, site access rules, and personal protective equipment (PPE) mandates. Subway Energy Limited reserves the right to suspend site privileges for unsafe electrical work or policy violations.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">
                4. Intellectual Property &amp; Certification
              </h2>
              <p>
                All engineering spreadsheets, single-line diagrams, textbooks, and video lectures remain the intellectual property of Subway Energy Limited and Engr. Asanga. Official Certificates of Completion are issued strictly upon verified completion of all required modules and evaluations.
              </p>
            </div>
          </div>

          {/* Contact Block */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Admissions &amp; Compliance Desk
            </h3>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2B82C9] shrink-0 mt-0.5" />
                <span>Head Office: 23 Ikot Edet Use Abat, Ibiono Ibom L.G.A • Branch Office: 106 Ikot Ekpene Road</span>
              </div>
              <a href="tel:+2347012715632" className="flex items-center gap-2 hover:text-[#2B82C9] transition-colors">
                <Phone className="w-4 h-4 text-[#E13B2B] shrink-0" />
                <span>+234 701 271 5632</span>
              </a>
              <a href="mailto:subwayschoolsadmin@gmail.com" className="flex items-center gap-2 hover:text-[#2B82C9] transition-colors">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>subwayschoolsadmin@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

