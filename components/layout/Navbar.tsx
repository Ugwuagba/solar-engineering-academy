"use client";

import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";
import { 
  Sun, 
  Zap, 
  BookOpen, 
  ShieldCheck, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X,
  ArrowRight,
  GraduationCap,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleQuickDemoLogin = async (role: "student" | "admin") => {
    if (role === "admin") {
      await signIn("credentials", {
        email: "admin@solaracademy.org",
        password: "SolarAdmin2026!",
        callbackUrl: "/admin",
      });
    } else {
      await signIn("credentials", {
        email: "student@solaracademy.org",
        password: "SolarStudent2026!",
        callbackUrl: "/courses/solar-installation-101",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-xs">
      {/* 1. Top Industrial Announcement Bar */}
      <div className="bg-[#0F172A] text-slate-200 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E13B2B] text-white">
              Announcement
            </span>
            <span className="text-slate-300 font-medium text-[11px] sm:text-xs">
              Next Practical Solar Cohort starting soon. Includes <strong>2–4 months physical field attachment</strong> with partners.
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>RC: 1837154</span>
            <span>•</span>
            <span className="text-amber-400">...light up your world</span>
            <span>•</span>
            <a href="tel:+2348000000000" className="hover:text-white flex items-center gap-1 transition-colors">
              <PhoneCall className="w-3 h-3 text-[#2B82C9]" />
              Support
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Clean Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Subway Energy & Subway Schools Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#2B82C9] to-[#0284C7] p-0.5 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:shadow-blue-500/25 transition-all">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Sun className="w-6 h-6 text-[#2B82C9] group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-slate-900 font-sans">
                SUBWAY <span className="text-[#2B82C9]">ENERGY</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#2B82C9] border border-blue-200">
                RC: 1837154
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <GraduationCap className="w-3.5 h-3.5 text-[#E13B2B]" />
              <span className="text-slate-700 font-semibold">Subway Schools</span>
              <span>— Industrial Solar Institute</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="/#solutions"
            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#2B82C9] hover:bg-slate-50 rounded-lg transition-colors"
          >
            Industrial Solutions
          </Link>
          <Link
            href="/courses"
            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#2B82C9] hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-[#2B82C9]" />
            Academy Catalog
          </Link>
          <Link
            href="/courses/solar-installation-101"
            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#2B82C9] hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-[#E13B2B]" />
            Solar Installation 101
          </Link>
          <Link
            href="/#companion"
            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#2B82C9] hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Solar Companion
          </Link>
          <Link
            href="/#about"
            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#2B82C9] hover:bg-slate-50 rounded-lg transition-colors"
          >
            About Us
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Faculty Studio
            </Link>
          )}
        </nav>

        {/* Action Controls & Fast Demo Switcher */}
        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800">
                  {session.user.name || session.user.email}
                </span>
                <span className="text-[10px] font-mono font-semibold text-[#2B82C9] flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {session.user.role}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                <button
                  onClick={() => handleQuickDemoLogin("student")}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-[#2B82C9] hover:bg-white rounded transition-colors"
                  title="Demo Student Login"
                >
                  Student
                </button>
                <button
                  onClick={() => handleQuickDemoLogin("admin")}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-[#2B82C9] hover:bg-white rounded transition-colors"
                  title="Demo Admin Login"
                >
                  Admin
                </button>
              </div>

              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/courses/solar-installation-101"
                className="px-4 py-2 text-xs font-bold text-white bg-[#2B82C9] hover:bg-[#226ba8] active:scale-[0.99] rounded-lg shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                <span>Explore Academy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          <Link
            href="/#solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Industrial Solutions
          </Link>
          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Academy Catalog
          </Link>
          <Link
            href="/courses/solar-installation-101"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Solar Installation 101 (Engr. Asanga)
          </Link>
          <Link
            href="/#companion"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Solar Companion Handbook
          </Link>
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            About Subway Energy
          </Link>

          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-amber-700 bg-amber-50 rounded-lg"
            >
              Faculty Studio
            </Link>
          )}

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {session?.user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">{session.user.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/courses/solar-installation-101"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 text-xs font-bold bg-[#2B82C9] text-white rounded-lg"
                >
                  Explore Academy
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
