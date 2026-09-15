import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check (optional but recommended: allow authenticated users / admins)
    const session = await getServerSession(authOptions);
    // Allow if authenticated or in dev
    const isAuthorized = session?.user?.role === "ADMIN" || session?.user?.role === "INSTRUCTOR" || process.env.NODE_ENV === "development";
    if (!isAuthorized && !session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in as an admin or instructor to upload assets." },
        { status: 401 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please attach an image file with key 'file'." },
        { status: 400 }
      );
    }

    // 3. Validate Mime Type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { 
          error: `Invalid file type: ${file.type}. Allowed formats are JPEG, PNG, and WebP.` 
        },
        { status: 400 }
      );
    }

    // 4. Validate File Size (5MB limit)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 5MB maximum limit.` 
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Option A: Vercel Blob (if token exists)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(`courses/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`, file, {
          access: "public",
        });
        return NextResponse.json({
          success: true,
          url: blob.url,
          filename: file.name,
          size: file.size,
          storage: "vercel-blob",
        });
      } catch (blobErr) {
        console.warn("Vercel Blob upload failed, falling back to local/data storage:", blobErr);
      }
    }

    // 6. Option B: Local Public Filesystem Storage
    try {
      const publicUploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }

      const cleanFileName = `course-cover-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(publicUploadsDir, cleanFileName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${cleanFileName}`,
        filename: cleanFileName,
        size: file.size,
        storage: "local-fs",
      });
    } catch (fsErr) {
      // 7. Option C: Resilient Base64 Data URL (for read-only serverless without Blob token)
      console.warn("Local filesystem write failed, using Base64 Data URL fallback:", fsErr);
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64Data}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: file.name,
        size: file.size,
        storage: "base64-inline",
      });
    }
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while processing the upload." },
      { status: 500 }
    );
  }
}
