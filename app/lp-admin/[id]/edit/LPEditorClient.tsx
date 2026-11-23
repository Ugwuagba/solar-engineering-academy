"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Trash2,
  Video,
  Image as ImageIcon,
  Settings,
  FileText,
  Plus,
  RefreshCw,
  Eye,
  Info,
} from "lucide-react";
import {
  SerializedLandingPage,
  LandingPageContent,
  LandingPageMediaConfig,
} from "@/lib/landing-page-types";
import { updateLandingPage } from "../../actions/lp-actions";
import VideoEmbedPlayer from "@/app/lp/[slug]/VideoEmbedPlayer";

interface LPEditorClientProps {
  initialPage: SerializedLandingPage;
}

export default function LPEditorClient({ initialPage }: LPEditorClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"settings" | "media" | "copy">(
    "settings"
  );
  const [activeCopySection, setActiveCopySection] = useState<
    "hero" | "opportunity" | "clarity" | "gains" | "about" | "footer"
  >("hero");

  // Core Page Settings State
  const [title, setTitle] = useState(initialPage.title || "");
  const [slug, setSlug] = useState(initialPage.slug || "");
  const [whatsappUrl, setWhatsappUrl] = useState(initialPage.whatsappUrl || "");
  const [metaPixelId, setMetaPixelId] = useState(initialPage.metaPixelId || "");
  const [isPublished, setIsPublished] = useState(initialPage.isPublished);
  const [showPlaceholders, setShowPlaceholders] = useState(
    initialPage.showPlaceholders
  );

  // Media Config State
  const [media, setMedia] = useState<LandingPageMediaConfig>({
    heroImageUrl: initialPage.media?.heroImageUrl || "",
    heroCaption: initialPage.media?.heroCaption || "",
    showHeroImage: initialPage.media?.showHeroImage !== false,
    videoEmbedUrl: initialPage.media?.videoEmbedUrl || "",
    videoTitle: initialPage.media?.videoTitle || "",
    showVideo: initialPage.media?.showVideo !== false,
    section2Image1Url: initialPage.media?.section2Image1Url || "",
    showSection2Image1: initialPage.media?.showSection2Image1 !== false,
    section2Image2Url: initialPage.media?.section2Image2Url || "",
    showSection2Image2: initialPage.media?.showSection2Image2 !== false,
    aboutImageUrl: initialPage.media?.aboutImageUrl || "",
    showAboutImage: initialPage.media?.showAboutImage !== false,
  });

  // Content Sections State
  const [content, setContent] = useState<LandingPageContent>({
    hero: {
      eyebrow: initialPage.content?.hero?.eyebrow || "SUBWAY SCHOOLS PRESENTS",
      badge:
        initialPage.content?.hero?.badge ||
        "FREE SOLAR ENERGY CAREER & BUSINESS WEBINAR",
      headline:
        initialPage.content?.hero?.headline ||
        "TAP FROM THE $268.93 BILLION OF SOLAR ENERGY MARKET VALUE WHEN YOU ATTEND THIS WEBINAR",
      subheadline:
        initialPage.content?.hero?.subheadline ||
        "Discover How to Build a Successful Career in the Solar Energy Industry and Make a Fortune For Yourself Quick.",
      ctaText: initialPage.content?.hero?.ctaText || "JOIN THE FREE WEBINAR",
      urgencyText:
        initialPage.content?.hero?.urgencyText ||
        "We are starting the webinar soonest…. Don't miss it…",
    },
    opportunity: {
      introP1:
        initialPage.content?.opportunity?.introP1 ||
        "It's no longer a news that electricity is essential to homes, businesses, industries, hospitals, schools, and virtually every aspect of modern life.",
      introP2:
        initialPage.content?.opportunity?.introP2 ||
        "As more individuals and organisations seek reliable alternative power solutions, solar energy is creating job and career opportunities for people with the right technical knowledge and practical skills.",
      subLead:
        initialPage.content?.opportunity?.subLead || "Think about it:",
      checklist: initialPage.content?.opportunity?.checklist || [
        "Homes need reliable solar power solutions.",
        "Businesses need alternative electricity systems to reduce dependence on conventional power.",
        "Industries require experienced professionals to design and manage larger energy systems.",
        "Solar companies need competent technicians, installers, designers, and engineers.",
        "Entrepreneurs have opportunities to establish and grow businesses in the renewable energy sector.",
      ],
      followUpP1:
        initialPage.content?.opportunity?.followUpP1 ||
        "But there's a difference between being interested in solar energy and having the professional skills to work in the industry.",
      followUpP2:
        initialPage.content?.opportunity?.followUpP2 ||
        "The opportunity is growing. The question is: will you develop the skills to become part of it?",
      followUpP3:
        initialPage.content?.opportunity?.followUpP3 ||
        "The world is moving towards renewable energy, and the demand for skilled solar professionals continues to create new opportunities.",
      calloutBox:
        initialPage.content?.opportunity?.calloutBox ||
        "Whether you are an electrician, engineer, graduate, technician, entrepreneur, or someone looking to acquire a valuable professional skill, this is your opportunity to discover what the solar energy industry has to offer.",
    },
    clarity: {
      headline:
        initialPage.content?.clarity?.headline ||
        "Before You Invest in Solar Training, Get the Knowledge You Need to Make the Right Decision.",
      leadP1:
        initialPage.content?.clarity?.leadP1 ||
        "Choosing a professional training programme is an important decision.",
      leadP2:
        initialPage.content?.clarity?.leadP2 ||
        "You probably have questions:",
      questions: initialPage.content?.clarity?.questions || [
        "What exactly does solar installation involve?",
        "What skills do I need to become a solar professional?",
        "Can I build a career or business in the solar industry?",
        "What is the difference between basic solar installation and professional solar engineering?",
        "Where should I begin if I have little or no experience?",
        "How can I improve my existing electrical or technical skills?",
      ],
      offerP1:
        initialPage.content?.clarity?.offerP1 ||
        "We understand these concerns.",
      offerP2:
        initialPage.content?.clarity?.offerP2 ||
        "That's why Subway Schools is inviting you to a special solar energy webinar designed to introduce you to the industry, help you understand the available opportunities, and show you the skills required to build a future in this field and make a fortune for yourself.",
      offerP3:
        initialPage.content?.clarity?.offerP3 ||
        "This is an opportunity to learn, ask questions, and gain clarity before deciding on your next step.",
      freeHighlight:
        initialPage.content?.clarity?.freeHighlight ||
        "And I can tell you that it's absolutely FREE.",
      offerP4:
        initialPage.content?.clarity?.offerP4 ||
        "You don't have to enroll in a course to attend the webinar.",
      offerP5:
        initialPage.content?.clarity?.offerP5 ||
        "Come with your questions. Leave with a better understanding of the opportunities ahead.",
      ctaText: initialPage.content?.clarity?.ctaText || "JOIN THE FREE WEBINAR",
      urgencyText:
        initialPage.content?.clarity?.urgencyText ||
        "We are starting the webinar soonest…. Don't miss it…",
    },
    webinarGains: {
      headline:
        initialPage.content?.webinarGains?.headline ||
        "What Will You Gain From Attending This Webinar?",
      cards: initialPage.content?.webinarGains?.cards || [
        {
          num: "01",
          title: "Discover Opportunities in the Solar Energy Industry:",
          desc: "Understand the different areas of the solar energy industry and the opportunities available to skilled individuals.",
        },
        {
          num: "02",
          title:
            "Understand the Skills Required to Become a Solar Professional:",
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
        initialPage.content?.webinarGains?.bannerHeading ||
        "One webinar could give you the clarity you need to take your next professional step.",
      bannerSubheading:
        initialPage.content?.webinarGains?.bannerSubheading ||
        "Join Subway Schools for an insightful webinar where you will discover the opportunities, essential technical skills, business possibilities, and professional training pathways available in the solar energy industry.",
      bannerCtaText:
        initialPage.content?.webinarGains?.bannerCtaText ||
        "JOIN THE FREE WEBINAR",
      bannerSubtext:
        initialPage.content?.webinarGains?.bannerSubtext ||
        "Join our WhatsApp group to receive your webinar date, time, access link, and important announcements.",
    },
    about: {
      eyebrow:
        initialPage.content?.about?.eyebrow || "ABOUT SUBWAY SCHOOLS",
      headline: initialPage.content?.about?.headline || "THE BIGGER DREAM:",
      subheadline:
        initialPage.content?.about?.subheadline ||
        "A GLOBAL HOME FOR LEARNING, GROWTH AND OPPORTUNITY",
      paragraphs: initialPage.content?.about?.paragraphs || [
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
      signatureTitle:
        initialPage.content?.about?.signatureTitle || "Subway Schools",
      signatureMotto:
        initialPage.content?.about?.signatureMotto ||
        "Changing Lives, One Student at a Time.",
      ctaText: initialPage.content?.about?.ctaText || "JOIN THE FREE WEBINAR",
    },
    footer: {
      brandLine:
        initialPage.content?.footer?.brandLine ||
        "Subway Schools • Subway Energy Limited (RC: 1837154)",
      motto:
        initialPage.content?.footer?.motto ||
        "Changing Lives, One Student at a Time.",
      copyright:
        initialPage.content?.footer?.copyright ||
        "© 2026 Subway Energy Limited. All Rights Reserved.",
    },
  });

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  // File input refs
  const heroFileRef = useRef<HTMLInputElement>(null);
  const sec2Img1FileRef = useRef<HTMLInputElement>(null);
  const sec2Img2FileRef = useRef<HTMLInputElement>(null);
  const aboutImgFileRef = useRef<HTMLInputElement>(null);

  // Handle Slug Sanitization
  const handleSlugChange = (raw: string) => {
    const sanitized = raw
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
    setSlug(sanitized);
  };

  // Image Upload Handler (Strict <= 500KB)
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slotKey: keyof LandingPageMediaConfig
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers onChange
    e.target.value = "";

    const MAX_SIZE = 512000; // 500 KB
    if (file.size > MAX_SIZE) {
      alert(
        `File is too large (${Math.round(file.size / 1024)} KB).\nMaximum allowed image upload size is 500 KB to guarantee high-speed page loading.\nPlease resize or compress your image.`
      );
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Invalid file format. Only JPEG, PNG, and WebP are supported.");
      return;
    }

    setUploadingSlot(slotKey);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/lp-admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setMedia((prev) => {
        const toggleKey =
          slotKey === "heroImageUrl"
            ? "showHeroImage"
            : slotKey === "section2Image1Url"
            ? "showSection2Image1"
            : slotKey === "section2Image2Url"
            ? "showSection2Image2"
            : "showAboutImage";

        return {
          ...prev,
          [slotKey]: data.url,
          [toggleKey]: true,
        };
      });

      setSaveMessage({
        type: "success",
        text: `Image uploaded successfully (${Math.round(data.sizeBytes / 1024)} KB)! Remember to click 'Save Changes'.`,
      });
    } catch (err: any) {
      alert(err.message || "An error occurred while uploading the image.");
    } finally {
      setUploadingSlot(null);
    }
  };

  // Save All Changes
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const result = await updateLandingPage(initialPage.id, {
        title: title.trim(),
        slug: slug.trim(),
        whatsappUrl: whatsappUrl.trim(),
        metaPixelId: metaPixelId.trim() || null,
        isPublished,
        showPlaceholders,
        content,
        media,
      });

      if (result.success) {
        setSaveMessage({
          type: "success",
          text: "All landing page changes saved and published live!",
        });
        if (result.page.slug !== initialPage.slug) {
          router.replace(`/lp-admin/${initialPage.id}/edit`);
        }
      }
    } catch (err: any) {
      setSaveMessage({
        type: "error",
        text: err.message || "Failed to save landing page.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/lp-admin"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Back to Studio Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white truncate max-w-[240px] sm:max-w-md">
                  {title || "Untitled Landing Page"}
                </h1>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    isPublished
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {isPublished ? "Live" : "Draft"}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                subwayschools.com/lp/
                <span className="text-amber-400 font-bold">{slug}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center">
            <a
              href={`/lp/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:border-slate-600 shadow-sm"
            >
              <Eye className="w-4 h-4 text-sky-400" />
              <span>Preview Live</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {saveMessage && (
          <div className="max-w-7xl mx-auto mt-2">
            <div
              className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between ${
                saveMessage.type === "success"
                  ? "bg-emerald-950/80 border border-emerald-500/30 text-emerald-300"
                  : "bg-rose-950/80 border border-rose-500/30 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {saveMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{saveMessage.text}</span>
              </div>
              <button
                onClick={() => setSaveMessage(null)}
                className="text-slate-400 hover:text-white text-xs px-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>URL & Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("media")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "media"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media & Video</span>
          </button>

          <button
            onClick={() => setActiveTab("copy")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "copy"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Section Copy</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ============================================================== */}
        {/* TAB 1: SETTINGS, URL & FUNNEL */}
        {/* ============================================================== */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-4xl">
            {/* Master page notice */}
            {initialPage.slug === "solar" && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="font-bold text-amber-300">
                    Master Solar Landing Page Notice
                  </p>
                  <p className="mt-0.5 text-amber-200/80">
                    This is the master template page. The URL slug is currently{" "}
                    <code className="bg-amber-950/80 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                      solar
                    </code>
                    . To maintain existing ad links, avoid changing this slug
                    unless you intentionally want to move the master path.
                  </p>
                </div>
              </div>
            )}

            {/* General Settings Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <span>General Funnel & Identity</span>
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Internal Page Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Solar Webinar (Master)"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Used internally on the dashboard to identify this specific
                    campaign variant.
                  </p>
                </div>

                {/* Locked URL Slug */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Live URL Slug
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 focus-within:border-amber-500 overflow-hidden">
                    <span className="bg-slate-900 text-slate-400 text-xs sm:text-sm font-mono px-3.5 py-2.5 border-r border-slate-800 select-none">
                      subwayschools.com/lp/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="e.g. solar-webinar-01"
                      className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-amber-400 font-mono placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Live URL:{" "}
                    <span className="font-mono text-slate-400">
                      https://subwayschools.com/lp/{slug || "..."}
                    </span>
                  </p>
                </div>

                {/* WhatsApp Group Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    WhatsApp Group Invite Link
                  </label>
                  <input
                    type="url"
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none font-mono transition-colors"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Every &quot;JOIN THE FREE WEBINAR&quot; CTA button across
                    this landing page routes directly to this WhatsApp invite
                    URL.
                  </p>
                </div>

                {/* Meta Pixel ID */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Meta Pixel ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={metaPixelId}
                    onChange={(e) => setMetaPixelId(e.target.value)}
                    placeholder="e.g. 84920491823901"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none font-mono transition-colors"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Allows running individual Facebook/Instagram conversion
                    campaigns tracked specifically to this page variant.
                  </p>
                </div>
              </div>
            </div>

            {/* Visibility & Behavior Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-sky-400" />
                <span>Page Visibility & Media Placeholders</span>
              </h2>

              <div className="space-y-5">
                {/* Publish Toggle */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Publish Landing Page Live
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      When published, anyone with the link can view the page.
                      When draft, only admins and editors can access it.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublished(!isPublished)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isPublished ? "bg-emerald-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isPublished ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Auto-Reflow Layout Information */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Automatic Layout Reflow
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      When empty or toggled OFF in the Media tab, media slots automatically collapse and the page layout reflows seamlessly without any placeholder boxes or empty gaps.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    Auto-Reflow Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MEDIA & VIDEO MANAGER */}
        {/* ============================================================== */}
        {activeTab === "media" && (
          <div className="space-y-8 max-w-5xl">
            {/* Helper Note */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-sky-200 text-xs sm:text-sm flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">
                  Adaptive Layout Reflow
                </p>
                <p className="text-slate-300 mt-0.5">
                  Empty or turned-off media slots are automatically hidden on the live page, and the layout adjusts cleanly.
                </p>
              </div>
            </div>

            {/* Video Manager Card */}
            <div
              className={`bg-slate-900 border rounded-3xl p-6 sm:p-8 space-y-6 transition-all ${
                media.showVideo === false
                  ? "border-slate-800/80 opacity-75"
                  : "border-slate-800"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-400" />
                    <span>Hosted Video Embed Player</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    YouTube / Vimeo / MP4
                  </span>
                </div>

                {/* Per-Slot Video Toggle */}
                <div className="flex items-center gap-3">
                  {media.showVideo === false && (
                    <span className="text-[10px] font-semibold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      Hidden on live page
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 font-medium">
                      Show on live page
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setMedia((prev) => ({
                          ...prev,
                          showVideo: prev.showVideo === false ? true : false,
                        }))
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        media.showVideo !== false ? "bg-emerald-500" : "bg-slate-700"
                      }`}
                      title={
                        media.showVideo !== false
                          ? "Hide video on live page"
                          : "Show video on live page"
                      }
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          media.showVideo !== false ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Video Embed URL
                    </label>
                    <input
                      type="url"
                      value={media.videoEmbedUrl || ""}
                      onChange={(e) =>
                        setMedia((prev) => ({
                          ...prev,
                          videoEmbedUrl: e.target.value,
                          showVideo: true, // auto flip on when URL entered
                        }))
                      }
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none font-mono transition-colors"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Supports standard YouTube watch links, youtu.be shortlinks,
                      YouTube Shorts, Vimeo links, and direct .mp4 files.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Video Title / Label
                    </label>
                    <input
                      type="text"
                      value={media.videoTitle || ""}
                      onChange={(e) =>
                        setMedia((prev) => ({
                          ...prev,
                          videoTitle: e.target.value,
                        }))
                      }
                      placeholder="e.g. Solar Engineering Webinar Intro"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                    />
                  </div>

                  {media.videoEmbedUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setMedia((prev) => ({
                          ...prev,
                          videoEmbedUrl: "",
                          videoTitle: "",
                        }))
                      }
                      className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Video Embed</span>
                    </button>
                  )}
                </div>

                {/* Video Preview Box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Live Video Player Preview
                  </label>
                  {media.videoEmbedUrl ? (
                    <VideoEmbedPlayer
                      url={media.videoEmbedUrl}
                      title={media.videoTitle || "Preview"}
                      className="shadow-md"
                    />
                  ) : (
                    <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                      <Video className="w-8 h-8 text-slate-600 mb-2" />
                      <p className="text-xs font-medium">
                        No video configured yet.
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Paste a YouTube, Vimeo, or MP4 URL on the left to see the
                        live embed player.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4 Image Upload Slots */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-sky-400" />
                    <span>Image Asset Manager (4 Configurable Slots)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Maximum file size is strictly 500 KB per image. Empty or disabled slots auto-hide cleanly on live pages.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Slot 1: Hero Image */}
                <ImageSlotCard
                  title="Hero Section Image"
                  slotKey="heroImageUrl"
                  currentUrl={media.heroImageUrl}
                  caption={media.heroCaption}
                  captionKey="heroCaption"
                  isEnabled={media.showHeroImage !== false}
                  onToggleEnabled={(enabled) =>
                    setMedia((prev) => ({ ...prev, showHeroImage: enabled }))
                  }
                  isUploading={uploadingSlot === "heroImageUrl"}
                  fileInputRef={heroFileRef}
                  onUpload={(e) => handleImageUpload(e, "heroImageUrl")}
                  onClear={() =>
                    setMedia((prev) => ({
                      ...prev,
                      heroImageUrl: "",
                      heroCaption: "",
                    }))
                  }
                  onUrlChange={(url) =>
                    setMedia((prev) => ({
                      ...prev,
                      heroImageUrl: url,
                      showHeroImage: url ? true : prev.showHeroImage,
                    }))
                  }
                  onCaptionChange={(caption) =>
                    setMedia((prev) => ({ ...prev, heroCaption: caption }))
                  }
                />

                {/* Slot 2: Section 2 Field Photo 1 */}
                <ImageSlotCard
                  title="Field Installation Photo 1 (Section 2)"
                  slotKey="section2Image1Url"
                  currentUrl={media.section2Image1Url}
                  isEnabled={media.showSection2Image1 !== false}
                  onToggleEnabled={(enabled) =>
                    setMedia((prev) => ({ ...prev, showSection2Image1: enabled }))
                  }
                  isUploading={uploadingSlot === "section2Image1Url"}
                  fileInputRef={sec2Img1FileRef}
                  onUpload={(e) => handleImageUpload(e, "section2Image1Url")}
                  onClear={() =>
                    setMedia((prev) => ({ ...prev, section2Image1Url: "" }))
                  }
                  onUrlChange={(url) =>
                    setMedia((prev) => ({
                      ...prev,
                      section2Image1Url: url,
                      showSection2Image1: url ? true : prev.showSection2Image1,
                    }))
                  }
                />

                {/* Slot 3: Section 2 Field Photo 2 */}
                <ImageSlotCard
                  title="Field Installation Photo 2 (Section 2)"
                  slotKey="section2Image2Url"
                  currentUrl={media.section2Image2Url}
                  isEnabled={media.showSection2Image2 !== false}
                  onToggleEnabled={(enabled) =>
                    setMedia((prev) => ({ ...prev, showSection2Image2: enabled }))
                  }
                  isUploading={uploadingSlot === "section2Image2Url"}
                  fileInputRef={sec2Img2FileRef}
                  onUpload={(e) => handleImageUpload(e, "section2Image2Url")}
                  onClear={() =>
                    setMedia((prev) => ({ ...prev, section2Image2Url: "" }))
                  }
                  onUrlChange={(url) =>
                    setMedia((prev) => ({
                      ...prev,
                      section2Image2Url: url,
                      showSection2Image2: url ? true : prev.showSection2Image2,
                    }))
                  }
                />

                {/* Slot 4: About Banner Image */}
                <ImageSlotCard
                  title="About & Vision Banner Image"
                  slotKey="aboutImageUrl"
                  currentUrl={media.aboutImageUrl}
                  isEnabled={media.showAboutImage !== false}
                  onToggleEnabled={(enabled) =>
                    setMedia((prev) => ({ ...prev, showAboutImage: enabled }))
                  }
                  isUploading={uploadingSlot === "aboutImageUrl"}
                  fileInputRef={aboutImgFileRef}
                  onUpload={(e) => handleImageUpload(e, "aboutImageUrl")}
                  onClear={() =>
                    setMedia((prev) => ({ ...prev, aboutImageUrl: "" }))
                  }
                  onUrlChange={(url) =>
                    setMedia((prev) => ({
                      ...prev,
                      aboutImageUrl: url,
                      showAboutImage: url ? true : prev.showAboutImage,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SECTION COPY EDITORS */}
        {/* ============================================================== */}
        {activeTab === "copy" && (
          <div className="space-y-6 max-w-5xl">
            {/* Copy Sub-Navigation */}
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
              {(
                [
                  { id: "hero", label: "Hero Header" },
                  { id: "opportunity", label: "Section 2: Opportunity" },
                  { id: "clarity", label: "Section 3: Clarity" },
                  { id: "gains", label: "Section 4: Gains Cards" },
                  { id: "about", label: "Section 5: About & Vision" },
                  { id: "footer", label: "Footer" },
                ] as const
              ).map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveCopySection(sec.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCopySection === sec.id
                      ? "bg-slate-800 text-amber-400 border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Sub-Section 1: Hero */}
            {activeCopySection === "hero" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
                <h3 className="text-base font-bold text-white">
                  Hero Section Copy
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Eyebrow / Organization Tag
                  </label>
                  <input
                    type="text"
                    value={content.hero.eyebrow}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, eyebrow: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Pill Badge Text
                  </label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, badge: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Main Headline
                  </label>
                  <textarea
                    rows={3}
                    value={content.hero.headline}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, headline: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-4 text-sm text-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={content.hero.subheadline}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subheadline: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-4 text-sm text-white focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={content.hero.ctaText}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, ctaText: e.target.value },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Urgency Caption
                    </label>
                    <input
                      type="text"
                      value={content.hero.urgencyText}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, urgencyText: e.target.value },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Section 2: Opportunity */}
            {activeCopySection === "opportunity" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
                <h3 className="text-base font-bold text-white">
                  Section 2: The Opportunity Copy
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Intro Paragraph 1
                  </label>
                  <textarea
                    rows={2}
                    value={content.opportunity.introP1}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        opportunity: {
                          ...prev.opportunity,
                          introP1: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Intro Paragraph 2
                  </label>
                  <textarea
                    rows={2}
                    value={content.opportunity.introP2}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        opportunity: {
                          ...prev.opportunity,
                          introP2: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Sub-Lead (&quot;Think about it:&quot;)
                  </label>
                  <input
                    type="text"
                    value={content.opportunity.subLead}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        opportunity: {
                          ...prev.opportunity,
                          subLead: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                {/* 5 Checklist Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Opportunity Checklist Bullets ({content.opportunity.checklist.length})
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          opportunity: {
                            ...prev.opportunity,
                            checklist: [
                              ...prev.opportunity.checklist,
                              "New opportunity bullet point",
                            ],
                          },
                        }))
                      }
                      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Bullet</span>
                    </button>
                  </div>

                  {content.opportunity.checklist.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 w-5">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const updated = [...content.opportunity.checklist];
                          updated[idx] = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            opportunity: {
                              ...prev.opportunity,
                              checklist: updated,
                            },
                          }));
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.opportunity.checklist.filter(
                            (_, i) => i !== idx
                          );
                          setContent((prev) => ({
                            ...prev,
                            opportunity: {
                              ...prev.opportunity,
                              checklist: updated,
                            },
                          }));
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Follow-Up Paragraph 1
                  </label>
                  <textarea
                    rows={2}
                    value={content.opportunity.followUpP1}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        opportunity: {
                          ...prev.opportunity,
                          followUpP1: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Follow-Up Paragraph 2
                  </label>
                  <textarea
                    rows={2}
                    value={content.opportunity.followUpP2}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        opportunity: {
                          ...prev.opportunity,
                          followUpP2: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Follow-Up Paragraph 3
                  </label>
                  <textarea
                    rows={2}
                    value={content.opportunity.followUpP3}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        opportunity: {
                          ...prev.opportunity,
                          followUpP3: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Bold Callout Box Text
                  </label>
                  <textarea
                    rows={3}
                    value={content.opportunity.calloutBox}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        opportunity: {
                          ...prev.opportunity,
                          calloutBox: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Sub-Section 3: Clarity */}
            {activeCopySection === "clarity" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
                <h3 className="text-base font-bold text-white">
                  Section 3: Clarity & Questions Copy
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Headline
                  </label>
                  <textarea
                    rows={2}
                    value={content.clarity.headline}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        clarity: { ...prev.clarity, headline: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Lead Paragraph 1
                    </label>
                    <textarea
                      rows={2}
                      value={content.clarity.leadP1}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          clarity: { ...prev.clarity, leadP1: e.target.value },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Lead Paragraph 2 (&quot;You probably have questions:&quot;)
                    </label>
                    <textarea
                      rows={2}
                      value={content.clarity.leadP2}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          clarity: { ...prev.clarity, leadP2: e.target.value },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 6 Questions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Questions ({content.clarity.questions.length})
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          clarity: {
                            ...prev.clarity,
                            questions: [
                              ...prev.clarity.questions,
                              "What are the career prospects?",
                            ],
                          },
                        }))
                      }
                      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Question</span>
                    </button>
                  </div>

                  {content.clarity.questions.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 w-5">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={q}
                        onChange={(e) => {
                          const updated = [...content.clarity.questions];
                          updated[idx] = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            clarity: { ...prev.clarity, questions: updated },
                          }));
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.clarity.questions.filter(
                            (_, i) => i !== idx
                          );
                          setContent((prev) => ({
                            ...prev,
                            clarity: { ...prev.clarity, questions: updated },
                          }));
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Offer Explanation (Paragraph 2)
                  </label>
                  <textarea
                    rows={3}
                    value={content.clarity.offerP2}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        clarity: { ...prev.clarity, offerP2: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-rose-400 mb-1.5">
                    Bold Red Free Highlight
                  </label>
                  <input
                    type="text"
                    value={content.clarity.freeHighlight}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        clarity: {
                          ...prev.clarity,
                          freeHighlight: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm text-rose-300 font-semibold focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Sub-Section 4: Gains */}
            {activeCopySection === "gains" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <h3 className="text-base font-bold text-white">
                  Section 4: Webinar Gains Cards & Bottom Banner
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Section Headline
                  </label>
                  <input
                    type="text"
                    value={content.webinarGains.headline}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        webinarGains: {
                          ...prev.webinarGains,
                          headline: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Gains Cards ({content.webinarGains.cards.length})
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.webinarGains.cards.map((card, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400">
                            Card {card.num || `0${idx + 1}`}
                          </span>
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const updated = [...content.webinarGains.cards];
                              updated[idx] = {
                                ...updated[idx],
                                title: e.target.value,
                              };
                              setContent((prev) => ({
                                ...prev,
                                webinarGains: {
                                  ...prev.webinarGains,
                                  cards: updated,
                                },
                              }));
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={card.desc}
                            onChange={(e) => {
                              const updated = [...content.webinarGains.cards];
                              updated[idx] = {
                                ...updated[idx],
                                desc: e.target.value,
                              };
                              setContent((prev) => ({
                                ...prev,
                                webinarGains: {
                                  ...prev.webinarGains,
                                  cards: updated,
                                },
                              }));
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Banner */}
                <div className="border-t border-slate-800 pt-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Webinar Bottom Banner
                  </h4>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">
                      Banner Heading
                    </label>
                    <input
                      type="text"
                      value={content.webinarGains.bannerHeading}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          webinarGains: {
                            ...prev.webinarGains,
                            bannerHeading: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">
                      Banner Subheading
                    </label>
                    <textarea
                      rows={2}
                      value={content.webinarGains.bannerSubheading}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          webinarGains: {
                            ...prev.webinarGains,
                            bannerSubheading: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Section 5: About & Vision */}
            {activeCopySection === "about" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <h3 className="text-base font-bold text-white">
                  Section 5: About Subway Schools & Vision Copy
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Eyebrow
                    </label>
                    <input
                      type="text"
                      value={content.about.eyebrow}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, eyebrow: e.target.value },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={content.about.headline}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, headline: e.target.value },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Subheadline
                    </label>
                    <input
                      type="text"
                      value={content.about.subheadline}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          about: { ...prev.about, subheadline: e.target.value },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 13 Paragraphs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Vision Story Paragraphs ({content.about.paragraphs.length})
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((prev) => ({
                          ...prev,
                          about: {
                            ...prev.about,
                            paragraphs: [
                              ...prev.about.paragraphs,
                              "New story paragraph...",
                            ],
                          },
                        }))
                      }
                      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Paragraph</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {content.about.paragraphs.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-xs font-bold text-slate-500 w-5 pt-2">
                          #{idx + 1}
                        </span>
                        <textarea
                          rows={2}
                          value={p}
                          onChange={(e) => {
                            const updated = [...content.about.paragraphs];
                            updated[idx] = e.target.value;
                            setContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, paragraphs: updated },
                            }));
                          }}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none leading-relaxed"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = content.about.paragraphs.filter(
                              (_, i) => i !== idx
                            );
                            setContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, paragraphs: updated },
                            }));
                          }}
                          className="p-2 text-slate-500 hover:text-rose-400 pt-2.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Signature Brand Name
                    </label>
                    <input
                      type="text"
                      value={content.about.signatureTitle}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          about: {
                            ...prev.about,
                            signatureTitle: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Signature Motto
                    </label>
                    <input
                      type="text"
                      value={content.about.signatureMotto}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          about: {
                            ...prev.about,
                            signatureMotto: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none italic"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Section 6: Footer */}
            {activeCopySection === "footer" && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
                <h3 className="text-base font-bold text-white">
                  Footer Section Copy
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Brand & Registration Line
                  </label>
                  <input
                    type="text"
                    value={content.footer?.brandLine || ""}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, brandLine: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Motto Line
                  </label>
                  <input
                    type="text"
                    value={content.footer?.motto || ""}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, motto: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none italic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={content.footer?.copyright || ""}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        footer: { ...prev.footer, copyright: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Image Slot Sub-Component
// ---------------------------------------------------------------------------
interface ImageSlotCardProps {
  title: string;
  slotKey: string;
  currentUrl?: string;
  caption?: string;
  captionKey?: string;
  isEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onUrlChange: (url: string) => void;
  onCaptionChange?: (caption: string) => void;
}

function ImageSlotCard({
  title,
  currentUrl,
  caption,
  captionKey,
  isEnabled,
  onToggleEnabled,
  isUploading,
  fileInputRef,
  onUpload,
  onClear,
  onUrlChange,
  onCaptionChange,
}: ImageSlotCardProps) {
  return (
    <div
      className={`bg-slate-900 border rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all ${
        !isEnabled ? "border-slate-800/80 opacity-75" : "border-slate-800"
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-white truncate">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {!isEnabled && (
              <span className="text-[10px] font-semibold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Hidden on live page
              </span>
            )}
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Show on live page
            </span>
            <button
              type="button"
              onClick={() => onToggleEnabled(!isEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isEnabled ? "bg-emerald-500" : "bg-slate-700"
              }`}
              title={isEnabled ? "Hide on live page" : "Show on live page"}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="relative w-full aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-600 p-4 text-center">
              <ImageIcon className="w-8 h-8 mb-1.5 opacity-50" />
              <p className="text-xs font-medium">Slot is Empty</p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Automatically hidden on live page with adaptive layout reflow.
              </p>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-amber-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold">Uploading (&le;500KB)...</span>
            </div>
          )}
        </div>

        {/* Manual URL input */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Image URL / Path
          </label>
          <input
            type="text"
            value={currentUrl || ""}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="/images/... or https://..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none font-mono"
          />
        </div>

        {/* Optional caption if slot supports it */}
        {captionKey && onCaptionChange && (
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Image Caption / Subtext
            </label>
            <input
              type="text"
              value={caption || ""}
              onChange={(e) => onCaptionChange(e.target.value)}
              placeholder="e.g. Field Engineers in action"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onUpload}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors disabled:opacity-50"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Image</span>
        </button>

        {currentUrl && (
          <button
            type="button"
            onClick={onClear}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 transition-colors"
            title="Clear image to show placeholder"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

