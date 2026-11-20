import React from "react";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import {
  LandingPageContent,
  LandingPageMediaConfig,
  SerializedLandingPage,
} from "@/lib/landing-page-types";
import LPEditorClient from "./LPEditorClient";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLandingPage({ params }: EditPageProps) {
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

  if (!session?.user) {
    redirect("/lp-admin/login");
  }

  if (!isAuthorized) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const page = await prisma.landingPage.findUnique({
    where: { id },
  });

  if (!page) {
    notFound();
  }

  const serializedPage: SerializedLandingPage = {
    id: page.id,
    slug: page.slug,
    title: page.title,
    isPublished: page.isPublished,
    showPlaceholders: page.showPlaceholders,
    whatsappUrl: page.whatsappUrl,
    metaPixelId: page.metaPixelId,
    content: (page.content as unknown as LandingPageContent) || {},
    media: (page.media as unknown as LandingPageMediaConfig) || {},
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };

  return <LPEditorClient initialPage={serializedPage} />;
}

