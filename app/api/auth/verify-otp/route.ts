import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and 6-digit verification code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();

    // Find the latest OTP verification entry
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        email: normalizedEmail,
        code: cleanCode,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    // Mark user as verified
    const user = await prisma.user.update({
      where: { email: normalizedEmail },
      data: { isEmailVerified: true },
    });

    // Delete used OTP records for this email
    await prisma.otpVerification.deleteMany({
      where: { email: normalizedEmail },
    });

    return NextResponse.json({
      success: true,
      verified: true,
      email: normalizedEmail,
      message: "Email verified successfully! You can now sign in to your candidate account.",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify code. Please try again." },
      { status: 500 }
    );
  }
}
