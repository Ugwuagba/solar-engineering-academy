"use client";

import Image from "next/image";
import { BookOpen, ExternalLink, ShieldCheck, Sparkles, Users } from "lucide-react";

interface Publication {
  id: string;
  image: string;
  title: string;
  tag: string;
  description: string;
  badge?: string;
  edition?: string;
}

const PUBLICATIONS_WHATSAPP_GROUP_URL = "https://shorturl.at/iI5NJ";

const PUBLICATIONS: Publication[] = [
  {
    id: "pub-49-reasons",
    image: "/images/books/solar-books-podium-1.jpg",
    title: "49 Reasons Why Solar Installations Fail & Profiting From The Sun",
    tag: "FIELD AUDIT & BUSINESS STRATEGY",
    description:
      "A compendium of decades of solar field experience. Uncovers common installation pitfalls, equipment mismatch faults, and commercial business strategies for sustainable energy profitability.",
    badge: "Dual Volume Set",
    edition: "Engr. Asanga & Subway Energy Directors",
  },
  {
    id: "pub-companion-2",
    image: "/images/books/solar-companion-2.jpg",
    title: "Solar Companion 2: The Big Boss Approach",
    tag: "ADVANCED INSTALLATION MANUAL",
    description:
      "The premier handbook for site managers, lead installers, and project engineers detailing industrial solar generator fabrication, safety protocols, and commissioning mastery.",
    badge: "Field Edition",
    edition: "Industrial Solar Generator Fabrication",
  },
  {
    id: "pub-exclusive-guide",
    image: "/images/books/solar-exclusive-guide.jpg",
    title: "Solar Exclusive (The Secrets Made Simple) & Designer's Guide",
    tag: "SYSTEM DESIGN & SIZING BLUEPRINT",
    description:
      "Essential technical formulas, PV array matching criteria, inverter load sizing calculations, and practical design principles simplified for energy professionals.",
    badge: "Reference Manual",
    edition: "Sizing & Formula Compendium",
  },
];

export default function PublicationsSection() {
  const rawPhone = process.env.NEXT_PUBLIC_INSTRUCTOR_WHATSAPP || "2347012715632";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");

  return (
    <section
      id="publications"
      className="relative py-20 lg:py-28 bg-[#050a14] text-white border-y border-[#1e293b] overflow-hidden"
    >
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>ACADEMIC PUBLICATIONS & FIELD MANUALS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Decades of Solar Engineering Insights, Distilled into Reference Handbooks
          </h2>

          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed font-normal">
            Authored by Subway Energy Limited directors and lead engineers to solve real field failure modes, financial models, and bankable PV designs across Africa.
          </p>

          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Verified Subway Energy Field Audits
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#2B82C9]" />
              Official Training Handbooks
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              Active Reading Community
            </span>
          </div>
        </div>

        {/* 3-Card Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PUBLICATIONS.map((book) => {
            return (
              <div
                key={book.id}
                className="group relative bg-[#0b1528] border border-[#1e293b] rounded-2xl overflow-hidden hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-400/10 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Subtle Card Accent Glow on Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                <div>
                  {/* High Quality Rounded Image Showcase with Clean Pedestal Frame */}
                  <div className="p-4 pb-0">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#0e1b33] to-[#070e1c] border border-[#1e293b] flex items-center justify-center p-3">
                      <Image
                        src={book.image}
                        alt={book.title}
                        width={600}
                        height={450}
                        className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1528]/40 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Metadata Tag & Badge Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-md">
                        {book.tag}
                      </span>
                      {book.badge && (
                        <span className="text-[10px] font-mono font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-300 border border-amber-400/20">
                          {book.badge}
                        </span>
                      )}
                    </div>

                    {/* Book Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug tracking-tight">
                      {book.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {book.description}
                    </p>

                    {/* Author / Edition Note */}
                    {book.edition && (
                      <p className="text-xs text-slate-400 font-mono pt-2 border-t border-slate-800/80">
                        {book.edition}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Button & Reading Group Note */}
                <div className="p-6 pt-0 mt-auto">
                  <a
                    href={PUBLICATIONS_WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer group/btn"
                  >
                    {/* Official WhatsApp SVG Icon */}
                    <svg
                      className="w-5 h-5 fill-current shrink-0 text-slate-950"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.981-1.309A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.583 0-3.07-.442-4.349-1.21l-.311-.186-2.962.778.791-2.888-.204-.325A8.134 8.134 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167z" />
                    </svg>
                    <span>Join Publications Group</span>
                    <ExternalLink className="w-4 h-4 text-slate-950 opacity-70 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                  <p className="text-xs text-slate-400 text-center mt-2 leading-normal">
                    Join our dedicated reading group for book orders, discounts & author Q&A.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Academy Trust Note */}
        <div className="mt-14 text-center">
          <p className="text-xs text-slate-400">
            Need institutional bulk copies or physical dispatch to your engineering office?{" "}
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                "Hello Subway Schools, I would like to inquire about institutional bulk orders of your solar handbooks."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4 decoration-amber-400/40"
            >
              Contact our admissions & publications desk on WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
