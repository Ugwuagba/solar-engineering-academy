import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendEnrollmentReceiptEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("verif-hash");
    const secretHash = process.env.FLW_WEBHOOK_HASH;

    if (!secretHash || signature !== secretHash) {
      console.warn("[Flutterwave Webhook]: Unauthorized webhook verification hash mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = await req.json().catch(() => null);
    if (!payload) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { event, data } = payload;

    if (event === "charge.completed" && data?.status === "successful" && data?.currency === "NGN") {
      const meta = data.meta || {};
      const metaCourseId = meta.courseId;
      const metaCourseSlug = meta.courseSlug;
      const metaUserId = meta.userId;
      const customerEmail = data.customer?.email?.toLowerCase()?.trim();
      const paidAmount = Number(data.amount || 0);

      // Resolve course in DB
      const course = await prisma.course.findFirst({
        where: {
          OR: [
            ...(metaCourseId ? [{ id: metaCourseId }] : []),
            ...(metaCourseSlug ? [{ slug: metaCourseSlug }] : []),
          ],
        },
      });

      if (!course || paidAmount < Number(course.price || 0)) {
        console.warn("[Flutterwave Webhook]: Course missing or underpaid amount:", paidAmount);
        return NextResponse.json({ status: "ignored" }, { status: 200 });
      }

      // Resolve user in DB
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
          const studentName = data.customer?.name || "Student Candidate";
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
          console.warn("[User Auto-Create Warning in Webhook]:", userCreateErr);
        }
      }

      if (user) {
        const txIdempotentKey = String(data.id || data.tx_ref || "");
        const newlyRecorded = await prisma.$transaction(async (trx) => {
          const existingLog = txIdempotentKey
            ? await trx.auditLog.findFirst({
                where: {
                  action: "FLW_PAYMENT_VERIFIED",
                  resource: txIdempotentKey,
                },
              })
            : null;

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

            if (txIdempotentKey) {
              await trx.auditLog.create({
                data: {
                  actorId: user.id,
                  action: "FLW_PAYMENT_VERIFIED",
                  resource: txIdempotentKey,
                  details: {
                    txRef: data.tx_ref || "",
                    flwTransactionId: data.id,
                    courseId: course.id,
                    amount: paidAmount,
                  },
                },
              });
            }
            return true;
          }
          return false;
        });

        if (newlyRecorded && customerEmail) {
          try {
            await sendEnrollmentReceiptEmail({
              toEmail: customerEmail,
              studentName: user.name || data.customer?.name || undefined,
              courseTitle: course.title,
              courseSlug: metaCourseSlug || course.slug,
              amount: paidAmount || course.price || 0,
              txRef: data.tx_ref || "",
              paymentDate: new Date(),
            });
          } catch (emailErr) {
            console.error("[Email Receipt Error in Webhook]:", emailErr);
          }
        }
      }
    }

    return NextResponse.json({ status: "success", received: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("[Flutterwave Webhook Exception]:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Internal error" },
      { status: 200 }
    );
  }
}
