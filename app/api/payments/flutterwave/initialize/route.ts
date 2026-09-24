import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json().catch(() => ({}));

    const courseId = body.courseId;
    const courseSlug = body.courseSlug || body.slug || "";
    
    // Resolve exact course price from passed body or database
    let resolvedAmount = typeof body.amount === "number" ? body.amount : (body.amount ? Number(body.amount) : undefined);

    if ((resolvedAmount === undefined || isNaN(resolvedAmount)) && (courseId || courseSlug)) {
      const dbCourse = await prisma.course.findFirst({
        where: {
          OR: [
            ...(courseId ? [{ id: courseId }, { code: courseId }] : []),
            ...(courseSlug ? [{ slug: courseSlug }, { slug: { startsWith: courseSlug } }] : []),
          ],
        },
        select: { price: true },
      });
      if (dbCourse && typeof dbCourse.price === "number") {
        resolvedAmount = dbCourse.price;
      }
    }

    const amount = (resolvedAmount !== undefined && !isNaN(resolvedAmount)) ? resolvedAmount : 5000;
    const email = body.email || session?.user?.email;
    const name = body.name || session?.user?.name || "Student Candidate";
    const userId = body.userId || session?.user?.id;

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "User email is required for payment initialization" },
        { status: 400 }
      );
    }

    const secretKey = process.env.FLW_CLIENT_SECRET;
    if (!secretKey) {
      console.error("[Flutterwave Init]: Missing FLW_CLIENT_SECRET environment variable");
      return NextResponse.json(
        { status: "error", message: "Payment service configuration error" },
        { status: 500 }
      );
    }

    // Generate unique transaction reference
    const cleanSlug = courseSlug.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 30);
    const tx_ref = `subway_${cleanSlug || courseId || "course"}_${Date.now()}`;

    // App URL base resolution
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.nextUrl.origin ||
      "https://subwayschools.com";
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
        courseId: String(courseId || ""),
        userId: String(userId || ""),
        courseSlug: String(courseSlug || ""),
        tx_ref,
      },
      customizations: {
        title: "Subway Schools",
        description: "Course Tuition & Enrollment",
        logo: "https://subwayschools.com/icon.png",
      },
    };

    console.log(`[Flutterwave Init]: Initializing transaction ${tx_ref} for ${email} (₦${amount})`);

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

    console.log(`[Flutterwave Success]: Payment link generated: ${flwData.data.link}`);

    return NextResponse.json({
      status: "success",
      link: flwData.data.link,
      tx_ref,
    });
  } catch (error: any) {
    console.error("[Flutterwave Init Exception]:", error);
    return NextResponse.json(
      { status: "error", message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
