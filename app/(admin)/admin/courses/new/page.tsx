"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Globe, 
  Eye, 
  BookOpen, 
  Video, 
  FileText, 
  HelpCircle, 
  Award, 
  Clock, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Check
} from "lucide-react";

interface QuestionForm {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

interface QuizForm {
  title: string;
  passingScore: number;
  questions: QuestionForm[];
}

interface LessonForm {
  id: string;
  title: string;
  durationText: string;
  videoUrl: string;
  isPreview: boolean;
  technicalSheetUrl: string;
}

interface ModuleForm {
  id: string;
  title: string;
  description: string;
  lessons: LessonForm[];
  hasQuiz: boolean;
  quiz: QuizForm;
}

const PRESET_THUMBNAILS = [
  { label: "Solar Array Sunset", url: "/images/hero/hero-commercial.jpg" },
  { label: "Urban Rooftop Solar", url: "/images/hero/hero-urban.jpg" },
  { label: "Technician Field Training", url: "/images/hero/hero-academy.jpg" },
  { label: "Commercial Inverter Room", url: "/images/solutions/solutions-inverters.jpg" },
  { label: "Power Auditing Equipment", url: "/images/solutions/solutions-audit.jpg" },
  { label: "Solar Foundations Master", url: "/images/courses/course-1-solar-intro.jpg" },
];

const PRESET_OUTCOMES = [
  "Scientific solar PV design according to international IEC/IEEE & Nigerian NEC standards",
  "Sizing battery energy storage systems (BESS) for zero-flicker commercial microgrids",
  "Comprehensive single-line diagrams (SLD) and protective earthing calculations",
  "Hands-on equipment commissioning, hybrid inverter programming, and fault diagnostics",
  "Commercial load profile logging, peak demand shaving, and investment financial modeling",
];

const PRESET_INCLUDES = [
  "40 Contact Hours of Accredited Technical Training",
  "Includes 2–4 Months Practical Field Attachment with Partners",
  "Downloadable Technical Calculation Sheets & Sizing Spreadsheets",
  "Full Lifetime Access to Video Curriculum & Master Lectures",
  "Official Subway Schools Accredited Solar Engineering Certificate",
];

export default function AdminCourseUploadStudio() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"metadata" | "curriculum" | "review">("metadata");

  // TAB 1: Metadata State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [code, setCode] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<"INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED" | "COMPREHENSIVE_MASTERCLASS">("INTRODUCTORY");
  const [deliveryType, setDeliveryType] = useState<"SELF_PACED" | "COHORT">("SELF_PACED");
  const [contactHours, setContactHours] = useState(40);
  const [price, setPrice] = useState(75000);
  const [originalPrice, setOriginalPrice] = useState<number | "">(120000);
  const [thumbnailUrl, setThumbnailUrl] = useState("/images/hero/hero-commercial.jpg");
  const [promoVideoUrl, setPromoVideoUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [badge, setBadge] = useState("New Program");
  const [instructorName, setInstructorName] = useState("Engr. Asanga (Certified Solar Professional, 20+ Years Experience)");

  const [whatYoullLearn, setWhatYoullLearn] = useState<string[]>([...PRESET_OUTCOMES]);
  const [includesList, setIncludesList] = useState<string[]>([...PRESET_INCLUDES]);

  // TAB 2: Modular Curriculum State
  const [modules, setModules] = useState<ModuleForm[]>([
    {
      id: "mod-1",
      title: "Module 1: Introduction to Solar PV Engineering & Solar Radiation Fundamentals",
      description: "Atmospheric solar irradiance, sun-path charts, solar geometry, and photovoltaic energy conversion fundamentals.",
      lessons: [
        {
          id: "les-1-1",
          title: "Lesson 1.1: Historical Development & Evolution of Modern Photovoltaics",
          durationText: "25m",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          isPreview: true,
          technicalSheetUrl: "https://solar-engineering-academy.vercel.app/docs/solar-radiation-chart.pdf",
        },
        {
          id: "les-1-2",
          title: "Lesson 1.2: Solar Irradiance, Peak Sun Hours (PSH), and Angle of Incidence",
          durationText: "40m",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          isPreview: false,
          technicalSheetUrl: "https://solar-engineering-academy.vercel.app/docs/peak-sun-hours-nigeria.xlsx",
        },
      ],
      hasQuiz: true,
      quiz: {
        title: "Module 1 Assessment: Solar Fundamentals & Irradiance",
        passingScore: 70,
        questions: [
          {
            id: "q-1-1",
            question: "What does 1 Peak Sun Hour (PSH) correspond to in terms of solar irradiance?",
            options: [
              "1,000 W/m² received for a duration of 1 hour (1 kWh/m²)",
              "500 W/m² received for a duration of 2 hours",
              "10,000 lumens under clear noon sky",
              "Maximum surface panel temperature above 45°C",
            ],
            correctOptionIndex: 0,
            explanation: "1 Peak Sun Hour (PSH) equals 1,000 W/m² of standard solar irradiance accumulated over one hour (1 kWh/m²).",
          },
        ],
      },
    },
  ]);

  // Submission / Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [previewAccordionState, setPreviewAccordionState] = useState<Record<number, boolean>>({ 0: true });

  // Auto-generate slug and code from title if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(autoSlug);

    // Auto-generate code initials if empty
    if (!code) {
      const words = val.trim().split(/\s+/);
      if (words.length >= 2) {
        const initials = words.map((w) => w[0]?.toUpperCase()).join("").slice(0, 4);
        setCode(`${initials}101`);
      }
    }
  };

  // Outcome Repeater Handlers
  const handleAddOutcome = () => {
    setWhatYoullLearn([...whatYoullLearn, ""]);
  };

  const handleUpdateOutcome = (idx: number, text: string) => {
    const copy = [...whatYoullLearn];
    copy[idx] = text;
    setWhatYoullLearn(copy);
  };

  const handleRemoveOutcome = (idx: number) => {
    setWhatYoullLearn(whatYoullLearn.filter((_, i) => i !== idx));
  };

  // Includes Repeater Handlers
  const handleAddInclude = () => {
    setIncludesList([...includesList, ""]);
  };

  const handleUpdateInclude = (idx: number, text: string) => {
    const copy = [...includesList];
    copy[idx] = text;
    setIncludesList(copy);
  };

  const handleRemoveInclude = (idx: number) => {
    setIncludesList(includesList.filter((_, i) => i !== idx));
  };

  // Module Management Handlers
  const handleAddModule = () => {
    const nextIdx = modules.length + 1;
    const newModule: ModuleForm = {
      id: `mod-${Date.now()}`,
      title: `Module ${nextIdx}: Advanced Engineering & System Integration`,
      description: "In-depth engineering formulas, sizing spreadsheets, and hands-on commissioning protocols.",
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: `Lesson ${nextIdx}.1: Core Theoretical Principles & System Architecture`,
          durationText: "30m",
          videoUrl: "",
          isPreview: false,
          technicalSheetUrl: "",
        },
      ],
      hasQuiz: true,
      quiz: {
        title: `Module ${nextIdx} Assessment: Technical Mastery`,
        passingScore: 70,
        questions: [
          {
            id: `q-${Date.now()}-1`,
            question: "Which formula calculates total DC string power?",
            options: [
              "Number of panels × Rated STC Wattage (Wp)",
              "Open Circuit Voltage (Voc) ÷ Short Circuit Current (Isc)",
              "Battery Ah capacity × Inverter Efficiency",
              "Ambient Temperature × Coefficient of Thermal Expansion",
            ],
            correctOptionIndex: 0,
            explanation: "Total DC array power is the product of panel quantity and rated peak wattage at Standard Test Conditions (STC).",
          },
        ],
      },
    };
    setModules([...modules, newModule]);
  };

  const handleRemoveModule = (mIdx: number) => {
    setModules(modules.filter((_, i) => i !== mIdx));
  };

  const handleUpdateModule = (mIdx: number, field: keyof ModuleForm, val: any) => {
    const copy = [...modules];
    copy[mIdx] = { ...copy[mIdx], [field]: val };
    setModules(copy);
  };

  // Lesson Management Handlers
  const handleAddLesson = (mIdx: number) => {
    const copy = [...modules];
    const mod = copy[mIdx];
    const nextLessonIdx = mod.lessons.length + 1;
    const newLesson: LessonForm = {
      id: `les-${Date.now()}-${nextLessonIdx}`,
      title: `Lesson ${mIdx + 1}.${nextLessonIdx}: Technical Execution & Design Calculation`,
      durationText: "35m",
      videoUrl: "",
      isPreview: false,
      technicalSheetUrl: "",
    };
    mod.lessons.push(newLesson);
    setModules(copy);
  };

  const handleUpdateLesson = (mIdx: number, lIdx: number, field: keyof LessonForm, val: any) => {
    const copy = [...modules];
    const mod = copy[mIdx];
    mod.lessons[lIdx] = { ...mod.lessons[lIdx], [field]: val };
    setModules(copy);
  };

  const handleRemoveLesson = (mIdx: number, lIdx: number) => {
    const copy = [...modules];
    copy[mIdx].lessons = copy[mIdx].lessons.filter((_, i) => i !== lIdx);
    setModules(copy);
  };

  // Quiz Question Management Handlers
  const handleAddQuestion = (mIdx: number) => {
    const copy = [...modules];
    const quiz = copy[mIdx].quiz;
    quiz.questions.push({
      id: `q-${Date.now()}-${quiz.questions.length + 1}`,
      question: "",
      options: ["", "", "", ""],
      correctOptionIndex: 0,
      explanation: "",
    });
    setModules(copy);
  };

  const handleUpdateQuestion = (mIdx: number, qIdx: number, field: keyof QuestionForm, val: any) => {
    const copy = [...modules];
    copy[mIdx].quiz.questions[qIdx] = { ...copy[mIdx].quiz.questions[qIdx], [field]: val };
    setModules(copy);
  };

  const handleUpdateQuestionOption = (mIdx: number, qIdx: number, optIdx: number, text: string) => {
    const copy = [...modules];
    const opts = [...copy[mIdx].quiz.questions[qIdx].options];
    opts[optIdx] = text;
    copy[mIdx].quiz.questions[qIdx].options = opts;
    setModules(copy);
  };

  const handleRemoveQuestion = (mIdx: number, qIdx: number) => {
    const copy = [...modules];
    copy[mIdx].quiz.questions = copy[mIdx].quiz.questions.filter((_, i) => i !== qIdx);
    setModules(copy);
  };

  // Final Persistence Handler (Save Draft or Publish)
  const handleSubmitCourse = async (publish: boolean) => {
    setSubmissionError(null);

    // Basic Validations
    if (!title.trim()) {
      setSubmissionError("Please enter a Course Title in Tab 1.");
      setActiveTab("metadata");
      return;
    }
    if (!slug.trim()) {
      setSubmissionError("Please enter a valid unique Course Slug in Tab 1.");
      setActiveTab("metadata");
      return;
    }
    if (!code.trim()) {
      setSubmissionError("Please enter a Course Code (e.g. PVOL101) in Tab 1.");
      setActiveTab("metadata");
      return;
    }
    if (modules.length === 0) {
      setSubmissionError("Please configure at least 1 Module in Tab 2.");
      setActiveTab("curriculum");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        code: code.trim().toUpperCase(),
        subtitle: subtitle.trim(),
        description: description.trim() || `Professional accredited program in ${title}.`,
        level,
        deliveryType,
        contactHours: Number(contactHours) || 40,
        price: Number(price) || 0,
        originalPrice: originalPrice !== "" ? Number(originalPrice) : null,
        isPublished: publish,
        whatYoullLearn: whatYoullLearn.filter((item) => item.trim().length > 0),
        includesList: includesList.filter((item) => item.trim().length > 0),
        thumbnailUrl: thumbnailUrl || "/images/hero/hero-commercial.jpg",
        promoVideoUrl: promoVideoUrl.trim() || null,
        badge: badge.trim() || null,
        instructorName: instructorName.trim() || "Engr. Asanga",
        modules: modules.map((m, mIdx) => ({
          title: m.title.trim(),
          order: mIdx + 1,
          description: m.description.trim(),
          lessons: m.lessons.map((l, lIdx) => ({
            title: l.title.trim(),
            order: lIdx + 1,
            durationText: l.durationText.trim() || "30m",
            videoUrl: l.videoUrl.trim(),
            isPreview: l.isPreview,
            technicalSheetUrl: l.technicalSheetUrl.trim() || null,
          })),
          quiz: m.hasQuiz && m.quiz.title.trim()
            ? {
                title: m.quiz.title.trim(),
                passingScore: m.quiz.passingScore || 70,
                questions: m.quiz.questions
                  .filter((q) => q.question.trim().length > 0)
                  .map((q) => ({
                    question: q.question.trim(),
                    options: q.options.map((opt) => opt.trim()).filter(Boolean),
                    correctOptionIndex: q.correctOptionIndex,
                    explanation: q.explanation.trim() || "Verified by Subway Schools curriculum board.",
                  })),
              }
            : null,
        })),
      };

      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create course");
      }

      // Success: route directly to the published course or catalog
      if (publish) {
        router.push(`/courses/${data.slug}`);
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      setSubmissionError(err.message || "An unexpected error occurred while saving the course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculation for discount preview
  const calculatedDiscount = originalPrice && Number(originalPrice) > Number(price)
    ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 selection:bg-[#2B82C9] selection:text-white">
      {/* Studio Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Admin Studio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-sky-400 border border-blue-500/30">
                  STUDIO ARCHITECT
                </span>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-xs text-slate-400 font-mono">NEW PROGRAM TEMPLATE</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate max-w-md sm:max-w-xl">
                {title || "Untitled Solar Engineering Course"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleSubmitCourse(false)}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={() => handleSubmitCourse(true)}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#2B82C9] hover:bg-sky-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Publishing..." : "Publish to Catalog"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Validation Alert */}
        {submissionError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-white">Curriculum Verification Error</p>
              <p>{submissionError}</p>
            </div>
          </div>
        )}

        {/* Tab Navigation Controls */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab("metadata")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "metadata"
                  ? "bg-[#2B82C9] text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>1. Core Course Metadata</span>
            </button>

            <button
              onClick={() => setActiveTab("curriculum")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "curriculum"
                  ? "bg-[#2B82C9] text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2. Modular Curriculum &amp; Videos ({modules.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("review")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "review"
                  ? "bg-[#2B82C9] text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>3. Live Preview &amp; Publish</span>
            </button>
          </div>

          <span className="hidden md:inline-flex text-xs font-mono text-slate-400">
            Total Modules: <strong className="text-white ml-1">{modules.length}</strong> • Lessons:{" "}
            <strong className="text-white ml-1">
              {modules.reduce((sum, m) => sum + m.lessons.length, 0)}
            </strong>
          </span>
        </div>

        {/* TAB 1: CORE COURSE METADATA */}
        {activeTab === "metadata" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Essential Identifiers */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">1.1 Course Identifiers &amp; Positioning</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Define the primary course headline, unique course slug, and accredited code.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Commercial &amp; Industrial Solar PV Sizing Masterclass"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 text-sm sm:text-base font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Course Slug (URL Route) *
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-950 border border-white/15 overflow-hidden">
                    <span className="px-3 text-xs text-slate-500 font-mono bg-slate-900/80 select-none py-3">
                      /courses/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
                      placeholder="commercial-industrial-solar"
                      className="w-full px-3 py-3 bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Course Code (e.g. PVOL101) *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase().trim())}
                    placeholder="PVOL101"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white font-mono font-bold uppercase text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Course Subtitle (1–2 Line Executive Overview)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Comprehensive practical training with Engr. Asanga paired with 2–4 months industrial partner attachment."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Full Description &amp; Technical Scope
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed breakdown of the curriculum scope, industrial equipment utilized, and attachment expectations..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white text-sm focus:outline-none focus:border-sky-400 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Pricing, Accreditation & Tier */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">1.2 Tuition &amp; Academic Accreditation</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure tuition fees in Nigerian Naira (₦), contact hours, and target mastery level.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Tuition Price (₦) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400 font-bold">₦</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono font-bold text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Original Price (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400 font-bold">₦</span>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 120000"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-sky-400"
                    />
                  </div>
                  {calculatedDiscount && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {calculatedDiscount}% Discount active
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Accredited Contact Hours
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={contactHours}
                      onChange={(e) => setContactHours(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono font-bold text-sm focus:outline-none focus:border-sky-400"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-mono">Hours</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Technical Level
                  </label>
                  <select
                    value={level}
                    onChange={(e: any) => setLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-sky-400"
                  >
                    <option value="INTRODUCTORY">Introductory (Foundational)</option>
                    <option value="INTERMEDIATE">Intermediate (Professional)</option>
                    <option value="ADVANCED">Advanced (EPC / High-Voltage)</option>
                    <option value="COMPREHENSIVE_MASTERCLASS">Comprehensive Masterclass</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Delivery Track
                  </label>
                  <select
                    value={deliveryType}
                    onChange={(e: any) => setDeliveryType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-sky-400"
                  >
                    <option value="SELF_PACED">Self-Paced with Field Attachment</option>
                    <option value="COHORT">Scheduled Physical / Live Cohort</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Lead Instructor
                  </label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Hero Badge Label
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Bestseller / Flagship"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Promo Video URL
                  </label>
                  <input
                    type="text"
                    value={promoVideoUrl}
                    onChange={(e) => setPromoVideoUrl(e.target.value)}
                    placeholder="https://vimeo.com/... or MP4 link"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            </div>

            {/* Thumbnail Selection */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-4">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-sky-400" />
                    <span>1.3 Course Cover &amp; Thumbnail Image</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a high-resolution verified industrial solar asset or input a custom asset URL.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                {PRESET_THUMBNAILS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setThumbnailUrl(preset.url)}
                    className={`group relative rounded-xl overflow-hidden border text-left transition-all cursor-pointer ${
                      thumbnailUrl === preset.url
                        ? "border-[#2B82C9] ring-2 ring-[#2B82C9]/50 shadow-md"
                        : "border-white/15 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="w-full h-20 bg-slate-950 overflow-hidden">
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2 bg-slate-950/90 text-[10px] font-medium text-slate-300 truncate">
                      {preset.label}
                    </div>
                    {thumbnailUrl === preset.url && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#2B82C9] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="/images/... or custom image URL"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* What You'll Learn Dynamic Repeater */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>1.4 &ldquo;What You&rsquo;ll Learn&rdquo; Key Competency Outcomes</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Displayed prominently as a 2-column checklist on the course landing page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddOutcome}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-sky-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Outcome</span>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {whatYoullLearn.map((outcome, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-sky-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-blue-500/20">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => handleUpdateOutcome(idx, e.target.value)}
                      placeholder="e.g. Sizing battery energy storage systems for commercial applications"
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOutcome(idx)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* "This Course Includes" Dynamic Repeater */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>1.5 &ldquo;This Course Includes&rdquo; Package Inclusions</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Displayed inside the floating enrollment widget on the right rail.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddInclude}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Inclusion</span>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {includesList.map((includeItem, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-emerald-500/20">
                      ✓
                    </span>
                    <input
                      type="text"
                      value={includeItem}
                      onChange={(e) => handleUpdateInclude(idx, e.target.value)}
                      placeholder="e.g. Includes 2–4 Months Practical Field Attachment with Partners"
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveInclude(idx)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Step Button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveTab("curriculum")}
                className="px-6 py-3 rounded-xl bg-[#2B82C9] hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Modular Curriculum Builder</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MODULAR CURRICULUM & VIDEO BUILDER */}
        {activeTab === "curriculum" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-400" />
                  <span>Curriculum Architecture &amp; Milestone Assessments</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Build your course module-by-module. Each module supports technical video lessons, downloadable engineering calculation sheets, and end-of-module evaluation quizzes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddModule}
                className="px-5 py-2.5 rounded-xl bg-[#2B82C9] hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Module {modules.length + 1}</span>
              </button>
            </div>

            {/* Modules Accordions */}
            <div className="space-y-6">
              {modules.map((mod, mIdx) => (
                <div
                  key={mod.id}
                  className="bg-slate-900/80 rounded-2xl border border-white/15 overflow-hidden shadow-xl"
                >
                  {/* Module Header Bar */}
                  <div className="bg-slate-950/80 p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-sky-400 font-mono text-sm font-black flex items-center justify-center shrink-0">
                        {mIdx + 1}
                      </span>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => handleUpdateModule(mIdx, "title", e.target.value)}
                          placeholder={`Module ${mIdx + 1} Title`}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-white font-bold text-sm sm:text-base focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 justify-end">
                      <button
                        type="button"
                        onClick={() => handleAddLesson(mIdx)}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-sky-400" />
                        <span>Add Lesson</span>
                      </button>

                      {modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(mIdx)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                          title="Delete Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Module Content Body */}
                  <div className="p-6 space-y-6">
                    {/* Module Description */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                        Module Executive Summary
                      </label>
                      <input
                        type="text"
                        value={mod.description}
                        onChange={(e) => handleUpdateModule(mIdx, "description", e.target.value)}
                        placeholder="Key technical formulas and operational scope covered in this module..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    {/* Lessons List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                          <Video className="w-3.5 h-3.5 text-sky-400" />
                          <span>Technical Lessons ({mod.lessons.length})</span>
                        </span>
                      </div>

                      <div className="space-y-3">
                        {mod.lessons.map((lesson, lIdx) => (
                          <div
                            key={lesson.id}
                            className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-3 hover:border-white/20 transition-all"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5 flex-1">
                                <span className="font-mono text-xs text-sky-400 font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                                  {mIdx + 1}.{lIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => handleUpdateLesson(mIdx, lIdx, "title", e.target.value)}
                                  placeholder={`Lesson ${mIdx + 1}.${lIdx + 1} Title`}
                                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-400"
                                />
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 w-24">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  <input
                                    type="text"
                                    value={lesson.durationText}
                                    onChange={(e) => handleUpdateLesson(mIdx, lIdx, "durationText", e.target.value)}
                                    placeholder="35m"
                                    className="w-full px-2 py-1 rounded bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none"
                                  />
                                </div>

                                <label className="flex items-center gap-1.5 text-xs text-slate-300 select-none cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={lesson.isPreview}
                                    onChange={(e) => handleUpdateLesson(mIdx, lIdx, "isPreview", e.target.checked)}
                                    className="rounded border-white/20 text-[#2B82C9] focus:ring-0"
                                  />
                                  <span>Free Preview</span>
                                </label>

                                {mod.lessons.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveLesson(mIdx, lIdx)}
                                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                    title="Remove Lesson"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Additional Lesson URLs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 font-mono shrink-0">Video URL:</span>
                                <input
                                  type="text"
                                  value={lesson.videoUrl}
                                  onChange={(e) => handleUpdateLesson(mIdx, lIdx, "videoUrl", e.target.value)}
                                  placeholder="https://.../lecture-video.mp4"
                                  className="w-full px-3 py-1 rounded bg-slate-900 border border-white/10 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-400"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <input
                                  type="text"
                                  value={lesson.technicalSheetUrl}
                                  onChange={(e) => handleUpdateLesson(mIdx, lIdx, "technicalSheetUrl", e.target.value)}
                                  placeholder="Technical calculation sheet URL (Excel/PDF)"
                                  className="w-full px-3 py-1 rounded bg-slate-900 border border-white/10 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-400"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* End-of-Module Quiz Assessment Builder */}
                    <div className="bg-slate-950/70 p-5 rounded-xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2.5">
                          <HelpCircle className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                            End-of-Module Milestone Assessment
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={mod.hasQuiz}
                              onChange={(e) => handleUpdateModule(mIdx, "hasQuiz", e.target.checked)}
                              className="rounded border-white/20 text-[#2B82C9] focus:ring-0"
                            />
                            <span>Include Quiz for Module {mIdx + 1}</span>
                          </label>
                        </div>
                      </div>

                      {mod.hasQuiz && (
                        <div className="space-y-4 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2 space-y-1">
                              <label className="block text-[11px] font-mono text-slate-400 uppercase">
                                Assessment Title
                              </label>
                              <input
                                type="text"
                                value={mod.quiz.title}
                                onChange={(e) => {
                                  const copy = [...modules];
                                  copy[mIdx].quiz.title = e.target.value;
                                  setModules(copy);
                                }}
                                placeholder={`Module ${mIdx + 1} Technical Assessment`}
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-sky-400"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono text-slate-400 uppercase">
                                Passing Score (%)
                              </label>
                              <input
                                type="number"
                                min={50}
                                max={100}
                                value={mod.quiz.passingScore}
                                onChange={(e) => {
                                  const copy = [...modules];
                                  copy[mIdx].quiz.passingScore = Number(e.target.value);
                                  setModules(copy);
                                }}
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                              />
                            </div>
                          </div>

                          {/* Quiz Questions List */}
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                                Questions ({mod.quiz.questions.length})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddQuestion(mIdx)}
                                className="px-3 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Question</span>
                              </button>
                            </div>

                            {mod.quiz.questions.map((q, qIdx) => (
                              <div
                                key={q.id}
                                className="bg-slate-900/90 p-4 rounded-xl border border-white/10 space-y-3"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-2 flex-1">
                                    <span className="text-xs font-mono font-bold text-amber-400 mt-1">
                                      Q{qIdx + 1}:
                                    </span>
                                    <textarea
                                      rows={2}
                                      value={q.question}
                                      onChange={(e) => handleUpdateQuestion(mIdx, qIdx, "question", e.target.value)}
                                      placeholder="State question prompt (e.g. What is the minimum temperature derating for an ambient 40°C environment?)"
                                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-400 leading-relaxed"
                                    />
                                  </div>

                                  {mod.quiz.questions.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveQuestion(mIdx, qIdx)}
                                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                                      title="Delete Question"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                {/* 4 Options */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                  {q.options.map((opt, optIdx) => (
                                    <label
                                      key={optIdx}
                                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                                        q.correctOptionIndex === optIdx
                                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                                          : "bg-slate-950 border-white/10 text-slate-300 hover:border-white/20"
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`correct-${mIdx}-${qIdx}`}
                                        checked={q.correctOptionIndex === optIdx}
                                        onChange={() => handleUpdateQuestion(mIdx, qIdx, "correctOptionIndex", optIdx)}
                                        className="text-emerald-500 focus:ring-0"
                                      />
                                      <span className="font-mono text-[11px] font-bold text-slate-400">
                                        {String.fromCharCode(65 + optIdx)}:
                                      </span>
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => handleUpdateQuestionOption(mIdx, qIdx, optIdx, e.target.value)}
                                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                        className="w-full bg-transparent text-xs text-white focus:outline-none"
                                      />
                                    </label>
                                  ))}
                                </div>

                                {/* Explanation */}
                                <div className="flex items-center gap-2 text-xs pt-1">
                                  <span className="text-slate-500 font-mono shrink-0">Rationale:</span>
                                  <input
                                    type="text"
                                    value={q.explanation}
                                    onChange={(e) => handleUpdateQuestion(mIdx, qIdx, "explanation", e.target.value)}
                                    placeholder="Explanation displayed when student checks answer..."
                                    className="w-full px-3 py-1 rounded bg-slate-950 border border-white/10 text-slate-300 text-xs focus:outline-none"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Step Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab("metadata")}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>← Back to Metadata</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("review")}
                className="px-6 py-3 rounded-xl bg-[#2B82C9] hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-sky-500/20"
              >
                <span>Proceed to Review &amp; Live Preview</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: REVIEW & LIVE PREVIEW */}
        {activeTab === "review" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Live Preview Header Card */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider block mb-1">
                  PREVIEW MODE
                </span>
                <h2 className="text-xl font-bold text-white">
                  Live Visual Inspection matching /courses/solar-installation-101
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  This preview renders the exact layout, full-bleed hero banner, syllabus accordion, and enrollment card your students will see once published.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmitCourse(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitCourse(true)}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#2B82C9] hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Globe className="w-4 h-4" />
                  <span>{isSubmitting ? "Publishing Course..." : "Publish Course to Catalog"}</span>
                </button>
              </div>
            </div>

            {/* MOCK LIVE PREVIEW CONTAINER (Matching /courses/solar-installation-101 exactly) */}
            <div className="rounded-3xl border border-slate-700 overflow-hidden bg-white text-slate-900 shadow-2xl">
              {/* Top Simulated Browser Bar */}
              <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-white/10 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-slate-300">
                    https://solar-engineering-academy.vercel.app/courses/{slug || "new-program"}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  READY TO PUBLISH
                </span>
              </div>

              {/* 1. Full-Bleed Dark Hero Section */}
              <div className="bg-[#080f1e] text-white py-12 px-6 sm:px-10 border-b border-white/10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <span>Home</span>
                      <span>›</span>
                      <span>Courses</span>
                      <span>›</span>
                      <span className="text-sky-400 font-mono">{code || "SOLAR101"}</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                      {title || "Commercial & Industrial Solar Engineering Masterclass"}
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                      {subtitle || "Accredited solar engineering training with 2–4 months practical partner field attachment."}
                    </p>

                    <div className="flex items-center flex-wrap gap-3 pt-1 text-xs">
                      <span className="px-2.5 py-0.5 rounded font-black text-xs uppercase bg-[#ECEB98] text-[#3D3C0A]">
                        {badge || "Bestseller"}
                      </span>
                      <span className="text-amber-400 font-bold">★ 4.9 (140 ratings)</span>
                      <span className="text-slate-300">850 students enrolled</span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Created by <strong className="text-white underline">{instructorName}</strong>
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 font-mono">
                      <span>{contactHours} Contact Hours</span>
                      <span>•</span>
                      <span>Level: {level}</span>
                      <span>•</span>
                      <span>English</span>
                    </div>
                  </div>

                  {/* Simulated Floating Card on Right */}
                  <div className="lg:col-span-4 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-5 space-y-4">
                    <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-950 relative">
                      <img
                        src={thumbnailUrl || "/images/hero/hero-commercial.jpg"}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                          ▶
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          ₦{price.toLocaleString()}
                        </span>
                        {originalPrice && (
                          <span className="text-sm line-through text-slate-400 font-mono">
                            ₦{Number(originalPrice).toLocaleString()}
                          </span>
                        )}
                        {calculatedDiscount && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {calculatedDiscount}% off
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Includes Physical Attachment Guarantee</p>
                    </div>

                    <button
                      type="button"
                      className="w-full py-3 rounded-xl bg-[#2B82C9] text-white font-bold text-sm shadow-md"
                    >
                      Enroll in Program Now
                    </button>

                    <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      <p className="font-bold text-slate-900 text-xs">This course includes:</p>
                      {includesList.slice(0, 4).map((inc, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span className="text-[11px] leading-tight">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. White Content Area (What You'll Learn & Curriculum Accordion) */}
              <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-10">
                {/* What You'll Learn Box */}
                <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">What you&rsquo;ll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                    {whatYoullLearn.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Curriculum Accordion Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Course content</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {modules.length} modules • {modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons • {contactHours}h total length
                      </p>
                    </div>
                  </div>

                  {/* Modules Accordion */}
                  <div className="space-y-3">
                    {modules.map((mod, mIdx) => {
                      const isOpen = previewAccordionState[mIdx] ?? (mIdx === 0);
                      return (
                        <div
                          key={mod.id}
                          className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewAccordionState((prev) => ({
                                ...prev,
                                [mIdx]: !isOpen,
                              }))
                            }
                            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#2B82C9] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-blue-200">
                                {mIdx + 1}
                              </span>
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{mod.title}</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {mod.lessons.length} technical lectures • {mod.hasQuiz ? "1 Milestone Quiz" : "Self-Assessment"}
                                </p>
                              </div>
                            </div>

                            {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-4 divide-y divide-slate-100">
                              {mod.lessons.map((les, lIdx) => (
                                <div
                                  key={les.id}
                                  className="py-2.5 flex items-center justify-between text-xs text-slate-700"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Video className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>
                                      {mIdx + 1}.{lIdx + 1} {les.title}
                                    </span>
                                    {les.isPreview && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-[#2B82C9] border border-sky-200">
                                        Preview
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3">
                                    {les.technicalSheetUrl && (
                                      <span className="text-[11px] text-emerald-600 font-medium">Sheet Attached</span>
                                    )}
                                    <span className="font-mono text-slate-400">{les.durationText}</span>
                                  </div>
                                </div>
                              ))}

                              {mod.hasQuiz && (
                                <div className="py-2.5 flex items-center justify-between text-xs bg-amber-50/60 px-3 rounded-lg mt-2">
                                  <div className="flex items-center gap-2 text-amber-900 font-medium">
                                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                                    <span>{mod.quiz.title || "Module Milestone Assessment"}</span>
                                  </div>
                                  <span className="font-mono text-[11px] text-amber-700 font-bold">
                                    Passing: {mod.quiz.passingScore}%
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Final Action Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("curriculum")}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>← Back to Curriculum Builder</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmitCourse(true)}
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-[#2B82C9] hover:bg-sky-500 active:scale-95 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <Globe className="w-4 h-4" />
                <span>{isSubmitting ? "Publishing Course..." : "Publish Course to Public Catalog"}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
