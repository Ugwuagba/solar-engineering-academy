"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function createStaffAccount(formData: FormData) {
  // 1. Verify session: must be authenticated AND have SUPER_ADMIN role
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Authentication required.");
  }

  const currentRole = session.user.role;
  if (currentRole !== Role.SUPER_ADMIN && currentRole !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super Admin privileges required to create staff accounts.");
  }

  // 2. Extract inputs from formData
  const emailRaw = formData.get("email");
  const roleRaw = formData.get("role");

  if (!emailRaw || typeof emailRaw !== "string" || !emailRaw.trim()) {
    throw new Error("Email address is required.");
  }
  const email = emailRaw.trim().toLowerCase();

  // Basic email pattern check
  if (!email.includes("@") || !email.includes(".")) {
    throw new Error("Please enter a valid email address.");
  }

  if (!roleRaw || typeof roleRaw !== "string") {
    throw new Error("Role selection is required.");
  }
  const role = roleRaw.trim().toUpperCase() as Role;

  // Allowed staff roles
  const validRoles: Role[] = [
    Role.PROGRAM_ADMIN,
    Role.INSTRUCTOR,
    Role.SUPER_ADMIN,
    Role.LP_EDITOR,
  ];

  if (!validRoles.includes(role)) {
    throw new Error(`Invalid staff role: ${roleRaw}. Allowed roles: PROGRAM_ADMIN, INSTRUCTOR, SUPER_ADMIN, LP_EDITOR.`);
  }

  // 1. Query Prisma to check if a user with that email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // 2. If the user ALREADY EXISTS:
    // Update their record in Prisma to assign the new role
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // Create an AuditLog entry
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
  } else {
    // 3. If the user DOES NOT EXIST:
    // Generate the bcrypt password hash as before
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

    // Create an AuditLog entry
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "STAFF_CREATED",
        resource: email,
        details: {
          createdUserId: newUser.id,
          role,
          temporaryPassword: tempPassword,
          timestamp: new Date().toISOString(),
        },
      },
    });
  }

  // 4. Ensure both paths successfully call revalidatePath("/super-admin/users")
  revalidatePath("/super-admin/users");
}
