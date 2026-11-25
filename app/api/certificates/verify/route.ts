import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code")?.trim() || "";

    if (!code) {
      return NextResponse.json(
        { found: false, message: "Please enter a certificate code to verify." },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.findFirst({
      where: {
        OR: [
          { certificateCode: { equals: code, mode: "insensitive" } },
          { id: code },
        ],
      },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true, code: true } },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        {
          found: false,
          message:
            "No digital certificate record matched that code. For manual verification of physical or legacy credentials, please contact Admissions.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      found: true,
      certificate: {
        certificateCode: certificate.certificateCode,
        holderName: certificate.user?.name || "Verified Graduate",
        courseTitle: certificate.course?.title || "Accredited Solar Program",
        courseCode: certificate.course?.code || "",
        contactHours: certificate.contactHours,
        issuedAt: certificate.issuedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[Certificate Verification API Error]:", error);
    return NextResponse.json(
      { found: false, message: "Unable to verify certificate right now. Please try again." },
      { status: 500 }
    );
  }
}

