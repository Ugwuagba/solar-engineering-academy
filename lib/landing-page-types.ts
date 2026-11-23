export interface LandingPageContent {
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  header?: {
    brandName?: string;
    brandTagline?: string;
  };
  hero: {
    eyebrow: string;
    badge: string;
    headline: string;
    highlightedMarketValue?: string;
    subheadline: string;
    ctaText: string;
    urgencyText: string;
  };
  opportunity: {
    introP1: string;
    introP2: string;
    subLead: string;
    checklist: string[];
    followUpP1: string;
    followUpP2: string;
    followUpP3: string;
    calloutBox: string;
  };
  clarity: {
    headline: string;
    leadP1: string;
    leadP2: string;
    questions: string[];
    offerP1: string;
    offerP2: string;
    offerP3: string;
    freeHighlight: string;
    offerP4: string;
    offerP5: string;
    ctaText: string;
    urgencyText: string;
  };
  webinarGains: {
    headline: string;
    cards: Array<{
      num: string;
      title: string;
      desc: string;
    }>;
    bannerHeading: string;
    bannerSubheading: string;
    bannerCtaText: string;
    bannerSubtext: string;
  };
  about: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    paragraphs: string[];
    signatureTitle: string;
    signatureMotto: string;
    ctaText: string;
  };
  footer?: {
    brandLine?: string;
    motto?: string;
    copyright?: string;
  };
}

export interface LandingPageMediaConfig {
  heroImageUrl?: string;
  heroCaption?: string;
  showHeroImage?: boolean;
  videoEmbedUrl?: string;
  videoTitle?: string;
  showVideo?: boolean;
  section2Image1Url?: string;
  showSection2Image1?: boolean;
  section2Image2Url?: string;
  showSection2Image2?: boolean;
  aboutImageUrl?: string;
  showAboutImage?: boolean;
}

export interface SerializedLandingPage {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
  showPlaceholders: boolean;
  whatsappUrl: string;
  metaPixelId?: string | null;
  content: LandingPageContent;
  media: LandingPageMediaConfig;
  createdAt: string;
  updatedAt: string;
}

