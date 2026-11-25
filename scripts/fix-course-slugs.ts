import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SLUG_UPDATES: Record<string, string> = {
  CIPART2:
    "advanced-commercial-industrial-solar-system-design-installation-maintenance-part-2",
  BATPART2: "advanced-lithium-battery-fabrication-demystified-part-2",
};

async function main() {
  console.log("🔧 Starting safe course slug cleanup...\n");

  for (const [code, newSlug] of Object.entries(SLUG_UPDATES)) {
    const existing = await prisma.course.findUnique({
      where: { code },
      select: { id: true, code: true, title: true, slug: true },
    });

    if (!existing) {
      console.log(`⚠️  Course [${code}] not found — skipping.`);
      continue;
    }

    if (existing.slug === newSlug) {
      console.log(`✓ [${code}] Slug already clean: "${newSlug}"`);
      continue;
    }

    await prisma.course.update({
      where: { code },
      data: { slug: newSlug },
    });
    console.log(
      `✅ [${code}] Updated slug:\n   Old: "${existing.slug}"\n   New: "${newSlug}"`
    );
  }

  const allCourses = await prisma.course.findMany({
    select: { code: true, slug: true, title: true },
    orderBy: { order: "asc" },
  });

  console.log("\n📋 Updated Course Code -> Slug Table:");
  console.table(allCourses);
}

main()
  .catch((err) => {
    console.error("❌ Failed to update course slugs:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

