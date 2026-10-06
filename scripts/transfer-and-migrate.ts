import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

interface EnvConfig {
  destUrl: string;
  sourceUrl: string;
}

function loadEnvConfig(): EnvConfig {
  const envLocalPath = path.join(process.cwd(), ".env.local");
  let destUrl = "";
  let sourceUrl = "";

  if (fs.existsSync(envLocalPath)) {
    const lines = fs.readFileSync(envLocalPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      if (trimmed.startsWith("DATABASE_URL=")) {
        destUrl = trimmed.replace("DATABASE_URL=", "").replace(/^["']|["']$/g, "").trim();
      } else if (trimmed.startsWith("NEON_DATABASE_URL=")) {
        sourceUrl = trimmed.replace("NEON_DATABASE_URL=", "").replace(/^["']|["']$/g, "").trim();
      }
    }
  }

  // Fallbacks
  destUrl = destUrl || process.env.DATABASE_URL || "";
  sourceUrl = sourceUrl || process.env.NEON_DATABASE_URL || "";

  return { destUrl, sourceUrl };
}

function mask(url: string): string {
  try {
    const p = new URL(url);
    p.password = "****";
    return p.toString();
  } catch {
    return url.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:****@");
  }
}

async function transferData() {
  console.log("=================================================");
  console.log("   DATABASE DATA TRANSFER & MIGRATION SCRIPT");
  console.log("=================================================\n");

  const { destUrl, sourceUrl } = loadEnvConfig();

  console.log(`🎯 Destination (DATABASE_URL): ${destUrl ? mask(destUrl) : "NOT FOUND"}`);
  console.log(`📦 Source (NEON_DATABASE_URL): ${sourceUrl ? mask(sourceUrl) : "NOT FOUND (Will use backup-neon-data.json)"}\n`);

  if (!destUrl) {
    console.error("❌ Error: DATABASE_URL is not defined in .env.local");
    process.exit(1);
  }

  if (destUrl.includes("ep-sparkling-cherry-b55v940o")) {
    console.warn("⚠️ Warning: DATABASE_URL still points to the old quota-exceeded Neon endpoint!");
    console.warn("Please make sure you have saved .env.local with your new Railway DATABASE_URL.\n");
  }

  // Load dataset from backup-neon-data.json (which was successfully dumped from Neon)
  const backupPath = path.join(process.cwd(), "backup-neon-data.json");
  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup file not found at ${backupPath}`);
    process.exit(1);
  }

  const rawBackup = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
  const data = rawBackup.data || {};

  const destPrisma = new PrismaClient({
    datasources: { db: { url: destUrl } },
  });

  const summary: { Model: string; Transferred: number; Skipped: number; Status: string }[] = [];

  try {
    console.log("🚀 Beginning migration of records to destination database...\n");

    // 1. Transfer Users
    const users: any[] = data.User || [];
    let userSuccess = 0;
    let userSkipped = 0;
    console.log(`👤 Transferring ${users.length} Users...`);

    for (const u of users) {
      try {
        await destPrisma.user.upsert({
          where: { id: u.id },
          update: {
            name: u.name,
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role,
            isEmailVerified: u.isEmailVerified,
            updatedAt: new Date(u.updatedAt || u.createdAt || Date.now()),
          },
          create: {
            id: u.id,
            name: u.name,
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role,
            isEmailVerified: u.isEmailVerified,
            createdAt: new Date(u.createdAt || Date.now()),
            updatedAt: new Date(u.updatedAt || u.createdAt || Date.now()),
          },
        });
        userSuccess++;
      } catch (err: any) {
        console.error(`   Failed to transfer user ${u.email}:`, err.message);
        userSkipped++;
      }
    }
    summary.push({ Model: "User", Transferred: userSuccess, Skipped: userSkipped, Status: "Completed" });

    // 2. Transfer Courses
    const courses: any[] = data.Course || [];
    let courseSuccess = 0;
    let courseSkipped = 0;
    console.log(`📚 Transferring ${courses.length} Courses...`);

    for (const c of courses) {
      try {
        await destPrisma.course.upsert({
          where: { id: c.id },
          update: {
            code: c.code,
            title: c.title,
            slug: c.slug,
            subtitle: c.subtitle,
            description: c.description,
            level: c.level,
            deliveryType: c.deliveryType,
            contactHours: c.contactHours,
            price: c.price,
            originalPrice: c.originalPrice,
            isPublished: c.isPublished,
            status: c.status,
            instructorId: c.instructorId,
            instructorName: c.instructorName,
            whatYoullLearn: c.whatYoullLearn,
            includesList: c.includesList,
            targetAudience: c.targetAudience || [],
            requirements: c.requirements || [],
            thumbnailUrl: c.thumbnailUrl,
            promoVideoUrl: c.promoVideoUrl,
            badge: c.badge,
            order: c.order || 0,
            updatedAt: new Date(c.updatedAt || c.createdAt || Date.now()),
          },
          create: {
            id: c.id,
            code: c.code,
            title: c.title,
            slug: c.slug,
            subtitle: c.subtitle,
            description: c.description,
            level: c.level,
            deliveryType: c.deliveryType,
            contactHours: c.contactHours,
            price: c.price,
            originalPrice: c.originalPrice,
            isPublished: c.isPublished,
            status: c.status,
            instructorId: c.instructorId,
            instructorName: c.instructorName,
            whatYoullLearn: c.whatYoullLearn,
            includesList: c.includesList,
            targetAudience: c.targetAudience || [],
            requirements: c.requirements || [],
            thumbnailUrl: c.thumbnailUrl,
            promoVideoUrl: c.promoVideoUrl,
            badge: c.badge,
            order: c.order || 0,
            createdAt: new Date(c.createdAt || Date.now()),
            updatedAt: new Date(c.updatedAt || c.createdAt || Date.now()),
          },
        });
        courseSuccess++;
      } catch (err: any) {
        console.error(`   Failed to transfer course ${c.code}:`, err.message);
        courseSkipped++;
      }
    }
    summary.push({ Model: "Course", Transferred: courseSuccess, Skipped: courseSkipped, Status: "Completed" });

    // 3. Transfer Enrollments
    const enrollments: any[] = data.Enrollment || [];
    let enrollSuccess = 0;
    let enrollSkipped = 0;
    console.log(`🎓 Transferring ${enrollments.length} Enrollments...`);

    for (const e of enrollments) {
      try {
        await destPrisma.enrollment.upsert({
          where: { id: e.id },
          update: {
            userId: e.userId,
            courseId: e.courseId,
            cohortId: e.cohortId,
            status: e.status,
            progressPercent: e.progressPercent,
            amountPaid: e.amountPaid,
            updatedAt: new Date(e.updatedAt || e.createdAt || Date.now()),
          },
          create: {
            id: e.id,
            userId: e.userId,
            courseId: e.courseId,
            cohortId: e.cohortId,
            status: e.status,
            progressPercent: e.progressPercent,
            amountPaid: e.amountPaid,
            enrolledAt: new Date(e.enrolledAt || e.createdAt || Date.now()),
            createdAt: new Date(e.createdAt || Date.now()),
            updatedAt: new Date(e.updatedAt || e.createdAt || Date.now()),
          },
        });
        enrollSuccess++;
      } catch (err: any) {
        console.error(`   Failed to transfer enrollment ${e.id}:`, err.message);
        enrollSkipped++;
      }
    }
    summary.push({ Model: "Enrollment", Transferred: enrollSuccess, Skipped: enrollSkipped, Status: "Completed" });

    // 4. Transfer Modules
    const modules: any[] = data.Module || [];
    let modSuccess = 0;
    let modSkipped = 0;
    if (modules.length > 0) {
      console.log(`📑 Transferring ${modules.length} Modules...`);
      for (const m of modules) {
        try {
          await destPrisma.module.upsert({
            where: { id: m.id },
            update: {
              title: m.title,
              sortOrder: m.sortOrder,
              description: m.description,
            },
            create: {
              id: m.id,
              courseId: m.courseId,
              title: m.title,
              sortOrder: m.sortOrder,
              description: m.description,
              createdAt: new Date(m.createdAt || Date.now()),
            },
          });
          modSuccess++;
        } catch (err: any) {
          modSkipped++;
        }
      }
      summary.push({ Model: "Module", Transferred: modSuccess, Skipped: modSkipped, Status: "Completed" });
    }

    // 5. Transfer Lessons
    const lessons: any[] = data.Lesson || [];
    let lessonSuccess = 0;
    let lessonSkipped = 0;
    if (lessons.length > 0) {
      console.log(`🎬 Transferring ${lessons.length} Lessons...`);
      for (const l of lessons) {
        try {
          await destPrisma.lesson.upsert({
            where: { id: l.id },
            update: {
              title: l.title,
              sortOrder: l.sortOrder,
              videoUrl: l.videoUrl,
              durationText: l.durationText,
              durationSec: l.durationSec,
              contentMarkdown: l.contentMarkdown,
              downloadableUrl: l.downloadableUrl,
              technicalSheetUrl: l.technicalSheetUrl,
              isFreePreview: l.isFreePreview,
            },
            create: {
              id: l.id,
              moduleId: l.moduleId,
              title: l.title,
              sortOrder: l.sortOrder,
              videoUrl: l.videoUrl,
              durationText: l.durationText,
              durationSec: l.durationSec,
              contentMarkdown: l.contentMarkdown,
              downloadableUrl: l.downloadableUrl,
              technicalSheetUrl: l.technicalSheetUrl,
              isFreePreview: l.isFreePreview,
              createdAt: new Date(l.createdAt || Date.now()),
            },
          });
          lessonSuccess++;
        } catch (err: any) {
          lessonSkipped++;
        }
      }
      summary.push({ Model: "Lesson", Transferred: lessonSuccess, Skipped: lessonSkipped, Status: "Completed" });
    }

    // 6. Transfer Quizzes
    const quizzes: any[] = data.Quiz || [];
    let quizSuccess = 0;
    let quizSkipped = 0;
    if (quizzes.length > 0) {
      console.log(`📝 Transferring ${quizzes.length} Quizzes...`);
      for (const q of quizzes) {
        try {
          await destPrisma.quiz.upsert({
            where: { id: q.id },
            update: {
              title: q.title,
              passingScore: q.passingScore,
            },
            create: {
              id: q.id,
              moduleId: q.moduleId,
              title: q.title,
              passingScore: q.passingScore,
              createdAt: new Date(q.createdAt || Date.now()),
            },
          });
          quizSuccess++;
        } catch {
          quizSkipped++;
        }
      }
      summary.push({ Model: "Quiz", Transferred: quizSuccess, Skipped: quizSkipped, Status: "Completed" });
    }

    // 7. Transfer Questions
    const questions: any[] = data.Question || [];
    let qSuccess = 0;
    let qSkipped = 0;
    if (questions.length > 0) {
      console.log(`❓ Transferring ${questions.length} Questions...`);
      for (const q of questions) {
        try {
          await destPrisma.question.upsert({
            where: { id: q.id },
            update: {
              text: q.text,
              optionsJson: q.optionsJson,
              correctOptionIndex: q.correctOptionIndex,
              explanation: q.explanation,
            },
            create: {
              id: q.id,
              quizId: q.quizId,
              text: q.text,
              optionsJson: q.optionsJson,
              correctOptionIndex: q.correctOptionIndex,
              explanation: q.explanation,
              createdAt: new Date(q.createdAt || Date.now()),
            },
          });
          qSuccess++;
        } catch {
          qSkipped++;
        }
      }
      summary.push({ Model: "Question", Transferred: qSuccess, Skipped: qSkipped, Status: "Completed" });
    }

    // 8. Transfer OtpVerifications
    const otps: any[] = data.OtpVerification || [];
    let otpSuccess = 0;
    let otpSkipped = 0;
    if (otps.length > 0) {
      console.log(`🔑 Transferring ${otps.length} OTP verifications...`);
      for (const o of otps) {
        try {
          await destPrisma.otpVerification.upsert({
            where: { id: o.id },
            update: {
              email: o.email,
              code: o.code,
              expiresAt: new Date(o.expiresAt),
            },
            create: {
              id: o.id,
              email: o.email,
              code: o.code,
              expiresAt: new Date(o.expiresAt),
              createdAt: new Date(o.createdAt || Date.now()),
            },
          });
          otpSuccess++;
        } catch {
          otpSkipped++;
        }
      }
      summary.push({ Model: "OtpVerification", Transferred: otpSuccess, Skipped: otpSkipped, Status: "Completed" });
    }

    console.log("\n=================================================");
    console.log("   TRANSFER COMPLETION REPORT");
    console.log("=================================================");
    console.table(summary);

    const totalTransferred = summary.reduce((acc, curr) => acc + curr.Transferred, 0);
    console.log(`\n✅ Successfully transferred ${totalTransferred} records to destination database.`);

  } catch (err: any) {
    console.error("❌ Fatal transfer error:", err.message);
    process.exit(1);
  } finally {
    await destPrisma.$disconnect();
  }
}

transferData();
