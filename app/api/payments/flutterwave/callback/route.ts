import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendEnrollmentReceiptEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");
  const tx_ref = searchParams.get("tx_ref");
  const transaction_id = searchParams.get("transaction_id");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.nextUrl.origin ||
    "https://www.subwayschools.com";

  let targetSlug = "solar-installation-101-6402";

  if (tx_ref && tx_ref.startsWith("subway_")) {
    const parts = tx_ref.split("_");
    if (parts.length >= 3) {
      targetSlug = parts.slice(1, -1).join("_");
    }
  }

  if (!status || (status !== "successful" && status !== "completed") || !transaction_id) {
    return NextResponse.redirect(`${appUrl}/courses/${targetSlug}?payment=cancelled`);
  }

  try {
    const rawSecretKey = process.env.FLW_SECRET_KEY || process.env.FLW_CLIENT_SECRET;
    const secretKey = rawSecretKey ? rawSecretKey.replace(/^["']|["']$/g, "").trim() : "";
    if (!secretKey) {
      throw new Error("Missing FLW_SECRET_KEY or FLW_CLIENT_SECRET on server");
    }

    // 1. Verify transaction with Flutterwave API
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transaction_id)}/verify`,
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
    const paidAmount = Number(tx.amount || 0);

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

    if (!course) {
      console.error("[Flutterwave Callback]: Course not found for", metaCourseId || metaCourseSlug);
      return NextResponse.redirect(`${appUrl}/courses/${targetSlug}?payment=failed`);
    }

    // 3. Enforce verified paid amount covers course tuition price
    if (paidAmount < Number(course.price || 0)) {
      console.error(
        `[Flutterwave Amount Mismatch]: Paid ₦${paidAmount} < Course Price ₦${course.price} for ${course.code}`
      );
      return NextResponse.redirect(`${appUrl}/courses/${course.slug}?payment=failed`);
    }

    // 4. Resolve User in DB (by userId or customer email)
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(metaUserId ? [{ id: metaUserId }] : []),
          ...(customerEmail ? [{ email: customerEmail }] : []),
        ],
      },
    });

    if (!user && customerEmail) {
      try {
        const studentName = tx.customer?.name || "Student Candidate";
        user = await prisma.user.create({
          data: {
            email: customerEmail,
            name: studentName,
            passwordHash: "enrolled_via_flutterwave",
            role: "STUDENT",
            isEmailVerified: true,
          },
        });
      } catch (userCreateErr) {
        console.warn("[User Auto-Create Warning]:", userCreateErr);
      }
    }

    const activeSlug = course.slug || metaCourseSlug || targetSlug;
    const finalTxRef = tx.tx_ref || tx_ref || "";
    const txIdempotentKey = String(tx.id || finalTxRef);

    // 5. Idempotently record Payment + Enrollment inside transaction
    if (user) {
      const newlyRecorded = await prisma.$transaction(async (trx) => {
        const existingLog = await trx.auditLog.findFirst({
          where: {
            action: "FLW_PAYMENT_VERIFIED",
            resource: txIdempotentKey,
          },
        });

        await trx.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: course.id,
            },
          },
          update: {
            status: "ACTIVE",
            amountPaid: paidAmount,
          },
          create: {
            userId: user.id,
            courseId: course.id,
            status: "ACTIVE",
            amountPaid: paidAmount,
          },
        });

        if (!existingLog) {
          await trx.payment.create({
            data: {
              userId: user.id,
              courseId: course.id,
              amount: paidAmount,
              status: "COMPLETED",
            },
          });

          await trx.auditLog.create({
            data: {
              actorId: user.id,
              action: "FLW_PAYMENT_VERIFIED",
              resource: txIdempotentKey,
              details: {
                txRef: finalTxRef,
                flwTransactionId: tx.id,
                courseId: course.id,
                amount: paidAmount,
              },
            },
          });
          return true;
        }
        return false;
      });

      if (newlyRecorded && customerEmail) {
        try {
          await sendEnrollmentReceiptEmail({
            toEmail: customerEmail,
            studentName: user.name || tx.customer?.name || undefined,
            courseTitle: course.title,
            courseSlug: activeSlug,
            amount: paidAmount || course.price || 0,
            txRef: finalTxRef,
            paymentDate: new Date(),
          });
        } catch (emailErr) {
          console.error("[Email Receipt Error in Callback]:", emailErr);
        }
      }
    }

    return NextResponse.redirect(
      `${appUrl}/learn/${activeSlug}?payment=success&tx_ref=${encodeURIComponent(finalTxRef)}`
    );
  } catch (err: unknown) {
    console.error("[Flutterwave Callback Error]:", err);
    return NextResponse.redirect(`${appUrl}/courses/${targetSlug}?payment=error`);
  }
}
