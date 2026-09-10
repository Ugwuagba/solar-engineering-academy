"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ArrowRight, Check } from "lucide-react";

interface CarouselCourse {
  title: string;
  instructor: string;
  rating: number;
  ratingCount: number;
  price: string;
  originalPrice: string;
  badge?: "Bestseller" | "Hot & New" | "Practical" | "Entrepreneurship" | "Practical Attachment Included";
  image: string;
  slug: string;
  categories: string[];
  updatedDate: string;
  durationText: string;
  summary: string;
  objectives: string[];
}

const COURSES: CarouselCourse[] = [
  {
    title: "Solar System Design, Installation & Maintenance (Solar 101)",
    instructor: "Engr. Asanga",
    rating: 4.9,
    ratingCount: 2840,
    price: "₦150,000",
    originalPrice: "₦250,000",
    badge: "Bestseller",
    image: "/images/hero/hero-academy.jpg",
    slug: "solar-installation-101",
    categories: ["All Solar Programs", "Photovoltaic Installation", "Power Audits & Sizing"],
    updatedDate: "Updated September 2026",
    durationText: "48 contact hours · Professional Foundation",
    summary: "Comprehensive masterclass covering foundational PV physics, site load assessment, battery sizing, inverter selection, and preventative maintenance.",
    objectives: [
      "Master solar PV system sizing & precision power audits",
      "Design commercial inverters & battery backup systems",
      "Includes 2–4 months practical partner attachment",
    ],
  },
  {
    title: "Commercial & Industrial (C&I) Mini-Grid Design",
    instructor: "Subway Technical Faculty",
    rating: 4.8,
    ratingCount: 980,
    price: "₦180,000",
    originalPrice: "₦260,000",
    badge: "Hot & New",
    image: "/images/hero/hero-commercial.jpg",
    slug: "commercial-industrial-solar",
    categories: ["All Solar Programs", "Photovoltaic Installation", "Inverters & Storage (BESS)"],
    updatedDate: "Updated September 2026",
    durationText: "40 contact hours · Advanced C&I",
    summary: "Engineering multi-hundred kilowatt rooftop arrays, three-phase synchronization, medium-voltage distribution, and transformer isolation.",
    objectives: [
      "Engineer utility-scale C&I solar arrays & single-line diagrams",
      "Perform harmonic analysis & medium-voltage interconnection",
      "Analyze multi-year facility ROI & diesel displacement economics",
    ],
  },
  {
    title: "Battery Energy Storage Systems (BESS) & Lithium Safety",
    instructor: "Engr. Asanga",
    rating: 4.9,
    ratingCount: 1150,
    price: "₦140,000",
    originalPrice: "₦200,000",
    badge: "Bestseller",
    image: "/images/hero/hero-urban.jpg",
    slug: "bess-201",
    categories: ["All Solar Programs", "Inverters & Storage (BESS)"],
    updatedDate: "Updated September 2026",
    durationText: "24 contact hours · Storage Specialist",
    summary: "High-yield battery storage bank engineering, modular LiFePO4 rack integration, BMS balancing, and thermal runaway prevention.",
    objectives: [
      "Assemble, configure, and balance LiFePO4 lithium battery banks",
      "Program smart BMS communication protocols & low-voltage cutoffs",
      "Implement NFPA 855 fire safety & thermal mitigation protocols",
    ],
  },
  {
    title: "Solar Power Auditing, Load Profiling & Sizing Masterclass",
    instructor: "Subway Energy Engineers",
    rating: 4.7,
    ratingCount: 740,
    price: "₦95,000",
    originalPrice: "₦140,000",
    badge: "Practical",
    image: "/images/solutions/factory-roof.jpg",
    slug: "power-audit-masterclass",
    categories: ["All Solar Programs", "Power Audits & Sizing", "Photovoltaic Installation"],
    updatedDate: "Updated September 2026",
    durationText: "18 contact hours · Practical Auditing",
    summary: "Scientific facility electrical auditing, power analyzer deployment, inductive surge analysis, and precision ROI modeling.",
    objectives: [
      "Conduct professional onsite electrical power and load audits",
      "Identify vampire loads and calculate inductive motor surges",
      "Generate bankable technical audit reports and ROI proposals",
    ],
  },
  {
    title: "Solar Business, Contracting & Project Financing",
    instructor: "Subway Schools",
    rating: 4.8,
    ratingCount: 610,
    price: "₦85,000",
    originalPrice: "₦120,000",
    badge: "Entrepreneurship",
    image: "/images/solutions/field-work.jpg",
    slug: "solar-entrepreneurship",
    categories: ["All Solar Programs", "Solar Entrepreneurship"],
    updatedDate: "Updated September 2026",
    durationText: "16 contact hours · Commercial Strategy",
    summary: "Blueprint for launching and scaling a profitable renewable energy enterprise, client contracting, procurement, and EPC project delivery.",
    objectives: [
      "Draft standard EPC contracts, warranties, and service agreements",
      "Structure solar lease, PPA, and commercial milestone financing",
      "Source quality OEM equipment and establish distribution channels",
    ],
  },
  {
    title: "Mini Grid Solar System Design, Installation and Maintenance",
    instructor: "Subway Engineering Faculty",
    rating: 4.9,
    ratingCount: 890,
    price: "₦220,000",
    originalPrice: "₦310,000",
    badge: "Hot & New",
    image: "/images/courses/course-6-minigrid.jpg",
    slug: "minigrid-solar-system-design",
    categories: ["All Solar Programs", "Photovoltaic Installation", "Inverters & Storage (BESS)"],
    updatedDate: "Updated September 2026",
    durationText: "44 contact hours · Grid Architecture",
    summary: "Decentralized community mini-grid generation, smart metering, AC/DC bus coupling, and high-reliability hybrid generation.",
    objectives: [
      "Design rural & industrial mini-grid generation architectures",
      "Configure synchronized multi-cluster inverter power hubs",
      "Implement prepaid smart metering & remote SCADA telemetry",
    ],
  },
  {
    title: "Introduction to Battery Fabrication & Cell Management",
    instructor: "Engr. Asanga",
    rating: 4.8,
    ratingCount: 1040,
    price: "₦130,000",
    originalPrice: "₦185,000",
    badge: "Bestseller",
    image: "/images/courses/course-7-battery-fabrication.jpg",
    slug: "intro-battery-fabrication",
    categories: ["All Solar Programs", "Inverters & Storage (BESS)"],
    updatedDate: "Updated September 2026",
    durationText: "32 contact hours · Cell Engineering",
    summary: "Hands-on battery fabrication from individual prismatic and cylindrical cells, spot-welding busbars, and active cell balancing.",
    objectives: [
      "Test, sort, and match internal resistance of lithium cells",
      "Assemble custom lithium packs with pure copper nickel busbars",
      "Integrate active balancing circuits & smart Bluetooth BMS",
    ],
  },
  {
    title: "CCTV Installation & Solar Security Systems Integration",
    instructor: "Subway Systems Engineers",
    rating: 4.8,
    ratingCount: 520,
    price: "₦75,000",
    originalPrice: "₦110,000",
    badge: "Practical",
    image: "/images/courses/course-10-cctv-installation.jpg",
    slug: "cctv-installation",
    categories: ["All Solar Programs", "Photovoltaic Installation"],
    updatedDate: "Updated September 2026",
    durationText: "14 contact hours · Security Integration",
    summary: "Standalone solar-powered surveillance, IP camera deployment, NVR network configuration, and wireless transmission links.",
    objectives: [
      "Deploy off-grid solar camera poles with dedicated battery storage",
      "Configure IP cameras, PoE switches, NVRs, and remote mobile viewing",
      "Design perimeter surveillance with night vision and motion analytics",
    ],
  },
];

const TABS = [
  "All Solar Programs",
  "Photovoltaic Installation",
  "Inverters & Storage (BESS)",
  "Power Audits & Sizing",
  "Solar Entrepreneurship",
];

export default function CourseCarouselSection() {
  const [activeTab, setActiveTab] = useState("All Solar Programs");
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Hover Popover State
  const [hoveredCourse, setHoveredCourse] = useState<CarouselCourse | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{
    top: number;
    left: number;
    placement: "right" | "left";
  } | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter courses based on active tab
  const filteredCourses =
    activeTab === "All Solar Programs"
      ? COURSES
      : COURSES.filter((c) => c.categories.includes(activeTab));

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    const handleScroll = () => {
      checkScroll();
      // Dismiss flyout immediately if user scrolls the carousel
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setHoveredCourse(null);
      setFlyoutPos(null);
    };

    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [filteredCourses]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  // Hover Popover Handlers
  const handleMouseEnterCard = (course: CarouselCourse, slug: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      const cardEl = cardRefs.current[slug];
      if (!cardEl || !sectionRef.current) return;

      const cardRect = cardEl.getBoundingClientRect();
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      // Smart boundary detection: check if there is at least 360px on right side
      const spaceOnRight = windowWidth - cardRect.right;
      const placement = spaceOnRight >= 360 ? "right" : "left";

      // Calculate position relative to section container
      const top = Math.max(10, cardRect.top - sectionRect.top);
      const left =
        placement === "right"
          ? cardRect.right - sectionRect.left + 12
          : cardRect.left - sectionRect.left - 330 - 12;

      setFlyoutPos({ top, left, placement });
      setHoveredCourse(course);
    }, 300);
  };

  const handleMouseLeaveCard = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredCourse(null);
      setFlyoutPos(null);
    }, 200);
  };

  const handleFlyoutMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  const handleFlyoutMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredCourse(null);
      setFlyoutPos(null);
    }, 200);
  };

  const getBadgeClass = (badge?: CarouselCourse["badge"]) => {
    switch (badge) {
      case "Bestseller":
        return "bg-amber-100 text-amber-900";
      case "Hot & New":
        return "bg-rose-100 text-rose-800";
      case "Practical":
      case "Practical Attachment Included":
        return "bg-sky-100 text-sky-800";
      case "Entrepreneurship":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <section ref={sectionRef} className="bg-white py-16 border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Skills to Transform Your Energy Career
          </h2>
          <p className="text-base text-slate-600 mt-2">
            From foundational solar PV principles to high-voltage industrial engineering, Subway Schools supports your professional accreditation.
          </p>
        </div>

        {/* Category Tabs (Segmented strip like Udemy) */}
        <div className="mt-8 border-b border-slate-200">
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-px">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setHoveredCourse(null);
                    setFlyoutPos(null);
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
                    }
                  }}
                  className={`pb-3 text-sm whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                    isActive
                      ? "border-slate-900 font-semibold text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-900 font-medium"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Carousel Wrapper */}
        <div className="relative mt-6 group/carousel">
          {/* Floating Circular Left Navigation Arrow */}
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous courses"
            className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-xl border border-slate-200 p-3 hover:bg-slate-50 z-20 transition-all duration-200 cursor-pointer ${
              canScrollLeft
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>

          {/* Floating Circular Right Navigation Arrow */}
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next courses"
            className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-xl border border-slate-200 p-3 hover:bg-slate-50 z-20 transition-all duration-200 cursor-pointer ${
              canScrollRight
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </button>

          {/* Display Grid / Horizontal Flex Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar py-4 px-1"
          >
            {filteredCourses.map((course) => (
              <div
                key={course.slug}
                ref={(el) => {
                  cardRefs.current[course.slug] = el;
                }}
                onMouseEnter={() => handleMouseEnterCard(course, course.slug)}
                onMouseLeave={handleMouseLeaveCard}
                className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 min-w-[280px] max-w-[280px] h-[370px] flex-shrink-0 relative cursor-pointer group"
              >
                <Link
                  href={`/courses/${course.slug}`}
                  className="flex flex-col justify-between h-full w-full focus:outline-none"
                >
                  {/* Top Details Stack */}
                  <div className="w-full">
                    {/* Image: w-full h-[155px] rounded-lg overflow-hidden object-cover mb-3 */}
                    <div className="w-full h-[155px] rounded-lg overflow-hidden relative mb-3 bg-slate-100">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Title: text-sm font-bold text-slate-900 line-clamp-2 leading-snug */}
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug min-h-[38px] group-hover:text-[#2B82C9] transition-colors">
                      {course.title}
                    </h3>

                    {/* Instructor: text-xs text-slate-500 mt-1 */}
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {course.instructor}
                    </p>

                    {/* Star Rating: 4.8 / 4.9 in font-bold text-amber-900 text-xs with yellow stars */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="font-bold text-amber-900 text-xs">
                        {course.rating.toFixed(1)}
                      </span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">
                        ({course.ratingCount.toLocaleString()})
                      </span>
                    </div>
                  </div>

                  {/* Bottom Price & Badge Stack */}
                  <div className="w-full pt-2">
                    {/* Price: Bold price with muted strikethrough original price */}
                    <div className="flex items-baseline">
                      <span className="text-base font-bold text-slate-900">
                        {course.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-2">
                        {course.originalPrice}
                      </span>
                    </div>

                    {/* Status Badge: Small rounded pill at bottom */}
                    {course.badge && (
                      <div className="mt-2">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded w-fit inline-block ${getBadgeClass(
                            course.badge
                          )}`}
                        >
                          {course.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Udemy-Style Hover Popover (Flyout) */}
        <AnimatePresence>
          {hoveredCourse && flyoutPos && (
            <motion.div
              initial={{
                opacity: 0,
                x: flyoutPos.placement === "right" ? -8 : 8,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: flyoutPos.placement === "right" ? -8 : 8,
              }}
              transition={{ duration: 0.15 }}
              style={{
                top: flyoutPos.top,
                left: flyoutPos.left,
              }}
              onMouseEnter={handleFlyoutMouseEnter}
              onMouseLeave={handleFlyoutMouseLeave}
              className="hidden md:block absolute w-[330px] bg-white rounded-xl shadow-2xl border border-slate-200 p-5 text-left text-slate-900 z-50 pointer-events-auto"
            >
              {/* Little triangle pointer pointing back to parent card */}
              <div
                className={`absolute top-8 w-3.5 h-3.5 bg-white transform rotate-45 ${
                  flyoutPos.placement === "right"
                    ? "-left-2 border-l border-b border-slate-200"
                    : "-right-2 border-r border-t border-slate-200"
                }`}
              />

              {/* Course Title: text-base font-bold text-slate-900 leading-snug */}
              <h4 className="text-base font-bold text-slate-900 leading-snug">
                {hoveredCourse.title}
              </h4>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {hoveredCourse.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${getBadgeClass(
                      hoveredCourse.badge
                    )}`}
                  >
                    {hoveredCourse.badge}
                  </span>
                )}
                <span className="text-[11px] font-semibold text-emerald-700">
                  {hoveredCourse.updatedDate}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                {hoveredCourse.durationText}
              </div>

              {/* Course Short Summary: text-xs text-slate-600 leading-relaxed my-2.5 */}
              <p className="text-xs text-slate-600 leading-relaxed my-2.5">
                {hoveredCourse.summary}
              </p>

              {/* 3 Key Learning Bullets with Checkmarks */}
              <div className="space-y-2 my-3">
                {hoveredCourse.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 leading-tight">
                      {obj}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Link
                href={`/courses/${hoveredCourse.slug}`}
                className="w-full bg-[#2B82C9] hover:bg-sky-600 text-white font-semibold py-2.5 rounded-lg text-sm shadow-md transition-colors text-center block mt-4"
              >
                Enroll Now
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Link */}
        <div className="mt-8 pt-4 flex items-center justify-between border-t border-slate-100">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2B82C9] hover:text-[#226ba8] transition-colors group"
          >
            <span>Show all Solar Energy courses</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
