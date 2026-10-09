import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Starting cleanup of dummy/placeholder seed courses...\n");

  // All placeholder courses created with dummy codes and prices (200, 220, 340, 380, 400, 450)
  const dummyCodes = [
    "BATT201",
    "MINI301",
    "CIGID201",
    "FAST301",
    "CCTV101",
    "GEN101",
    "SOLAR201",
    "SOLAR101",
  ];

  console.log(`Checking for placeholder courses with codes: ${dummyCodes.join(", ")}`);

  const coursesToDelete = await prisma.course.findMany({
    where: {
      code: { in: dummyCodes },
    },
    select: {
      id: true,
      code: true,
      title: true,
      price: true,
    },
  });

  console.log(`Found ${coursesToDelete.length} placeholder course(s) to remove:`);
  for (const c of coursesToDelete) {
    console.log(` - [${c.code}] ${c.title} (Price: ₦${c.price})`);
  }

  if (coursesToDelete.length === 0) {
    console.log("No placeholder courses found. Database is already clean!");
    return;
  }

  // Delete related records and courses
  for (const c of coursesToDelete) {
    try {
      console.log(`Deleting course [${c.code}] (id: ${c.id})...`);
      
      // Delete enrollments for this course
      await prisma.enrollment.deleteMany({
        where: { courseId: c.id },
      });

      // Delete certificates for this course
      await prisma.certificate.deleteMany({
        where: { courseId: c.id },
      });

      // Delete cohorts for this course
      await prisma.cohort.deleteMany({
        where: { courseId: c.id },
      });

      // Delete lessons & quizzes for modules of this course
      const modules = await prisma.module.findMany({
        where: { courseId: c.id },
        select: { id: true },
      });

      for (const mod of modules) {
        // Delete quiz attempts & questions
        const quiz = await prisma.quiz.findUnique({
          where: { moduleId: mod.id },
          select: { id: true },
        });
        if (quiz) {
          await prisma.quizAttempt.deleteMany({ where: { quizId: quiz.id } });
          await prisma.question.deleteMany({ where: { quizId: quiz.id } });
          await prisma.quiz.delete({ where: { id: quiz.id } });
        }

        // Delete progresses and lessons
        const lessons = await prisma.lesson.findMany({
          where: { moduleId: mod.id },
          select: { id: true },
        });
        for (const l of lessons) {
          await prisma.progress.deleteMany({ where: { lessonId: l.id } });
          await prisma.lessonProgress.deleteMany({ where: { lessonId: l.id } });
        }
        await prisma.lesson.deleteMany({ where: { moduleId: mod.id } });
      }

      await prisma.module.deleteMany({
        where: { courseId: c.id },
      });

      // Finally delete the course
      await prisma.course.delete({
        where: { id: c.id },
      });

      console.log(`✓ Successfully deleted course [${c.code}]`);
    } catch (err: any) {
      console.error(`Failed to hard-delete [${c.code}], setting isPublished=false and status='DRAFT':`, err.message);
      await prisma.course.update({
        where: { id: c.id },
        data: {
          isPublished: false,
          status: "DRAFT",
        },
      });
    }
  }

  // Verify remaining courses
  const remainingCourses = await prisma.course.findMany({
    select: {
      code: true,
      title: true,
      price: true,
      isPublished: true,
      status: true,
      thumbnailUrl: true,
    },
    orderBy: { createdAt: "desc" },
  });

  console.log("\n================ REMAINING AUTHENTIC COURSES ================");
  console.table(
    remainingCourses.map((c) => ({
      code: c.code,
      title: c.title.slice(0, 35),
      price: `₦${Number(c.price).toLocaleString()}`,
      status: c.status,
      isPublished: c.isPublished,
      hasThumb: Boolean(c.thumbnailUrl),
    }))
  );
  console.log(`\n🎉 Total authentic courses remaining in database: ${remainingCourses.length}`);
}

main()
  .catch((e) => {
    console.error("Cleanup error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
