import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const FALLBACK_SECRET = "solar-engineering-academy-super-secure-jwt-secret-key-2026";

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = FALLBACK_SECRET;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes strictly require ADMIN role
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/courses?error=AdminAccessRequired", req.url));
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET || FALLBACK_SECRET,
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Gated classroom requires authenticated session
        if (path.startsWith("/learn")) {
          return !!token;
        }
        // Admin panel requires authenticated session
        if (path.startsWith("/admin")) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/learn/:path*", "/admin/:path*"],
};
