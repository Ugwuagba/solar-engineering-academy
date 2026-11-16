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
  ];

  if (!validRoles.includes(role)) {
    throw new Error(`Invalid staff role: ${roleRaw}. Allowed roles: PROGRAM_ADMIN, INSTRUCTOR, SUPER_ADMIN.`);
  }

  // 3. Generate a temporary secure password and hash it using bcrypt
  const tempPassword = `Staff#${crypto.randomBytes(5).toString("hex")}!`;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(tempPassword, salt);

  // 4. Execute atomic Prisma transaction: create User & AuditLog entry
  const result = await prisma.$transaction(async (tx) => {
    // Check if user already exists
    const existingUser = await tx.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error(`A user with email "${email}" already exists in the system.`);
    }

    const newUser = await tx.user.create({
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

    const auditLog = await tx.auditLog.create({
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

    return { newUser, auditLog, tempPassword };
  });

  // 5. Revalidate the /super-admin/users path
  revalidatePath("/super-admin/users");
}
