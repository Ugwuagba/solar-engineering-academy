import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (existing) {
      if (existing.isEmailVerified) {
        return NextResponse.json(
          { error: "An account with this email address already exists. Please sign in." },
          { status: 400 }
        );
      }

      // Existing unverified account: update details & password, resend OTP
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: name?.trim() || existing.name || "Candidate",
          passwordHash,
        },
      });
    } else {
      // Create new candidate record
      await prisma.user.create({
        data: {
          name: name?.trim() || "Candidate",
          email: normalizedEmail,
          passwordHash,
          role: "STUDENT",
          isEmailVerified: false,
        },
      });
    }

    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Clean up any existing OTPs for this email and save the new code
    await prisma.otpVerification.deleteMany({
      where: { email: normalizedEmail },
    });

    await prisma.otpVerification.create({
      data: {
        email: normalizedEmail,
        code,
        expiresAt,
      },
    });

    // Dispatch OTP email (logs to console in dev, sends via Resend if key exists)
    await sendOtpEmail(normalizedEmail, code);

    return NextResponse.json(
      {
        success: true,
        requireOtp: true,
        email: normalizedEmail,
        message: "Verification code sent to your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register candidate. Please try again." },
      { status: 500 }
    );
  }
}
