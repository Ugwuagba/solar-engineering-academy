import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import prisma from "@/lib/db";
import { CourseStatus } from "@prisma/client";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const courseSlugs: Record<string, string> = {};
  try {
    const footerCourses = await prisma.course.findMany({
      where: {
        code: { in: ["SI101", "COMSIT", "CIP1", "LBF1"] },
        OR: [{ status: CourseStatus.PUBLISHED }, { isPublished: true }],
      },
      select: { code: true, slug: true },
    });
    for (const c of footerCourses) {
      if (c.code && c.slug) {
        courseSlugs[c.code] = c.slug;
      }
    }
  } catch (err) {
    console.error("[PublicLayout Footer Query Error]:", err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer courseSlugs={courseSlugs} />
    </div>
  );
}
