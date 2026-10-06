import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚡ Starting database update to publish all courses and activate all cohorts...\n");

  // 1. Update all courses to isPublished: true and status: 'PUBLISHED'
  const updateCoursesResult = await prisma.course.updateMany({
    data: {
      isPublished: true,
      status: "PUBLISHED",
    },
  });
  console.log(`✓ Updated ${updateCoursesResult.count} courses to isPublished: true and status: 'PUBLISHED'`);

  // 2. Fetch all courses with their cohorts
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      code: true,
      title: true,
      isPublished: true,
      status: true,
      cohorts: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
    orderBy: { code: "asc" },
  });

  // 3. Update all existing cohorts to be currently active (startDate: Oct 1, 2026; endDate: Dec 31, 2026)
  const currentActiveStart = new Date("2026-10-01T00:00:00Z");
  const futureEnd = new Date("2026-12-31T23:59:59Z");

  const updateCohortsResult = await prisma.cohort.updateMany({
    data: {
      startDate: currentActiveStart,
      endDate: futureEnd,
    },
  });
  console.log(`✓ Updated ${updateCohortsResult.count} cohorts: startDate=${currentActiveStart.toISOString()}, endDate=${futureEnd.toISOString()}`);

  // 4. Ensure every course has at least 2 active cohorts
  let addedCohorts = 0;
  for (const c of courses) {
    if (c.cohorts.length === 0) {
      await prisma.cohort.createMany({
        data: [
          {
            courseId: c.id,
            name: `${c.code} • October - December 2026 Active Cohort`,
            startDate: currentActiveStart,
            endDate: futureEnd,
            maxCapacity: 35,
          },
          {
            courseId: c.id,
            name: `${c.code} • Comprehensive Masterclass Cohort`,
            startDate: currentActiveStart,
            endDate: futureEnd,
            maxCapacity: 40,
          },
        ],
      });
      addedCohorts += 2;
    }
  }
  if (addedCohorts > 0) {
    console.log(`✓ Created ${addedCohorts} additional active cohorts for courses without cohorts`);
  }

  // 5. Verify and display the results
  const verifiedCourses = await prisma.course.findMany({
    select: {
      code: true,
      title: true,
      status: true,
      isPublished: true,
      _count: {
        select: {
          modules: true,
          cohorts: true,
        },
      },
      cohorts: {
        select: {
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
    orderBy: { code: "asc" },
  });

  console.log("\n================ VERIFIED ACTIVE COURSES & COHORTS ================");
  console.table(
    verifiedCourses.map((c) => ({
      Code: c.code,
      Title: c.title.slice(0, 35),
      Status: c.status,
      Published: c.isPublished,
      Modules: c._count.modules,
      Cohorts: c._count.cohorts,
      CohortStartDate: c.cohorts[0]?.startDate.toISOString().slice(0, 10) || "N/A",
      CohortEndDate: c.cohorts[0]?.endDate.toISOString().slice(0, 10) || "N/A",
    }))
  );

  console.log(`\n🎉 Verification Complete: ${verifiedCourses.length} courses published and ${updateCohortsResult.count + addedCohorts} cohorts active.`);
}

main()
  .catch((err) => {
    console.error("❌ Error updating courses and cohorts:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
