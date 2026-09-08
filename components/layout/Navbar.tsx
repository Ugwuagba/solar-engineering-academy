"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  GraduationCap, 
  ArrowRight, 
  Menu, 
  X, 
  LogOut, 
  User
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Courses", href: "/courses" },
    { name: "Why Us", href: "/#solutions" },
    { name: "Projects", href: "/#solutions" },
    { name: "Success Stories", href: "/#success-stories" },
    { name: "Contact", href: "/#about" },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href) && href !== "/#about" && href !== "/#solutions" && href !== "/#success-stories") {
      return true;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B1528] border-b border-white/10 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* 1. Left Brand Identity: Circular Logo + SUBWAY SCHOOLS */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          {/* Circular White Logo Container matching Reference */}
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md p-1.5 shrink-0 group-hover:scale-105 transition-transform duration-300">
            <svg 
              viewBox="0 0 48 48" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <circle cx="24" cy="24" r="22" stroke="#2B82C9" strokeWidth="2" strokeDasharray="3 2" />
              {/* Sun Ray Beams */}
              <path d="M24 6V11" stroke="#E13B2B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M24 37V42" stroke="#E13B2B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M6 24H11" stroke="#E13B2B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M37 24H42" stroke="#E13B2B" strokeWidth="2.5" strokeLinecap="round" />
              {/* Stylized Solar PV Matrix */}
              <rect x="15" y="15" width="18" height="18" rx="3" fill="#2B82C9" />
              <path d="M15 24H33" stroke="white" strokeWidth="1.5" />
              <path d="M24 15V33" stroke="white" strokeWidth="1.5" />
              {/* Energy Lightning / Subway Ascent Curve */}
              <path d="M20 28L24 20L28 28" stroke="#E13B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-black text-base sm:text-lg tracking-wider text-white uppercase block leading-tight">
              SUBWAY SCHOOLS
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-300 font-normal block leading-tight mt-0.5 tracking-tight">
              Building Africa&apos;s Next Generation of Energy Professionals
            </span>
          </div>
        </Link>

        {/* 2. Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navLinks.map((item) => {
            const active = isLinkActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative py-1 text-xs xl:text-sm font-semibold transition-colors duration-200 ${
                  active 
                    ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#E13B2B]" 
                    : "text-slate-200 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 3. Right Action Buttons: [Student Portal] and [Apply Now →] */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Outlined Pill: Student Portal */}
          <Link
            href={session?.user ? "/learn/solar-installation-101" : "/login"}
            className="px-4 py-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs lg:text-sm font-semibold flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-slate-200" />
            <span>{session?.user ? "Student Portal" : "Student Portal"}</span>
          </Link>

          {/* Solid Red Rounded Pill: Apply Now → */}
          <Link
            href="/courses/solar-installation-101"
            className="px-5 py-2 rounded-full bg-[#E13B2B] hover:bg-red-600 text-white font-bold text-xs lg:text-sm flex items-center gap-1.5 shadow-md shadow-red-500/25 transition-all cursor-pointer"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Discreet sign out icon if user is logged in */}
          {session?.user && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-full transition-colors ml-1 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 4. Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 5. Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0B1528] px-4 py-5 space-y-3 shadow-xl">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href={session?.user ? "/learn/solar-installation-101" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold border border-white/30 rounded-full text-white bg-white/10 flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </Link>

            <Link
              href="/courses/solar-installation-101"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold bg-[#E13B2B] hover:bg-red-600 text-white rounded-full flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {session?.user && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-center py-2 text-xs font-semibold text-rose-400 hover:text-rose-300"
              >
                Sign Out ({session.user.email})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
