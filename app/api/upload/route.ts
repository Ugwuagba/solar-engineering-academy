import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    const isAuthorized =
      role === "ADMIN" ||
      role === "INSTRUCTOR" ||
      (role as string) === "DIRECTOR" ||
      process.env.NODE_ENV === "development";

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

    // 5. Convert directly to Base64 Data URL (no disk filesystem writing)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: file.name,
      size: file.size,
      storage: "base64-data-url",
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while processing the upload." },
      { status: 500 }
    );
  }
}
