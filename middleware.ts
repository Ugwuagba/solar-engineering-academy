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

    // 1. Special case: /lp-admin/login is the dedicated login page for LP studio
    if (path === "/lp-admin/login" || path === "/lp-admin/login/") {
      if (token) {
        return NextResponse.redirect(new URL("/lp-admin", req.url));
      }
      return NextResponse.next();
    }

    // 2. If unauthenticated on protected routes, redirect
    if (!token) {
      if (path.startsWith("/lp-admin")) {
        return NextResponse.redirect(new URL("/lp-admin/login", req.url));
      }
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = token.role;
    const isLPEditor = role === Role.LP_EDITOR || role === "LP_EDITOR";

    // 3. LP_EDITOR role containment: can ONLY access /lp-admin/** and public /lp/**
    if (isLPEditor) {
      if (
        path.startsWith("/super-admin") ||
        path.startsWith("/program-admin") ||
        path.startsWith("/admin") ||
        path.startsWith("/instructor") ||
        path.startsWith("/classroom") ||
        path.startsWith("/learn")
      ) {
        return NextResponse.redirect(new URL("/lp-admin", req.url));
      }
    }

    // 4. Paths starting with /lp-admin: Allow LP_EDITOR, SUPER_ADMIN, PROGRAM_ADMIN, and ADMIN
    if (path.startsWith("/lp-admin")) {
      const isAllowedLPAdmin =
        isLPEditor ||
        role === Role.SUPER_ADMIN ||
        role === "SUPER_ADMIN" ||
        role === Role.PROGRAM_ADMIN ||
        role === "PROGRAM_ADMIN" ||
        role === Role.ADMIN ||
        role === "ADMIN";

      if (!isAllowedLPAdmin) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 5. Paths starting with /super-admin: ONLY allow Role.SUPER_ADMIN
    if (path.startsWith("/super-admin")) {
      if (role !== Role.SUPER_ADMIN && role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 6. Paths starting with /program-admin: Allow Role.PROGRAM_ADMIN, Role.SUPER_ADMIN, and legacy Role.ADMIN
    if (path.startsWith("/program-admin")) {
      const isProgramAdmin =
        role === Role.PROGRAM_ADMIN ||
        role === "PROGRAM_ADMIN" ||
        role === Role.SUPER_ADMIN ||
        role === "SUPER_ADMIN" ||
        role === Role.ADMIN ||
        role === "ADMIN";

      if (!isProgramAdmin) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 7. Paths starting with /instructor: Allow Role.INSTRUCTOR, SUPER_ADMIN, PROGRAM_ADMIN, and ADMIN
    if (path.startsWith("/instructor")) {
      const isAllowedInstructor =
        role === Role.INSTRUCTOR ||
        role === "INSTRUCTOR" ||
        role === Role.SUPER_ADMIN ||
        role === "SUPER_ADMIN" ||
        role === Role.PROGRAM_ADMIN ||
        role === "PROGRAM_ADMIN" ||
        role === Role.ADMIN ||
        role === "ADMIN";

      if (!isAllowedInstructor) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 8. Existing /admin routes: allow administrative roles
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

    // 9. Role-based Dashboard router for authenticated sessions
    if (path === "/dashboard" || path === "/dashboard/") {
      if (isLPEditor) {
        return NextResponse.redirect(new URL("/lp-admin", req.url));
      }
      if (role === Role.SUPER_ADMIN || role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/super-admin/users", req.url));
      }
      if (
        role === Role.PROGRAM_ADMIN ||
        role === "PROGRAM_ADMIN" ||
        role === Role.ADMIN ||
        role === "ADMIN"
      ) {
        return NextResponse.redirect(new URL("/program-admin", req.url));
      }
      if (role === Role.INSTRUCTOR || role === "INSTRUCTOR") {
        return NextResponse.redirect(new URL("/instructor", req.url));
      }
      return NextResponse.redirect(new URL("/classroom", req.url));
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET || FALLBACK_SECRET,
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path === "/lp-admin/login" || path === "/lp-admin/login/") {
          return true;
        }
        // All protected dashboard and LMS routes require an active session
        if (
          path.startsWith("/lp-admin") ||
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
    "/lp-admin/:path*",
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
