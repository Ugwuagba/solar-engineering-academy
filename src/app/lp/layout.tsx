import React from "react";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080e1a] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {children}
    </div>
  );
}
