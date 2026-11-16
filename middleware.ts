import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

const FALLBACK_SECRET = "solar-engineering-academy-super-secure-jwt-secret-key-2026";

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = FALLBACK_SECRET;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. If unauthenticated, redirect to /login
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = token.role;

    // 2. Paths starting with /super-admin: ONLY allow Role.SUPER_ADMIN
    if (path.startsWith("/super-admin")) {
      if (role !== Role.SUPER_ADMIN && role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 3. Paths starting with /program-admin: Allow Role.PROGRAM_ADMIN and Role.SUPER_ADMIN
    if (path.startsWith("/program-admin")) {
      const isProgramAdmin =
        role === Role.PROGRAM_ADMIN ||
        role === "PROGRAM_ADMIN" ||
        role === Role.SUPER_ADMIN ||
        role === "SUPER_ADMIN";

      if (!isProgramAdmin) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 4. Paths starting with /instructor: Allow Role.INSTRUCTOR
    if (path.startsWith("/instructor")) {
      if (role !== Role.INSTRUCTOR && role !== "INSTRUCTOR") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 5. Existing /admin routes: allow administrative roles (SUPER_ADMIN, PROGRAM_ADMIN, ADMIN, INSTRUCTOR)
    if (path.startsWith("/admin")) {
      const isAllowedAdmin =
        role === Role.SUPER_ADMIN ||
        role === "SUPER_ADMIN" ||
        role === Role.PROGRAM_ADMIN ||
        role === "PROGRAM_ADMIN" ||
        role === Role.ADMIN ||
        role === "ADMIN" ||
        role === Role.INSTRUCTOR ||
        role === "INSTRUCTOR";

      if (!isAllowedAdmin) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 6. Dashboard alias route directly redirects to classroom for authenticated learners
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
        // All protected dashboard and LMS routes require an active session
        if (
          path.startsWith("/super-admin") ||
          path.startsWith("/program-admin") ||
          path.startsWith("/instructor") ||
          path.startsWith("/admin") ||
          path.startsWith("/dashboard") ||
          path.startsWith("/classroom") ||
          path.startsWith("/learn")
        ) {
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
    "/super-admin/:path*",
    "/program-admin/:path*",
    "/instructor/:path*",
    "/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/classroom",
    "/classroom/:path*",
    "/learn/:path*",
  ],
};
