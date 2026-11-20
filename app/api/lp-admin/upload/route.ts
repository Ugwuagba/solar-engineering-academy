import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

const MAX_IMAGE_SIZE_BYTES = 512000; // 500KB strict limit
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    const isAuthorized =
      role === Role.LP_EDITOR ||
      role === "LP_EDITOR" ||
      role === Role.PROGRAM_ADMIN ||
      role === "PROGRAM_ADMIN" ||
      role === Role.SUPER_ADMIN ||
      role === "SUPER_ADMIN" ||
      role === Role.ADMIN ||
      role === "ADMIN";

    if (!isAuthorized || !session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Landing page editor privileges required." },
        { status: 401 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided. Please attach an image file with key 'file'." },
        { status: 400 }
      );
    }

    // 3. Validate Mime Type
    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        {
          error: `Invalid image type: ${file.type}. Allowed formats are JPEG, PNG, and WebP.`,
        },
        { status: 400 }
      );
    }

    // 4. Strict File Size Validation (<=500KB)
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      const sizeKb = (file.size / 1024).toFixed(1);
      return NextResponse.json(
        {
          error: `File size (${sizeKb} KB) exceeds the strict 500KB maximum limit for landing page images. Please optimize or compress the image before uploading.`,
        },
        { status: 400 }
      );
    }

    // 5. Save Binary to Database
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const media = await prisma.landingPageMedia.create({
      data: {
        filename: file.name || "landing-page-photo",
        mimeType: mimeType === "image/jpg" ? "image/jpeg" : mimeType,
        sizeBytes: file.size,
        data: buffer,
      },
    });

    return NextResponse.json({
      success: true,
      url: `/api/lp-media/${media.id}`,
      mediaId: media.id,
      filename: media.filename,
      sizeBytes: media.sizeBytes,
    });
  } catch (err: any) {
    console.error("Error uploading landing page image:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process image upload." },
      { status: 500 }
    );
  }
}

