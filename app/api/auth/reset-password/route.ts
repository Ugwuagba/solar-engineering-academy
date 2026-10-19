import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { token, password, email } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Reset token is missing or invalid." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // 1. Locate candidate by token and ensure token has not expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
        ...(email ? { email: email.toLowerCase().trim() } : {}),
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "This password reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // 2. Hash new password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Update candidate password and clear token fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log(`[PASSWORD RESET SUCCESS]: Password successfully changed for candidate ${user.email}`);

    return NextResponse.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[RESET_PASSWORD_API_ERROR]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating your password." },
      { status: 500 }
    );
  }
}
