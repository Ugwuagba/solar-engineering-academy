"use client";

import { useState, useId, useRef, useEffect, useCallback } from "react";
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
  Check, 
  Upload, 
  RefreshCw,
  Loader2,
  GripVertical,
  Users,
  CheckSquare
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
  "Official Verifiable Certificate of Completion",
  "Downloadable Technical Calculation Sheets & Sizing Spreadsheets",
  "Full Lifetime Access to Video Curriculum & Master Lectures",
  "Official Subway Schools Accredited Solar Engineering Certificate",
];

const PRESET_AUDIENCE = [
  "Electrical engineers, technicians, and installers aiming for commercial EPC mastery",
  "Facility directors and solar business entrepreneurs building high-reliability mini-grids",
  "Technical diploma holders transitioning into solar photovoltaic engineering",
];

const PRESET_REQUIREMENTS = [
  "Basic understanding of electrical principles (Voltage, Current, Resistance)",
  "A laptop or smartphone for technical calculation simulations and spreadsheets",
  "Commitment to complete technical assessments and coursework",
];

interface CourseStudioFormProps {
  initialCourse?: any;
  mode?: "create" | "edit";
}

export default function CourseStudioForm({ initialCourse, mode = "create" }: CourseStudioFormProps) {
  const router = useRouter();
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(initialCourse?.id || null);
  const [activeTab, setActiveTab] = useState<"metadata" | "curriculum" | "review">("metadata");

  // Helper to parse JSON arrays safely
  const parseJsonArray = (val: any): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  };

  // TAB 1: Metadata State
  const [title, setTitle] = useState(initialCourse?.title || "");
  const [slug, setSlug] = useState(initialCourse?.slug || "");
  const [code, setCode] = useState(initialCourse?.code || "");
  const [subtitle, setSubtitle] = useState(initialCourse?.subtitle || "");
  const [description, setDescription] = useState(initialCourse?.description || "");
  const [level, setLevel] = useState<"INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED" | "COMPREHENSIVE_MASTERCLASS">(
    initialCourse?.level || "INTRODUCTORY"
  );
  const [deliveryType, setDeliveryType] = useState<"SELF_PACED" | "COHORT">(
    initialCourse?.deliveryType || "SELF_PACED"
  );
  const [contactHours, setContactHours] = useState(initialCourse?.contactHours ?? 40);
  const [price, setPrice] = useState(initialCourse?.price ?? 75000);
  const [originalPrice, setOriginalPrice] = useState<number | "">(initialCourse?.originalPrice ?? 120000);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialCourse?.thumbnailUrl || "/images/hero/hero-commercial.jpg");
  const [thumbnailSourceTab, setThumbnailSourceTab] = useState<"upload" | "presets">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // TAB 1: Outcomes & Inclusions State
  const [whatYoullLearn, setWhatYoullLearn] = useState<string[]>(
    initialCourse?.whatYoullLearn ? parseJsonArray(initialCourse.whatYoullLearn) : PRESET_OUTCOMES
  );
  const [newOutcome, setNewOutcome] = useState("");

  const [includesList, setIncludesList] = useState<string[]>(
    initialCourse?.includesList ? parseJsonArray(initialCourse.includesList) : PRESET_INCLUDES
  );
  const [newInclusion, setNewInclusion] = useState("");

  // TAB 1: Target Audience & Requirements State
  const [targetAudience, setTargetAudience] = useState<string[]>(
    initialCourse?.targetAudience ? parseJsonArray(initialCourse.targetAudience) : (mode === "create" ? PRESET_AUDIENCE : [])
  );
  const [newAudience, setNewAudience] = useState("");

  const [requirements, setRequirements] = useState<string[]>(
    initialCourse?.requirements ? parseJsonArray(initialCourse.requirements) : (mode === "create" ? PRESET_REQUIREMENTS : [])
  );
  const [newRequirement, setNewRequirement] = useState("");

  // Additional Metadata
  const [promoVideoUrl, setPromoVideoUrl] = useState(initialCourse?.promoVideoUrl || "");
  const [badge, setBadge] = useState(initialCourse?.badge || (mode === "create" ? "Industry Accredited" : ""));
  const [instructorName, setInstructorName] = useState(initialCourse?.instructorName || "Engr. Asanga");

  // Initializing modules from initialCourse
  const initModules = (): ModuleForm[] => {
    if (initialCourse?.modules && Array.isArray(initialCourse.modules) && initialCourse.modules.length > 0) {
      return initialCourse.modules.map((m: any, mIdx: number) => ({
        id: m.id || `mod-${mIdx + 1}`,
        title: m.title || `Module ${mIdx + 1}`,
        description: m.description || "",
        lessons: Array.isArray(m.lessons)
          ? m.lessons.map((l: any, lIdx: number) => ({
              id: l.id || `les-${mIdx + 1}-${lIdx + 1}`,
              title: l.title || `Lesson ${lIdx + 1}`,
              durationText: l.durationText || "30m",
              videoUrl: l.videoUrl || "",
              isPreview: Boolean(l.isFreePreview ?? l.isPreview),
              technicalSheetUrl: l.technicalSheetUrl || "",
            }))
          : [],
        hasQuiz: Boolean(m.quiz),
        quiz: {
          title: m.quiz?.title || `${m.title || "Module"} Knowledge Assessment`,
          passingScore: m.quiz?.passingScore || 70,
          questions: Array.isArray(m.quiz?.questions)
            ? m.quiz.questions.map((q: any, qIdx: number) => ({
                id: q.id || `q-${mIdx + 1}-${qIdx + 1}`,
                question: q.text || q.question || "",
                options: Array.isArray(q.options)
                  ? q.options
                  : (typeof q.optionsJson === "string" ? JSON.parse(q.optionsJson) : ["Option A", "Option B", "Option C", "Option D"]),
                correctOptionIndex: q.correctOptionIndex ?? 0,
                explanation: q.explanation || "",
              }))
            : [],
        },
      }));
    }

    // Default template module for new course
    return [
      {
        id: "mod-1",
        title: "Module 1: Electrical & Mechanical Engineering Foundations",
        description: "Master baseline electrical physics, solar irradiance geometry, and standard safety measures.",
        lessons: [
          {
            id: "les-1",
            title: "Lesson 1.1: System Architecture, Inverter Topologies & Grid Tie Standards",
            durationText: "45m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            isPreview: true,
            technicalSheetUrl: "https://example.com/spec-sheet-101.pdf",
          },
          {
            id: "les-2",
            title: "Lesson 1.2: String Voltage Calculations, Temperature Coefficients & Wire Sizing",
            durationText: "50m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            isPreview: false,
            technicalSheetUrl: "",
          },
        ],
        hasQuiz: true,
        quiz: {
          title: "Module 1 Assessment: Engineering Sizing & Compliance",
          passingScore: 70,
          questions: [
            {
              id: "q-1",
              question: "What effect does extreme ambient cold have on the open circuit voltage (Voc) of a PV string?",
              options: [
                "Voc decreases proportionally with temperature drop",
                "Voc increases according to the negative temperature coefficient (mV/°C)",
                "Voc remains unchanged; only short circuit current (Isc) shifts",
                "Voc drops to zero due to bypass diode activation",
              ],
              correctOptionIndex: 1,
              explanation: "Silicon solar cells feature a negative temperature coefficient for voltage. Cold climates significantly elevate Voc.",
            },
          ],
        },
      },
    ];
  };

  // TAB 2: Curriculum State
  const [modules, setModules] = useState<ModuleForm[]>(initModules);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true,
  });

  // UI / State Status
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auto-slug generator on title change
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
    if (mode === "create" && (!slug || slug.startsWith("draft-") || slug === "untitled-course")) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  // File Upload Handler
  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setUploadError("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds the 5MB maximum limit.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setThumbnailUrl(data.url);
      setIsDirty(true);
      showToast("Thumbnail uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload image. Please try again.");
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Outcomes Handlers
  const addOutcome = () => {
    if (newOutcome.trim()) {
      setWhatYoullLearn([...whatYoullLearn, newOutcome.trim()]);
      setNewOutcome("");
      setIsDirty(true);
    }
  };

  const removeOutcome = (index: number) => {
    setWhatYoullLearn(whatYoullLearn.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Inclusions Handlers
  const addInclusion = () => {
    if (newInclusion.trim()) {
      setIncludesList([...includesList, newInclusion.trim()]);
      setNewInclusion("");
      setIsDirty(true);
    }
  };

  const removeInclusion = (index: number) => {
    setIncludesList(includesList.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Target Audience Handlers
  const addAudience = () => {
    if (newAudience.trim()) {
      setTargetAudience([...targetAudience, newAudience.trim()]);
      setNewAudience("");
      setIsDirty(true);
    }
  };

  const removeAudience = (index: number) => {
    setTargetAudience(targetAudience.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Requirements Handlers
  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
      setIsDirty(true);
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Drag-and-Drop & Reordering State and Handlers
  type ListType = "outcomes" | "inclusions" | "targetAudience" | "requirements";

  const [draggingItem, setDraggingItem] = useState<{ listType: ListType; index: number } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{ listType: ListType; index: number } | null>(null);

  const handleReorder = (
    listType: ListType,
    draggedIndex: number,
    targetIndex: number
  ) => {
    if (draggedIndex === targetIndex || draggedIndex < 0 || targetIndex < 0) return;
    if (listType === "outcomes") {
      setWhatYoullLearn((prev) => {
        if (draggedIndex >= prev.length || targetIndex >= prev.length) return prev;
        const updated = [...prev];
        const [movedItem] = updated.splice(draggedIndex, 1);
        updated.splice(targetIndex, 0, movedItem);
        return updated;
      });
    } else if (listType === "inclusions") {
      setIncludesList((prev) => {
        if (draggedIndex >= prev.length || targetIndex >= prev.length) return prev;
        const updated = [...prev];
        const [movedItem] = updated.splice(draggedIndex, 1);
        updated.splice(targetIndex, 0, movedItem);
        return updated;
      });
    } else if (listType === "targetAudience") {
      setTargetAudience((prev) => {
        if (draggedIndex >= prev.length || targetIndex >= prev.length) return prev;
        const updated = [...prev];
        const [movedItem] = updated.splice(draggedIndex, 1);
        updated.splice(targetIndex, 0, movedItem);
        return updated;
      });
    } else if (listType === "requirements") {
      setRequirements((prev) => {
        if (draggedIndex >= prev.length || targetIndex >= prev.length) return prev;
        const updated = [...prev];
        const [movedItem] = updated.splice(draggedIndex, 1);
        updated.splice(targetIndex, 0, movedItem);
        return updated;
      });
    }
    setIsDirty(true);
  };

  const moveItem = (listType: ListType, index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    let list: string[] = [];
    if (listType === "outcomes") list = whatYoullLearn;
    else if (listType === "inclusions") list = includesList;
    else if (listType === "targetAudience") list = targetAudience;
    else if (listType === "requirements") list = requirements;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    handleReorder(listType, index, targetIndex);
  };

  // Module Accordion Toggle
  const toggleModuleAccordion = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Curriculum Management Handlers
  const addModule = () => {
    const newId = `mod-${Date.now()}`;
    const newMod: ModuleForm = {
      id: newId,
      title: `Module ${modules.length + 1}: Practical Application`,
      description: "Hands-on engineering methodology and industry best practices.",
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: "Lesson 1: Introduction to Implementation",
          durationText: "30m",
          videoUrl: "",
          isPreview: false,
          technicalSheetUrl: "",
        },
      ],
      hasQuiz: false,
      quiz: {
        title: "Module Knowledge Assessment",
        passingScore: 70,
        questions: [],
      },
    };
    setModules([...modules, newMod]);
    setExpandedModules((prev) => ({ ...prev, [newId]: true }));
    setIsDirty(true);
  };

  const removeModule = (mIdx: number) => {
    if (modules.length === 1) {
      alert("A course must have at least 1 module.");
      return;
    }
    setModules(modules.filter((_, i) => i !== mIdx));
    setIsDirty(true);
  };

  const updateModuleTitle = (mIdx: number, val: string) => {
    const copy = [...modules];
    copy[mIdx].title = val;
    setModules(copy);
    setIsDirty(true);
  };

  const updateModuleDesc = (mIdx: number, val: string) => {
    const copy = [...modules];
    copy[mIdx].description = val;
    setModules(copy);
    setIsDirty(true);
  };

  // Lesson Handlers
  const addLesson = (mIdx: number) => {
    const copy = [...modules];
    const newLes: LessonForm = {
      id: `les-${Date.now()}-${copy[mIdx].lessons.length + 1}`,
      title: `Lesson ${copy[mIdx].lessons.length + 1}: Technical Lecture`,
      durationText: "35m",
      videoUrl: "",
      isPreview: false,
      technicalSheetUrl: "",
    };
    copy[mIdx].lessons.push(newLes);
    setModules(copy);
    setIsDirty(true);
  };

  const removeLesson = (mIdx: number, lIdx: number) => {
    const copy = [...modules];
    if (copy[mIdx].lessons.length === 1) {
      alert("A module must contain at least 1 lesson.");
      return;
    }
    copy[mIdx].lessons = copy[mIdx].lessons.filter((_, i) => i !== lIdx);
    setModules(copy);
    setIsDirty(true);
  };

  const updateLesson = (mIdx: number, lIdx: number, field: keyof LessonForm, val: any) => {
    const copy = [...modules];
    copy[mIdx].lessons[lIdx] = { ...copy[mIdx].lessons[lIdx], [field]: val };
    setModules(copy);
    setIsDirty(true);
  };

  // Quiz Handlers
  const toggleQuiz = (mIdx: number) => {
    const copy = [...modules];
    copy[mIdx].hasQuiz = !copy[mIdx].hasQuiz;
    if (copy[mIdx].hasQuiz && !copy[mIdx].quiz.title) {
      copy[mIdx].quiz.title = `${copy[mIdx].title} Certification Assessment`;
    }
    setModules(copy);
    setIsDirty(true);
  };

  const updateQuizPassingScore = (mIdx: number, score: number) => {
    const copy = [...modules];
    copy[mIdx].quiz.passingScore = score;
    setModules(copy);
    setIsDirty(true);
  };

  const addQuestion = (mIdx: number) => {
    const copy = [...modules];
    const newQ: QuestionForm = {
      id: `q-${Date.now()}`,
      question: "Sample assessment inquiry: Verify conductor ampacity and derating factors.",
      options: [
        "Apply 0.82 ambient temperature correction factor",
        "Maintain baseline ampacity with zero derating",
        "Double the circuit breaker rating directly",
        "Bypass all junction box terminal blocks",
      ],
      correctOptionIndex: 0,
      explanation: "Conductor ampacity must be derated for elevated ambient temperatures per standards.",
    };
    copy[mIdx].quiz.questions.push(newQ);
    setModules(copy);
    setIsDirty(true);
  };

  const updateQuestion = (mIdx: number, qIdx: number, field: keyof QuestionForm, val: any) => {
    const copy = [...modules];
    copy[mIdx].quiz.questions[qIdx] = { ...copy[mIdx].quiz.questions[qIdx], [field]: val };
    setModules(copy);
    setIsDirty(true);
  };

  const updateOption = (mIdx: number, qIdx: number, optIdx: number, val: string) => {
    const copy = [...modules];
    copy[mIdx].quiz.questions[qIdx].options[optIdx] = val;
    setModules(copy);
    setIsDirty(true);
  };

  const removeQuestion = (mIdx: number, qIdx: number) => {
    const copy = [...modules];
    copy[mIdx].quiz.questions = copy[mIdx].quiz.questions.filter((_, i) => i !== qIdx);
    setModules(copy);
    setIsDirty(true);
  };

  // Draft Save Handler
  const handleSaveDraft = useCallback(async (isAutoSave = false) => {
    if (isSavingDraft || isPublishing) return;
    setIsSavingDraft(true);
    setSubmissionError(null);

    try {
      const payload = {
        courseId: currentCourseId,
        title: title.trim(),
        slug: slug.trim(),
        code: code.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        level,
        deliveryType,
        contactHours: Number(contactHours) || 40,
        price: Number(price) || 0,
        originalPrice: originalPrice !== "" ? Number(originalPrice) : null,
        thumbnailUrl: thumbnailUrl || "/images/hero/hero-commercial.jpg",
        promoVideoUrl: promoVideoUrl.trim() || null,
        badge: badge.trim() || null,
        instructorName: instructorName.trim() || "Engr. Asanga",
        whatYoullLearn: whatYoullLearn.filter((item) => item.trim().length > 0),
        includesList: includesList.filter((item) => item.trim().length > 0),
        targetAudience: targetAudience.filter((item) => item.trim().length > 0),
        requirements: requirements.filter((item) => item.trim().length > 0),
        publish: false,
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
          hasQuiz: m.hasQuiz,
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
                    explanation: q.explanation.trim() || "Assessment note.",
                  })),
              }
            : null,
        })),
      };

      const response = await fetch("/api/courses/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save draft");
      }

      // Update courseId and silently update URL if saving new course for first time
      if (data.courseId) {
        if (!currentCourseId) {
          setCurrentCourseId(data.courseId);
          if (typeof window !== "undefined") {
            window.history.replaceState(null, "", `/admin/courses/${data.courseId}/edit`);
          }
        }
      }

      const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setLastSaved(`Draft saved at ${nowStr}`);
      setIsDirty(false);
      showToast(isAutoSave ? `Draft auto-saved (${nowStr})` : "Draft saved successfully", "success");
    } catch (err: any) {
      console.error("Save draft error:", err);
      if (!isAutoSave) {
        showToast(err.message || "Failed to save draft", "error");
      }
    } finally {
      setIsSavingDraft(false);
    }
  }, [
    currentCourseId,
    title,
    slug,
    code,
    subtitle,
    description,
    level,
    deliveryType,
    contactHours,
    price,
    originalPrice,
    thumbnailUrl,
    promoVideoUrl,
    badge,
    instructorName,
    whatYoullLearn,
    includesList,
    targetAudience,
    requirements,
    modules,
    isSavingDraft,
    isPublishing
  ]);

  // Auto-Save 30-second interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty && (title.trim().length > 0 || modules.length > 0)) {
        handleSaveDraft(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isDirty, title, modules, handleSaveDraft]);

  // Publish Handler
  const handlePublish = async () => {
    setSubmissionError(null);

    // Validation
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

    setIsPublishing(true);

    try {
      const payload = {
        courseId: currentCourseId,
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
        publish: true,
        whatYoullLearn: whatYoullLearn.filter((item) => item.trim().length > 0),
        includesList: includesList.filter((item) => item.trim().length > 0),
        targetAudience: targetAudience.filter((item) => item.trim().length > 0),
        requirements: requirements.filter((item) => item.trim().length > 0),
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
          hasQuiz: m.hasQuiz,
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

      const response = await fetch("/api/courses/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to publish course");
      }

      showToast("Course published successfully to the live catalog!", "success");
      router.push("/admin");
    } catch (err: any) {
      setSubmissionError(err.message || "An unexpected error occurred while publishing the course.");
    } finally {
      setIsPublishing(false);
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
                  {mode === "edit" ? "STUDIO EDITOR" : "STUDIO ARCHITECT"}
                </span>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-xs text-slate-400 font-mono uppercase">
                  {mode === "edit" ? (initialCourse?.status === "PUBLISHED" ? "PUBLISHED PROGRAM" : "DRAFT CURRICULUM") : "NEW PROGRAM TEMPLATE"}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate max-w-md sm:max-w-xl">
                {title || "Untitled Solar Engineering Course"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-save timestamp indicator */}
            {lastSaved && (
              <span className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lastSaved}</span>
              </span>
            )}

            {/* Save Draft Button */}
            <button
              onClick={() => handleSaveDraft(false)}
              disabled={isSavingDraft || isPublishing}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Save changes as a draft without making public"
            >
              {isSavingDraft ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSavingDraft ? "Saving..." : "Save Draft"}</span>
            </button>

            {/* Publish to Catalog Button */}
            <button
              onClick={handlePublish}
              disabled={isSavingDraft || isPublishing}
              className="px-5 py-2 rounded-xl bg-[#2B82C9] hover:bg-sky-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Globe className="w-3.5 h-3.5" />
              )}
              <span>{isPublishing ? "Publishing..." : "Publish to Catalog"}</span>
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
                      onChange={(e) => {
                        setSlug(e.target.value.toLowerCase().trim());
                        setIsDirty(true);
                      }}
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
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase().trim());
                      setIsDirty(true);
                    }}
                    placeholder="PVOL202"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Subtitle / Target Hook
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => {
                      setSubtitle(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Comprehensive practical commissioning of multi-megawatt string inverters and energy storage systems"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs sm:text-sm"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Course Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Detailed syllabus overview and practical engineering capabilities acquired upon graduation..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs sm:text-sm leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Delivery, Pricing & Accreditation */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">1.2 Delivery Parameters, Hours &amp; Tuition (NGN)</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure pacing, contact hours, and accredited tuition fees.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Curriculum Level
                  </label>
                  <select
                    value={level}
                    onChange={(e: any) => {
                      setLevel(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
                  >
                    <option value="INTRODUCTORY">INTRODUCTORY</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                    <option value="COMPREHENSIVE_MASTERCLASS">COMPREHENSIVE MASTERCLASS</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Delivery Mode
                  </label>
                  <select
                    value={deliveryType}
                    onChange={(e: any) => {
                      setDeliveryType(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
                  >
                    <option value="SELF_PACED">Self-Paced (On-Demand)</option>
                    <option value="COHORT">Scheduled Live Cohort</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Contact Hours
                  </label>
                  <input
                    type="number"
                    value={contactHours}
                    onChange={(e) => {
                      setContactHours(Number(e.target.value));
                      setIsDirty(true);
                    }}
                    min={1}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Badge Callout
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => {
                      setBadge(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Industry Accredited"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Tuition Fee (NGN ₦) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      setPrice(Number(e.target.value));
                      setIsDirty(true);
                    }}
                    min={0}
                    step={1000}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono text-sm font-bold text-sky-400 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Original Strike Price (NGN ₦)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => {
                      setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value));
                      setIsDirty(true);
                    }}
                    min={0}
                    step={1000}
                    placeholder="Optional discount anchor"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                  />
                  {calculatedDiscount !== null && (
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                      Save {calculatedDiscount}%
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Lead Faculty / Mentor
                  </label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => {
                      setInstructorName(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Promo Video URL (HLS / MP4)
                  </label>
                  <input
                    type="text"
                    value={promoVideoUrl}
                    onChange={(e) => {
                      setPromoVideoUrl(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="https://.../preview.mp4"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            </div>

            {/* Thumbnail Selection & Upload */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">1.3 Course Media &amp; Thumbnail Art</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload an authentic high-resolution field photography asset or choose an official preset.
                  </p>
                </div>

                <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-white/10 max-w-fit">
                  <button
                    type="button"
                    onClick={() => setThumbnailSourceTab("upload")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      thumbnailSourceTab === "upload"
                        ? "bg-[#2B82C9] text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setThumbnailSourceTab("presets")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      thumbnailSourceTab === "presets"
                        ? "bg-[#2B82C9] text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Stock Presets</span>
                  </button>
                </div>
              </div>

              {thumbnailSourceTab === "upload" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      if (e.dataTransfer.files?.[0]) {
                        handleFileSelect(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`md:col-span-2 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                      dragOver
                        ? "border-sky-400 bg-sky-500/10"
                        : "border-white/15 bg-slate-950 hover:border-white/30 hover:bg-slate-900/50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 mb-3 shadow-inner">
                      {isUploading ? (
                        <RefreshCw className="w-6 h-6 animate-spin text-sky-400" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>

                    <p className="text-sm font-bold text-white mb-1">
                      {isUploading ? "Uploading Field Photography..." : "Click or drag & drop high-res thumbnail"}
                    </p>
                    <p className="text-xs text-slate-400 mb-3 font-mono">
                      PNG, JPG, or WEBP up to 5MB (16:9 widescreen recommended)
                    </p>

                    {uploadError && (
                      <p className="text-xs text-rose-400 font-semibold mt-2">{uploadError}</p>
                    )}
                  </div>

                  {/* Live Preview Card */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">Live Image Preview</span>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 bg-slate-950 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={localPreview || thumbnailUrl}
                        alt="Course Thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[10px] font-mono text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                          {thumbnailUrl}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {PRESET_THUMBNAILS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setThumbnailUrl(preset.url);
                        setLocalPreview(null);
                        setIsDirty(true);
                      }}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 text-left group transition-all cursor-pointer ${
                        thumbnailUrl === preset.url
                          ? "border-sky-400 ring-2 ring-sky-400/30"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 p-2 flex items-end">
                        <span className="text-[10px] font-bold text-white leading-tight">
                          {preset.label}
                        </span>
                      </div>
                      {thumbnailUrl === preset.url && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Learning Outcomes */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">1.4 LEARNING OUTCOMES</h2>
                <p className="text-xs text-slate-400 mt-1">
                  After completing the course, the learner should be able to:
                </p>
              </div>

              <div className="space-y-3">
                {whatYoullLearn.map((outcome, idx) => {
                  const isDragging = draggingItem?.listType === "outcomes" && draggingItem?.index === idx;
                  const isDragOver = dragOverItem?.listType === "outcomes" && dragOverItem?.index === idx && draggingItem?.index !== idx;

                  return (
                    <div
                      key={idx}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", `outcomes:${idx}`);
                        setDraggingItem({ listType: "outcomes", index: idx });
                      }}
                      onDragEnd={() => {
                        setDraggingItem(null);
                        setDragOverItem(null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverItem?.index !== idx || dragOverItem?.listType !== "outcomes") {
                          setDragOverItem({ listType: "outcomes", index: idx });
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggingItem(null);
                        setDragOverItem(null);
                        const data = e.dataTransfer.getData("text/plain");
                        if (!data) return;
                        const [sourceType, fromIndexStr] = data.split(":");
                        if (sourceType === "outcomes") {
                          const fromIndex = Number(fromIndexStr);
                          if (!isNaN(fromIndex)) {
                            handleReorder("outcomes", fromIndex, idx);
                          }
                        }
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm text-slate-200 transition-all group select-none ${
                        isDragging
                          ? "opacity-50 scale-[0.99] border-sky-400/50 bg-slate-900"
                          : isDragOver
                          ? "border-sky-400 bg-sky-500/10 shadow-lg ring-1 ring-sky-400/30"
                          : "bg-slate-950 border-white/10 hover:border-white/25"
                      }`}
                    >
                      <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 mr-1 shrink-0 transition-colors" />
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="flex-1 select-text">{outcome}</span>
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveItem("outcomes", idx, "up")}
                          className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === whatYoullLearn.length - 1}
                          onClick={() => moveItem("outcomes", idx, "down")}
                          className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeOutcome(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer ml-1"
                          title="Delete outcome"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addOutcome();
                      }
                    }}
                    placeholder="Add an actionable skill outcome and press Enter..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={addOutcome}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Outcome</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Course Includes Package */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">1.5 This Course Includes</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Deliverables, calculation spreadsheets, and certification deliverables.
                </p>
              </div>

              <div className="space-y-3">
                {includesList.map((inc, idx) => {
                  const isDragging = draggingItem?.listType === "inclusions" && draggingItem?.index === idx;
                  const isDragOver = dragOverItem?.listType === "inclusions" && dragOverItem?.index === idx && draggingItem?.index !== idx;

                  return (
                    <div
                      key={idx}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", `inclusions:${idx}`);
                        setDraggingItem({ listType: "inclusions", index: idx });
                      }}
                      onDragEnd={() => {
                        setDraggingItem(null);
                        setDragOverItem(null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverItem?.index !== idx || dragOverItem?.listType !== "inclusions") {
                          setDragOverItem({ listType: "inclusions", index: idx });
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggingItem(null);
                        setDragOverItem(null);
                        const data = e.dataTransfer.getData("text/plain");
                        if (!data) return;
                        const [sourceType, fromIndexStr] = data.split(":");
                        if (sourceType === "inclusions") {
                          const fromIndex = Number(fromIndexStr);
                          if (!isNaN(fromIndex)) {
                            handleReorder("inclusions", fromIndex, idx);
                          }
                        }
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm text-slate-200 transition-all group select-none ${
                        isDragging
                          ? "opacity-50 scale-[0.99] border-sky-400/50 bg-slate-900"
                          : isDragOver
                          ? "border-sky-400 bg-sky-500/10 shadow-lg ring-1 ring-sky-400/30"
                          : "bg-slate-950 border-white/10 hover:border-white/25"
                      }`}
                    >
                      <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 mr-1 shrink-0 transition-colors" />
                      <Award className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="flex-1 select-text">{inc}</span>
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveItem("inclusions", idx, "up")}
                          className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === includesList.length - 1}
                          onClick={() => moveItem("inclusions", idx, "down")}
                          className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeInclusion(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer ml-1"
                          title="Delete inclusion"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInclusion();
                      }
                    }}
                    placeholder="Add an included resource deliverable..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={addInclusion}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 1.6 Target Audience */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">1.6 Target Audience</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Define who should take this course (displayed under &apos;Who this course is for&apos; on the course page).
                </p>
              </div>

              <div className="space-y-3">
                {targetAudience.map((audience, idx) => {
                  const isDragging = draggingItem?.listType === "targetAudience" && draggingItem?.index === idx;
                  const isDragOver = dragOverItem?.listType === "targetAudience" && dragOverItem?.index === idx && draggingItem?.index !== idx;

                  return (
                    <div
                      key={idx}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", `targetAudience:${idx}`);
                        setDraggingItem({ listType: "targetAudience", index: idx });
                      }}
                      onDragEnd={() => {
                        setDraggingItem(null);
                        setDragOverItem(null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverItem?.index !== idx || dragOverItem?.listType !== "targetAudience") {
                          setDragOverItem({ listType: "targetAudience", index: idx });
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggingItem(null);
                        setDragOverItem(null);
                        const data = e.dataTransfer.getData("text/plain");
                        if (!data) return;
                        const [sourceType, fromIndexStr] = data.split(":");
                        if (sourceType === "targetAudience") {
                          const fromIndex = Number(fromIndexStr);
                          if (!isNaN(fromIndex)) {
                            handleReorder("targetAudience", fromIndex, idx);
                          }
                        }
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm text-slate-200 transition-all group select-none ${
                        isDragging
                          ? "opacity-50 scale-[0.99] border-sky-400/50 bg-slate-900"
                          : isDragOver
                          ? "border-sky-400 bg-sky-500/10 shadow-lg ring-1 ring-sky-400/30"
                          : "bg-slate-950 border-white/10 hover:border-white/25"
                      }`}
                    >
                      <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 mr-1 shrink-0 transition-colors" />
                      <Users className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="flex-1 select-text">{audience}</span>
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveItem("targetAudience", idx, "up")}
                          className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === targetAudience.length - 1}
                          onClick={() => moveItem("targetAudience", idx, "down")}
                          className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeAudience(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer ml-1"
                          title="Delete audience item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAudience();
                      }
                    }}
                    placeholder="e.g. Electrical engineers, technicians, and installers aiming for commercial EPC mastery"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={addAudience}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Audience</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 1.7 Course Prerequisites & Requirements */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">1.7 Course Prerequisites &amp; Requirements</h2>
                <p className="text-xs text-slate-400 mt-1">
                  List tools, background knowledge, or equipment students need before enrolling.
                </p>
              </div>

              <div className="space-y-3">
                {requirements.map((req, idx) => {
                  const isDragging = draggingItem?.listType === "requirements" && draggingItem?.index === idx;
                  const isDragOver = dragOverItem?.listType === "requirements" && dragOverItem?.index === idx && draggingItem?.index !== idx;

                  return (
                    <div
                      key={idx}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", `requirements:${idx}`);
                        setDraggingItem({ listType: "requirements", index: idx });
                      }}
                      onDragEnd={() => {
                        setDraggingItem(null);
                        setDragOverItem(null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragOverItem?.index !== idx || dragOverItem?.listType !== "requirements") {
                          setDragOverItem({ listType: "requirements", index: idx });
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggingItem(null);
                        setDragOverItem(null);
                        const data = e.dataTransfer.getData("text/plain");
                        if (!data) return;
                        const [sourceType, fromIndexStr] = data.split(":");
                        if (sourceType === "requirements") {
                          const fromIndex = Number(fromIndexStr);
                          if (!isNaN(fromIndex)) {
                            handleReorder("requirements", fromIndex, idx);
                          }
                        }
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm text-slate-200 transition-all group select-none ${
                        isDragging
                          ? "opacity-50 scale-[0.99] border-sky-400/50 bg-slate-900"
                          : isDragOver
                          ? "border-sky-400 bg-sky-500/10 shadow-lg ring-1 ring-sky-400/30"
                          : "bg-slate-950 border-white/10 hover:border-white/25"
                      }`}
                    >
                      <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 mr-1 shrink-0 transition-colors" />
                      <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="flex-1 select-text">{req}</span>
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveItem("requirements", idx, "up")}
                          className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === requirements.length - 1}
                          onClick={() => moveItem("requirements", idx, "down")}
                          className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRequirement(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer ml-1"
                          title="Delete requirement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addRequirement();
                      }
                    }}
                    placeholder="e.g. Basic understanding of electrical principles (Voltage, Current, Resistance)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Requirement</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setActiveTab("curriculum")}
                className="px-6 py-3 rounded-xl bg-[#2B82C9] hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
              >
                <span>Proceed to Tab 2: Curriculum &amp; Videos</span>
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MODULAR CURRICULUM & VIDEOS */}
        {activeTab === "curriculum" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-white/10">
              <div>
                <h2 className="text-lg font-bold text-white">2. Modular Syllabus &amp; Technical Lessons</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Organize chapters into progressive modules with video lectures and quizzes.
                </p>
              </div>

              <button
                type="button"
                onClick={addModule}
                className="px-4 py-2.5 rounded-xl bg-[#2B82C9] hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/20 cursor-pointer max-w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>Add Module Chapter</span>
              </button>
            </div>

            {/* Modules List */}
            <div className="space-y-5">
              {modules.map((mod, mIdx) => {
                const isExpanded = expandedModules[mod.id] ?? false;

                return (
                  <div
                    key={mod.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all"
                  >
                    {/* Module Accordion Header */}
                    <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-slate-900/90 border-b border-white/10">
                      <button
                        type="button"
                        onClick={() => toggleModuleAccordion(mod.id)}
                        className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                          {mIdx + 1}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                            {mod.title || `Module ${mIdx + 1}`}
                          </h3>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {mod.lessons.length} Lessons • {mod.hasQuiz ? "Includes Quiz Assessment" : "No Quiz"}
                          </span>
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeModule(mIdx)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleModuleAccordion(mod.id)}
                          className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Module Accordion Body */}
                    {isExpanded && (
                      <div className="p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-mono font-bold uppercase text-slate-300">
                              Module Title
                            </label>
                            <input
                              type="text"
                              value={mod.title}
                              onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-sky-400"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-mono font-bold uppercase text-slate-300">
                              Module Overview Description
                            </label>
                            <input
                              type="text"
                              value={mod.description}
                              onChange={(e) => updateModuleDesc(mIdx, e.target.value)}
                              placeholder="Key engineering methodologies acquired..."
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
                            />
                          </div>
                        </div>

                        {/* Lessons List within Module */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                              Lessons ({mod.lessons.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => addLesson(mIdx)}
                              className="px-3 py-1 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/15 text-white flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Lesson</span>
                            </button>
                          </div>

                          <div className="space-y-3">
                            {mod.lessons.map((les, lIdx) => (
                              <div
                                key={les.id}
                                className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 flex-1">
                                    <Video className="w-4 h-4 text-sky-400 shrink-0" />
                                    <input
                                      type="text"
                                      value={les.title}
                                      onChange={(e) => updateLesson(mIdx, lIdx, "title", e.target.value)}
                                      placeholder="Lesson title..."
                                      className="w-full bg-transparent text-xs font-bold text-white focus:outline-none border-b border-transparent focus:border-sky-400 pb-0.5"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeLesson(mIdx, lIdx)}
                                    className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                  <div>
                                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                                      Duration (e.g. 45m)
                                    </label>
                                    <input
                                      type="text"
                                      value={les.durationText}
                                      onChange={(e) => updateLesson(mIdx, lIdx, "durationText", e.target.value)}
                                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-mono text-slate-400 mb-1">
                                      Video Stream URL (HLS / MP4)
                                    </label>
                                    <input
                                      type="text"
                                      value={les.videoUrl}
                                      onChange={(e) => updateLesson(mIdx, lIdx, "videoUrl", e.target.value)}
                                      placeholder="https://.../stream.mp4"
                                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                                    />
                                  </div>

                                  <div className="flex items-center gap-2 pt-4">
                                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                                      <input
                                        type="checkbox"
                                        checked={les.isPreview}
                                        onChange={(e) => updateLesson(mIdx, lIdx, "isPreview", e.target.checked)}
                                        className="rounded border-white/20 bg-slate-900 text-sky-500 focus:ring-sky-500"
                                      />
                                      <span>Free Preview Lesson</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quiz Section within Module */}
                        <div className="pt-4 border-t border-white/10 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <HelpCircle className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                                Module Quiz Assessment
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleQuiz(mIdx)}
                              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                mod.hasQuiz
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-white/10 text-slate-300 hover:bg-white/15"
                              }`}
                            >
                              {mod.hasQuiz ? "Quiz Enabled" : "+ Enable Assessment"}
                            </button>
                          </div>

                          {mod.hasQuiz && (
                            <div className="p-5 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                                    Quiz Assessment Title
                                  </label>
                                  <input
                                    type="text"
                                    value={mod.quiz.title}
                                    onChange={(e) => {
                                      const copy = [...modules];
                                      copy[mIdx].quiz.title = e.target.value;
                                      setModules(copy);
                                      setIsDirty(true);
                                    }}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-emerald-400"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                                    Passing Score Threshold (%)
                                  </label>
                                  <input
                                    type="number"
                                    value={mod.quiz.passingScore}
                                    onChange={(e) => updateQuizPassingScore(mIdx, Number(e.target.value))}
                                    min={50}
                                    max={100}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                                  />
                                </div>
                              </div>

                              {/* Questions List */}
                              <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-mono text-slate-400">
                                    Questions ({mod.quiz.questions.length})
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => addQuestion(mIdx)}
                                    className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors cursor-pointer"
                                  >
                                    + Add Question
                                  </button>
                                </div>

                                {mod.quiz.questions.map((q, qIdx) => (
                                  <div
                                    key={q.id}
                                    className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-3"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-center gap-2 flex-1">
                                        <span className="text-xs font-mono font-bold text-emerald-400">
                                          Q{qIdx + 1}.
                                        </span>
                                        <input
                                          type="text"
                                          value={q.question}
                                          onChange={(e) => updateQuestion(mIdx, qIdx, "question", e.target.value)}
                                          className="w-full bg-transparent text-xs font-bold text-white focus:outline-none border-b border-white/10 focus:border-emerald-400 pb-1"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeQuestion(mIdx, qIdx)}
                                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Options */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                      {q.options.map((opt, optIdx) => (
                                        <div
                                          key={optIdx}
                                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
                                            q.correctOptionIndex === optIdx
                                              ? "border-emerald-500/50 bg-emerald-500/10"
                                              : "border-white/10 bg-slate-950"
                                          }`}
                                        >
                                          <input
                                            type="radio"
                                            name={`correct-${mod.id}-${q.id}`}
                                            checked={q.correctOptionIndex === optIdx}
                                            onChange={() => updateQuestion(mIdx, qIdx, "correctOptionIndex", optIdx)}
                                            className="text-emerald-500 focus:ring-emerald-500"
                                          />
                                          <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => updateOption(mIdx, qIdx, optIdx, e.target.value)}
                                            className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                                          />
                                        </div>
                                      ))}
                                    </div>

                                    <div>
                                      <input
                                        type="text"
                                        value={q.explanation}
                                        onChange={(e) => updateQuestion(mIdx, qIdx, "explanation", e.target.value)}
                                        placeholder="Explanation / technical rationale shown after answering..."
                                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-400 text-[11px] focus:outline-none focus:border-emerald-400"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("metadata")}
                className="px-5 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back to Tab 1: Metadata
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("review")}
                className="px-6 py-2.5 rounded-xl bg-[#2B82C9] hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
              >
                <span>Proceed to Tab 3: Live Preview</span>
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE PREVIEW & FINAL PUBLICATION */}
        {activeTab === "review" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">3. Public Student Catalog Preview</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect how this accredited program will appear to prospective candidates before saving or publishing.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveDraft(false)}
                  disabled={isSavingDraft || isPublishing}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingDraft ? "Saving..." : "Save Draft"}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isSavingDraft || isPublishing}
                  className="px-6 py-2.5 rounded-xl bg-[#2B82C9] hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>{isPublishing ? "Publishing..." : "Publish to Catalog"}</span>
                </button>
              </div>
            </div>

            {/* Mock Course Detail View */}
            <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Mock Banner */}
              <div className="p-6 sm:p-10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-white/10">
                <div className="max-w-4xl space-y-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold">
                      {code || "COURSE CODE"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-white/10 text-slate-300 text-xs font-mono uppercase">
                      {level}
                    </span>
                    {badge && (
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        {badge}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {title || "Untitled Solar Engineering Course"}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                    {subtitle || description || "Comprehensive accredited technical training syllabus."}
                  </p>

                  <div className="flex items-center flex-wrap gap-6 text-xs text-slate-400 pt-2 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-sky-400" />
                      <span>{contactHours} Contact Hours</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>{modules.length} Modules ({modules.reduce((s, m) => s + m.lessons.length, 0)} Lessons)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Official Certificate of Completion</span>
                    </span>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <span className="text-3xl font-black text-white font-mono">
                      ₦{Number(price).toLocaleString()}
                    </span>
                    {originalPrice && Number(originalPrice) > Number(price) && (
                      <span className="text-lg text-slate-500 line-through font-mono">
                        ₦{Number(originalPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mock Body */}
              <div className="p-6 sm:p-10 space-y-8 bg-slate-950/60">
                {/* Learning Outcomes */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                    What You&apos;ll Learn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {whatYoullLearn.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Who This Course Is For */}
                {targetAudience.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                      Who This Course Is For
                    </h3>
                    <div className="space-y-2">
                      {targetAudience.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <Users className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {requirements.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                      Requirements &amp; Prerequisites
                    </h3>
                    <div className="space-y-2">
                      {requirements.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Course Content Breakdown */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                    Course Content ({modules.length} Modules)
                  </h3>
                  <div className="space-y-2">
                    {modules.map((m, idx) => (
                      <div
                        key={m.id}
                        className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-sky-500/20 text-sky-400 font-mono font-bold flex items-center justify-center text-[11px]">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-white">{m.title}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {m.lessons.length} lessons {m.hasQuiz ? "• Quiz" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Alert Toast */}
      {toast?.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === "success"
              ? "bg-slate-900 text-emerald-300 border-emerald-500/40"
              : "bg-slate-900 text-rose-300 border-rose-500/40"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
