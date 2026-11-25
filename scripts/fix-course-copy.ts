import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TITLE_UPDATES: Record<string, string> = {
  SGFAB: "Professional Solar Generator Fabrication",
  CIP1: "Introduction to Commercial, Industrial & Mini-Grid Solar Projects",
  CIPART2: "Advanced Commercial & Industrial Solar System Design, Installation & Maintenance – Part 2",
  BATPART2: "Advanced Lithium Battery Fabrication Demystified – Part 2",
  SI102: "Solar Installation 102",
};

const SI101_LEARNING_OUTCOMES: string[] = [
  "Explain the basic concepts of solar energy and understand basic photovoltaic terminologies.",
  "Identify the major components of a photovoltaic system.",
  "Distinguish between different photovoltaic system types and understand the advantages and disadvantages of each.",
  "Understand how each system type affects the cost, sizing, and installation of a solar system.",
  "Explain the relationship between energy sources and electrical loads, and recognize common causes of solar system installation failures.",
  "Understand the reasons why people hesitate to embrace solar energy despite its numerous advantages.",
  "Know the exact factors that determine the size of any solar system installation.",
  "Explain the purpose of a solar power audit and master the steps to a successful professional power audit exercise.",
  "Recognize important roof considerations and different roof types during solar power projects and installations.",
  "Identify the various service-sector and product-oriented business opportunities in the solar industry.",
];

async function main() {
  console.log("🧹 Starting safe, idempotent course copy cleanup...\n");

  for (const [code, newTitle] of Object.entries(TITLE_UPDATES)) {
    const existing = await prisma.course.findUnique({
      where: { code },
      select: { id: true, code: true, title: true },
    });

    if (!existing) {
      console.log(`⚠️  Course [${code}] not found in database — skipping.`);
      continue;
    }

    if (existing.title === newTitle) {
      console.log(`✓ [${code}] Title already clean: "${newTitle}"`);
      continue;
    }

    await prisma.course.update({
      where: { code },
      data: { title: newTitle },
    });
    console.log(`✅ [${code}] Updated title:\n   Old: "${existing.title}"\n   New: "${newTitle}"`);
  }

  // Update SI101 whatYoullLearn JSON string array
  const si101 = await prisma.course.findUnique({
    where: { code: "SI101" },
    select: { id: true, code: true, whatYoullLearn: true },
  });

  if (!si101) {
    console.log("⚠️  Course [SI101] not found in database — skipping learning outcomes.");
  } else {
    const serializedOutcomes = JSON.stringify(SI101_LEARNING_OUTCOMES);
    if (si101.whatYoullLearn === serializedOutcomes) {
      console.log("✓ [SI101] Learning outcomes already clean (10 items).");
    } else {
      await prisma.course.update({
        where: { code: "SI101" },
        data: { whatYoullLearn: serializedOutcomes },
      });
      console.log(`✅ [SI101] Updated whatYoullLearn (${SI101_LEARNING_OUTCOMES.length} cleaned outcomes).`);
    }
  }

  console.log("\n🎉 Safe course copy cleanup complete. Zero slugs, IDs, prices, modules, or enrollments were altered.");
}

main()
  .catch((err) => {
    console.error("❌ Failed to clean course copy:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

