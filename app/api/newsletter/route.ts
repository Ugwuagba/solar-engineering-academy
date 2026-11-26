import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        { status: "error", message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: rawEmail },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { status: "already_subscribed", message: "You're already subscribed." },
        { status: 200 }
      );
    }

    await prisma.newsletterSubscriber.create({
      data: { email: rawEmail },
    });

    return NextResponse.json(
      { status: "subscribed", message: "Subscribed!" },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle race-condition unique constraint cleanly
    const prismaError = error as { code?: string };
    if (prismaError?.code === "P2002") {
      return NextResponse.json(
        { status: "already_subscribed", message: "You're already subscribed." },
        { status: 200 }
      );
    }
    console.error("[Newsletter API Error]:", error);
    return NextResponse.json(
      { status: "error", message: "Unable to subscribe right now. Please try again." },
      { status: 500 }
    );
  }
}

