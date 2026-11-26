import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { status: "error", message: "Please sign in to enroll in a course." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const courseId = typeof body.courseId === "string" ? body.courseId.trim() : "";
    const courseSlug = typeof (body.courseSlug || body.slug) === "string" ? String(body.courseSlug || body.slug).trim() : "";

    if (!courseId && !courseSlug) {
      return NextResponse.json(
        { status: "error", message: "Course identifier is required." },
        { status: 400 }
      );
    }

    // Always resolve course & authoritative price from Prisma (never trust client amount)
    const dbCourse = await prisma.course.findFirst({
      where: {
        OR: [
          ...(courseId ? [{ id: courseId }, { code: courseId }] : []),
          ...(courseSlug ? [{ slug: courseSlug }] : []),
        ],
      },
      select: { id: true, slug: true, code: true, title: true, price: true, isPublished: true, status: true },
    });

    if (!dbCourse || (!dbCourse.isPublished && dbCourse.status !== "PUBLISHED")) {
      return NextResponse.json(
        { status: "error", message: "Course not found or not available for enrollment." },
        { status: 404 }
      );
    }

    const amount = Number(dbCourse.price || 0);
    const email = session.user.email.toLowerCase().trim();
    const name = session.user.name || "Student Candidate";
    const userId = session.user.id;

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.nextUrl.origin ||
      "https://www.subwayschools.com";

    // Free course: activate enrollment directly without payment gateway
    if (amount <= 0) {
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId: dbCourse.id,
          },
        },
        update: { status: "ACTIVE" },
        create: {
          userId,
          courseId: dbCourse.id,
          status: "ACTIVE",
          amountPaid: 0,
        },
      });

      return NextResponse.json({
        status: "success",
        link: `${appUrl}/learn/${dbCourse.slug}?payment=success`,
        tx_ref: `free_${dbCourse.code}_${Date.now()}`,
      });
    }

    const rawSecretKey = process.env.FLW_SECRET_KEY || process.env.FLW_CLIENT_SECRET;
    const secretKey = rawSecretKey ? rawSecretKey.replace(/^["']|["']$/g, "").trim() : "";

    if (!secretKey) {
      console.error("[Flutterwave Init]: Missing FLW_SECRET_KEY or FLW_CLIENT_SECRET environment variable");
      return NextResponse.json(
        { status: "error", message: "Payment service configuration error: Missing FLW_SECRET_KEY" },
        { status: 500 }
      );
    }

    const cleanSlug = dbCourse.slug.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 30);
    const tx_ref = `subway_${cleanSlug || dbCourse.id}_${Date.now()}`;
    const redirect_url = `${appUrl}/api/payments/flutterwave/callback`;

    const payload = {
      tx_ref,
      amount,
      currency: "NGN",
      redirect_url,
      customer: {
        email,
        name,
      },
      meta: {
        courseId: dbCourse.id,
        userId,
        courseSlug: dbCourse.slug,
        expectedAmount: amount,
        tx_ref,
      },
      customizations: {
        title: "Subway Schools",
        description: `${dbCourse.title} — Course Tuition`,
        logo: "https://www.subwayschools.com/icon.png",
      },
    };

    const flwRes = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify(payload),
    });

    const flwData = await flwRes.json().catch(() => null);

    if (!flwRes.ok || flwData?.status !== "success" || !flwData?.data?.link) {
      console.error("[Flutterwave Init Error]:", flwData);
      return NextResponse.json(
        {
          status: "error",
          message: flwData?.message || "Failed to initialize payment gateway",
          details: flwData,
        },
        { status: flwRes.status || 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      link: flwData.data.link,
      tx_ref,
    });
  } catch (error: unknown) {
    console.error("[Flutterwave Init Exception]:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
