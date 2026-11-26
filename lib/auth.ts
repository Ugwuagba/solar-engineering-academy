import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";

// ─── NextAuth type augmentation ───────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role | string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: Role | string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role | string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production"
      ? "dev-only-insecure-nextauth-secret"
      : undefined),
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "engineer@solaracademy.org" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password.");
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        // 1. Resolve through live Prisma database
        let foundUserInDb = false;
        try {
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (user) {
            foundUserInDb = true;
            const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
            if (isValid) {
              if (!user.isEmailVerified) {
                throw new Error("Please verify your email before logging in.");
              }
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: (user.role as Role) ?? Role.LEARNER,
              };
            }
          }
        } catch (authError: unknown) {
          if (authError instanceof Error && authError.message === "Please verify your email before logging in.") {
            throw authError;
          }
          // Live database might not be initialized yet in local dev
        }

        // 2. Demo credentials fallback ONLY in non-production and only if account does not exist in DB
        if (!foundUserInDb && process.env.NODE_ENV !== "production") {
          if (
            normalizedEmail === "admin@solaracademy.org" &&
            credentials.password === "SolarAdmin2026!"
          ) {
            return {
              id: "seed-admin-01",
              name: "Lead Solar Engineer (Director)",
              email: "admin@solaracademy.org",
              role: "ADMIN",
            };
          }

          if (
            normalizedEmail === "student@solaracademy.org" &&
            credentials.password === "SolarStudent2026!"
          ) {
            return {
              id: "seed-student-01",
              name: "Alex Rivera, EIT",
              email: "student@solaracademy.org",
              role: "STUDENT",
            };
          }
        }

        throw new Error("Invalid email or password credentials.");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) ?? Role.LEARNER;
      }
      return session;
    },
  },
};
