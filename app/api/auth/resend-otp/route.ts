import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendEmail, getOtpEmailTemplate } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Candidate account not found with this email." },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "This email is already verified. Please sign in directly." },
        { status: 400 }
      );
    }

    // Generate fresh 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Clean up old OTP records and save fresh code
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

    const otp = code;
    console.log(`>>> [EMERGENCY_AUDIT_OTP] Candidate: ${normalizedEmail} | Code: ${otp} <<<`);

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: 'Subway Schools - Your Verification Code',
        html: getOtpEmailTemplate({ otp, candidateName: user.name || undefined }),
      });
    } catch (err) {
      console.error('[OTP_SEND_ERROR]:', err);
      return NextResponse.json(
        { error: 'Failed to send verification code. Please check your email or contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "A new confirmation code has been sent to your email.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification code. Please try again." },
      { status: 500 }
    );
  }
}
