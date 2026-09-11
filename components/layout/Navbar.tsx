"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  Search, 
  ChevronDown, 
  ArrowRight, 
  Menu, 
  X, 
  LogOut,
  GraduationCap
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const EXPLORE_COURSES = [
  {
    title: "Solar System Design, Installation & Maintenance (Solar 101)",
    code: "SOLAR 101 · Flagship Masterclass",
    href: "/courses/solar-installation-101",
  },
  {
    title: "Commercial & Industrial (C&I) Mini-Grid Design",
    code: "CIGID 101 · Advanced C&I",
    href: "/courses/commercial-industrial-solar",
  },
  {
    title: "Battery Energy Storage Systems (BESS) & Lithium Safety",
    code: "BESS 201 · Storage Specialist",
    href: "/courses/bess-201",
  },
  {
    title: "Solar Power Auditing & Load Profiling",
    code: "AUDIT 201 · Practical Auditing",
    href: "/courses/power-audit-masterclass",
  },
  {
    title: "Solar Business, Contracting & Project Financing",
    code: "ENTRE 301 · Commercial Strategy",
    href: "/courses/solar-entrepreneurship",
  },
];

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Navigation State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Explore Dropdown Hover State & Delay Bridge
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleExploreEnter = () => {
    if (exploreTimeoutRef.current) clearTimeout(exploreTimeoutRef.current);
    setExploreOpen(true);
  };

  const handleExploreLeave = () => {
    exploreTimeoutRef.current = setTimeout(() => {
      setExploreOpen(false);
    }, 150);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?query=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  // Close menus on route change or escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExploreOpen(false);
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-xs transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* 1. Brand Logo: Subway Schools logo and title linking to "/" */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-xs group-hover:scale-105 transition-transform duration-200">
            <img 
              src="/images/subway-logo.png" 
              alt="Subway Schools Official Logo" 
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-base sm:text-lg tracking-wider text-slate-900 uppercase block leading-tight">
              SUBWAY SCHOOLS
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-normal block leading-tight mt-0.5 tracking-tight hidden sm:block">
              Building Africa&apos;s Next Generation of Energy Professionals
            </span>
          </div>
        </Link>

        {/* 2. "Explore" Dropdown Button (Udemy Category Style with 150ms delay bridge) */}
        <div 
          className="relative hidden md:block"
          onMouseEnter={handleExploreEnter}
          onMouseLeave={handleExploreLeave}
        >
          <button
            type="button"
            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-2 px-3 rounded-lg hover:bg-slate-100 cursor-pointer ${
              exploreOpen ? "text-[#2B82C9] bg-slate-50" : "text-slate-800"
            }`}
          >
            <span>Explore</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                exploreOpen ? "rotate-180 text-[#2B82C9]" : "text-slate-500"
              }`} 
            />
          </button>

          {/* Invisible Bridge padding so mouse doesn't leave hover zone */}
          <div className="absolute top-full left-0 w-full h-2" />

          {/* Absolute Flyout Menu */}
          {exploreOpen && (
            <div 
              className="absolute top-[calc(100%+8px)] left-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-3 z-50 text-left text-slate-900 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="px-4 pb-2 mb-1 border-b border-slate-100 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Accredited Solar Tracks
              </div>

              <div className="space-y-0.5">
                {EXPLORE_COURSES.map((course) => (
                  <Link
                    key={course.href}
                    href={course.href}
                    onClick={() => setExploreOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 hover:text-[#2B82C9] transition-colors group/item"
                  >
                    <div className="text-xs font-semibold text-slate-800 group-hover/item:text-[#2B82C9] leading-snug">
                      {course.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                      {course.code}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 px-4">
                <Link
                  href="/courses"
                  onClick={() => setExploreOpen(false)}
                  className="flex items-center justify-between text-xs font-bold text-[#2B82C9] hover:text-[#226ba8] py-1 transition-colors"
                >
                  <span>View All Programs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 3. "Courses" Nav Link (in place of Udemy's "Subscribe") */}
        <Link
          href="/courses"
          className="hidden md:inline-flex text-sm font-semibold text-slate-700 hover:text-[#2B82C9] transition-colors py-2 px-1 whitespace-nowrap"
        >
          Courses
        </Link>

        {/* 4. Global Functional Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xl mx-4"
        >
          <div className="w-full border border-slate-300 focus-within:border-[#2B82C9] bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white rounded-full px-4 py-2 flex items-center gap-2.5 transition-all shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="what do you want to learn?"
              className="w-full bg-transparent border-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* 5. "Business" Nav Link: pointing to /about */}
        <Link
          href="/about"
          className="hidden lg:inline-flex text-sm font-semibold text-slate-700 hover:text-[#2B82C9] transition-colors py-2 px-1 whitespace-nowrap"
        >
          Business
        </Link>

        {/* 6 & 7. Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* "Log in" Button */}
          {session?.user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/learn/solar-installation-101"
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold text-sm flex items-center gap-1.5 transition-all"
              >
                <GraduationCap className="w-4 h-4 text-[#2B82C9]" />
                <span>My Classroom</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                title={`Sign out (${session.user.email})`}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="border border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap"
            >
              Log in
            </Link>
          )}

          {/* "Apply Now" CTA Button */}
          <Link
            href="/courses/solar-installation-101"
            className="bg-[#E13B2B] hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg text-sm shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-1">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-b border-slate-100 bg-white animate-in slide-in-from-top-1 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="w-full border border-slate-300 focus-within:border-[#2B82C9] bg-slate-50 rounded-full px-4 py-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="what do you want to learn?"
                className="w-full bg-transparent border-none text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* Explore Accordion */}
          <div>
            <button
              onClick={() => setMobileExploreOpen(!mobileExploreOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              <span>Explore Programs</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileExploreOpen ? "rotate-180 text-[#2B82C9]" : ""}`} />
            </button>

            {mobileExploreOpen && (
              <div className="pl-4 pr-2 pt-1 pb-2 space-y-1.5 border-l-2 border-[#2B82C9] ml-3 mt-1">
                {EXPLORE_COURSES.map((course) => (
                  <Link
                    key={course.href}
                    href={course.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs font-semibold text-slate-700 hover:text-[#2B82C9]"
                  >
                    {course.title}
                  </Link>
                ))}
                <Link
                  href="/courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block pt-2 text-xs font-bold text-[#2B82C9]"
                >
                  View All Programs →
                </Link>
              </div>
            )}
          </div>

          {/* Courses Link */}
          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Courses Catalog
          </Link>

          {/* Business Link */}
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Business & Enterprise
          </Link>

          {/* Mobile Buttons */}
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            {session?.user ? (
              <>
                <Link
                  href="/learn/solar-installation-101"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-semibold border border-slate-300 rounded-lg text-slate-800 bg-slate-50 flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-[#2B82C9]" />
                  <span>My Classroom</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-center py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  Sign Out ({session.user.email})
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-semibold border border-slate-300 rounded-lg text-slate-800 hover:bg-slate-50 flex items-center justify-center"
              >
                Log in
              </Link>
            )}

            <Link
              href="/courses/solar-installation-101"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold bg-[#E13B2B] hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-red-500/20"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
