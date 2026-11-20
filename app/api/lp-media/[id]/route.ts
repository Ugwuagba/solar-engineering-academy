import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return new NextResponse("Media ID is required", { status: 400 });
    }

    const media = await prisma.landingPageMedia.findUnique({
      where: { id },
    });

    if (!media || !media.data) {
      return new NextResponse("Image not found", { status: 404 });
    }

    return new NextResponse(media.data as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": media.mimeType || "image/jpeg",
        "Content-Length": media.sizeBytes.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("Error retrieving landing page media:", err);
    return new NextResponse("Failed to load image", { status: 500 });
  }
}
