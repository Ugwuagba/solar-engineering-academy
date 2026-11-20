import { PrismaClient } from "@prisma/client";
import { LandingPageContent, LandingPageMediaConfig } from "../lib/landing-page-types";

const prisma = new PrismaClient();

const MASTER_CONTENT: LandingPageContent = {
  meta: {
    title: "Free Solar Energy Career & Business Webinar | Subway Schools",
    description:
      "Tap from the $268.93 billion solar energy market. Attend the free Subway Schools webinar and discover how to build a career or business in solar energy.",
    keywords: [
      "Solar Energy Career",
      "Solar Energy Webinar",
      "Solar Business",
      "Subway Schools",
      "Subway Energy Limited",
      "RC 1837154",
      "Solar Installation Training",
      "Renewable Energy Jobs",
      "Solar Industry Opportunities",
    ],
  },
  header: {
    brandName: "SUBWAY SCHOOLS",
    brandTagline: "Subway Energy Limited • RC: 1837154",
  },
  hero: {
    eyebrow: "SUBWAY SCHOOLS PRESENTS",
    badge: "FREE SOLAR ENERGY CAREER & BUSINESS WEBINAR",
    headline:
      "TAP FROM THE $268.93 BILLION OF SOLAR ENERGY MARKET VALUE WHEN YOU ATTEND THIS WEBINAR",
    highlightedMarketValue: "$268.93 BILLION",
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

const MASTER_MEDIA: LandingPageMediaConfig = {
  heroImageUrl: "/images/webinar/webinar-hero.jpg",
  heroCaption: "Subway Energy Practical Field Installation",
  videoEmbedUrl: "",
  videoTitle: "Solar Energy Practical Engineering Preview",
  section2Image1Url: "/images/webinar/webinar-inverters-bank.jpg",
  section2Image2Url: "/images/webinar/webinar-technicians.jpg",
  aboutImageUrl: "/images/webinar/webinar-rooftop-array.jpg",
};

const TEMPLATE_MEDIA: LandingPageMediaConfig = {
  heroImageUrl: "",
  heroCaption: "",
  videoEmbedUrl: "",
  videoTitle: "",
  section2Image1Url: "",
  section2Image2Url: "",
  aboutImageUrl: "",
};

async function main() {
  console.log("Seeding Landing Pages into Database...");

  const WHATSAPP_URL =
    "https://chat.whatsapp.com/KOI7BGwsQot4AQgEXce0zF?s=cl&p=i&iam=2";

  // 1. Master Page: /lp/solar
  const master = await prisma.landingPage.upsert({
    where: { slug: "solar" },
    update: {
      title: "Solar Webinar (Master)",
      isPublished: true,
      showPlaceholders: false,
      whatsappUrl: WHATSAPP_URL,
      content: MASTER_CONTENT as any,
      media: MASTER_MEDIA as any,
    },
    create: {
      slug: "solar",
      title: "Solar Webinar (Master)",
      isPublished: true,
      showPlaceholders: false,
      whatsappUrl: WHATSAPP_URL,
      content: MASTER_CONTENT as any,
      media: MASTER_MEDIA as any,
    },
  });
  console.log(`✓ Master Landing Page seeded: /lp/${master.slug} (ID: ${master.id})`);

  // 2. Template Duplicate: /lp/solar-duplicate-1
  const duplicate = await prisma.landingPage.upsert({
    where: { slug: "solar-duplicate-1" },
    update: {
      title: "Duplicate 1 (Template Ready)",
      isPublished: true,
      showPlaceholders: true,
      whatsappUrl: WHATSAPP_URL,
      content: MASTER_CONTENT as any,
      media: TEMPLATE_MEDIA as any,
    },
    create: {
      slug: "solar-duplicate-1",
      title: "Duplicate 1 (Template Ready)",
      isPublished: true,
      showPlaceholders: true,
      whatsappUrl: WHATSAPP_URL,
      content: MASTER_CONTENT as any,
      media: TEMPLATE_MEDIA as any,
    },
  });
  console.log(`✓ Template Duplicate seeded: /lp/${duplicate.slug} (ID: ${duplicate.id}, showPlaceholders: true)`);

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding landing pages:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

