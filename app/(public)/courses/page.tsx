import { getAllCourses } from "@/lib/courses";
import CoursesCatalogClient from "@/components/course/CoursesCatalogClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Accredited Solar & Storage Programs | Subway Schools",
  description: "Browse accredited professional solar engineering courses, hands-on field attachments, and energy storage certifications.",
};

export default async function CoursesCatalogPage() {
  const courses = await getAllCourses();
  return <CoursesCatalogClient initialCourses={courses} />;
}
