import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  LandingPageContent,
  LandingPageMediaConfig,
  SerializedLandingPage,
} from "@/lib/landing-page-types";
import LandingPageView from "./LandingPageView";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const page = await prisma.landingPage.findUnique({
    where: { slug },
  });

  if (!page) {
    return {
      title: "Landing Page Not Found | Subway Schools",
    };
  }

  const content = page.content as unknown as LandingPageContent;
  const media = page.media as unknown as LandingPageMediaConfig;

  const title =
    content?.meta?.title ||
    `${page.title} | Subway Schools`;
  const description =
    content?.meta?.description ||
    "Discover high-impact career and business opportunities with Subway Schools.";
  const keywords = content?.meta?.keywords || [
    "Subway Schools",
    "Solar Engineering Academy",
    "Webinar",
    "Career Opportunities",
  ];

  const ogImage = media?.heroImageUrl || "/images/subway-logo.png";

  return {
    metadataBase: new URL(
      process.env.NEXTAUTH_URL || "https://subwayschools.com"
    ),
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://subwayschools.com/lp/${page.slug}`,
      siteName: "Subway Schools",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function DynamicLandingPage({ params }: PageProps) {
  const { slug } = await params;

  const page = await prisma.landingPage.findUnique({
    where: { slug },
  });

  if (!page) {
    notFound();
  }

  // Auth gate for unpublished / draft landing pages
  if (!page.isPublished) {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;
    const isAuthorizedStaff =
      role === "SUPER_ADMIN" ||
      role === "PROGRAM_ADMIN" ||
      role === "LP_EDITOR" ||
      role === "ADMIN";

    if (!isAuthorizedStaff) {
      notFound();
    }
  }

  const serializedPage: SerializedLandingPage = {
    id: page.id,
    slug: page.slug,
    title: page.title,
    isPublished: page.isPublished,
    showPlaceholders: page.showPlaceholders,
    whatsappUrl: page.whatsappUrl,
    metaPixelId: page.metaPixelId,
    content: page.content as unknown as LandingPageContent,
    media: page.media as unknown as LandingPageMediaConfig,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };

  return <LandingPageView page={serializedPage} />;
}

