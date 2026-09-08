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
  title: "Subway Energy Limited & Subway Schools | Industrial Solar Engineering & Academy",
  description:
    "Subway Energy Limited (RC: 1837154) — '...light up your world'. Next-generation solar engineering, commercial power auditing, and certified academy training featuring Engr. Asanga's comprehensive masterclass with 2-4 months practical partner field attachment.",
  keywords: [
    "Subway Energy Limited",
    "Subway Schools",
    "RC 1837154",
    "Solar System Design Installation and Maintenance",
    "Solar Installation 101",
    "Engr Asanga",
    "Deye Solar",
    "Power Audit",
    "Commercial Solar",
    "Solar Training Field Attachment",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-blue-500/20 selection:text-blue-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
