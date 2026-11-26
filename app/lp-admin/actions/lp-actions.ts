"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  LandingPageContent,
  LandingPageMediaConfig,
} from "@/lib/landing-page-types";

const RESERVED_SLUGS = [
  "admin",
  "login",
  "api",
  "dashboard",
  "super-admin",
  "program-admin",
  "courses",
  "classroom",
  "instructor",
  "lp-admin",
  "lp",
  "auth",
];

export async function requireLPEditorSession() {
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
    throw new Error("Unauthorized: Landing page editor permissions required.");
  }

  return session;
}

export async function sanitizeSlug(input: string): Promise<string> {
  if (!input || typeof input !== "string") {
    throw new Error("URL slug is required.");
  }

  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    throw new Error("Invalid URL slug. Please provide letters, numbers, or dashes.");
  }

  if (RESERVED_SLUGS.includes(slug)) {
    throw new Error(`The slug '${slug}' is reserved by the system. Please pick a different name.`);
  }

  return slug;
}

export async function createLandingPage(data: {
  title: string;
  slug: string;
  whatsappUrl?: string;
}) {
  await requireLPEditorSession();

  const title = data.title?.trim();
  if (!title) {
    throw new Error("Page title is required.");
  }

  const cleanSlug = await sanitizeSlug(data.slug);

  const existing = await prisma.landingPage.findUnique({
    where: { slug: cleanSlug },
  });

  if (existing) {
    throw new Error(`A landing page with the URL /lp/${cleanSlug} already exists.`);
  }

  // Get master page to copy default content structure
  const master = await prisma.landingPage.findFirst({
    where: { slug: "solar" },
  });

  const defaultContent = master?.content || {
    hero: {
      eyebrow: "SUBWAY SCHOOLS PRESENTS",
      badge: "FREE SOLAR ENERGY CAREER & BUSINESS WEBINAR",
      headline:
        "TAP FROM THE $268.93 BILLION OF SOLAR ENERGY MARKET VALUE WHEN YOU ATTEND THIS WEBINAR",
      subheadline:
        "Discover How to Build a Successful Career in the Solar Energy Industry and Make a Fortune For Yourself Quick.",
      ctaText: "JOIN THE FREE WEBINAR",
      urgencyText: "We are starting the webinar soonest…. Don't miss it…",
    },
    opportunity: {
      introP1:
        "It's no longer a news that electricity is essential to homes, businesses, industries, hospitals, schools, and virtually every aspect of modern life.",
      introP2:
        "As more individuals and organisations seek reliable alternative power solutions, solar energy is creating job and career opportunities for people with the right technical knowledge and practical skills.",
      subLead: "Think about it:",
      checklist: [
        "Homes need reliable solar power solutions.",
        "Businesses need alternative electricity systems to reduce dependence on conventional power.",
        "Industries require experienced professionals to design and manage larger energy systems.",
        "Solar companies need competent technicians, installers, designers, and engineers.",
        "Entrepreneurs have opportunities to establish and grow businesses in the renewable energy sector.",
      ],
      followUpP1:
        "But there's a difference between being interested in solar energy and having the professional skills to work in the industry.",
      followUpP2:
        "The opportunity is growing. The question is: will you develop the skills to become part of it?",
      followUpP3:
        "The world is moving towards renewable energy, and the demand for skilled solar professionals continues to create new opportunities.",
      calloutBox:
        "Whether you are an electrician, engineer, graduate, technician, entrepreneur, or someone looking to acquire a valuable professional skill, this is your opportunity to discover what the solar energy industry has to offer.",
    },
    clarity: {
      headline:
        "Before You Invest in Solar Training, Get the Knowledge You Need to Make the Right Decision.",
      leadP1: "Choosing a professional training programme is an important decision.",
      leadP2: "You probably have questions:",
      questions: [
        "What exactly does solar installation involve?",
        "What skills do I need to become a solar professional?",
        "Can I build a career or business in the solar industry?",
        "What is the difference between basic solar installation and professional solar engineering?",
        "Where should I begin if I have little or no experience?",
        "How can I improve my existing electrical or technical skills?",
      ],
      offerP1: "We understand these concerns.",
      offerP2:
        "That's why Subway Schools is inviting you to a special solar energy webinar designed to introduce you to the industry, help you understand the available opportunities, and show you the skills required to build a future in this field and make a fortune for yourself.",
      offerP3:
        "This is an opportunity to learn, ask questions, and gain clarity before deciding on your next step.",
      freeHighlight: "And I can tell you that it's absolutely FREE.",
      offerP4: "You don't have to enroll in a course to attend the webinar.",
      offerP5:
        "Come with your questions. Leave with a better understanding of the opportunities ahead.",
      ctaText: "JOIN THE FREE WEBINAR",
      urgencyText: "We are starting the webinar soonest…. Don't miss it…",
    },
    webinarGains: {
      headline: "What Will You Gain From Attending This Webinar?",
      cards: [
        {
          num: "01",
          title: "Discover Opportunities in the Solar Energy Industry:",
          desc: "Understand the different areas of the solar energy industry and the opportunities available to skilled individuals.",
        },
        {
          num: "02",
          title: "Understand the Skills Required to Become a Solar Professional:",
          desc: "Discover the technical knowledge involved in solar system design, installation, maintenance, troubleshooting, and energy storage.",
        },
        {
          num: "03",
          title: "Explore Career and Business Opportunities:",
          desc: "Learn how solar energy skills can create opportunities in employment, contracting, freelance projects, entrepreneurship, and business expansion.",
        },
        {
          num: "04",
          title: "Understand How Solar Systems Work:",
          desc: "Get introduced to the major components of solar energy systems, including solar panels, inverters, batteries, charge controllers, Earthing and other essential equipment.",
        },
        {
          num: "05",
          title: "Discover the Right Learning Path for You:",
          desc: "Whether you are a beginner, electrician, technician, engineer, or business owner, understand the training areas that may suit your background and goals.",
        },
        {
          num: "06",
          title: "Interact With Experienced Professionals:",
          desc: "Get the opportunity to ask questions, clarify your concerns, and gain insights into the realities of working in the solar energy industry.",
        },
      ],
      bannerHeading:
        "One webinar could give you the clarity you need to take your next professional step.",
      bannerSubheading:
        "Join Subway Schools for an insightful webinar where you will discover the opportunities, essential technical skills, business possibilities, and professional training pathways available in the solar energy industry.",
      bannerCtaText: "JOIN THE FREE WEBINAR",
      bannerSubtext:
        "Join our WhatsApp group to receive your webinar date, time, access link, and important announcements.",
    },
    about: {
      eyebrow: "ABOUT SUBWAY SCHOOLS",
      headline: "THE BIGGER DREAM:",
      subheadline: "A GLOBAL HOME FOR LEARNING, GROWTH AND OPPORTUNITY",
      paragraphs: [
        "Every great institution begins with a dream.",
        "But some dreams are too big to be restricted by geographical boundaries, industries or professional limitations.",
        "At Subway Schools, we started with a passion for technical education, particularly in the power and renewable energy sector.",
        "However, as our vision continues to grow, we have come to realise that our responsibility and potential impact must go far beyond one industry.",
        "We dream of a future where a young person searching for direction, a professional seeking career advancement, an entrepreneur looking to acquire new skills, or an individual simply passionate about learning can find a place at Subway Schools.",
        "We want to build a platform where people can access courses in virtually every field of human endeavour, learn from knowledgeable instructors, develop practical skills and discover opportunities they may never have imagined possible.",
        "Our ambition is to make Subway Schools a global destination for learning, where geographical location, professional background or previous experience does not determine how far someone can go.",
        "We understand that behind every person seeking education is a dream, a challenge, a family, a responsibility or a future waiting to be transformed.",
        "That is why we do not see education merely as the transfer of knowledge.",
        "We see it as an opportunity to unlock human potential, create possibilities, empower generations and give people the confidence to pursue bigger dreams.",
        "We want to be remembered not just for the courses we offer, but for the lives we touch, the opportunities we create, the professionals we develop and the generations we inspire.",
        "Our dream is simple but powerful: to build an educational institution whose impact will be felt across industries, communities, countries and generations.",
        "Subway Schools is not just preparing people for today's opportunities; we are building a platform to prepare generations for the opportunities of tomorrow.",
      ],
      signatureTitle: "Subway Schools",
      signatureMotto: "Changing Lives, One Student at a Time.",
      ctaText: "JOIN THE FREE WEBINAR",
    },
    footer: {
      brandLine: "Subway Schools • Subway Energy Limited (RC: 1837154)",
      motto: "Changing Lives, One Student at a Time.",
      copyright: "© 2026 Subway Energy Limited. All Rights Reserved.",
    },
  };

  const newPage = await prisma.landingPage.create({
    data: {
      title,
      slug: cleanSlug,
      isPublished: true,
      showPlaceholders: false,
      whatsappUrl:
        data.whatsappUrl?.trim() ||
        master?.whatsappUrl ||
        "https://chat.whatsapp.com/KOI7BGwsQot4AQgEXce0zF?s=cl&p=i&iam=2",
      content: defaultContent as any,
      media: {
        heroImageUrl: "",
        heroCaption: "",
        showHeroImage: true,
        videoEmbedUrl: "",
        videoTitle: "",
        showVideo: true,
        section2Image1Url: "",
        showSection2Image1: true,
        section2Image2Url: "",
        showSection2Image2: true,
        aboutImageUrl: "",
        showAboutImage: true,
      } as any,
    },
  });

  revalidatePath("/lp-admin");
  revalidatePath("/super-admin/users");
  revalidatePath(`/lp/${cleanSlug}`);

  return { success: true, pageId: newPage.id, slug: newPage.slug };
}

export async function updateLandingPage(
  id: string,
  data: {
    title: string;
    slug: string;
    whatsappUrl: string;
    metaPixelId?: string | null;
    isPublished: boolean;
    showPlaceholders: boolean;
    content: LandingPageContent;
    media: LandingPageMediaConfig;
  }
) {
  await requireLPEditorSession();

  const existing = await prisma.landingPage.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Landing page not found.");
  }

  const cleanSlug = await sanitizeSlug(data.slug);

  // If slug changed, check uniqueness
  if (cleanSlug !== existing.slug) {
    const slugConflict = await prisma.landingPage.findFirst({
      where: {
        slug: cleanSlug,
        id: { not: id },
      },
    });

    if (slugConflict) {
      throw new Error(`The URL slug '/lp/${cleanSlug}' is already in use by another page.`);
    }
  }

  const updated = await prisma.landingPage.update({
    where: { id },
    data: {
      title: data.title.trim() || existing.title,
      slug: cleanSlug,
      whatsappUrl: data.whatsappUrl.trim(),
      metaPixelId: data.metaPixelId?.trim() || null,
      isPublished: data.isPublished,
      showPlaceholders: data.showPlaceholders,
      content: data.content as any,
      media: data.media as any,
    },
  });

  revalidatePath("/lp-admin");
  revalidatePath(`/lp-admin/${id}/edit`);
  revalidatePath("/super-admin/users");
  revalidatePath(`/lp/${existing.slug}`);
  revalidatePath(`/lp/${cleanSlug}`);

  return { success: true, page: updated };
}

export async function duplicateLandingPage(
  pageId: string,
  newSlugInput: string,
  newTitleInput: string,
  clearMediaForPlaceholders: boolean = true
) {
  await requireLPEditorSession();

  const source = await prisma.landingPage.findUnique({
    where: { id: pageId },
  });

  if (!source) {
    throw new Error("Source landing page not found.");
  }

  const cleanSlug = await sanitizeSlug(newSlugInput);

  const existing = await prisma.landingPage.findUnique({
    where: { slug: cleanSlug },
  });

  if (existing) {
    throw new Error(`A landing page with slug '/lp/${cleanSlug}' already exists.`);
  }

  const sourceMedia = (source.media as any) || {};
  const newMedia = clearMediaForPlaceholders
    ? {
        heroImageUrl: "",
        heroCaption: "",
        showHeroImage: sourceMedia.showHeroImage !== false,
        videoEmbedUrl: "",
        videoTitle: "",
        showVideo: sourceMedia.showVideo !== false,
        section2Image1Url: "",
        showSection2Image1: sourceMedia.showSection2Image1 !== false,
        section2Image2Url: "",
        showSection2Image2: sourceMedia.showSection2Image2 !== false,
        aboutImageUrl: "",
        showAboutImage: sourceMedia.showAboutImage !== false,
      }
    : source.media;

  const duplicated = await prisma.landingPage.create({
    data: {
      title: newTitleInput.trim() || `${source.title} (Copy)`,
      slug: cleanSlug,
      isPublished: source.isPublished,
      showPlaceholders: false,
      whatsappUrl: source.whatsappUrl,
      metaPixelId: source.metaPixelId,
      content: source.content as any,
      media: newMedia as any,
    },
  });

  revalidatePath("/lp-admin");
  revalidatePath("/super-admin/users");
  revalidatePath(`/lp/${cleanSlug}`);

  return { success: true, pageId: duplicated.id, slug: duplicated.slug };
}

export async function bulkDuplicateLandingPages(
  sourcePageId: string,
  duplicates: Array<{ title: string; slug: string }>,
  clearMediaForPlaceholders: boolean = true
) {
  await requireLPEditorSession();

  if (!duplicates || duplicates.length === 0) {
    throw new Error("Please specify at least one landing page to create.");
  }

  if (duplicates.length > 10) {
    throw new Error("You can create a maximum of 10 pages in a single batch.");
  }

  const source = await prisma.landingPage.findUnique({
    where: { id: sourcePageId },
  });

  if (!source) {
    throw new Error("Source landing page not found.");
  }

  // Sanitize and validate all slugs
  const cleanedEntries: Array<{ title: string; slug: string }> = [];
  const seenSlugs = new Set<string>();

  for (let i = 0; i < duplicates.length; i++) {
    const item = duplicates[i];
    const title = item.title?.trim() || `Campaign Landing Page ${i + 1}`;
    const slug = await sanitizeSlug(item.slug);

    if (seenSlugs.has(slug)) {
      throw new Error(`Duplicate slug detected in batch: '/lp/${slug}'. Each page must have a unique URL.`);
    }
    seenSlugs.add(slug);
    cleanedEntries.push({ title, slug });
  }

  // Check database for any collision
  const existingRecords = await prisma.landingPage.findMany({
    where: {
      slug: { in: Array.from(seenSlugs) },
    },
    select: { slug: true },
  });

  if (existingRecords.length > 0) {
    const conflicts = existingRecords.map((r) => `/lp/${r.slug}`).join(", ");
    throw new Error(`The following URL slugs are already in use: ${conflicts}. Please choose unique names.`);
  }

  const sourceMedia = (source.media as any) || {};
  const newMedia = clearMediaForPlaceholders
    ? {
        heroImageUrl: "",
        heroCaption: "",
        showHeroImage: sourceMedia.showHeroImage !== false,
        videoEmbedUrl: "",
        videoTitle: "",
        showVideo: sourceMedia.showVideo !== false,
        section2Image1Url: "",
        showSection2Image1: sourceMedia.showSection2Image1 !== false,
        section2Image2Url: "",
        showSection2Image2: sourceMedia.showSection2Image2 !== false,
        aboutImageUrl: "",
        showAboutImage: sourceMedia.showAboutImage !== false,
      }
    : source.media;

  // Execute in transaction
  await prisma.$transaction(
    cleanedEntries.map((entry) =>
      prisma.landingPage.create({
        data: {
          title: entry.title,
          slug: entry.slug,
          isPublished: true,
          showPlaceholders: false,
          whatsappUrl: source.whatsappUrl,
          metaPixelId: source.metaPixelId,
          content: source.content as any,
          media: newMedia as any,
        },
      })
    )
  );

  revalidatePath("/lp-admin");
  revalidatePath("/super-admin/users");
  for (const entry of cleanedEntries) {
    revalidatePath(`/lp/${entry.slug}`);
  }

  return { success: true, count: cleanedEntries.length };
}

export async function togglePublishLandingPage(id: string) {
  await requireLPEditorSession();

  const page = await prisma.landingPage.findUnique({
    where: { id },
  });

  if (!page) {
    throw new Error("Landing page not found.");
  }

  const updated = await prisma.landingPage.update({
    where: { id },
    data: {
      isPublished: !page.isPublished,
    },
  });

  revalidatePath("/lp-admin");
  revalidatePath("/super-admin/users");
  revalidatePath(`/lp/${page.slug}`);

  return { success: true, isPublished: updated.isPublished };
}

export async function deleteLandingPage(id: string) {
  await requireLPEditorSession();

  const page = await prisma.landingPage.findUnique({
    where: { id },
  });

  if (!page) {
    throw new Error("Landing page not found.");
  }

  if (page.slug === "solar") {
    throw new Error("The master 'solar' landing page is protected from deletion as it serves as the baseline academy template.");
  }

  await prisma.landingPage.delete({
    where: { id },
  });

  revalidatePath("/lp-admin");
  revalidatePath("/super-admin/users");
  revalidatePath(`/lp/${page.slug}`);

  return { success: true };
}

