import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚡ Checking Admin User & Course Associations...\n");

  // 1. Find the admin user
  const admin = await prisma.user.findFirst({
    where: {
      OR: [
        { email: "admin@solaracademy.org" },
        { role: "ADMIN" },
      ],
    },
  });

  if (!admin) {
    console.error("❌ No admin user found in database!");
    return;
  }

  console.log(`✓ Found Admin Account: [${admin.id}] ${admin.name} (${admin.email}), Role: ${admin.role}`);

  // 2. Count courses before update
  const coursesBefore = await prisma.course.findMany({
    select: { id: true, code: true, title: true, instructorId: true, instructorName: true },
  });
  console.log(`Total courses in database: ${coursesBefore.length}`);
  const unassigned = coursesBefore.filter((c) => !c.instructorId || c.instructorId !== admin.id);
  console.log(`Courses unassigned or assigned to other users: ${unassigned.length}`);

  // 3. Update all courses to link to this admin
  const updateResult = await prisma.course.updateMany({
    data: {
      instructorId: admin.id,
      instructorName: admin.name || "Lead Solar Engineer (Director)",
    },
  });

  console.log(`\n✓ Successfully linked ${updateResult.count} courses to Admin User [${admin.id}] (${admin.name})!`);

  // 4. Verify updated courses
  const coursesAfter = await prisma.course.findMany({
    select: {
      id: true,
      code: true,
      title: true,
      instructorId: true,
      instructorName: true,
      isPublished: true,
      status: true,
    },
    orderBy: { code: "asc" },
  });

  console.log("\n================ VERIFIED COURSES ASSIGNED TO ADMIN ================");
  console.table(
    coursesAfter.map((c) => ({
      Code: c.code,
      Title: c.title.slice(0, 35),
      InstructorId: c.instructorId,
      InstructorName: c.instructorName,
      Status: c.status,
      Published: c.isPublished,
    }))
  );
}

main()
  .catch((err) => {
    console.error("Error linking courses to admin:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
