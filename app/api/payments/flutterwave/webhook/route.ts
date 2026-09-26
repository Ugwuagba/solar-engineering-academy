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
    console.log(`[Flutterwave Webhook]: Received event '${event}' for tx_ref='${data?.tx_ref}'`);

    if (event === "charge.completed" && data?.status === "successful") {
      const meta = data.meta || {};
      const metaCourseId = meta.courseId;
      const metaCourseSlug = meta.courseSlug;
      const metaUserId = meta.userId;
      const customerEmail = data.customer?.email?.toLowerCase()?.trim();

      // Resolve course in DB
      const course = await prisma.course.findFirst({
        where: {
          OR: [
            ...(metaCourseId ? [{ id: metaCourseId }] : []),
            ...(metaCourseSlug ? [{ slug: metaCourseSlug }] : []),
          ],
        },
      });

      // Resolve user in DB
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            ...(metaUserId ? [{ id: metaUserId }] : []),
            ...(customerEmail ? [{ email: customerEmail }] : []),
          ],
        },
      });

      // Auto-create user profile if paying student has not registered yet
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
          console.log(`[User Auto-Created in Webhook]: ${user.email} (${user.id})`);
        } catch (userCreateErr) {
          console.warn("[User Auto-Create Warning in Webhook]:", userCreateErr);
        }
      }

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
            amountPaid: Number(data.amount) || undefined,
          },
          create: {
            userId: user.id,
            courseId: course.id,
            status: "ACTIVE",
            amountPaid: Number(data.amount) || undefined,
          },
        });
        console.log(`[Flutterwave Webhook Success]: Enrollment verified active for ${user.email} in ${course.title}`);

        // Asynchronously trigger automated enrollment receipt email (safe try/catch)
        if (customerEmail) {
          try {
            await sendEnrollmentReceiptEmail({
              toEmail: customerEmail,
              studentName: user.name || data.customer?.name || undefined,
              courseTitle: course.title,
              courseSlug: metaCourseSlug || course.slug,
              amount: Number(data.amount) || course.price || 0,
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
  } catch (error: any) {
    console.error("[Flutterwave Webhook Exception]:", error);
    // Return 200 to prevent webhook retries on internal logging issues
    return NextResponse.json({ status: "error", message: error?.message }, { status: 200 });
  }
}
