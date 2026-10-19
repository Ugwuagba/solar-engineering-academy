import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/db";
import { sendEmail, getPasswordResetEmailTemplate } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find user in Postgres
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // 2. If user is not found, return success immediately to prevent email enumeration
    if (!user) {
      console.log(`[PASSWORD RESET REQUEST]: No account found for ${normalizedEmail} (silent success response)`);
      return NextResponse.json(
        { success: true, message: "Password reset link sent" },
        { status: 200 }
      );
    }

    // 3. Generate secure 32-byte hexadecimal reset token and 15-minute expiration
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 4. Save token to user record in Postgres
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // 5. Construct secure candidate reset URL
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://subwayschools.com";
    const resetUrl = `${baseUrl.replace(/\/$/, "")}/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;

    console.log(`[PASSWORD RESET DISPATCH -> ${normalizedEmail}]: Token generated, expires in 15 mins`);

    // 6. Non-blocking email dispatch via Google Apps Script HTTPS relay
    sendEmail({
      to: normalizedEmail,
      subject: "Subway Schools - Password Reset Request",
      html: getPasswordResetEmailTemplate({
        resetUrl,
        candidateName: user.name || undefined,
        logoUrl: "https://subwayschools.com/logo.png",
      }),
    }).catch((err) => console.error("[Password Reset Dispatch Error]:", err));

    return NextResponse.json(
      { success: true, message: "Password reset link sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FORGOT_PASSWORD_API_ERROR]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
