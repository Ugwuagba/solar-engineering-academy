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
  title: "Subway Schools | Building Africa's Next Generation of Energy Professionals",
  description:
    "Subway Schools & Subway Energy Limited (RC: 1837154) — Accredited solar engineering and energy storage training featuring practical partner field attachments.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
  },
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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-blue-500/20 selection:text-blue-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
