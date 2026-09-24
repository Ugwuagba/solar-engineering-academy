import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");
  const tx_ref = searchParams.get("tx_ref");
  const transaction_id = searchParams.get("transaction_id");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.nextUrl.origin ||
    "https://subwayschools.com";

  console.log(`[Flutterwave Callback]: Received status='${status}', tx_ref='${tx_ref}', transaction_id='${transaction_id}'`);

  // Default redirect if cancelled or invalid
  let targetSlug = "solar-installation-101";

  // Try extracting slug from tx_ref if format is subway_[slug]_[timestamp]
  if (tx_ref && tx_ref.startsWith("subway_")) {
    const parts = tx_ref.split("_");
    if (parts.length >= 3) {
      targetSlug = parts.slice(1, -1).join("_");
    }
  }

  // If status is explicitly cancelled or not successful
  if (!status || (status !== "successful" && status !== "completed") || !transaction_id) {
    console.warn(`[Flutterwave Callback]: Payment cancelled or invalid status (${status})`);
    return NextResponse.redirect(`${appUrl}/courses/${targetSlug}?payment=cancelled`);
  }

  try {
    const secretKey = process.env.FLW_CLIENT_SECRET;
    if (!secretKey) {
      throw new Error("Missing FLW_CLIENT_SECRET on server");
    }

    // 1. Verify transaction with Flutterwave API
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verifyData = await verifyRes.json().catch(() => null);

    if (
      !verifyRes.ok ||
      verifyData?.status !== "success" ||
      !verifyData?.data ||
      verifyData.data.status !== "successful" ||
      verifyData.data.currency !== "NGN"
    ) {
      console.error("[Flutterwave Verification Failed]:", verifyData);
      return NextResponse.redirect(`${appUrl}/courses/${targetSlug}?payment=failed`);
    }

    const tx = verifyData.data;
    const meta = tx.meta || {};
    const metaCourseId = meta.courseId;
    const metaCourseSlug = meta.courseSlug || targetSlug;
    const metaUserId = meta.userId;
    const customerEmail = tx.customer?.email?.toLowerCase()?.trim();

    console.log(`[Flutterwave Verified]: Validated transaction ${tx.id} for ${customerEmail} (₦${tx.amount})`);

    // 2. Resolve Course in DB
    const course = await prisma.course.findFirst({
      where: {
        OR: [
          ...(metaCourseId ? [{ id: metaCourseId }] : []),
          ...(metaCourseSlug ? [{ slug: metaCourseSlug }] : []),
          ...(targetSlug ? [{ slug: targetSlug }] : []),
        ],
      },
    });

    // 3. Resolve User in DB (by userId or customer email)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(metaUserId ? [{ id: metaUserId }] : []),
          ...(customerEmail ? [{ email: customerEmail }] : []),
        ],
      },
    });

    const activeSlug = course?.slug || metaCourseSlug || targetSlug;

    // 4. Activate enrollment in Prisma if user & course exist
    if (user && course) {
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
        update: {
          status: "ACTIVE",
          amountPaid: Number(tx.amount) || undefined,
        },
        create: {
          userId: user.id,
          courseId: course.id,
          status: "ACTIVE",
          amountPaid: Number(tx.amount) || undefined,
        },
      });
      console.log(`[Enrollment Activated]: User '${user.email}' enrolled in course '${course.title}'`);
    } else {
      console.warn(
        `[Enrollment Notice]: Could not resolve user (${user ? user.id : "null"}) or course (${course ? course.id : "null"}). Meta:`,
        meta
      );
    }

    // 5. Redirect student directly into the classroom
    return NextResponse.redirect(`${appUrl}/learn/${activeSlug}?payment=success`);
  } catch (err: any) {
    console.error("[Flutterwave Callback Error]:", err);
    return NextResponse.redirect(`${appUrl}/courses/${targetSlug}?payment=error`);
  }
}
