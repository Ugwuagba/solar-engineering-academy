/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');


// Read existing seed-data.ts to preserve the exact detailed Module 1-11 of Course 1
const currentSeedPath = path.join(__dirname, '../lib/seed-data.ts');
const currentSeedContent = fs.readFileSync(currentSeedPath, 'utf8');

// Extract Course 1 modules (from 'modules: [' up to the end of course 1)
const course1ModulesMatch = currentSeedContent.match(/modules:\s*\[\s*\{\s*title:\s*"Module 1: Introduction to Solar Energy"[\s\S]*?\}\s*\]\s*\}\s*,/);

if (!course1ModulesMatch) {
  console.error("Could not find Course 1 modules");
  process.exit(1);
}

const course1ModulesString = course1ModulesMatch[0].replace(/\}\s*,$/, '');

const fullSeedFile = `export interface SeedQuestion {
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface SeedLesson {
  title: string;
  sortOrder: number;
  videoUrl: string;
  durationSec: number;
  contentMarkdown: string;
  downloadableUrl?: string;
  isFreePreview: boolean;
}

export interface SeedModule {
  title: string;
  sortOrder: number;
  lessons: SeedLesson[];
  quiz: {
    title: string;
    passingScore: number;
    questions: SeedQuestion[];
  };
}

export interface SeedCourse {
  code: string;
  title: string;
  subtitle?: string;
  slug: string;
  description: string;
  instructor?: string;
  fieldAttachment?: string;
  level: "INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED";
  deliveryType: "SELF_PACED" | "COHORT";
  contactHours: number;
  price: number;
  priceNgn?: string;
  originalPriceNgn?: string;
  discountPercentage?: number;
  rating?: number;
  ratingCount?: number;
  studentsCount?: number;
  thumbnailImage: string;
  badge?: string;
  isPublished: boolean;
  whatYouWillLearn?: string[];
  requirements?: string[];
  targetAudience?: string[];
  includes?: string[];
  modules: SeedModule[];
  cohorts?: {
    name: string;
    startDate: string;
    endDate: string;
    maxCapacity: number;
  }[];
  tools: {
    title: string;
    format: string;
    fileSize: string;
    description: string;
  }[];
}

export const SEED_COURSES: SeedCourse[] = [
  // 1. Introduction to Solar System design, installation and maintenance training
  {
    code: "SOLAR101",
    title: "Introduction to Solar System design, installation and maintenance training",
    subtitle: "A Comprehensive Foundation in Solar Energy, PV Components, System Types, Power Audit, Load Assessment, System Sizing and Solar Entrepreneurship",
    slug: "solar-installation-101",
    instructor: "Engr. Asanga (Certified Solar Professional, 20+ Years Experience)",
    fieldAttachment: "Includes 2–4 Months Hands-on Practical Field Attachment with Industry Partners",
    description:
      "The definitive industry masterclass by Subway Schools & Subway Energy Limited. Master step-by-step photovoltaic system engineering, comprehensive site & roof power audits, equipment nameplate analysis, battery autonomy calculations, inverter sizing, and commercial installation safety. Includes practical field attachment.",
    level: "INTERMEDIATE",
    deliveryType: "SELF_PACED",
    contactHours: 48,
    price: 350,
    priceNgn: "₦150,000",
    originalPriceNgn: "₦180,000",
    discountPercentage: 17,
    rating: 4.9,
    ratingCount: 2450,
    studentsCount: 14200,
    thumbnailImage: "/images/courses/course-1-solar-intro.jpg",
    badge: "Bestseller",
    isPublished: true,
    whatYouWillLearn: [
      "Explain the fundamental principles of solar energy and how photovoltaic panels generate electricity",
      "Identify major solar-system components (inverters, batteries, panels, charge controllers) and their functions",
      "Differentiate between standalone, hybrid, and grid-connected solar power systems",
      "Conduct comprehensive residential and commercial solar power audits and electrical load assessments",
      "Interpret electrical equipment nameplates, load ratings, and manage phantom/vampire loads",
      "Assess site and roof characteristics, tilt angles, azimuth, walkways, and HSE rooftop safety considerations",
      "Professionally design and size solar inverters, battery banks (Lead-Acid & Lithium), panels, and charge controllers",
      "Master the Solar Companion Technical Reference: surge multipliers, power factor, depth of discharge, and temperature deratings",
      "Identify common causes of solar-system failures and apply industry-standard preventative maintenance",
      "Launch and scale profitable service and product-oriented solar businesses in the renewable energy industry"
    ],
    requirements: [
      "Basic addition and subtraction knowledge",
      "No electrical knowledge required as the course introduces many fundamental concepts progressively",
      "No previous professional solar installation experience is required for beginners",
      "Dedication to complete hands-on practical exercises and field attachment preparation"
    ],
    targetAudience: [
      "Beginners seeking professional knowledge of solar PV systems",
      "Aspiring solar installation technicians and electrical practitioners",
      "Electrical and power engineering students",
      "Engineers seeking foundational solar PV knowledge and practical field skills",
      "Solar-energy entrepreneurs and business developers",
      "Marketers and project managers interested in the solar industry"
    ],
    includes: [
      "48 hours on-demand technical video lectures",
      "10 structured chapters + complete Solar Companion Technical Reference",
      "Two hard copies of official Subway Schools engineering textbooks",
      "2 to 4 months intensive practical field attachment with industry partner EPCs",
      "Downloadable power audit field logs, single-line CAD diagrams, and Excel sizing engines",
      "Subway Schools Accredited Certificate of Completion",
      "Full lifetime access on mobile and desktop devices"
    ],
    cohorts: [
      {
        name: "Q2 2026 Practical Field Attachment Cohort",
        startDate: "2026-05-01T09:00:00Z",
        endDate: "2026-08-31T17:00:00Z",
        maxCapacity: 40,
      },
      {
        name: "Q3 2026 Industrial Technicians Cohort",
        startDate: "2026-09-01T09:00:00Z",
        endDate: "2026-12-20T17:00:00Z",
        maxCapacity: 35,
      },
    ],
    tools: [
      {
        title: "Subway Energy Power Audit Field Log & Load Profile Template",
        format: ".XLSX / Print PDF",
        fileSize: "3.2 MB",
        description: "Standardized residential and commercial appliance audit worksheet with peak surge multipliers and phantom load calculations."
      },
      {
        title: "Solar Companion Engineering Sizing Reference Guide",
        format: ".PDF",
        fileSize: "6.8 MB",
        description: "Complete technical reference handbook covering inverter power factors, battery DOD curves, and PERC module temperature coefficients."
      },
      {
        title: "Roof Structural & Electrical Single-Line Schematic Template",
        format: ".DWG / .PDF",
        fileSize: "5.4 MB",
        description: "Ready-to-use AutoCAD drawings for residential hybrid inverters, DC combiners, and AC changeover bypass panels."
      }
    ],
    ${course1ModulesString}
  },

  // 2. Advanced Solar System design, Installation and maintenance
  {
    code: "SOLAR201",
    title: "Advanced Solar System design, Installation and maintenance",
    subtitle: "Master High-Voltage String Inverters, Commercial AC Couplings, Advanced Protection & Utility Interconnection Standards",
    slug: "advanced-solar-design-installation",
    instructor: "Engr. Asanga & C&I Engineering Specialists",
    fieldAttachment: "Includes 2–4 Months Advanced Industrial Field Attachment",
    description:
      "A rigorous, advanced engineering program for practicing technicians and engineers. Dive deep into high-voltage 1000V/1500V DC string sizing, multi-MPPT optimization, transformerless grid interconnection, harmonic suppression, thermal imaging thermography, and utility compliance.",
    level: "ADVANCED",
    deliveryType: "SELF_PACED",
    contactHours: 40,
    price: 380,
    priceNgn: "₦170,000",
    originalPriceNgn: "₦210,000",
    discountPercentage: 19,
    rating: 4.9,
    ratingCount: 1120,
    studentsCount: 6800,
    thumbnailImage: "/images/courses/course-2-solar-advanced.jpg",
    badge: "Hot & New",
    isPublished: true,
    whatYouWillLearn: [
      "Design and configure high-voltage DC arrays up to 1000V and 1500V architecture safely",
      "Synchronize multiple commercial hybrid string inverters in parallel with shared battery banks",
      "Model AC-coupled retrofits for large facilities with existing diesel backup generators",
      "Calculate fault current levels, short-circuit withstand, and arc-flash boundaries (NEC 70E)",
      "Perform thermographic inspection with FLIR cameras to detect hotspots, bypassed diodes, and cell micro-cracks",
      "Execute commissioning protocols and complete full utility interconnection single-line diagrams (SLD)"
    ],
    requirements: [
      "Completion of Solar Installation 101 or verifiable basic solar electrical experience",
      "Understanding of alternating current (AC) and direct current (DC) circuits",
      "Familiarity with digital multimeters and clamp meters"
    ],
    targetAudience: [
      "Practicing solar installers wanting to transition to commercial projects",
      "Electrical engineers and project supervisors",
      "Maintenance technicians responsible for facility solar systems",
      "EPC technical directors"
    ],
    includes: [
      "40 hours on-demand advanced video training",
      "Commercial AutoCAD Single-Line Diagram templates (480V 3-Phase)",
      "FLIR Thermal Analysis report template",
      "2–4 months field attachment on active commercial PV projects",
      "Accredited Certificate in Advanced Solar Engineering"
    ],
    tools: [
      {
        title: "AutoCAD Commercial 3-Phase Single-Line Diagram Pack",
        format: ".DWG / .PDF",
        fileSize: "7.8 MB",
        description: "Commercial switchgear, rapid shutdown, and utility net-metering interconnection schematics."
      },
      {
        title: "Voltage Drop & Conductor Sizing Engine (NEC compliant)",
        format: ".XLSX",
        fileSize: "2.4 MB",
        description: "Automated calculations for long DC runs, temperature deratings, and conduit fill factors."
      }
    ],
    modules: [
      {
        title: "Module 1: High-Voltage DC Strings & Multi-MPPT Inverter Architecture",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: 1000V & 1500V Commercial String Sizing & Extreme Weather Calculations",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 2100,
            isFreePreview: true,
            contentMarkdown: "### Commercial String Design\\nCalculations for maximum Voc at sub-zero temperatures and minimum Vmp during hot summer peak irradiation."
          },
          {
            title: "Lesson 1.2: Multi-MPPT Configurations for Complex Roof Azimuths & Orientations",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            durationSec: 1950,
            isFreePreview: false,
            contentMarkdown: "### MPPT Channel Independent Operation\\nHow multi-tracker inverters eliminate inter-row mismatch losses."
          }
        ],
        quiz: {
          title: "Module 1 Quiz: High-Voltage Array Engineering",
          passingScore: 70,
          questions: [
            {
              text: "Under NEC 690.7, what temperature coefficient must be applied to determine the maximum string voltage for equipment rating?",
              options: ["Temperature coefficient of Pmax", "Temperature coefficient of Voc at lowest expected ambient", "Temperature coefficient of Isc", "Standard ambient 25°C"],
              correctOptionIndex: 1,
              explanation: "Voc rises as temperature drops; string sizing must ensure array Voc never exceeds the inverter maximum DC limit at the lowest recorded local temperature."
            }
          ]
        }
      },
      {
        title: "Module 2: AC Coupling & Generator Synchronization",
        sortOrder: 2,
        lessons: [
          {
            title: "Lesson 2.1: AC Coupling Frequency Shift Power Control (FSPC)",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            durationSec: 2400,
            isFreePreview: false,
            contentMarkdown: "### Frequency Shift Control\\nHow battery inverters shift grid frequency (50.5Hz - 52Hz) to throttle grid-tied inverters when batteries are full."
          },
          {
            title: "Lesson 2.2: Diesel Generator Auto-Start, Reverse Power Protection & Microgrid Coordination",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            durationSec: 2200,
            isFreePreview: false,
            contentMarkdown: "### Generator Hybrid Controls\\nPreventing solar power backfeed into generator windings to prevent reverse power tripping."
          }
        ],
        quiz: {
          title: "Module 2 Quiz: AC Coupling Dynamics",
          passingScore: 70,
          questions: [
            {
              text: "What happens if a grid-tied PV inverter pushes excess current into a synchronous diesel generator during low load?",
              options: ["Generator speed drops", "Generator acts as a motor and trips on reverse power", "Inverter increases power", "Fuel efficiency increases"],
              correctOptionIndex: 1,
              explanation: "Backfeeding power into a diesel generator can drive it as a motor, potentially causing mechanical catastrophic damage or reverse-power relay trips."
            }
          ]
        }
      }
    ]
  },

  // 3. The Solar Fast-track blueprint
  {
    code: "FAST301",
    title: "The Solar Fast-track blueprint",
    subtitle: "Rapid Deployment Framework for Residential & Light-Commercial PV Sizing, Supplier Sourcing & High-Margin Execution",
    slug: "solar-fast-track-blueprint",
    instructor: "Engr. Asanga",
    fieldAttachment: "Includes 2 Months Partner Field Attachment",
    description:
      "A fast-paced, high-efficiency blueprint designed to take you from concept to your first completed solar installation in weeks. Learn streamlined load auditing, plug-and-play system selection, avoiding common contractor pitfalls, and closing client contracts.",
    level: "INTRODUCTORY",
    deliveryType: "SELF_PACED",
    contactHours: 20,
    price: 220,
    priceNgn: "₦95,000",
    originalPriceNgn: "₦120,000",
    discountPercentage: 21,
    rating: 4.8,
    ratingCount: 940,
    studentsCount: 8150,
    thumbnailImage: "/images/courses/course-3-solar-fasttrack.jpg",
    badge: "Fast Track",
    isPublished: true,
    whatYouWillLearn: [
      "Deploy functional residential solar systems using standardized equipment packages",
      "Conduct a 15-minute quick-audit for homes and small commercial businesses",
      "Source certified Tier-1 panels, inverters, and lithium batteries from verified suppliers",
      "Price solar installation jobs accurately with healthy profit margins",
      "Use professional client proposal templates to win bids faster"
    ],
    requirements: [
      "No prior electrical background needed",
      "A passion for renewable energy and practical entrepreneurship"
    ],
    targetAudience: [
      "Entrepreneurs wanting to start a solar business quickly",
      "Homeowners seeking to design and oversee their own home installation",
      "Real estate professionals and contractors"
    ],
    includes: [
      "20 hours condensed actionable video modules",
      "Ready-to-use Client Quotation & Sizing Spreadsheet",
      "Verified Tier-1 Distributor Directory",
      "Certificate of Completion"
    ],
    tools: [
      {
        title: "Fast-Track Residential Solar Sizing Calculator",
        format: ".XLSX",
        fileSize: "1.8 MB",
        description: "Plug in client appliances to immediately calculate required inverter kVA, battery kWh, and solar wattage."
      }
    ],
    modules: [
      {
        title: "Module 1: The 15-Minute Load Audit & Rapid Sizing Matrix",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: Fast-Track Appliance Tallying & Peak Load Identification",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 1500,
            isFreePreview: true,
            contentMarkdown: "### Rapid Load Auditing\\nHow to accurately estimate energy consumption using client electricity bills and major appliance power tallies."
          }
        ],
        quiz: {
          title: "Module 1 Quiz: Rapid Load Sizing",
          passingScore: 70,
          questions: [
            {
              text: "What rule of thumb multiplier should be applied to motor compressor loads for inverter surge headroom?",
              options: ["1.0x", "1.5x", "3.0x to 4.0x", "10.0x"],
              correctOptionIndex: 2,
              explanation: "Inductive compressor startup surge is typically 3 to 4 times the continuous running wattage."
            }
          ]
        }
      }
    ]
  },

  // 4. Introduction to Commercial, Industrial and Mini Grid Solar System Design, Installation and Maintenance
  {
    code: "CIGID101",
    title: "Introduction to Commercial, Industrial and Mini Grid Solar System Design, Installation and Maintenance",
    subtitle: "Foundational Engineering for Megawatt Rooftop Arrays, Industrial Three-Phase Hybrid Systems, and Rural Microgrids",
    slug: "intro-commercial-industrial-minigrid",
    instructor: "Engr. Asanga & Power Systems Faculty",
    fieldAttachment: "Includes 2–4 Months Field Attachment on C&I Rooftops",
    description:
      "Bridge the gap between residential setups and heavy commercial/industrial infrastructure. Learn three-phase 415V/480V electrical distribution, commercial cable sizing, roof structural integrity checks, and mini-grid architecture.",
    level: "INTERMEDIATE",
    deliveryType: "SELF_PACED",
    contactHours: 36,
    price: 360,
    priceNgn: "₦160,000",
    originalPriceNgn: "₦195,000",
    discountPercentage: 18,
    rating: 4.9,
    ratingCount: 1310,
    studentsCount: 7420,
    thumbnailImage: "/images/courses/course-4-c-and-i-intro.jpg",
    badge: "Accredited",
    isPublished: true,
    whatYouWillLearn: [
      "Understand the electrical and structural fundamentals of commercial rooftop and ground-mount PV",
      "Analyze three-phase industrial electrical distribution boards and tie-in points",
      "Select commercial string inverters and centralized inverter stations",
      "Comply with HSE working-at-heights and industrial electrical safety protocols",
      "Understand mini-grid power balance and distribution principles"
    ],
    requirements: [
      "Basic electrical or solar foundation recommended",
      "Familiarity with AC power systems (voltage, current, frequency)"
    ],
    targetAudience: [
      "Solar technicians aiming to enter commercial and industrial sectors",
      "Industrial facility managers and plant engineers",
      "Renewable energy project coordinators"
    ],
    includes: [
      "36 hours of focused commercial solar video lectures",
      "C&I Single Line Diagram Templates",
      "Rooftop Ballasted Mounting Structural Guide",
      "2–4 months C&I project field attachment",
      "Subway Schools Accredited Certificate"
    ],
    tools: [
      {
        title: "Commercial PV BOQ & Materials Takeoff Worksheet",
        format: ".XLSX",
        fileSize: "3.5 MB",
        description: "Comprehensive bill of quantities generator for industrial commercial rooftop installations."
      }
    ],
    modules: [
      {
        title: "Module 1: Three-Phase Commercial Electrical Distribution",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: 415V/480V 3-Phase Busbar Interconnection & Main Switchboards",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 1800,
            isFreePreview: true,
            contentMarkdown: "### Industrial Switchboards\\nSupply-side vs load-side interconnection rules and busbar ampacity rating checks."
          }
        ],
        quiz: {
          title: "Module 1 Quiz: Commercial Distribution",
          passingScore: 70,
          questions: [
            {
              text: "What is the standard line-to-line AC voltage for commercial three-phase distribution in Nigeria and the UK?",
              options: ["220V", "400V - 415V", "600V", "1000V"],
              correctOptionIndex: 1,
              explanation: "Commercial 3-phase low voltage distribution operates at 400V to 415V line-to-line (230V line-to-neutral)."
            }
          ]
        }
      }
    ]
  },

  // 5. Advance Commercial Solar System Design, Installation and maintenance Training
  {
    code: "CIGID201",
    title: "Advance Commercial Solar System Design, Installation and maintenance Training",
    subtitle: "Comprehensive Utility-Scale Engineering: PVSyst Modeling, Medium-Voltage Transformers, Demand Charge Shaving & Substation Interconnection",
    slug: "advance-commercial-solar-training",
    instructor: "Engr. Asanga & Lead Utility Engineers",
    fieldAttachment: "Includes 3 Months Megawatt Substation & Ground-Mount Attachment",
    description:
      "Advanced training for utility-scale EPC engineers. Master complex PVSyst loss diagrams, medium-voltage step-up transformers (11kV/33kV), substation protection relays, peak demand shaving automation, and bankable financial models.",
    level: "ADVANCED",
    deliveryType: "COHORT",
    contactHours: 50,
    price: 450,
    priceNgn: "₦200,000",
    originalPriceNgn: "₦250,000",
    discountPercentage: 20,
    rating: 4.9,
    ratingCount: 890,
    studentsCount: 4920,
    thumbnailImage: "/images/courses/course-5-c-and-i-advanced.jpg",
    badge: "Masterclass",
    isPublished: true,
    whatYouWillLearn: [
      "Build bankable energy yield simulations in PVSyst with horizon and 3D shading analysis",
      "Specify medium-voltage (MV) oil-immersed step-up transformers and ring main units (RMU)",
      "Design utility-grade substation grounding grids, lightning protection masts, and surge arresters",
      "Program power plant controllers (PPC) for reactive power (Q) control and curtailment",
      "Lead commissioning, testing, and acceptance (CTA) for megawatt-scale solar installations"
    ],
    requirements: [
      "Solid understanding of commercial solar or degree in electrical/power engineering",
      "Experience with single-line schematics and commercial installations"
    ],
    targetAudience: [
      "Lead solar engineers and EPC project directors",
      "Utility power engineers and grid operators",
      "Technical consultants conducting bankable feasibility studies"
    ],
    includes: [
      "50 hours in-depth utility engineering modules",
      "PVSyst .PAN and .OND component database pack",
      "Medium-Voltage Substation Design Blueprints",
      "3-month physical field attachment on utility/C&I sites",
      "Advanced Subway Schools Professional Diploma"
    ],
    tools: [
      {
        title: "PVSyst Simulation Parameter & Loss Diagram Template",
        format: ".PDF / .XLSX",
        fileSize: "5.1 MB",
        description: "Full loss breakdown guide: soiling, IAM, thermal deratings, inverter clipping, and ohmic losses."
      }
    ],
    modules: [
      {
        title: "Module 1: PVSyst Modeling & Energy Yield Analysis",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: 3D Shading Scene Creation & Horizon Import",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 2400,
            isFreePreview: true,
            contentMarkdown: "### PVSyst Shading Modeling\\nImporting digital elevation models and modeling near-field obstacles for bankable P50/P90 generation reports."
          }
        ],
        quiz: {
          title: "Module 1 Quiz: PVSyst Yield Assessment",
          passingScore: 70,
          questions: [
            {
              text: "What does a P90 energy generation figure represent to project lenders and banks?",
              options: ["90% of maximum inverter rating", "A conservative production estimate that has a 90% probability of being exceeded", "90 days of peak sunlight", "90% performance ratio"],
              correctOptionIndex: 1,
              explanation: "P90 is the conservative annual generation forecast where there is a 90% statistical probability that actual output will meet or exceed that value."
            }
          ]
        }
      }
    ]
  },

  // 6. Mini Grid Solar System Design, Installation and Maintenance
  {
    code: "MINI301",
    title: "Mini Grid Solar System Design, Installation and Maintenance",
    subtitle: "Engineering Islanded & Community Microgrids: Generation Asset Sizing, Smart Pre-Paid Metering, Low-Voltage Distribution & SCADA Monitoring",
    slug: "minigrid-solar-system-design",
    instructor: "Engr. Asanga & Rural Electrification Specialists",
    fieldAttachment: "Includes 3 Months Rural Mini-Grid Field Deployment",
    description:
      "A complete operational curriculum for designing, deploying, and running off-grid solar mini-grids for communities and commercial clusters. Covers demand forecasting, hybrid PV-diesel-storage dispatch, 400V reticulation networks, and pre-paid smart metering.",
    level: "ADVANCED",
    deliveryType: "COHORT",
    contactHours: 44,
    price: 400,
    priceNgn: "₦180,000",
    originalPriceNgn: "₦220,000",
    discountPercentage: 18,
    rating: 4.9,
    ratingCount: 780,
    studentsCount: 4100,
    thumbnailImage: "/images/courses/course-6-minigrid.jpg",
    badge: "Specialized",
    isPublished: true,
    whatYouWillLearn: [
      "Model community load curves, productive use of energy (PUE), and seasonal demand",
      "Design containerized solar and battery energy storage microgrid powerhouses",
      "Engineer 400V three-phase overhead low-voltage distribution networks and poles",
      "Deploy STS-compliant smart pre-paid metering, token vending, and revenue collection",
      "Implement remote GSM/satellite SCADA telemetry for real-time mini-grid monitoring"
    ],
    requirements: [
      "Intermediate understanding of solar PV and electrical power distribution",
      "Familiarity with off-grid inverters and battery systems"
    ],
    targetAudience: [
      "Engineers working on Rural Electrification Agency (REA) projects",
      "Mini-grid developers and EPC contractors",
      "NGO and development agency technical officers"
    ],
    includes: [
      "44 hours on-demand and live cohort workshops",
      "Community Load Survey & Demand Forecasting Toolkit",
      "Reticulation Network Bill of Engineering Measurement (BEME)",
      "3 months field deployment on operating mini-grids",
      "Accredited Mini-Grid Engineer Certificate"
    ],
    tools: [
      {
        title: "Mini-Grid Sizing & Tariff Financial Model",
        format: ".XLSX",
        fileSize: "4.6 MB",
        description: "Complete financial and technical modeling sheet balancing CAPEX, OPEX, LCOE, and tariff structures."
      }
    ],
    modules: [
      {
        title: "Module 1: Community Energy Demand Profiling & Generation Sizing",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: Productive Use of Energy (PUE) & Daily Load Sizing",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 2100,
            isFreePreview: true,
            contentMarkdown: "### Community Load Modeling\\nBalancing daytime grain milling and welding loads with nighttime residential lighting demand."
          }
        ],
        quiz: {
          title: "Module 1 Quiz: Mini-Grid Sizing",
          passingScore: 70,
          questions: [
            {
              text: "Why are Productive Use of Energy (PUE) loads critical to the economic viability of a rural mini-grid?",
              options: ["They consume energy at night", "They generate daytime commercial demand that improves revenue and plant load factor", "They require no batteries", "They eliminate distribution lines"],
              correctOptionIndex: 1,
              explanation: "Productive daytime loads (mills, pumps, cold storage) utilize solar power directly without battery round-trip losses, generating higher local revenue."
            }
          ]
        }
      }
    ]
  },

  // 7. Introduction to Battery Fabrication
  {
    code: "BATT101",
    title: "Introduction to Battery Fabrication",
    subtitle: "Hands-on Cell Sorting, Internal Resistance Testing, Spot Welding Nickel Strips & Building Safe Lithium-Ion Battery Packs",
    slug: "intro-battery-fabrication",
    instructor: "Engr. Asanga & Battery Cell Specialists",
    fieldAttachment: "Includes 2 Months Battery Lab Attachment",
    description:
      "A hands-on practical masterclass teaching you how to fabricate custom lithium battery packs from scratch. Master cell chemistry, internal resistance grading, spot-welding nickel tabs, BMS installation, and pack thermal protection.",
    level: "INTRODUCTORY",
    deliveryType: "SELF_PACED",
    contactHours: 24,
    price: 280,
    priceNgn: "₦125,000",
    originalPriceNgn: "₦155,000",
    discountPercentage: 19,
    rating: 4.8,
    ratingCount: 1420,
    studentsCount: 9300,
    thumbnailImage: "/images/courses/course-7-battery-fabrication.jpg",
    badge: "Practical Workshop",
    isPublished: true,
    whatYouWillLearn: [
      "Differentiate between 18650, 21700, 32700, and prismatic lithium cell chemistries",
      "Use internal resistance (mΩ) meters and capacity testers to grade and match cells",
      "Operate precision capacitive and transformer spot welders with pure nickel strips",
      "Calculate series (S) and parallel (P) configurations for required voltage and amp-hours",
      "Wire Battery Management System (BMS) balance leads, temperature sensors, and main terminals"
    ],
    requirements: [
      "Basic interest in electronics and electrical safety",
      "No previous fabrication experience required"
    ],
    targetAudience: [
      "Solar technicians wanting to build and repair custom lithium batteries",
      "Electronics technicians and makers",
      "Entrepreneurs wanting to start a battery assembly business"
    ],
    includes: [
      "24 hours step-by-step practical video demonstrations",
      "Battery Pack Series/Parallel Configuration Matrix",
      "BMS Wiring Diagrams & Safety Guidelines",
      "2 months battery laboratory attachment",
      "Certificate of Battery Fabrication Competence"
    ],
    tools: [
      {
        title: "Lithium Pack Sizing & Busbar Current Density Sheet",
        format: ".XLSX",
        fileSize: "2.1 MB",
        description: "Calculates nickel strip width/thickness requirements for target continuous discharge ampacity."
      }
    ],
    modules: [
      {
        title: "Module 1: Lithium Cell Selection & Internal Resistance Grading",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: Cell Chemistry Comparison: Li-Ion NMC vs LiFePO4",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 1800,
            isFreePreview: true,
            contentMarkdown: "### Lithium Chemistries\\nNominal voltages (3.2V for LFP vs 3.7V for NMC), cycle life, and thermal runaway thresholds."
          }
        ],
        quiz: {
          title: "Module 1 Quiz: Cell Selection",
          passingScore: 70,
          questions: [
            {
              text: "What is the nominal voltage of a single Lithium Iron Phosphate (LiFePO4) cell?",
              options: ["1.2V", "2.0V", "3.2V", "3.7V"],
              correctOptionIndex: 2,
              explanation: "LiFePO4 cells operate at a nominal voltage of 3.2V (fully charged at 3.65V, discharged at 2.5V)."
            }
          ]
        }
      }
    ]
  },

  // 8. Advance Battery Demystified Training
  {
    code: "BATT201",
    title: "Advance Battery Demystified Training",
    subtitle: "In-Depth Lithium Iron Phosphate (LiFePO4) Engineering: Smart Bluetooth/CAN-Bus BMS Architecture, Thermal Runway Prevention & UL 9540A Compliance",
    slug: "advance-battery-demystified-training",
    instructor: "Engr. Asanga & Energy Storage Directors",
    fieldAttachment: "Includes 2 Months Utility BESS Lab Attachment",
    description:
      "The definitive deep-dive into stationary Lithium Iron Phosphate energy storage. Master smart BMS protocols (Pylontech, Victron, Deye CAN communication), active capacitive balancing, state of charge algorithms, and battery fire safety compliance.",
    level: "ADVANCED",
    deliveryType: "SELF_PACED",
    contactHours: 32,
    price: 340,
    priceNgn: "₦150,000",
    originalPriceNgn: "₦185,000",
    discountPercentage: 19,
    rating: 4.9,
    ratingCount: 1050,
    studentsCount: 5600,
    thumbnailImage: "/images/courses/course-8-battery-advanced.jpg",
    badge: "Advanced Tech",
    isPublished: true,
    whatYouWillLearn: [
      "Assemble and compress 100Ah, 280Ah, and 304Ah large-format prismatic LiFePO4 cells",
      "Configure Smart BMS parameters via Bluetooth and PC software (charging cutoffs, cell delta thresholds)",
      "Set up CAN-Bus and RS485 closed-loop communication between batteries and hybrid inverters",
      "Implement active balancing boards (2A - 5A) to eliminate cell drifting in high-capacity banks",
      "Comply with international safety standards (UL 1973, UL 9540, and NFPA 855)"
    ],
    requirements: [
      "Understanding of basic electrical circuits and battery terminology",
      "Completion of Introduction to Battery Fabrication or equivalent experience"
    ],
    targetAudience: [
      "Advanced solar installers and battery technicians",
      "Energy storage system designers and C&I contractors",
      "Engineers specifying stationary commercial battery storage"
    ],
    includes: [
      "32 hours advanced battery engineering training",
      "Smart BMS CAN Communication Protocol Cheat Sheet",
      "Battery Enclosure Thermal Venting & Fire Safety Guide",
      "2 months utility BESS testing lab attachment",
      "Advanced Battery Systems Specialist Certification"
    ],
    tools: [
      {
        title: "BMS Parameter Configuration & CAN-Bus Protocol Matrix",
        format: ".PDF / .JSON",
        fileSize: "3.4 MB",
        description: "Standard parameters for Pace, Seplos, JK, and Daly smart BMS connected to Deye/Victron inverters."
      }
    ],
    modules: [
      {
        title: "Module 1: Large-Format Prismatic Cells & Mechanical Compression",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: Prismatic Cell Swelling, Epoxy Sheet Insulation & Fixture Clamping (300kgf)",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 2100,
            isFreePreview: true,
            contentMarkdown: "### Prismatic Cell Mechanics\\nWhy high-capacity LiFePO4 cells require spring-loaded mechanical clamping to prevent delamination during deep cycling."
          }
        ],
        quiz: {
          title: "Module 1 Quiz: Prismatic Cell Assembly",
          passingScore: 70,
          questions: [
            {
              text: "Why must large prismatic LiFePO4 cells be clamped under mechanical compression in an enclosure?",
              options: ["To keep them cold", "To prevent cell expansion during charging and prevent internal electrode delamination", "To increase voltage", "To block electromagnetic interference"],
              correctOptionIndex: 1,
              explanation: "LiFePO4 electrodes naturally expand slightly during charging; proper mechanical compression prevents micro-gaps and preserves 6,000+ cycle life."
            }
          ]
        }
      }
    ]
  },

  // 9. Solar Generator Training
  {
    code: "GEN101",
    title: "Solar Generator Training",
    subtitle: "Design, Assembling & Servicing Portable Solar Power Stations: MPPT Charge Circuits, Pure Sine Wave Inverters & Mobile Solar Charging",
    slug: "solar-generator-training",
    instructor: "Engr. Asanga & Hardware Lab Technicians",
    fieldAttachment: "Includes 2 Months Electronics Service Attachment",
    description:
      "Learn how to build, repair, and commercialize all-in-one portable solar generators. Covers lightweight lithium power packs, pure sine wave high-frequency inverter boards, multi-voltage DC outputs (USB-C PD, 12V automotive), and fast solar charging.",
    level: "INTRODUCTORY",
    deliveryType: "SELF_PACED",
    contactHours: 18,
    price: 200,
    priceNgn: "₦90,000",
    originalPriceNgn: "₦110,000",
    discountPercentage: 18,
    rating: 4.8,
    ratingCount: 980,
    studentsCount: 6700,
    thumbnailImage: "/images/courses/course-9-solar-generator.jpg",
    badge: "Hands-on",
    isPublished: true,
    whatYouWillLearn: [
      "Understand the internal schematic of integrated portable solar generators",
      "Assemble high-frequency pure sine wave inverters with lithium battery packs in rugged enclosures",
      "Wire DC fast-charge controllers compatible with portable folding solar panels",
      "Integrate LCD power display gauges showing remaining runtime and watts in/out",
      "Diagnose and repair common solar generator inverter board and cell faults"
    ],
    requirements: [
      "No prior electrical qualifications needed",
      "Basic understanding of tools (soldering iron, wire strippers, multimeter)"
    ],
    targetAudience: [
      "Technicians wanting to produce and sell portable solar generators",
      "Electronic repairers and solar entrepreneurs",
      "Individuals wanting reliable portable clean backup power"
    ],
    includes: [
      "18 hours hands-on video tutorials",
      "Complete Component Sourcing & Wiring Diagram Blueprint",
      "Fault Diagnosis Flowchart",
      "2 months workshop attachment",
      "Certificate of Solar Generator Assembly"
    ],
    tools: [
      {
        title: "Portable Solar Generator Sizing & Component Sourcing Guide",
        format: ".PDF",
        fileSize: "2.8 MB",
        description: "Complete bill of materials, supplier links, and case schematics for 500W, 1000W, and 2000W power stations."
      }
    ],
    modules: [
      {
        title: "Module 1: Integrated Power Station Architecture",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: Component Layout: Battery, Inverter, Charger & Thermal Management",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 1800,
            isFreePreview: true,
            contentMarkdown: "### Power Station Internal Architecture\\nInternal shielding, fan cooling airflow, and isolating high-voltage AC from low-voltage DC."
          }
        ],
        quiz: {
          title: "Module 1 Quiz: Generator Architecture",
          passingScore: 70,
          questions: [
            {
              text: "Which type of inverter waveform is essential in a portable solar generator to safely power medical devices, laptops, and refrigerators?",
              options: ["Modified sine wave", "Square wave", "Pure sine wave", "Sawtooth wave"],
              correctOptionIndex: 2,
              explanation: "Pure sine wave inverters produce clean AC identical to grid power, preventing overheating and damage to sensitive electronics."
            }
          ]
        }
      }
    ]
  },

  // 10. CCTV Installation
  {
    code: "CCTV101",
    title: "CCTV Installation",
    subtitle: "Professional IP Surveillance, Solar-Powered Camera Stations, PoE Networking, NVR Storage Sizing & Remote Mobile Streaming Setup",
    slug: "cctv-installation",
    instructor: "Engr. Asanga & Security Systems Engineers",
    fieldAttachment: "Includes 2 Months Security Integration Field Attachment",
    description:
      "A complete professional training program on modern CCTV and video surveillance installations. Learn IP camera configuration, Power over Ethernet (PoE) switches, NVR storage sizing, solar-powered standalone surveillance poles with 4G/LTE connectivity, and remote phone monitoring.",
    level: "INTRODUCTORY",
    deliveryType: "SELF_PACED",
    contactHours: 24,
    price: 220,
    priceNgn: "₦100,000",
    originalPriceNgn: "₦125,000",
    discountPercentage: 20,
    rating: 4.9,
    ratingCount: 1650,
    studentsCount: 11200,
    thumbnailImage: "/images/courses/course-10-cctv-installation.jpg",
    badge: "Job Ready",
    isPublished: true,
    whatYouWillLearn: [
      "Select and mount IP dome, bullet, and PTZ surveillance cameras for optimal coverage",
      "Terminate Cat6 ethernet cables with RJ45 connectors (T568B standard) and test continuity",
      "Configure Network Video Recorders (NVR), hard disk storage calculators, and H.265+ compression",
      "Design and install standalone solar-powered CCTV stations with 4G SIM router links for remote farms and highways",
      "Set up dynamic DNS, port forwarding, and mobile apps for remote real-time surveillance"
    ],
    requirements: [
      "No previous security system background required",
      "Basic computer literacy for software configuration"
    ],
    targetAudience: [
      "Aspiring security systems installers and technicians",
      "Solar technicians wanting to add CCTV installation to their services",
      "Property managers, IT technicians, and entrepreneurs"
    ],
    includes: [
      "24 hours comprehensive CCTV video lectures",
      "CCTV Bandwidth & Hard Drive Storage Sizing Calculator",
      "Solar-Powered Camera Station Wiring Diagram",
      "2 months practical field attachment with security partners",
      "Certified CCTV Systems Technician Certificate"
    ],
    tools: [
      {
        title: "CCTV Storage & Bandwidth Engineering Calculator",
        format: ".XLSX",
        fileSize: "1.9 MB",
        description: "Calculates required NVR hard drive terabytes based on camera resolution, frame rate, and retention days."
      }
    ],
    modules: [
      {
        title: "Module 1: IP Cameras, Lens Focal Length & Mounting Geometry",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: Camera Types (Dome vs Bullet vs PTZ) & DORI Standards (Detect, Observe, Recognize, Identify)",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 1800,
            isFreePreview: true,
            contentMarkdown: "### DORI Surveillance Standards\\nCalculating distance requirements for target detection, observation, license plate recognition, and positive facial identification."
          }
        ],
        quiz: {
          title: "Module 1 Quiz: Camera Optics & Standards",
          passingScore: 70,
          questions: [
            {
              text: "Which wiring pinout standard is most commonly used for terminating Cat6 RJ45 patch cables in CCTV installations?",
              options: ["T568A", "T568B", "Crossover standard", "Coaxial standard"],
              correctOptionIndex: 1,
              explanation: "T568B is the universal commercial standard for terminating straight-through RJ45 patch cables."
            }
          ]
        }
      }
    ]
  }
];
`;

fs.writeFileSync(currentSeedPath, fullSeedFile, 'utf8');
console.log('Successfully updated lib/seed-data.ts with all 10 courses!');
