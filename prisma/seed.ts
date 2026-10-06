import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SEED_COURSES } from "../lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("⚡ Starting Solar Engineering Academy database seed...");

  // 1. Seed Users (Admin and Student)
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash("SolarAdmin2026!", salt);
  const studentPasswordHash = await bcrypt.hash("SolarStudent2026!", salt);

  const admin = await prisma.user.upsert({
    where: { email: "admin@solaracademy.org" },
    update: {
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      name: "Lead Solar Engineer (Director)",
      isEmailVerified: true,
    },
    create: {
      email: "admin@solaracademy.org",
      name: "Lead Solar Engineer (Director)",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      isEmailVerified: true,
    },
  });
  console.log(`✓ Admin user ready: ${admin.email}`);

  const student = await prisma.user.upsert({
    where: { email: "student@solaracademy.org" },
    update: {
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      name: "Alex Rivera, EIT",
      isEmailVerified: true,
    },
    create: {
      email: "student@solaracademy.org",
      name: "Alex Rivera, EIT",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      isEmailVerified: true,
    },
  });
  console.log(`✓ Student user ready: ${student.email}`);

  // 2. Seed Cohorts for all active courses in the database
  const allDbCourses = await prisma.course.findMany();
  console.log(`\n📅 Checking cohorts for ${allDbCourses.length} active database courses...`);

  for (const c of allDbCourses) {
    const cohortCount = await prisma.cohort.count({ where: { courseId: c.id } });
    if (cohortCount === 0) {
      await prisma.cohort.createMany({
        data: [
          {
            courseId: c.id,
            name: `${c.code} • October 2026 Field Attachment Cohort`,
            startDate: new Date("2026-10-15T09:00:00Z"),
            endDate: new Date("2026-12-15T17:00:00Z"),
            maxCapacity: 30,
          },
          {
            courseId: c.id,
            name: `${c.code} • November 2026 Masterclass Cohort`,
            startDate: new Date("2026-11-01T09:00:00Z"),
            endDate: new Date("2027-01-01T17:00:00Z"),
            maxCapacity: 35,
          },
        ],
      });
      console.log(`  ✓ Created 2 active cohorts for [${c.code}] ${c.title}`);
    } else {
      console.log(`  ✓ Retaining existing ${cohortCount} cohorts for [${c.code}]`);
    }
  }

  // 3. Populate curriculum for any course that has 0 modules
  for (const courseData of SEED_COURSES) {
    // Check if course exists by code or slug
    let course = await prisma.course.findFirst({
      where: {
        OR: [
          { code: courseData.code },
          { slug: courseData.slug },
        ],
      },
    });

    if (!course) {
      course = await prisma.course.create({
        data: {
          code: courseData.code,
          title: courseData.title,
          slug: courseData.slug,
          description: courseData.description,
          level: courseData.level,
          deliveryType: courseData.deliveryType,
          contactHours: courseData.contactHours,
          price: courseData.price,
          isPublished: courseData.isPublished,
          status: "PUBLISHED",
        },
      });
      console.log(`\n📚 Created program [${course.code}] ${course.title}...`);
    }

    const existingModules = await prisma.module.count({ where: { courseId: course.id } });
    if (existingModules === 0 && courseData.modules && courseData.modules.length > 0) {
      console.log(`\n📚 Populating curriculum for [${course.code}] (${courseData.modules.length} modules)...`);
      for (const modData of courseData.modules) {
        const moduleRecord = await prisma.module.create({
          data: {
            courseId: course.id,
            title: modData.title,
            sortOrder: modData.sortOrder,
            lessons: {
              create: modData.lessons.map((lesson) => ({
                title: lesson.title,
                sortOrder: lesson.sortOrder,
                videoUrl: lesson.videoUrl,
                durationSec: lesson.durationSec,
                contentMarkdown: lesson.contentMarkdown,
                downloadableUrl: lesson.downloadableUrl || null,
                isFreePreview: lesson.isFreePreview,
              })),
            },
            quiz: {
              create: {
                title: modData.quiz.title,
                passingScore: modData.quiz.passingScore,
                questions: {
                  create: modData.quiz.questions.map((q) => ({
                    text: q.text,
                    optionsJson: JSON.stringify(q.options),
                    correctOptionIndex: q.correctOptionIndex,
                    explanation: q.explanation,
                  })),
                },
              },
            },
          },
        });
        console.log(`  ✓ Module ${moduleRecord.sortOrder}: ${moduleRecord.title} (3 lessons + quiz)`);
      }
    } else {
      console.log(`  ✓ Preserved existing ${existingModules} modules for [${course.code}]`);
    }

    // Seed active demo enrollment for student in first courses if not enrolled
    if (course.code === "SI101" || course.code === "SOLAR101") {
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: student.id,
            courseId: course.id,
          },
        },
      });

      if (!existingEnrollment) {
        await prisma.enrollment.create({
          data: {
            userId: student.id,
            courseId: course.id,
            status: "ACTIVE",
            progressPercent: 30.0,
          },
        });
        console.log(`  🎓 Seeded demo enrollment for student in ${course.code}`);
      }
    }
  }

  console.log("\n✅ Subway Energy & Subway Schools database cohorts and curricula verified!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding encountered an error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
