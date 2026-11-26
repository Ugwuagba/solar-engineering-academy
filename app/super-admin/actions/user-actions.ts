"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export interface StaffActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function createStaffAccount(formData: FormData): Promise<StaffActionResult> {
  try {
    // 1. Verify session: must be authenticated AND have SUPER_ADMIN role
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized: Authentication required." };
    }

    const currentRole = session.user.role;
    if (currentRole !== Role.SUPER_ADMIN && currentRole !== "SUPER_ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Super Admin privileges required to create staff accounts.",
      };
    }

    // 2. Extract inputs from formData
    const emailRaw = formData.get("email");
    const roleRaw = formData.get("role");

    if (!emailRaw || typeof emailRaw !== "string" || !emailRaw.trim()) {
      return { success: false, error: "Email address is required." };
    }
    const email = emailRaw.trim().toLowerCase();

    if (!email.includes("@") || !email.includes(".")) {
      return { success: false, error: "Please enter a valid email address." };
    }

    if (!roleRaw || typeof roleRaw !== "string") {
      return { success: false, error: "Role selection is required." };
    }
    const role = roleRaw.trim().toUpperCase() as Role;

    const validRoles: Role[] = [
      Role.PROGRAM_ADMIN,
      Role.INSTRUCTOR,
      Role.SUPER_ADMIN,
      Role.LP_EDITOR,
    ];

    if (!validRoles.includes(role)) {
      return {
        success: false,
        error: `Invalid staff role: ${roleRaw}. Allowed roles: PROGRAM_ADMIN, INSTRUCTOR, SUPER_ADMIN, LP_EDITOR.`,
      };
    }

    // 3. Query Prisma to check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let resultMessage = "";

    if (existingUser) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "STAFF_ROLE_UPDATED",
          resource: email,
          details: {
            userId: updatedUser.id,
            previousRole: existingUser.role,
            newRole: role,
            timestamp: new Date().toISOString(),
          },
        },
      });

      resultMessage = `Updated ${email} to ${role}.`;
    } else {
      const tempPassword = `Staff#${crypto.randomBytes(5).toString("hex")}!`;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(tempPassword, salt);

      const newUser = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role,
          isEmailVerified: true,
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "STAFF_CREATED",
          resource: email,
          details: {
            createdUserId: newUser.id,
            role,
            temporaryPasswordGenerated: true,
            timestamp: new Date().toISOString(),
          },
        },
      });

      resultMessage = `Provisioned ${email} as ${role}.`;
    }

    // 4. Revalidate Super Admin routes
    revalidatePath("/super-admin/users");
    revalidatePath("/super-admin");

    return { success: true, message: resultMessage };
  } catch (err: unknown) {
    console.error("[createStaffAccount Error]:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to provision staff account.",
    };
  }
}
