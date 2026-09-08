import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solar Engineering Academy | SEI-Aligned Technical PV & BESS Institute",
  description:
    "Accredited professional solar and battery energy storage engineering academy. Featuring self-paced PVOL101 design and BESS201 industrial battery storage masterclasses.",
  keywords: [
    "Solar Engineering",
    "PVOL101",
    "BESS201",
    "NABCEP certification",
    "Commercial Solar PV",
    "Battery Energy Storage",
    "NEC 690",
    "UL 9540",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
