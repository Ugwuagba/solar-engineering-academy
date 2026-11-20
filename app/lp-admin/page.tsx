import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { SerializedLandingPage } from "@/lib/landing-page-types";
import LPAdminDashboardClient from "./LPAdminDashboardClient";

export const metadata = {
  title: "Landing Page Studio | Subway Schools",
  description: "Campaign landing page CMS, URL slug manager, and page duplicator.",
};

export default async function LPAdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  const isAuthorized =
    role === Role.LP_EDITOR ||
    role === "LP_EDITOR" ||
    role === Role.PROGRAM_ADMIN ||
    role === "PROGRAM_ADMIN" ||
    role === Role.SUPER_ADMIN ||
    role === "SUPER_ADMIN" ||
    role === Role.ADMIN ||
    role === "ADMIN";

  if (!isAuthorized || !session?.user) {
    redirect("/lp-admin/login");
  }

  const pages = await prisma.landingPage.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  const serializedPages: SerializedLandingPage[] = pages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    isPublished: p.isPublished,
    showPlaceholders: p.showPlaceholders,
    whatsappUrl: p.whatsappUrl,
    metaPixelId: p.metaPixelId,
    content: p.content as any,
    media: p.media as any,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const user = {
    name: session.user.name || "Landing Page Editor",
    email: session.user.email || "",
    role: (session.user.role as string) || "LP_EDITOR",
  };

  return <LPAdminDashboardClient initialPages={serializedPages} user={user} />;
}

