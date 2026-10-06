import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

function getDatabaseUrl(): string {
  const envLocalPath = path.join(process.cwd(), ".env.local");
  let neonUrl = "";
  let databaseUrl = "";

  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      if (trimmed.startsWith("NEON_DATABASE_URL=")) {
        neonUrl = trimmed.replace("NEON_DATABASE_URL=", "").replace(/^["']|["']$/g, "").trim();
      } else if (trimmed.startsWith("DATABASE_URL=")) {
        databaseUrl = trimmed.replace("DATABASE_URL=", "").replace(/^["']|["']$/g, "").trim();
      }
    }
  }

  const resolved =
    neonUrl ||
    process.env.NEON_DATABASE_URL ||
    databaseUrl ||
    process.env.DATABASE_URL ||
    "";

  if (!resolved) {
    throw new Error("No NEON_DATABASE_URL or DATABASE_URL found in .env.local or process.env");
  }

  return resolved;
}

function maskUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.password = "****";
    return parsed.toString();
  } catch {
    return rawUrl.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:****@");
  }
}

async function backupNeonData() {
  console.log("=================================================");
  console.log("   NEON DATABASE LOCAL BACKUP SYSTEM");
  console.log("=================================================\n");

  const dbUrl = getDatabaseUrl();
  console.log(`🔌 Target Database: ${maskUrl(dbUrl)}`);

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

  const backupData: Record<string, any[]> = {};
  const recordCounts: { Model: string; Count: number; Status: string }[] = [];

  try {
    // 1. Fetch defined Prisma models
    const modelsToFetch: { name: string; fetcher: () => Promise<any[]> }[] = [
      { name: "User", fetcher: () => (prisma as any).user?.findMany() || Promise.resolve([]) },
      { name: "Course", fetcher: () => (prisma as any).course?.findMany() || Promise.resolve([]) },
      { name: "Cohort", fetcher: () => (prisma as any).cohort?.findMany() || Promise.resolve([]) },
      { name: "Module", fetcher: () => (prisma as any).module?.findMany() || Promise.resolve([]) },
      { name: "Lesson", fetcher: () => (prisma as any).lesson?.findMany() || Promise.resolve([]) },
      { name: "Quiz", fetcher: () => (prisma as any).quiz?.findMany() || Promise.resolve([]) },
      { name: "Question", fetcher: () => (prisma as any).question?.findMany() || Promise.resolve([]) },
      { name: "Enrollment", fetcher: () => (prisma as any).enrollment?.findMany() || Promise.resolve([]) },
      { name: "Progress", fetcher: () => (prisma as any).progress?.findMany() || Promise.resolve([]) },
      { name: "QuizAttempt", fetcher: () => (prisma as any).quizAttempt?.findMany() || Promise.resolve([]) },
      { name: "Certificate", fetcher: () => (prisma as any).certificate?.findMany() || Promise.resolve([]) },
      { name: "OtpVerification", fetcher: () => (prisma as any).otpVerification?.findMany() || Promise.resolve([]) },
      { name: "LessonProgress", fetcher: () => (prisma as any).lessonProgress?.findMany() || Promise.resolve([]) },
    ];

    for (const m of modelsToFetch) {
      try {
        const rows = await m.fetcher();
        backupData[m.name] = rows;
        recordCounts.push({ Model: m.name, Count: rows.length, Status: "Exported" });
      } catch (err: any) {
        backupData[m.name] = [];
        recordCounts.push({ Model: m.name, Count: 0, Status: `Error: ${err.message?.slice(0, 40)}` });
      }
    }

    // 2. Discover any additional PostgreSQL tables (e.g. Account, Session, VerificationToken)
    try {
      const allTables: any[] = await prisma.$queryRawUnsafe(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          AND table_name NOT LIKE '_prisma%'
        ORDER BY table_name;
      `);

      const knownModelsLower = new Set([
        ...modelsToFetch.map((m) => m.name.toLowerCase()),
        "user", "course", "cohort", "module", "lesson", "quiz", "question",
        "enrollment", "progress", "quizattempt", "certificate", "otpverification", "lessonprogress"
      ]);

      for (const t of allTables) {
        const tableName = t.table_name || t.TABLE_NAME;
        if (!tableName || knownModelsLower.has(tableName.toLowerCase())) continue;

        try {
          const rawRows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "${tableName}";`);
          backupData[tableName] = rawRows;
          recordCounts.push({ Model: tableName, Count: rawRows.length, Status: "Exported (Raw Table)" });
        } catch (err: any) {
          backupData[tableName] = [];
          recordCounts.push({ Model: tableName, Count: 0, Status: `Error: ${err.message?.slice(0, 40)}` });
        }
      }
    } catch (err: any) {
      console.warn("⚠️ Could not introspect additional raw tables:", err.message);
    }

    // 3. Serialize and save to project root: backup-neon-data.json
    const outputPath = path.join(process.cwd(), "backup-neon-data.json");
    const jsonString = JSON.stringify(
      {
        metadata: {
          exportedAt: new Date().toISOString(),
          databaseTarget: maskUrl(dbUrl),
          totalModels: recordCounts.length,
          totalRecords: recordCounts.reduce((acc, curr) => acc + curr.Count, 0),
        },
        data: backupData,
      },
      null,
      2
    );

    fs.writeFileSync(outputPath, jsonString, "utf-8");

    console.log("\n=================================================");
    console.log("   EXPORT SUMMARY REPORT");
    console.log("=================================================");
    console.table(recordCounts);

    const totalRecords = recordCounts.reduce((acc, curr) => acc + curr.Count, 0);
    console.log(`\n📦 Total Records Exported: ${totalRecords}`);
    console.log(`💾 Backup File Saved To: ${outputPath}`);
    console.log(`📊 File Size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);

  } catch (error: any) {
    console.error("\n❌ Fatal backup error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backupNeonData();
