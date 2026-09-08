export interface SeedQuestion {
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
  slug: string;
  description: string;
  level: "INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED";
  deliveryType: "SELF_PACED" | "COHORT";
  contactHours: number;
  price: number;
  isPublished: boolean;
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
  {
    code: "PVOL101",
    title: "Commercial & Industrial Solar PV Design",
    slug: "pvol101",
    description:
      "A rigorous, NABCEP-aligned masterclass on designing code-compliant commercial & industrial PV systems. Master solar irradiance modeling, string sizing under extreme ambient temperatures, inverter clipping calculations, NEC 690/705 electrical balance of systems, and AutoCAD single-line diagrams.",
    level: "INTERMEDIATE",
    deliveryType: "SELF_PACED",
    contactHours: 40,
    price: 350,
    isPublished: true,
    tools: [
      {
        title: "AutoCAD Commercial Single-Line Diagram (SLD) Template",
        format: ".DWG / .PDF",
        fileSize: "8.4 MB",
        description: "Standardized 480V 3-phase commercial PV interconnection schematic with rapid shutdown, switchgear, and utility bi-directional metering."
      },
      {
        title: "NEC 690.7 Extreme Temperature String Sizing Engine",
        format: ".XLSX",
        fileSize: "2.1 MB",
        description: "Automated calculation sheet utilizing ASHRAE weather station data for -20°C to +45°C temperature coefficient derating."
      },
      {
        title: "Commercial PV Bill of Quantities (BOQ) & Estimator",
        format: ".XLSX",
        fileSize: "3.5 MB",
        description: "Full materials takeoff sheet including racking ballasts, copper conductors, DC combiner boxes, and balance-of-system."
      }
    ],
    modules: [
      {
        title: "Module 1: Solar Irradiance, Sun Paths & Shading Analysis",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: Solar Geometry, Zenith Angle & Plane-of-Array (POA) Irradiance",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 1800,
            isFreePreview: true,
            downloadableUrl: "/downloads/PVOL101-M1-SunPath-Calculations.pdf",
            contentMarkdown: `### Overview of Solar Radiation on Tilted Surfaces
In commercial PV engineering, calculating accurate **Plane-of-Array (POA) Irradiance** is paramount. POA is composed of three distinct components:

1. **Beam (Direct) Irradiance ($G_b$):** Rays received directly from the sun disk.
2. **Diffuse Irradiance ($G_d$):** Sunlight scattered by molecules and aerosols in the atmosphere (modeled via Perez or Hay-Davies anisotropic sky models).
3. **Albedo (Ground-Reflected) Irradiance ($G_r$):**
   $$\\text{Albedo} = \\rho \\times G_{h} \\times \\frac{1 - \\cos(\\beta)}{2}$$
   where $\\rho$ is the ground reflectance (typically $0.2$ for aged asphalt, $0.8$ for fresh white TPO cool roof membranes).

#### Sun Path & Solar Time vs Civil Time
Civil time must be adjusted using the **Equation of Time (EoT)** and longitude difference to calculate exact Solar Zenith ($\\theta_z$) and Solar Azimuth ($\\gamma_s$):
$$\\text{Solar Time} = \\text{Local Standard Time} + 4 \\times (\\text{LSTM} - \\text{Local Longitude}) + \\text{EoT}$$`
          },
          {
            title: "Lesson 1.2: Horizon Shading, Near-Obstacle 3D LiDAR & Solar Access Value (SAV)",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            durationSec: 2100,
            isFreePreview: false,
            downloadableUrl: "/downloads/PVOL101-M1-LiDAR-Analysis-Guide.pdf",
            contentMarkdown: `### 3D Shading & Solar Access Quantification
Commercial rooftops are congested with HVAC units, parapet walls, and vents. 

#### Shading Derating Metrics:
- **Solar Access Value (SAV):** Percentage of annual solar energy available at a specific point on the roof compared to an unobstructed horizon.
- **Tilt and Orientation Factor (TOF):** The percentage of maximum solar irradiance received based solely on tilt and azimuth.
- **Total Solar Resource Fraction (TSRF):**
  $$\\text{TSRF} = \\text{SAV} \\times \\text{TOF}$$

Engineers must maintain minimum row-to-row spacing using the winter solstice 10:00 AM to 2:00 PM rule to eliminate inter-row shading losses:
$$\\text{Row Spacing } D = L \\times \\frac{\\sin(\\beta + \\text{Solar Altitude})}{\\sin(\\text{Solar Altitude})}$$`
          },
          {
            title: "Lesson 1.3: Meteorological Datasets (TMY3, NSRDB) & Inter-annual Variability (P50/P90)",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            durationSec: 1950,
            isFreePreview: false,
            downloadableUrl: "/downloads/PVOL101-M1-TMY3-Datasets.zip",
            contentMarkdown: `### Typical Meteorological Year (TMY3) vs Actual Meteorological Year (AMY)
Bankability of commercial solar projects hinges on statistical confidence intervals:

- **P50 Energy Estimate:** Expected annual yield under median 50% probability conditions.
- **P90 Energy Estimate:** Conservative yield with 90% statistical probability of exceedance, required by project financiers for debt service coverage ratios (DSCR).

$$\\text{P90} = \\text{P50} \\times (1 - 1.282 \\times \\sigma_{\\text{total}})$$
Where $\\sigma_{\\text{total}}$ incorporates resource variability, measurement sensor uncertainty, and PV model degradation uncertainties.`
          }
        ],
        quiz: {
          title: "Module 1 Assessment: Solar Geometry & Irradiance Modeling",
          passingScore: 70,
          questions: [
            {
              text: "A commercial TPO white membrane roof exhibits an albedo coefficient of 0.80. If global horizontal irradiance (GHI) is 900 W/m² and the PV tilt angle is 10°, what is the ground-reflected irradiance component on the plane of array?",
              options: [
                "Approximately 5.4 W/m²",
                "Approximately 45.2 W/m²",
                "Approximately 128.0 W/m²",
                "Approximately 360.0 W/m²"
              ],
              correctOptionIndex: 0,
              explanation: "Ground-reflected irradiance = GHI * albedo * (1 - cos(beta)) / 2. Here: 900 * 0.80 * (1 - cos(10°)) / 2 = 720 * (1 - 0.9848) / 2 = 720 * 0.01519 / 2 ≈ 5.47 W/m²."
            },
            {
              text: "Which statistical confidence metric is standardly mandated by commercial tax-equity financiers to evaluate project debt service coverage?",
              options: [
                "P10 Yield",
                "P50 Yield",
                "P90 Yield",
                "P99 Yield"
              ],
              correctOptionIndex: 2,
              explanation: "P90 estimates represent a 90% probability of exceedance, providing the financial conservatism required for institutional debt underwriting."
            },
            {
              text: "What is the Total Solar Resource Fraction (TSRF) of an array with a Solar Access Value (SAV) of 94% and a Tilt and Orientation Factor (TOF) of 96%?",
              options: [
                "90.24%",
                "95.00%",
                "98.50%",
                "88.10%"
              ],
              correctOptionIndex: 0,
              explanation: "TSRF = SAV * TOF = 0.94 * 0.96 = 0.9024 or 90.24%."
            }
          ]
        }
      },
      {
        title: "Module 2: String Sizing, Inverter Matching & NEC 690 Compliance",
        sortOrder: 2,
        lessons: [
          {
            title: "Lesson 2.1: Maximum System Voltage Calculation per NEC 690.7",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            durationSec: 2400,
            isFreePreview: false,
            downloadableUrl: "/downloads/PVOL101-M2-NEC690-String-Sizing.xlsx",
            contentMarkdown: `### NEC 690.7 Maximum DC Voltage Requirements
Under the National Electrical Code (NEC), photovoltaic system voltage must be calculated based on the lowest expected ambient temperature ($T_{\\text{min}}$).

#### Formula:
$$V_{\\text{oc-max}} = V_{\\text{oc-stc}} \\times \\left[1 + \\beta_{V_{\\text{oc}}} \\times (T_{\\text{min}} - 25^\\circ\\text{C})\\right]$$

- $V_{\\text{oc-stc}}$: Open-circuit voltage at Standard Test Conditions ($25^\\circ\\text{C}, 1000\\text{ W/m}^2$).
- $\\beta_{V_{\\text{oc}}}$: Temperature coefficient of $V_{\\text{oc}}$ (typically negative, e.g., $-0.28\\%/^\\circ\\text{C}$).
- $T_{\\text{min}}$: Extreme annual minimum temperature from ASHRAE climatic tables.

For commercial systems, string length $N$ must satisfy:
$$N \\times V_{\\text{oc-max}} \\le 1000\\text{ V (or 1500 V for utility-scale systems)}$$`
          },
          {
            title: "Lesson 2.2: MPPT Voltage Windows, Inverter Clipping & DC-to-AC Ratios (ILR)",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            durationSec: 2200,
            isFreePreview: false,
            contentMarkdown: `### Inverter Loading Ratio (ILR) Optimization
The DC-to-AC ratio (or Inverter Loading Ratio) balances levelized cost of electricity (LCOE) against inverter clipping loss:
$$\\text{ILR} = \\frac{P_{\\text{dc, STC}}}{P_{\\text{ac, rated}}}$$

Modern commercial installations target ILRs between **1.25 and 1.45**. 
- Lower CAPEX per peak watt.
- Inverter operates closer to peak efficiency curve across lower morning/late afternoon irradiance hours.
- Clipping losses are typically under 1.5% annually while gaining 8-12% energy in shoulder hours.`
          },
          {
            title: "Lesson 2.3: Overcurrent Protection Devices (OCPD) & Ampacity Derating per NEC 690.8",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            durationSec: 2100,
            isFreePreview: false,
            downloadableUrl: "/downloads/PVOL101-M2-Conductor-Derating-Table.pdf",
            contentMarkdown: `### Conductor Sizing & Continuous Duty Multipliers
Per NEC 690.8(A)(1), PV source circuit maximum current is:
$$I_{\\text{max}} = 1.25 \\times I_{\\text{sc-stc}}$$

The conductor ampacity must withstand the continuous current multiplier (125%) plus temperature and conduit bundling adjustment factors:
$$I_{\\text{rated}} = \\frac{1.25 \\times I_{\\text{max}}}{\\text{Temp Factor} \\times \\text{Bundling Factor}} = \\frac{1.56 \\times I_{\\text{sc}}}{\\text{Correction Factors}}$$`
          }
        ],
        quiz: {
          title: "Module 2 Assessment: String Sizing & Electrical Balance of Systems",
          passingScore: 70,
          questions: [
            {
              text: "A 550W PV module has Voc = 49.8V and a temperature coefficient of Voc of -0.27%/°C. What is the maximum string voltage for 18 modules in series at an extreme minimum design temperature of -15°C?",
              options: [
                "896.4 V",
                "993.2 V",
                "1048.5 V",
                "1120.8 V"
              ],
              correctOptionIndex: 1,
              explanation: "Delta T = -15 - 25 = -40°C. Temperature factor = 1 + (-0.0027 * -40) = 1 + 0.108 = 1.108. Voc_max per module = 49.8 * 1.108 = 55.178V. For 18 modules: 18 * 55.178V = 993.2V (which safely complies under the 1000V limit)."
            },
            {
              text: "Per NEC 690.8, what is the total minimum overcurrent protection multiplier applied to the module short-circuit current (Isc) for continuous duty without initial deratings?",
              options: [
                "1.00x",
                "1.25x",
                "1.56x",
                "2.00x"
              ],
              correctOptionIndex: 2,
              explanation: "NEC 690.8 requires 1.25 for max circuit current and an additional 1.25 for continuous duty (1.25 * 1.25 = 1.5625x Isc)."
            },
            {
              text: "Why do modern commercial solar designers select an Inverter Loading Ratio (ILR / DC-to-AC ratio) between 1.30 and 1.40?",
              options: [
                "To increase module open-circuit voltage during hot summer afternoons",
                "To capture more energy during early morning, evening, and overcast conditions while keeping inverter interconnect costs fixed",
                "To completely avoid rapid shutdown requirements under NEC 690.12",
                "To eliminate ground fault circuit interrupter tripping"
              ],
              correctOptionIndex: 1,
              explanation: "Oversizing DC capacity maximizes capacity factor and shoulder production with minimal clipping loss, optimizing the levelized cost of energy (LCOE)."
            }
          ]
        }
      },
      {
        title: "Module 3: Commercial Racking, Structural Loads & Wind/Snow Derating",
        sortOrder: 3,
        lessons: [
          {
            title: "Lesson 3.1: ASCE 7-16/7-22 Wind Load Dynamics, Uplift & Ballast Calculation",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            durationSec: 1980,
            isFreePreview: false,
            contentMarkdown: `### Ballasted Rooftop Wind Dynamics (ASCE 7)
Commercial ballasted systems rely on wind deflectors and concrete paver ballasts to counter aerodynamic uplift forces without puncturing the roof membrane.

#### Uplift Pressure Formula:
$$q_z = 0.00256 \\times K_z \\times K_{zt} \\times K_d \\times K_e \\times V^2$$
Where:
- $V$: Basic wind speed (mph) based on ASCE 7 risk category.
- $K_z$: Velocity pressure exposure coefficient.
- Edge and corner roof zones (Zones 2 & 3) encounter peak vortices requiring up to 300% more ballast weight than interior roof Zone 1.`
          },
          {
            title: "Lesson 3.2: Structural Dead Loads, Live Loads & Roof Deck Deflection Limits",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            durationSec: 1850,
            isFreePreview: false,
            downloadableUrl: "/downloads/PVOL101-M3-Structural-Capacity-Worksheet.pdf",
            contentMarkdown: `### Structural Deck Verification
Prior to deploying commercial ballasts (typically 3 to 7 lbs/sq.ft):
- **Dead Load ($D$):** Existing roofing structure, insulation, ballast, and modules.
- **Roof Live Load ($L_r$):** Maintenance crews and equipment (typically 20 psf reduced).
- **Snow Load ($S$):** Ground snow load adjusted for thermal factor ($C_t$), exposure ($C_e$), and slope ($C_s$).

Deflection criteria:
$$\\Delta_{\\text{max}} \\le \\frac{L}{240} \\text{ (total load) or } \\frac{L}{360} \\text{ (live load)}$$`
          },
          {
            title: "Lesson 3.3: Thermal Expansion, Seismic Setbacks & Fire Pathways per IFC 1205",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
            durationSec: 1900,
            isFreePreview: false,
            contentMarkdown: `### International Fire Code (IFC) 1205 Setback Rules
Rooftop arrays must maintain strict clearance dimensions:
- **Perimeter Access:** Minimum 4-foot to 6-foot clear perimeter around roof edges for fire fighter ladder access.
- **Smoke Ventilation Pathways:** 8-foot clear center pathways every 150 feet across the building axis.
- **Thermal Breaks:** Structural racking arrays must introduce thermal expansion gaps every 80 to 100 feet to absorb aluminum thermal expansion.`
          }
        ],
        quiz: {
          title: "Module 3 Assessment: Structural Engineering & Fire Code Compliance",
          passingScore: 70,
          questions: [
            {
              text: "Under ASCE 7 wind loading analysis, which rooftop areas experience the highest aerodynamic uplift pressures and necessitate the heaviest ballast weight?",
              options: [
                "Zone 1 (Interior field of roof)",
                "Directly adjacent to the center HVAC penthouse",
                "Zone 3 (Roof corner vortex zones)",
                "The southern drip line"
              ],
              correctOptionIndex: 2,
              explanation: "Zone 3 corner zones experience extreme conical corner vortices created by wind separation over roof edges, producing peak net uplift coefficients."
            },
            {
              text: "What is the typical minimum perimeter clear walkway required by IFC 1205 on commercial rooftops to allow firefighter ventilation access?",
              options: [
                "12 inches",
                "2 feet",
                "4 to 6 feet",
                "15 feet"
              ],
              correctOptionIndex: 2,
              explanation: "IFC Section 1205 specifies 4-to-6-foot perimeter pathways depending on roof area and smoke ventilation needs."
            },
            {
              text: "Why must thermal expansion breaks be engineered into commercial continuous aluminum racking rails every 80 to 100 feet?",
              options: [
                "To prevent mechanical shear stress and bolt pullout caused by daily solar thermal expansion and contraction cycles",
                "To satisfy NEC 690.12 rapid shutdown timing",
                "To comply with ground-fault current limits",
                "To improve inverter MPPT tracking"
              ],
              correctOptionIndex: 0,
              explanation: "Aluminum expands approximately 1 inch per 100 feet over a 40°C temperature delta. Thermal breaks prevent buckling, panel micro-cracking, and hardware failure."
            }
          ]
        }
      },
      {
        title: "Module 4: Single-Line Diagrams, Interconnection & Commissioning",
        sortOrder: 4,
        lessons: [
          {
            title: "Lesson 4.1: NEC 705 Interconnection Methods: Supply-Side vs Load-Side 120% Rule",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            durationSec: 2500,
            isFreePreview: false,
            downloadableUrl: "/downloads/PVOL101-M4-AutoCAD-Interconnection-Schematic.dwg",
            contentMarkdown: `### Utility Interconnection Engineering (NEC 705)
Two primary points of interconnection exist for commercial systems:

#### 1. Load-Side Interconnection (NEC 705.12):
The sum of breaker ratings supplying power to a busbar cannot exceed the busbar rating times 120%:
$$I_{\\text{main breaker}} + I_{\\text{solar backfeed}} \\le 1.20 \\times I_{\\text{busbar rating}}$$
*Example:* A 400A busbar with a 400A main breaker allows:
$$400\\text{A} \\times 1.20 - 400\\text{A} = 80\\text{A maximum continuous solar backfeed}$$

#### 2. Supply-Side Tap (NEC 705.11):
Connection made between the utility service meter and the main service disconnect, bypassing busbar ampacity constraints.`
          },
          {
            title: "Lesson 4.2: Rapid Shutdown (NEC 690.12), Arc-Fault (AFCI) & Ground-Fault Detection",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            durationSec: 2150,
            isFreePreview: false,
            contentMarkdown: `### Rapid Shutdown Protocol (NEC 690.12)
Commercial systems require module-level or string-level rapid shutdown within the array boundary (1 foot from array):
- Controlled conductors inside the boundary must be reduced to **80 volts or less** within 30 seconds of initiation.
- Outside the boundary: reduced to **30 volts or less** within 30 seconds.`
          },
          {
            title: "Lesson 4.3: IEC 62446 Commissioning: IV Curve Tracing, Megger Testing & Thermography",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
            durationSec: 2300,
            isFreePreview: false,
            downloadableUrl: "/downloads/PVOL101-M4-Commissioning-Checklist-IEC62446.xlsx",
            contentMarkdown: `### Quality Assurance & Acceptance Testing
Prior to permission to operate (PTO):
1. **Insulation Resistance (Megohmmeter):** Tested at 1000V DC between positive/negative conductors and ground (minimum $1\\text{ M}\\Omega$).
2. **I-V Curve Tracing:** Measures actual $I_{\\text{sc}}, V_{\\text{oc}}, I_{\\text{mp}}, V_{\\text{mp}}$, and fill factor (FF) normalized to STC.
3. **Aerial Thermography (IEC TS 62446-3):** Infrared scan at $>700\\text{ W/m}^2$ irradiance to diagnose bypass diode failures, localized hot-spots, and PID.`
          }
        ],
        quiz: {
          title: "Module 4 Assessment: Interconnection & Commissioning Verification",
          passingScore: 70,
          questions: [
            {
              text: "A commercial facility has an 800A rated panelboard with an 800A main service breaker. Under the standard NEC 705.12(B) 120% rule, what is the maximum allowable solar backfeed breaker rating?",
              options: [
                "0 A (No solar permitted)",
                "96 A",
                "160 A",
                "200 A"
              ],
              correctOptionIndex: 2,
              explanation: "Max backfeed = (1.20 * Busbar Rating) - Main Breaker = (1.20 * 800A) - 800A = 960A - 800A = 160A."
            },
            {
              text: "According to NEC 690.12, within how many seconds must rapid shutdown reduce voltage inside the array boundary to 80 volts or less?",
              options: [
                "10 seconds",
                "30 seconds",
                "60 seconds",
                "120 seconds"
              ],
              correctOptionIndex: 1,
              explanation: "NEC 690.12 specifies reduction to 80V or less within 30 seconds within the array boundary."
            },
            {
              text: "During IEC 62446 DC commissioning, what is the standard minimum acceptable insulation resistance test result for a 1000V PV string?",
              options: [
                "0.1 Megaohm",
                "1.0 Megaohm",
                "50.0 Megaohms",
                "500.0 Megaohms"
              ],
              correctOptionIndex: 1,
              explanation: "IEC 62446 defines 1.0 MΩ as the minimum threshold for insulation resistance on systems up to 1000V DC."
            }
          ]
        }
      }
    ]
  },
  {
    code: "BESS201",
    title: "Battery Energy Storage System Sizing & Safety",
    slug: "bess201",
    description:
      "Advanced industrial battery engineering covering stationary energy storage. Master Lithium Iron Phosphate (LFP) vs Nickel Manganese Cobalt (NMC) degradation curves, commercial peak shaving, microgrid islanding, NFPA 855 fire protection, UL 9540/9540A testing, and AC vs DC coupling.",
    level: "ADVANCED",
    deliveryType: "COHORT",
    contactHours: 24,
    price: 280,
    isPublished: true,
    cohorts: [
      {
        name: "Spring 2026 Intensive Cohort",
        startDate: "2026-04-15T09:00:00Z",
        endDate: "2026-05-20T17:00:00Z",
        maxCapacity: 35
      },
      {
        name: "Summer 2026 Engineering Cohort",
        startDate: "2026-07-01T09:00:00Z",
        endDate: "2026-08-05T17:00:00Z",
        maxCapacity: 30
      }
    ],
    tools: [
      {
        title: "Commercial Demand Charge & Peak Shaving Simulator",
        format: ".XLSX / Python",
        fileSize: "4.8 MB",
        description: "15-minute interval 8760 utility load profile analyzer calculating ROI, cycle life deratings, and optimal battery kW/kWh sizing."
      },
      {
        title: "NFPA 855 & UL 9540 Compliance Matrix & Checklist",
        format: ".PDF",
        fileSize: "1.9 MB",
        description: "Jurisdictional permitting guide for AHJ approvals, deflagration venting (NFPA 68/69), and hazard mitigation analysis (HMA)."
      },
      {
        title: "BESS Single-Line Architecture: AC-Coupled vs DC-Coupled SLD",
        format: ".DWG",
        fileSize: "5.2 MB",
        description: "Engineering schematics for 500kW/1MWh containerized battery with bi-directional PCS inverter, BMS telemetry, and grid sync."
      }
    ],
    modules: [
      {
        title: "Module 1: Battery Chemistries, Degradation Curves & C-Rates (LFP vs NMC)",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: Electrochemistry Comparison: LFP (LiFePO4) vs NMC (LiNiMnCoO2)",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 1800,
            isFreePreview: true,
            downloadableUrl: "/downloads/BESS201-M1-Battery-Chemistry-Comparison.pdf",
            contentMarkdown: `### Cell Chemistry in Stationary Energy Storage
Stationary storage is dominated by two primary lithium-ion chemistries:

| Metric | LFP (Lithium Iron Phosphate) | NMC (Nickel Manganese Cobalt) |
| :--- | :--- | :--- |
| **Nominal Cell Voltage** | 3.2 V | 3.6 - 3.7 V |
| **Cycle Life (80% DoD)** | 6,000 - 10,000 cycles | 2,000 - 3,500 cycles |
| **Thermal Runaway Onset** | ~270°C (High stability) | ~210°C (Exothermic cascade) |
| **Oxygen Release** | Strong P-O covalent bond | Releases $O_2$ upon decomposition |
| **Volumetric Density** | Lower (~300 Wh/L) | Higher (~650 Wh/L) |`
          },
          {
            title: "Lesson 1.2: C-Rate Dynamics, Depth of Discharge (DoD) & State of Health (SoH)",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            durationSec: 2000,
            isFreePreview: false,
            contentMarkdown: `### C-Rate and Degradation Fundamentals
The **C-Rate** measures the rate at which a battery discharges relative to its maximum capacity:
$$\\text{C-Rate} = \\frac{\\text{Current (A)}}{\\text{Rated Capacity (Ah)}} = \\frac{\\text{Power (kW)}}{\\text{Energy (kWh)}}$$

- A 100 kWh battery discharged at 50 kW operates at **0.5C (2-hour duration)**.
- A 100 kWh battery discharged at 200 kW operates at **2C (30-minute duration)**.

High C-rates increase internal resistive heating ($I^2 R$) and accelerate Solid Electrolyte Interphase (SEI) layer growth, decreasing capacity over operating lifespan.`
          },
          {
            title: "Lesson 1.3: End-of-Life (EoL) Degradation Modeling & Battery Augmentation Strategies",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            durationSec: 2100,
            isFreePreview: false,
            downloadableUrl: "/downloads/BESS201-M1-Augmentation-Strategies.pdf",
            contentMarkdown: `### Project Lifecycle Augmentation
BESS capacity decays over time (calendar aging + cycling aging). To guarantee a 15-year performance contract:

1. **Oversizing at Day 1:** Install 130% of required energy at commercial operation date (COD).
2. **Planned Augmentation (Year 5 & 10):** Add supplemental battery racks in reserved container bays to offset degraded capacity as battery cell prices drop over the project horizon.`
          }
        ],
        quiz: {
          title: "Module 1 Assessment: Battery Chemistries & Degradation Dynamics",
          passingScore: 70,
          questions: [
            {
              text: "Why is Lithium Iron Phosphate (LFP) universally favored over NMC in modern stationary utility and commercial energy storage?",
              options: [
                "LFP has significantly higher volumetric energy density",
                "LFP provides exceptional thermal runaway resistance (~270°C onset) and superior cycle life (6,000+ cycles)",
                "LFP operates without requiring a Battery Management System (BMS)",
                "LFP generates zero heat during 2C discharge"
              ],
              correctOptionIndex: 1,
              explanation: "LFP's strong covalent phospho-olivine molecular bond inhibits oxygen release during overheating, preventing self-sustaining thermal runaway."
            },
            {
              text: "A 500 kW / 1,000 kWh containerized BESS discharges continuously at 250 kW. What is the active C-Rate and discharge duration?",
              options: [
                "0.25C and 4 hours",
                "0.5C and 2 hours",
                "1.0C and 1 hour",
                "2.0C and 30 minutes"
              ],
              correctOptionIndex: 0,
              explanation: "C-rate = Power / Energy = 250 kW / 1000 kWh = 0.25C. Duration = 1 / 0.25C = 4 hours."
            },
            {
              text: "What battery degradation phenomenon primarily causes non-reversible capacity loss in lithium-ion cells over calendar time?",
              options: [
                "Copper busbar oxidation",
                "Solid Electrolyte Interphase (SEI) layer growth consuming active lithium ions",
                "Rapid shutdown relay cycling",
                "Electrolyte boiling at room temperature"
              ],
              correctOptionIndex: 1,
              explanation: "Continuous chemical growth of the SEI layer on the graphite anode irreversibly consumes active lithium inventory over calendar and cycle aging."
            }
          ]
        }
      },
      {
        title: "Module 2: Peak Shaving, Demand Charge Management & Microgrid Sizing",
        sortOrder: 2,
        lessons: [
          {
            title: "Lesson 2.1: Commercial Utility Tariffs: Demand Charges ($/kW) vs Energy Charges ($/kWh)",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            durationSec: 2200,
            isFreePreview: false,
            contentMarkdown: `### Decoding Commercial Utility Tariffs
Commercial electricity bills frequently attribute 40% to 70% of the invoice to **Demand Charges**:
- **Energy Charge ($/kWh):** Total volumetric consumption across billing period.
- **Demand Charge ($/kW):** Peak 15-minute rolling average power draw during coincident peak or on-peak utility windows.

$$\\text{Demand Cost} = P_{\\text{peak, 15min}} \\times \\text{Rate}_{\\$/\\text{kW}}$$

BESS automatically discharges during facility demand spikes to flatten the net grid draw below a contracted peak threshold.`
          },
          {
            title: "Lesson 2.2: 15-Minute Interval 8760 Load Profiling & Optimum Power/Energy Sizing",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            durationSec: 2300,
            isFreePreview: false,
            downloadableUrl: "/downloads/BESS201-M2-8760-Load-Profile-Tool.xlsx",
            contentMarkdown: `### Optimum kW vs kWh Ratio
To size a BESS for peak shaving:
1. Sort 15-minute interval load data to identify peak spike duration.
2. If facility peaks last 45 minutes, a 1-hour or 2-hour storage system (0.5C) provides maximal economic return without paying for unused battery capacity.
3. Establish state-of-charge (SoC) reserve buffers (e.g., minimum 15% SoC) to protect battery health.`
          },
          {
            title: "Lesson 2.3: Microgrid Islanding, Black Start Capability & Seamless Grid Synchronization",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            durationSec: 2400,
            isFreePreview: false,
            contentMarkdown: `### Grid-Forming vs Grid-Following Inverters
- **Grid-Following (Standard):** Inverters measure grid voltage and frequency and inject synchronized current. Cannot operate during utility blackouts.
- **Grid-Forming (Microgrid):** Inverter establishes voltage and frequency reference ($60\\text{ Hz}, 480\\text{ V}$), enabling true **black start** and islanded microgrid operation when utility power fails.`
          }
        ],
        quiz: {
          title: "Module 2 Assessment: Peak Shaving Economics & Microgrid Control",
          passingScore: 70,
          questions: [
            {
              text: "A commercial factory has a demand charge of $25/kW-month. A 200 kW / 400 kWh BESS consistently shaves 180 kW off the monthly peak demand. What is the annual demand charge savings?",
              options: [
                "$4,500",
                "$24,000",
                "$54,000",
                "$108,000"
              ],
              correctOptionIndex: 2,
              explanation: "Monthly savings = 180 kW * $25/kW = $4,500. Annual savings = $4,500 * 12 months = $54,000."
            },
            {
              text: "What inverter control capability is mandatory for a battery system to establish an energized islanded microgrid during a complete grid blackout?",
              options: [
                "Grid-Following (Current Source)",
                "Grid-Forming (Voltage Source with Black Start)",
                "Static Var Compensator only",
                "Passive Low-Pass Filtering"
              ],
              correctOptionIndex: 1,
              explanation: "Grid-forming inverters act as a voltage source, establishing frequency and voltage reference for all microgrid loads and solar generation."
            },
            {
              text: "Why is 15-minute interval utility metering data essential when sizing an industrial peak shaving battery system?",
              options: [
                "Demand charges are standardly billed based on the highest 15-minute rolling average power recorded in the billing cycle",
                "Utility transformers shut down every 15 minutes",
                "Inverters can only operate in 15-minute intervals",
                "Prisma ORM cannot store smaller intervals"
              ],
              correctOptionIndex: 0,
              explanation: "Commercial billing demand is established by the peak 15-minute kW average; sub-interval analysis ensures the battery discharges at the exact spike window."
            }
          ]
        }
      },
      {
        title: "Module 3: UL 9540/9540A Safety, Thermal Runaway Mitigation & Fire Suppression",
        sortOrder: 3,
        lessons: [
          {
            title: "Lesson 3.1: UL 9540 vs UL 9540A: Cell, Module, Unit, and Installation Fire Testing",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            durationSec: 2100,
            isFreePreview: false,
            downloadableUrl: "/downloads/BESS201-M3-UL9540-Test-Summary.pdf",
            contentMarkdown: `### UL Standards for Stationary Storage
- **UL 9540:** Safety certification for the integrated Energy Storage System (enclosure, BMS, PCS, fire protection).
- **UL 9540A:** Standard test method for evaluating thermal runaway fire propagation in battery systems across 4 tiered scales:
  1. *Cell Level:* Quantifies gas generation composition and thermal runaway onset temperature.
  2. *Module Level:* Evaluates propagation from one failing cell to adjacent cells.
  3. *Unit Level:* Tests propagation within a single rack enclosure.
  4. *Installation Level:* Evaluates sprinkler suppression efficacy and separation distances.`
          },
          {
            title: "Lesson 3.2: NFPA 855 Standard for the Installation of Stationary Energy Storage",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            durationSec: 2200,
            isFreePreview: false,
            contentMarkdown: `### NFPA 855 Spatial & Capacity Limitations
- **Unit Grouping Cap:** Maximum 50 kWh per unit for residential; 600 kWh per unit for commercial/industrial indoor systems.
- **Separation Distances:** Minimum **3 feet (0.9 m)** separation between BESS units and between BESS units and walls (can be reduced only with UL 9540A unit-level test proof).
- **Hazard Mitigation Analysis (HMA):** Required by the Authority Having Jurisdiction (AHJ) for non-standard configurations.`
          },
          {
            title: "Lesson 3.3: Deflagration Venting (NFPA 68/69), Off-Gas Detection & Water Suppression",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
            durationSec: 2050,
            isFreePreview: false,
            downloadableUrl: "/downloads/BESS201-M3-Fire-Suppression-Guide.pdf",
            contentMarkdown: `### Explosion Prevention & Gas Detection
Before open flame develops, thermal runaway vents explosive off-gases (Hydrogen $H_2$, Carbon Monoxide $CO$, and Methane $CH_4$):
- **Early Off-Gas Detection:** Special electrochemical sensors identify $H_2$ or VOCs minutes prior to smoke detector activation.
- **NFPA 68 Deflagration Panels:** Blast relief panels on exterior containers prevent structural rupture.
- **Suppression:** Water remains the only extinguishing agent with sufficient thermal capacity to cool adjacent lithium-ion cells below runaway temperatures.`
          }
        ],
        quiz: {
          title: "Module 3 Assessment: BESS Fire Codes & Hazard Mitigation",
          passingScore: 70,
          questions: [
            {
              text: "What is the primary purpose of the UL 9540A test standard?",
              options: [
                "To evaluate electrical conversion efficiency of the inverter",
                "To provide empirical test data regarding thermal runaway fire propagation characteristics and off-gas generation in battery modules and racks",
                "To measure solar panel degradation over 25 years",
                "To certify the billing accuracy of the utility meter"
              ],
              correctOptionIndex: 1,
              explanation: "UL 9540A is a rigorous fire test protocol that quantifies heat release rates, flammability, and thermal runaway cascading across battery cells and racks."
            },
            {
              text: "Under NFPA 855, what is the default minimum clearance separation required between adjacent stationary BESS units without UL 9540A exception data?",
              options: [
                "6 inches (0.15 m)",
                "1 foot (0.3 m)",
                "3 feet (0.9 m)",
                "10 feet (3.0 m)"
              ],
              correctOptionIndex: 2,
              explanation: "NFPA 855 mandates a baseline 3-foot (0.9m) separation distance between adjacent units and between units and walls to mitigate fire spread."
            },
            {
              text: "Which fire suppression agent is recognized as the only effective medium for halting thermal runaway propagation across lithium-ion cell modules?",
              options: [
                "Dry chemical ABC powder",
                "CO2 gas flooding",
                "Sustained high-volume water deluge for cooling",
                "Halon 1301"
              ],
              correctOptionIndex: 2,
              explanation: "Gas and chemical agents may knock down surface flames, but only continuous water deluge provides the heat extraction needed to cool battery cores below runaway temperature."
            }
          ]
        }
      },
      {
        title: "Module 4: AC-Coupled vs DC-Coupled Architectures & Commissioning",
        sortOrder: 4,
        lessons: [
          {
            title: "Lesson 4.1: System Architectures: AC-Coupled vs DC-Coupled Configurations",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            durationSec: 2350,
            isFreePreview: false,
            downloadableUrl: "/downloads/BESS201-M4-AC-vs-DC-Coupling-Schematics.dwg",
            contentMarkdown: `### AC-Coupled vs DC-Coupled System Architectures

#### AC-Coupling:
- PV array and Battery system have independent inverters and connect at the shared AC switchgear.
- *Advantage:* Ideal for retrofitting existing commercial solar installations; decoupled failure domains.
- *Round-Trip Efficiency:* Lower due to triple conversion ($DC \\rightarrow AC \\rightarrow DC \\rightarrow AC \\approx 84\\% - 88\\%$).

#### DC-Coupling:
- PV array and battery connect to a shared hybrid multi-port inverter via DC-DC charge controllers.
- *Advantage:* Higher round-trip efficiency ($92\\%+ $); zero AC interconnect clipping on oversized solar arrays.`
          },
          {
            title: "Lesson 4.2: Thermal Management Systems (TMS): Liquid Cooling vs Forced Air HVAC",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            durationSec: 2150,
            isFreePreview: false,
            contentMarkdown: `### Liquid Cold-Plate vs Air HVAC
Maintaining cell temperatures between $20^\\circ\\text{C}$ and $25^\\circ\\text{C}$ is vital:
- **Forced Air Cooling:** High parasitic load, thermal gradients across racks up to $\\pm 5^\\circ\\text{C}$, leading to uneven cell aging.
- **Closed-Loop Liquid Cooling:** Cold plates circulating glycol-water directly under cell modules maintain $\\le 2^\\circ\\text{C}$ temperature delta across entire containers, reducing parasitic auxiliary load by up to 30%.`
          },
          {
            title: "Lesson 4.3: BESS Commissioning, Capacity Acceptance Testing & Warranty Guarantees",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
            durationSec: 2400,
            isFreePreview: false,
            downloadableUrl: "/downloads/BESS201-M4-BESS-Commissioning-Protocol.xlsx",
            contentMarkdown: `### Commercial Acceptance Protocol
1. **Auxiliary Load Verification:** Auxiliary HVAC, lights, and BMS draw measured in idle and active states.
2. **Full Capacity Discharge Test:** Charge to 100% SoC, rest for 1 hour, discharge at rated C-rate to 0% SoC to verify guaranteed nameplate kWh.
3. **Round-Trip Efficiency (RTE):**
   $$\\text{RTE} = \\frac{E_{\\text{discharge (kWh)}}}{E_{\\text{charge (kWh)}}} \\times 100\\%$$
4. **Step-Load Transient Response:** Test response time from 0 to 100% output (< 100 milliseconds for frequency response contracts).`
          }
        ],
        quiz: {
          title: "Module 4 Assessment: System Architectures & Commissioning Verification",
          passingScore: 70,
          questions: [
            {
              text: "When retrofitting a multi-megawatt battery system to an existing operational commercial rooftop PV array, which architecture is almost universally chosen?",
              options: [
                "DC-Coupling requiring replacement of existing central string inverters",
                "AC-Coupling connecting the battery inverter directly to the facility AC switchgear",
                "Direct battery connection to solar DC strings without charge controllers",
                "Series connection to the utility medium-voltage transformer"
              ],
              correctOptionIndex: 1,
              explanation: "AC-coupling allows the existing solar system to remain untouched and certified, simply adding the battery system as an independent AC generation asset."
            },
            {
              text: "Why are modern utility-scale BESS enclosures rapidly transitioning from air-cooled HVAC to closed-loop liquid cold-plate cooling?",
              options: [
                "Liquid cooling keeps cell temperature deltas within 2°C, reducing parasitic loads and extending cycle life",
                "Liquid systems use zero electricity",
                "Air conditioning is prohibited by NFPA 855",
                "Liquid cooling eliminates all need for inverters"
              ],
              correctOptionIndex: 0,
              explanation: "Liquid cooling provides uniform thermal distribution (ΔT ≤ 2°C) directly at the cell base, mitigating localized hot spots and reducing parasitic fan energy."
            },
            {
              text: "How is Round-Trip Efficiency (RTE) calculated during BESS commissioning acceptance testing?",
              options: [
                "(Inverter AC Rating / Battery DC Capacity) * 100",
                "(Total Energy Discharged at POI / Total Energy Charged into BESS) * 100",
                "(Max Cell Voltage / Min Cell Voltage) * 100",
                "(PV Array Output / Battery Discharge Power) * 100"
              ],
              correctOptionIndex: 1,
              explanation: "RTE is the ratio of usable energy delivered during discharge compared to the total energy consumed from the grid to fully charge the battery system."
            }
          ]
        }
      }
    ]
  }
];
