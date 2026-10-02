import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int(),
    })
  ).min(1, "Items array must not be empty"),
});

async function handleReorder(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "INSTRUCTOR")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { items } = parsed.data;

    await prisma.$transaction(
      items.map((item) =>
        prisma.course.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    try {
      revalidatePath("/");
      revalidatePath("/courses");
    } catch (e) {
      console.warn("Revalidation warning in reorder route:", e);
    }

    return NextResponse.json({ success: true, count: items.length });
  } catch (error: any) {
    console.error("[Reorder Courses Error]:", error);
    return NextResponse.json(
      { error: "Failed to reorder courses", message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  return handleReorder(req);
}

export async function PUT(req: NextRequest) {
  return handleReorder(req);
}
