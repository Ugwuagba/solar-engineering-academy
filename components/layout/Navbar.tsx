"use client";

import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";
import { 
  Sun, 
  Zap, 
  BookOpen, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X
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
        callbackUrl: "/courses/pvol101",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-mono">SOLAR</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ACADEMY
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              SEI-Aligned Technical Institute
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/courses"
            className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            Course Catalog
          </Link>
          <Link
            href="/courses/pvol101"
            className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            PVOL101
          </Link>
          <Link
            href="/courses/bess201"
            className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            BESS201
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-3.5 py-2 text-sm font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Studio
            </Link>
          )}
        </nav>

        {/* Auth State & Quick Demo Controls */}
        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200">
                  {session.user.name || session.user.email}
                </span>
                <span className="text-[10px] font-mono font-medium text-amber-400 flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {session.user.role}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/60 p-1">
                <button
                  onClick={() => handleQuickDemoLogin("student")}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                  title="Instant Demo Student Login"
                >
                  Demo Student
                </button>
                <button
                  onClick={() => handleQuickDemoLogin("admin")}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                  title="Instant Demo Admin Login"
                >
                  Demo Admin
                </button>
              </div>

              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md shadow-amber-500/20 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#090d16] px-4 py-4 space-y-3">
          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            Course Catalog
          </Link>
          <Link
            href="/courses/pvol101"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            PVOL101 Masterclass
          </Link>
          <Link
            href="/courses/bess201"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            BESS201 Masterclass
          </Link>

          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-amber-300 bg-amber-500/10 rounded-lg"
            >
              Admin Studio
            </Link>
          )}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {session?.user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{session.user.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-3 py-1.5 text-xs text-rose-400 hover:bg-slate-800 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 text-sm font-medium border border-slate-800 rounded-lg text-slate-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2 text-sm font-semibold bg-amber-400 text-slate-950 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
