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

    // Admin routes strictly require ADMIN or INSTRUCTOR role
    if (path.startsWith("/admin") && token?.role !== "ADMIN" && token?.role !== "INSTRUCTOR") {
      return NextResponse.redirect(new URL("/courses?error=AdminAccessRequired", req.url));
    }

    // Dashboard alias route directly redirects to classroom for authenticated students
    if (path === "/dashboard" || path.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/classroom", req.url));
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET || FALLBACK_SECRET,
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Gated classroom and dashboard require authenticated session
        if (
          path.startsWith("/learn") ||
          path.startsWith("/classroom") ||
          path.startsWith("/dashboard")
        ) {
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
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public images/assets (svg, png, jpg, jpeg, gif, webp, avif)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
