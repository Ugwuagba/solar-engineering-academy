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
    },
    create: {
      email: "admin@solaracademy.org",
      name: "Lead Solar Engineer (Director)",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin user ready: ${admin.email}`);

  const student = await prisma.user.upsert({
    where: { email: "student@solaracademy.org" },
    update: {
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      name: "Alex Rivera, EIT",
    },
    create: {
      email: "student@solaracademy.org",
      name: "Alex Rivera, EIT",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
  });
  console.log(`✓ Student user ready: ${student.email}`);

  // 2. Seed Courses, Modules, Lessons, Quizzes, Questions
  for (const courseData of SEED_COURSES) {
    const course = await prisma.course.upsert({
      where: { code: courseData.code },
      update: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        level: courseData.level,
        deliveryType: courseData.deliveryType,
        contactHours: courseData.contactHours,
        price: courseData.price,
        isPublished: courseData.isPublished,
      },
      create: {
        code: courseData.code,
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        level: courseData.level,
        deliveryType: courseData.deliveryType,
        contactHours: courseData.contactHours,
        price: courseData.price,
        isPublished: courseData.isPublished,
      },
    });

    console.log(`\n📚 Populating curriculum for [${course.code}] ${course.title}...`);

    // Clean existing modules for deterministic seeding
    await prisma.module.deleteMany({
      where: { courseId: course.id },
    });

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

    // Cohorts if applicable
    if (courseData.cohorts) {
      await prisma.cohort.deleteMany({ where: { courseId: course.id } });
      for (const cohort of courseData.cohorts) {
        await prisma.cohort.create({
          data: {
            courseId: course.id,
            name: cohort.name,
            startDate: new Date(cohort.startDate),
            endDate: new Date(cohort.endDate),
            maxCapacity: cohort.maxCapacity,
          },
        });
        console.log(`  📅 Cohort scheduled: ${cohort.name}`);
      }
    }

    // Seed active enrollment for demo student in PVOL101
    if (course.code === "PVOL101") {
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
            progressPercent: 25.0,
          },
        });
        console.log(`  🎓 Seeded demo enrollment for student in ${course.code}`);
      }
    }
  }

  console.log("\n✅ Solar Engineering Academy database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding encountered an error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
