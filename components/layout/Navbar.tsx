"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  GraduationCap, 
  ArrowRight, 
  Menu, 
  X, 
  LogOut 
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
    if (
      href !== "/" && 
      pathname.startsWith(href) && 
      href !== "/#about" && 
      href !== "/#solutions" && 
      href !== "/#success-stories"
    ) {
      return true;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B1528] border-b border-white/10 shadow-sm transition-colors">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between gap-4">
        {/* 1. Left Brand Identity: Moved to the left with generous spacing */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          {/* Circular White Logo Container with Official Company Logo */}
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md p-1 shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
            <img 
              src="/images/subway-logo.png" 
              alt="Subway Energy Limited & Subway Schools Official Logo" 
              className="w-full h-full object-contain"
            />
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

        {/* 2. Center Desktop Navigation Links: Centered in the middle */}
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1 px-4">
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

        {/* 3. Right Action Buttons: Moved to the right */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Outlined Pill: Student Portal */}
          <Link
            href={session?.user ? "/learn/solar-installation-101" : "/login"}
            className="px-4 py-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs lg:text-sm font-semibold flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-slate-200" />
            <span>Student Portal</span>
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
