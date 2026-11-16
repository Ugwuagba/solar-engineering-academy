import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export const metadata = {
  title: "Access Restricted | Subway Schools",
  description: "You do not have the required permissions to view this resource.",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#070e1b] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0b1528] border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Access Restricted
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          You do not have the necessary administrative or instructor permissions to access this dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            My Dashboard
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all border border-slate-700"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

