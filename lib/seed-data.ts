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
  instructor?: string;
  fieldAttachment?: string;
  level: "INTRODUCTORY" | "INTERMEDIATE" | "ADVANCED";
  deliveryType: "SELF_PACED" | "COHORT";
  contactHours: number;
  price: number;
  priceNgn?: string;
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
    code: "SOLAR101",
    title: "Solar System Design, Installation & Maintenance",
    slug: "solar-installation-101",
    instructor: "Engr. Asanga (Certified Solar Professional, 20+ Years Experience)",
    fieldAttachment: "Includes 2–4 Months Hands-on Practical Field Attachment with Industry Partners",
    description:
      "The definitive industry masterclass by Subway Schools & Subway Energy Limited. Master step-by-step photovoltaic system engineering, comprehensive site & roof power audits, equipment nameplate analysis, battery autonomy calculations, and commercial installation safety. Includes practical field attachment.",
    level: "INTERMEDIATE",
    deliveryType: "SELF_PACED",
    contactHours: 48,
    price: 350,
    priceNgn: "₦150,000",
    isPublished: true,
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
    modules: [
      {
        title: "Module 1: Introduction to Solar Energy",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: Historical Development & Milestones of Solar Energy",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 1800,
            isFreePreview: true,
            downloadableUrl: "/downloads/SOLAR101-M1-History-and-Terminology.pdf",
            contentMarkdown: `### The Evolution of Photovoltaic Technology
Photovoltaic (PV) power has transformed from expensive satellite power sources in the 1950s into the world's most competitive electricity generation technology:

1. **1839 - The Becquerel Effect:** Alexandre Edmond Becquerel discovers that shining light on platinum electrodes submerged in an electrolyte creates current.
2. **1883 - First Solid-State Solar Cell:** Charles Fritts constructs the first selenium wafer cell (~1% efficiency).
3. **1954 - Bell Labs Breakthrough:** Chapin, Fuller, and Pearson invent the silicon p-n junction solar cell reaching 6% efficiency.
4. **Present Day:** Monocrystalline PERC and TOPCon cell modules regularly exceed **22% to 24% operational conversion efficiency** with levelized costs below coal and diesel generation.`
          },
          {
            title: "Lesson 1.2: Essential Photovoltaic Terminology: Irradiance, Insolation & Peak Sun Hours (PSH)",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            durationSec: 2100,
            isFreePreview: false,
            contentMarkdown: `### Technical Fundamentals of Solar Resource Measurement
Accurate system sizing requires understanding three core metrics:

- **Solar Irradiance ($G$):** The rate at which radiant solar energy is received per unit surface area, expressed in **Watts per square meter ($\\text{W/m}^2$)**. Standard Test Conditions (STC) use $1,000\\text{ W/m}^2$.
- **Solar Insolation ($H$):** The total cumulative solar energy received on a surface over a specified duration (typically a day), expressed in **Watt-hours per square meter ($\\text{Wh/m}^2/\\text{day}$)** or $\\text{kWh/m}^2/\\text{day}$.
- **Peak Sun Hours (PSH):** The equivalent number of hours per day during which solar irradiance equals a continuous $1,000\\text{ W/m}^2$:
$$\\text{1 PSH} = 1,000\\text{ Wh/m}^2 = 1\\text{ kWh/m}^2$$

*Example:* A region receiving an insolation of $5.2\\text{ kWh/m}^2/\\text{day}$ has **5.2 Peak Sun Hours** per day.`
          },
          {
            title: "Lesson 1.3: The Physics of PV Generation: Silicon Doping & The Photovoltaic Effect",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            durationSec: 2200,
            isFreePreview: false,
            contentMarkdown: `### Silicon Semiconductor Physics
Solar cells operate on the principle of the photovoltaic effect across a semiconductor p-n junction:

1. **Silicon Crystal Lattice:** Pure silicon has 4 valence electrons.
2. **N-Type Doping (Phosphorus):** Doped with 5-valence-electron phosphorus, providing surplus conduction electrons.
3. **P-Type Doping (Boron):** Doped with 3-valence-electron boron, providing surplus positive holes.
4. **Built-in Electric Field:** When brought together, electrons diffuse across the boundary, creating an electrostatic depletion zone.
5. **Photon Absorption:** Photons with energy equal to or greater than the silicon bandgap ($E_g \\approx 1.12\\text{ eV}$) knock electrons free, and the internal field sweeps them through the external circuit.`
          }
        ],
        quiz: {
          title: "Module 1 Assessment: Solar Fundamentals & Irradiance",
          passingScore: 70,
          questions: [
            {
              text: "If a rooftop site receives an average daily solar insolation of 5.8 kWh/m²/day, what is the site's daily Peak Sun Hours (PSH)?",
              options: [
                "2.9 Peak Sun Hours",
                "5.8 Peak Sun Hours",
                "10.0 Peak Sun Hours",
                "13.9 Peak Sun Hours"
              ],
              correctOptionIndex: 1,
              explanation: "One Peak Sun Hour is mathematically equivalent to 1 kWh/m² of cumulative radiation. Thus, 5.8 kWh/m²/day equals exactly 5.8 Peak Sun Hours."
            },
            {
              text: "Under Standard Test Conditions (STC) for rating photovoltaic modules, what irradiance and cell temperature are specified?",
              options: [
                "800 W/m² irradiance and 20°C ambient",
                "1,000 W/m² irradiance and 25°C cell temperature",
                "1,200 W/m² irradiance and 45°C cell temperature",
                "1,000 W/m² irradiance and 0°C cell temperature"
              ],
              correctOptionIndex: 1,
              explanation: "STC is universally defined as 1,000 W/m² irradiance, 25°C cell temperature, and Air Mass 1.5 (AM1.5) spectral distribution."
            },
            {
              text: "Which dopant element is introduced into silicon to create the electron-rich N-type semiconductor layer in a solar cell?",
              options: [
                "Boron",
                "Phosphorus",
                "Gallium",
                "Lead"
              ],
              correctOptionIndex: 1,
              explanation: "Phosphorus has 5 valence electrons (one more than silicon's 4), providing free conduction band electrons to form N-type material."
            }
          ]
        }
      },
      {
        title: "Module 2: Components of Photovoltaic Systems",
        sortOrder: 2,
        lessons: [
          {
            title: "Lesson 2.1: Solar Panels: Monocrystalline, Polycrystalline & Half-Cut PERC Architecture",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            durationSec: 2100,
            isFreePreview: false,
            contentMarkdown: `### Module Architectures in Modern Practice
1. **Monocrystalline Silicon (Mono-Si):** Single continuous crystal ingot, highest efficiency (20% - 24%), superior low-light performance.
2. **Passivated Emitter and Rear Cell (PERC):** Features a reflective rear passivation dielectric layer that bounces unabsorbed light back through the silicon, increasing red-wavelength capture.
3. **Half-Cut Cells:** Cutting 156mm cells in half cuts current in half ($I/2$), reducing resistive thermal losses ($I^2 R$) by **75%** and enhancing partial shading tolerance.`
          },
          {
            title: "Lesson 2.2: Charge Controllers: PWM vs MPPT High-Frequency Trackers",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            durationSec: 2250,
            isFreePreview: false,
            contentMarkdown: `### Maximum Power Point Tracking (MPPT) vs PWM
- **Pulse Width Modulation (PWM):** Directly connects the array to the battery, pulling module voltage down to battery terminal voltage ($V_{mp} \\approx 18\\text{V} \\rightarrow 12.8\\text{V}$), sacrificing up to 30% of harvestable solar energy.
- **MPPT Charge Controllers:** A DC-to-DC buck converter dynamically tracks the knee of the module's I-V curve, converting surplus array voltage into additional charging current ($P_{\\text{in}} \\approx P_{\\text{out}}$):
$$I_{\\text{batt}} = \\frac{V_{\\text{pv}} \\times I_{\\text{pv}} \\times \\eta}{V_{\\text{batt}}}$$`
          },
          {
            title: "Lesson 2.3: Battery Banks, Inverters & Balance of System (BoS)",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            durationSec: 2400,
            isFreePreview: false,
            contentMarkdown: `### Battery Storage & Inversion Infrastructure
- **Lithium Iron Phosphate (LFP / $\\text{LiFePO}_4$):** 90%+ usable depth of discharge, 6,000+ lifecycle cycles, built-in BMS protection.
- **Pure Sine Wave Inverters:** Produces harmonic distortion $\\text{THD} < 3\\%$, safe for motor compressors, inductive pumps, and sensitive electronics.
- **Balance of System (BoS):** DC disconnects, surge protective devices (SPD Type 2), circuit breakers, grounding electrodes, and UV-resistant double-insulated solar cables.`
          }
        ],
        quiz: {
          title: "Module 2 Assessment: Photovoltaic System Components",
          passingScore: 70,
          questions: [
            {
              text: "A 400W solar panel operates at Vmp = 40V and Imp = 10A charging a 12V nominal battery (charging at 13.5V). Assuming a 95% efficient MPPT controller, what is the charging current sent to the battery?",
              options: [
                "10.0 A",
                "28.1 A",
                "33.3 A",
                "40.0 A"
              ],
              correctOptionIndex: 1,
              explanation: "Array power = 40V * 10A = 400W. Useful power = 400W * 0.95 = 380W. Battery current = 380W / 13.5V ≈ 28.15 Amperes."
            },
            {
              text: "Why do half-cut cell modules experience significantly lower resistive power loss compared to standard full-cell modules?",
              options: [
                "They use twice as much copper busbar material",
                "Halving the cell halves the cell operating current (I), reducing I²R thermal resistance loss to one-fourth (25%)",
                "They operate at zero volts",
                "They eliminate all bypass diodes"
              ],
              correctOptionIndex: 1,
              explanation: "Power loss is proportional to current squared (P = I²R). Halving current reduces internal resistive power loss by 75%."
            },
            {
              text: "Which inverter output waveform is strictly required for inductive loads like commercial refrigerators and deep well borehole submersible pumps?",
              options: [
                "Square wave",
                "Modified sine wave",
                "Pure sine wave",
                "Triangular wave"
              ],
              correctOptionIndex: 2,
              explanation: "Modified sine waves cause extreme overheating, humming, and premature motor failure in inductive motor windings. Pure sine wave inversion is mandatory."
            }
          ]
        }
      },
      {
        title: "Module 3: Photovoltaic System Types",
        sortOrder: 3,
        lessons: [
          {
            title: "Lesson 3.1: Integrated Charging & Direct Day-Use Systems (Solar Pumping)",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            durationSec: 1950,
            isFreePreview: false,
            contentMarkdown: `### Direct Drive & Solar Water Pumping
In direct day-use applications, energy is consumed as it is produced without battery intermediaries:
- **Solar Pumping Inverters (VFD):** Variable Frequency Drives modulate AC pump motor frequency based on solar irradiance ($30\\text{ Hz} - 60\\text{ Hz}$).
- Water stored in an elevated reservoir acts as hydraulic energy storage, avoiding chemical battery degradation and CAPEX costs.`
          },
          {
            title: "Lesson 3.2: Standalone (Off-Grid) Battery Storage Systems",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            durationSec: 2150,
            isFreePreview: false,
            contentMarkdown: `### Off-Grid System Engineering
Standalone microgrids must deliver 100% autonomy without relying on the public grid:
- Must be sized for worst-case seasonal insolation (e.g., July/August rainy season or December solstice).
- Requires calibrated autonomy factors (typically 2 to 3 days of autonomy) and generator auto-start (ATS) dry contacts.`
          },
          {
            title: "Lesson 3.3: Hybrid & Grid-Tied Interactive Systems with Net Metering",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
            durationSec: 2200,
            isFreePreview: false,
            contentMarkdown: `### Modern Hybrid Inverter Architectures
Hybrid inverters integrate battery storage and utility synchronization:
- **Zero-Export Mode:** Inverter measures utility incoming current via external CT coils and throttles solar generation to match immediate household loads without backfeeding.
- **Time-of-Use (ToU) Arbitrage:** Charges battery during cheap off-peak utility tariffs; discharges during peak commercial hours.`
          }
        ],
        quiz: {
          title: "Module 3 Assessment: System Topologies & Grid Interaction",
          passingScore: 70,
          questions: [
            {
              text: "In a solar agricultural irrigation pumping project, what replaces chemical battery storage to provide energy resilience at lowest lifecycle cost?",
              options: [
                "Flywheel generators",
                "Elevated overhead water reservoir storage",
                "Supercapacitors",
                "Fuel cells"
              ],
              correctOptionIndex: 1,
              explanation: "Pumping water into an elevated gravity-fed storage tank during sunny hours acts as mechanical storage, eliminating battery replacement costs."
            },
            {
              text: "What sensor does a hybrid inverter use to execute 'Zero-Export' control to prevent unauthorized backfeeding into the utility grid?",
              options: [
                "Thermocouple probe",
                "Current Transformer (CT) clamp on main service conductors",
                "Pyranometer",
                "Differential pressure transducer"
              ],
              correctOptionIndex: 1,
              explanation: "External CT clamps measure real-time net grid draw, signaling the hybrid inverter to modulate output so solar never exceeds load consumption."
            },
            {
              text: "For a standalone off-grid system in an equatorial tropical zone with seasonal rains, what is the standard recommended days of battery autonomy?",
              options: [
                "2 hours",
                "12 hours",
                "2 to 3 days",
                "30 days"
              ],
              correctOptionIndex: 2,
              explanation: "Standard off-grid engineering specifies 2 to 3 days of autonomy to maintain continuous critical power during consecutive overcast or rainy days."
            }
          ]
        }
      },
      {
        title: "Module 4: Power Generation & Economics",
        sortOrder: 4,
        lessons: [
          {
            title: "Lesson 4.1: Renewable vs Non-Renewable Economics & Levelized Cost of Energy (LCOE)",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            durationSec: 2050,
            isFreePreview: false,
            contentMarkdown: `### Calculating Levelized Cost of Electricity (LCOE)
$$LCOE = \\frac{\\sum_{t=0}^{N} \\frac{\\text{CAPEX}_t + \\text{OPEX}_t + \\text{Fuel}_t}{(1 + r)^t}}{\\sum_{t=0}^{N} \\frac{E_t}{(1 + r)^t}}$$
For solar PV, $\\text{Fuel}_t = 0$. Diesel generator LCOE in commercial facilities frequently exceeds **$0.45 - $0.65 per kWh** due to maintenance, fuel delivery, and oil changes, compared to **$0.07 - $0.12 per kWh** for commercial solar.`
          },
          {
            title: "Lesson 4.2: Commercial Diesel Displacement & Return on Investment (ROI) Modeling",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            durationSec: 2100,
            isFreePreview: false,
            contentMarkdown: `### Diesel Generator Displacement
Calculating annual fuel savings when hybridizing solar with a diesel genset:
$$\\text{Fuel Saved (Liters/yr)} = \\frac{\\text{Solar Energy Harvested (kWh/yr)}}{\\text{Genset Fuel Efficiency (kWh/Liter)}} \\times \\text{Displacement Factor}$$
Standard industrial diesel engines produce approximately **3.0 to 3.5 kWh per liter of diesel**.`
          },
          {
            title: "Lesson 4.3: Overcoming Customer Objections & Bankable Proposals",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
            durationSec: 1950,
            isFreePreview: false,
            contentMarkdown: `### Structuring Client Proposals
Addressing common corporate concerns:
1. *'Batteries degrade too fast:'* Present LFP warranty sheets (10 years / 6,000 cycles at 80% DoD).
2. *'High initial cost:'* Present simple payback period (typically 2.5 to 4 years) and 25-year cumulative cash flow curves.`
          }
        ],
        quiz: {
          title: "Module 4 Assessment: Solar Financials & Generator Economics",
          passingScore: 70,
          questions: [
            {
              text: "A commercial facility generates 35,000 kWh of solar energy annually to offset a diesel generator operating at 3.5 kWh per liter. If diesel costs $1.20 per liter, what is the annual fuel savings?",
              options: [
                "$3,500",
                "$10,000",
                "$12,000",
                "$42,000"
              ],
              correctOptionIndex: 2,
              explanation: "Liters saved = 35,000 kWh / 3.5 kWh/L = 10,000 Liters. Financial savings = 10,000 L * $1.20/L = $12,000 annually."
            },
            {
              text: "What key metric measures the total lifetime cost of building and operating an energy system per unit of total electricity generated?",
              options: [
                "Net Present Value (NPV)",
                "Levelized Cost of Energy (LCOE)",
                "Internal Rate of Return (IRR)",
                "Debt Service Coverage Ratio (DSCR)"
              ],
              correctOptionIndex: 1,
              explanation: "LCOE represents the per-kilowatt-hour cost of energy over a system's full operating lifetime including CAPEX and OPEX."
            },
            {
              text: "What is the typical simple payback period for a commercial solar PV system offsetting high-tariff commercial grid and diesel power?",
              options: [
                "6 months",
                "2.5 to 4 years",
                "18 to 22 years",
                "Never"
              ],
              correctOptionIndex: 1,
              explanation: "Commercial solar systems offsetting diesel and high commercial tariffs typically achieve complete financial payback within 2.5 to 4 years."
            }
          ]
        }
      },
      {
        title: "Module 5: Solar System Failures & Sizing Criteria",
        sortOrder: 5,
        lessons: [
          {
            title: "Lesson 5.1: Forensic Analysis of Common Solar Installation Failures",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 2200,
            isFreePreview: false,
            contentMarkdown: `### Top Field Failure Mechanisms
1. **Undersized DC Cables:** Leads to voltage drops exceeding 3%, excessive terminal heating, and fire hazards.
2. **Improper MC4 Crimping:** Loose crimps cause DC series arc faults, the leading cause of rooftop PV fires.
3. **Mismatched String Voltages:** Paralleling strings with different module counts or orientations causes reverse-current overheating.`
          },
          {
            title: "Lesson 5.2: The Master Solar Sizing Equation & Derating Derivations",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            durationSec: 2350,
            isFreePreview: false,
            contentMarkdown: `### Array Sizing Formula
$$\\text{Required PV Power (Watts)} = \\frac{\\text{Daily Energy Consumption (Wh)}}{\\text{Peak Sun Hours (PSH)} \\times \\text{System Derate Factor (}\\eta_{\\text{sys}}\\text{)}}$$
Typical system derate factor $\\eta_{\\text{sys}} \\approx 0.75 - 0.80$ accounts for:
- Soiling (3% - 5%)
- Inverter efficiency (95% - 97%)
- Wiring losses (2%)
- Temperature degradation (8% - 12%)`
          },
          {
            title: "Lesson 5.3: Battery Bank Sizing & Depth of Discharge (DoD) Guardrails",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            durationSec: 2250,
            isFreePreview: false,
            contentMarkdown: `### Battery Bank Sizing Formula
$$\\text{Battery Capacity (Ah)} = \\frac{\\text{Daily Critical Load (Wh)} \\times \\text{Days of Autonomy}}{\\text{System Voltage (V)} \\times \\text{Max DoD} \\times \\eta_{\\text{inv}}}$$
- For Lithium LFP: $\\text{Max DoD} = 0.85 - 0.90$.
- For Lead-Acid/Gel: $\\text{Max DoD} = 0.50$ (discharging deeper than 50% reduces cycle life drastically).`
          }
        ],
        quiz: {
          title: "Module 5 Assessment: Sizing Calculations & Failure Mitigation",
          passingScore: 70,
          questions: [
            {
              text: "A home consumes 6,000 Wh (6 kWh) per day in an area with 4.5 Peak Sun Hours. Using a total system derating factor of 0.75, what is the minimum required solar array wattage?",
              options: [
                "1,333 Watts",
                "1,778 Watts",
                "2,400 Watts",
                "3,500 Watts"
              ],
              correctOptionIndex: 1,
              explanation: "Required PV = 6,000 Wh / (4.5 PSH * 0.75) = 6,000 / 3.375 = 1,777.78 Watts (approx 1,778W or four 450W panels)."
            },
            {
              text: "A 48V battery bank powers a 3,000 Wh daily load with 1 day of autonomy. Using LFP batteries with 85% maximum DoD and a 92% inverter efficiency, what is the required battery bank capacity in Amp-hours (Ah)?",
              options: [
                "38 Ah",
                "80 Ah",
                "160 Ah",
                "300 Ah"
              ],
              correctOptionIndex: 1,
              explanation: "Battery Capacity = 3,000 Wh / (48V * 0.85 * 0.92) = 3,000 / 37.536 ≈ 79.92 Ah (standard 48V 100Ah battery pack satisfies this)."
            },
            {
              text: "What is the primary cause of high-temperature electrical fires on DC solar rooftop circuits?",
              options: [
                "Excessive sunlight during peak noon",
                "Poorly crimped or mismatched MC4 connectors causing high-resistance DC arc faults",
                "Having too many ground rods",
                "Using pure sine wave inverters"
              ],
              correctOptionIndex: 1,
              explanation: "Improperly crimped or intermated MC4 connectors create contact resistance, which under high DC current generates localized electrical arcing reaching 3,000°C."
            }
          ]
        }
      },
      {
        title: "Module 6: Solar Power Audit",
        sortOrder: 6,
        lessons: [
          {
            title: "Lesson 6.1: Audit Methodologies: Walk-Through, Standard & Investment-Grade Audits",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            durationSec: 2150,
            isFreePreview: false,
            contentMarkdown: `### Levels of Energy Audits
1. **Level 1 (Walk-Through Audit):** Preliminary visual inspection, utility bill aggregation, identifying conspicuous energy waste.
2. **Level 2 (Standard Energy Survey):** Detailed appliance-by-appliance inventory, 24-hour power logging, baseline consumption analysis.
3. **Level 3 (Investment-Grade Audit):** 8760-hour sub-metering, power quality harmonics, transient analysis, financial guarantee modeling.`
          },
          {
            title: "Lesson 6.2: Essential Field Instrumentation: Clamp Meters, Power Loggers & Thermal Imaging",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            durationSec: 2200,
            isFreePreview: false,
            contentMarkdown: `### Professional Auditing Tool Arsenal
- **True RMS Clamp Meter:** Measures actual distorted non-sinusoidal currents on nonlinear loads.
- **In-line Power Monitor (Kill-A-Watt):** Measures real-time power (Watts), apparent power (VA), and power factor ($PF$).
- **FLIR Thermal Camera:** Detects loose busbars, imbalanced circuit breakers, and thermal anomalies in distribution boards.`
          },
          {
            title: "Lesson 6.3: Step-by-Step Practical Field Audit Execution",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            durationSec: 2300,
            isFreePreview: false,
            downloadableUrl: "/downloads/SOLAR101-M6-Audit-Field-Checklist.xlsx",
            contentMarkdown: `### Executing the On-Site Audit
1. Verify utility meter calibration and historical 12-month billing data.
2. Log all continuous and intermittent loads into the Subway Energy Audit Sheet.
3. Segregate critical emergency circuits from non-essential deferrable loads.
4. Calculate simultaneous diversity factor ($DF$):
$$\\text{Peak Demand} = \\sum P_{\\text{rated}} \\times DF$$`
          }
        ],
        quiz: {
          title: "Module 6 Assessment: Energy Auditing Procedures",
          passingScore: 70,
          questions: [
            {
              text: "Why is a True-RMS meter essential when measuring AC electrical currents in modern commercial facilities?",
              options: [
                "It weighs less than an analog meter",
                "Nonlinear electronics (computers, LED drivers, inverters) produce non-sinusoidal harmonic waveforms that average-sensing meters misread by up to 40%",
                "True-RMS meters require no batteries",
                "It automatically measures solar panel tilt"
              ],
              correctOptionIndex: 1,
              explanation: "Nonlinear loads draw current in short pulses. Average-responding meters under-report true thermal loading; True-RMS meters accurately calculate the root-mean-square current."
            },
            {
              text: "During an audit, what is the primary benefit of segregating loads into 'Critical' vs 'Non-Essential' categories?",
              options: [
                "It allows sizing a much smaller, affordable battery and inverter system for essential nighttime loads while deferring heavy loads to sunny daylight hours",
                "It avoids installing circuit breakers",
                "It eliminates all utility connection charges",
                "It makes the solar panels run colder"
              ],
              correctOptionIndex: 0,
              explanation: "Segregating critical loads (lighting, refrigeration, IT) from deferrable loads (water pumping, EV charging) reduces required battery capacity and CAPEX by up to 50%."
            },
            {
              text: "What instrument is used to diagnose high-resistance loose electrical connections in a switchgear panel before they result in thermal failure?",
              options: [
                "Sound level decibel meter",
                "Infrared Thermal Imaging Camera",
                "Laser distance meter",
                "Barometer"
              ],
              correctOptionIndex: 1,
              explanation: "Infrared thermography visually identifies localized hotspots caused by contact resistance in loose terminal lugs and breakers."
            }
          ]
        }
      },
      {
        title: "Module 7: Electrical Loads & Phantom Load Management",
        sortOrder: 7,
        lessons: [
          {
            title: "Lesson 7.1: Classifying Loads: Resistive, Inductive & Capacitive Profiles",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            durationSec: 2100,
            isFreePreview: false,
            contentMarkdown: `### Load Characteristics
- **Resistive Loads (Water Heaters, Incandescent):** Current and voltage are in phase ($PF = 1.0$). Steady, predictable power draw.
- **Inductive Loads (Air Conditioners, Pumps, Compressors):** Involve electromagnetic coils; current lags voltage ($PF < 1.0$). Exhibits high startup surge currents (3x to 7x rated running current).
- **Capacitive / Switched Mode Loads (Computers, LEDs):** Current leads voltage; produces high-frequency harmonic distortion.`
          },
          {
            title: "Lesson 7.2: Identifying & Eliminating Phantom / Vampire Loads",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            durationSec: 1950,
            isFreePreview: false,
            contentMarkdown: `### The Silent Battery Killer: Phantom Loads
Appliances in standby mode (TV decoders, microwave clocks, laptop chargers) consume power 24 hours a day:
$$\\text{Standby Power} = 25\\text{ W} \\times 24\\text{ h} = 600\\text{ Wh/day}$$
A seemingly negligible 25W standby draw requires an extra **200W solar panel and 50Ah of battery capacity** just to stay energized!`
          },
          {
            title: "Lesson 7.3: Power Factor Optimization & Sizing Impact on Inverters",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
            durationSec: 2200,
            isFreePreview: false,
            contentMarkdown: `### Real Power (Watts) vs Apparent Power (Volt-Amperes)
$$\\text{Power Factor (PF)} = \\frac{\\text{Real Power (W)}}{\\text{Apparent Power (VA)}} = \\cos(\\theta)$$
An inverter is rated in **Volt-Amperes (VA)**. If a facility has $3,000\\text{ W}$ of inductive loads with $PF = 0.70$, the inverter must deliver:
$$\\text{Inverter Size} = \\frac{3,000\\text{ W}}{0.70} = 4,286\\text{ VA (e.g. 5 kVA)}$$`
          }
        ],
        quiz: {
          title: "Module 7 Assessment: Load Profiles & Power Factor",
          passingScore: 70,
          questions: [
            {
              text: "A commercial office has 4,000 Watts of computer and HVAC loads operating at a measured power factor of 0.80. What minimum apparent power (VA) capacity must the inverter support?",
              options: [
                "3,200 VA",
                "4,000 VA",
                "5,000 VA",
                "6,400 VA"
              ],
              correctOptionIndex: 2,
              explanation: "Apparent Power (VA) = Real Power (W) / PF = 4,000W / 0.80 = 5,000 VA."
            },
            {
              text: "If a household has 30 Watts of phantom standby loads operating continuously for 24 hours, how much battery energy is consumed each day just by standby?",
              options: [
                "30 Wh",
                "240 Wh",
                "720 Wh",
                "3,000 Wh"
              ],
              correctOptionIndex: 2,
              explanation: "Daily energy = 30W * 24 hours = 720 Watt-hours (Wh)."
            },
            {
              text: "Why do single-phase air conditioning compressor motors trip undersized inverters during startup?",
              options: [
                "They draw negative voltage",
                "Compressor motors draw Locked Rotor Amps (LRA) reaching 4x to 7x their running current for the first 100-300 milliseconds",
                "Inverters do not support cool air",
                "Refrigerant boils inside the wire"
              ],
              correctOptionIndex: 1,
              explanation: "Inductive motor starting surge (LRA) is 4 to 7 times nominal full-load amps, requiring high inverter surge headroom or soft-starter modules."
            }
          ]
        }
      },
      {
        title: "Module 8: Electrical Load Ratings & Equipment Nameplates",
        sortOrder: 8,
        lessons: [
          {
            title: "Lesson 8.1: Decoding Equipment Nameplates: Voltage, Amps, HP & Duty Cycles",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            durationSec: 2150,
            isFreePreview: false,
            contentMarkdown: `### Reading Industrial Nameplates
- **Horsepower (HP) to Watts:** $1\\text{ HP} = 746\\text{ Watts}$ (electrical equivalent).
- **Full Load Amps (FLA):** Continuous running current at rated voltage.
- **Locked Rotor Amps (LRA):** Instantaneous inrush current when the rotor is stationary.`
          },
          {
            title: "Lesson 8.2: Data Collection Protocols & Automated Energy Logging",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            durationSec: 2050,
            isFreePreview: false,
            contentMarkdown: `### Establishing Operational Load Profiles
Distinguish between nameplate rating and real-world duty cycle:
- A $2,000\\text{W}$ electric water heater with a thermostat running 2 hours/day consumes $4,000\\text{Wh/day}$, not $48,000\\text{Wh/day}$.
- Using current data-logging loggers captures true duty-cycle operational runtime.`
          },
          {
            title: "Lesson 8.3: Strategic Load Shifting & Sizing Optimization",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
            durationSec: 2200,
            isFreePreview: false,
            contentMarkdown: `### Solar Sizing Optimization via Load Shifting
Educating clients to shift high-wattage non-continuous loads (laundry, dishwashers, water pumping) to daylight solar peak hours ($11\\text{am} - 2\\text{pm}$) enables direct solar utilization, reducing required battery storage by **30% to 45%**.`
          }
        ],
        quiz: {
          title: "Module 8 Assessment: Equipment Nameplate Analysis",
          passingScore: 70,
          questions: [
            {
              text: "A water pump nameplate indicates 1.5 Horsepower (HP) with a motor efficiency of 85%. What is the actual electrical input power consumed in Watts?",
              options: [
                "746 Watts",
                "1,119 Watts",
                "1,316 Watts",
                "2,500 Watts"
              ],
              correctOptionIndex: 2,
              explanation: "Mechanical output = 1.5 HP * 746W/HP = 1,119 Watts. Electrical input = Output / Efficiency = 1,119W / 0.85 ≈ 1,316.5 Watts."
            },
            {
              text: "What does the 'Locked Rotor Amps' (LRA) value printed on an air conditioner nameplate represent?",
              options: [
                "The current drawn during continuous economic operation",
                "The maximum instantaneous inrush current when the motor starts from rest",
                "The grounding leakage current",
                "The solar panel input current"
              ],
              correctOptionIndex: 1,
              explanation: "LRA is the high startup current drawn while the motor rotor is at zero RPM, determining the required inverter surge rating."
            },
            {
              text: "How does shifting water pumping and pool filtration to midday peak solar hours reduce project cost?",
              options: [
                "Solar panels produce higher voltage at night",
                "It allows direct consumption of solar energy during generation, reducing the required battery capacity and cycle wear",
                "Pumps do not work at night",
                "Utility rates are doubled during noon"
              ],
              correctOptionIndex: 1,
              explanation: "Directly consuming solar energy during daytime eliminates round-trip battery conversion losses and permits a smaller battery bank."
            }
          ]
        }
      },
      {
        title: "Module 9: Roof & Site Assessment",
        sortOrder: 9,
        lessons: [
          {
            title: "Lesson 9.1: Roof Types: Tile, Corrugated Metal, Membrane & Concrete Decks",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 2300,
            isFreePreview: false,
            downloadableUrl: "/downloads/SOLAR101-M9-Roof-Mounting-Hardware-Guide.pdf",
            contentMarkdown: `### Racking & Roof Attachments
- **Corrugated / Standing Seam Metal:** Uses non-penetrating seam clamps (S-5!) preserving roof manufacturer waterproofing warranties.
- **Concrete Flat Decks:** Uses ballasted aerodynamic trays or chem-set chemical anchor bolts with dual membrane flashing.
- **Tile Roofs:** Requires tile replacement flashings and stainless steel tile hooks anchored directly into timber rafters.`
          },
          {
            title: "Lesson 9.2: Dimensions, Tilt, Azimuth & Shading Buffers",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            durationSec: 2150,
            isFreePreview: false,
            contentMarkdown: `### Geometric Array Alignment
- **Azimuth:** In the Northern Hemisphere, arrays face True South ($180^\\circ$); in the Southern Hemisphere, True North ($0^\\circ$).
- **Optimal Tilt Angle:** Equal to site latitude for year-round production (or latitude $\\pm 15^\\circ$ for seasonal optimization). Minimum $10^\\circ$ tilt is mandatory for natural rainwater self-cleaning of dust and dirt.`
          },
          {
            title: "Lesson 9.3: OSHA/HSE Working at Heights, Walkways & Installation Safety",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            durationSec: 2250,
            isFreePreview: false,
            contentMarkdown: `### Health, Safety & Environment (HSE) on Rooftops
- Personal Fall Arrest Systems (PFAS): Full-body harness, shock-absorbing lanyard, certified anchor rated for $5,000\\text{ lbs}$ ($22.2\\text{ kN}$).
- 3-point contact ladder safety with extension $3\\text{ feet}$ above the roofline.
- Mandatory $4\\text{ to }6\\text{ foot}$ perimeter walkways for firefighter access per IFC 1205.`
          }
        ],
        quiz: {
          title: "Module 9 Assessment: Site Assessment & Rooftop Safety",
          passingScore: 70,
          questions: [
            {
              text: "Why is a minimum tilt angle of 10 degrees required even on flat commercial rooftops in equatorial regions?",
              options: [
                "To increase wind resistance",
                "To enable rainwater self-cleaning of dust, bird droppings, and debris from panel glass",
                "To prevent lightning strikes",
                "To satisfy inverter MPPT minimum voltage"
              ],
              correctOptionIndex: 1,
              explanation: "A minimum 10° tilt allows rainfall to naturally wash away accumulated dust and particulate soiling, preventing hot-spot cell degradation."
            },
            {
              text: "When mounting solar arrays on standing seam metal commercial roofs, what mounting technology avoids puncturing the roof membrane?",
              options: [
                "Heavy through-bolt anchors",
                "Direct wood screws",
                "Non-penetrating mechanical seam clamps (e.g., S-5! clamps)",
                "Standard roofing nails"
              ],
              correctOptionIndex: 2,
              explanation: "Non-penetrating standing seam clamps grip the vertical metal roof fold securely without penetrations, preserving the waterproofing warranty."
            },
            {
              text: "Under OSHA fall protection standards, at what height elevation above a lower level must personal fall arrest systems be utilized by roofing installers?",
              options: [
                "2 feet",
                "6 feet (1.8 meters)",
                "25 feet",
                "50 feet"
              ],
              correctOptionIndex: 1,
              explanation: "OSHA standard 1926.501 mandates fall protection systems for residential and commercial construction when working 6 feet or higher above a lower level."
            }
          ]
        }
      },
      {
        title: "Module 10: The Solar Entrepreneur",
        sortOrder: 10,
        lessons: [
          {
            title: "Lesson 10.1: Business Opportunities in Solar Service & Installation Sectors",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            durationSec: 2100,
            isFreePreview: false,
            contentMarkdown: `### Service Sector Value Chains
High-margin recurring revenue models for certified solar technicians:
1. **Preventative O&M Contracts:** Annual thermography scans, string IV tracing, panel cleaning, and inverter firmware upgrades.
2. **Battery Retrofits:** Upgrading aging lead-acid installations to modern high-voltage LFP rack systems.
3. **Power Auditing & Energy Management Consultancies.**`
          },
          {
            title: "Lesson 10.2: Product Sourcing, Quality Inspection & Equipment Retailing",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            durationSec: 2000,
            isFreePreview: false,
            contentMarkdown: `### Sourcing Tier-1 Certified Equipment
- Identifying authentic BloombergNEF Tier-1 modules vs counterfeit relabeled panels.
- Inspecting factory flash test reports and electroluminescence (EL) crack images.
- Establishing distributor credit lines and warranty replacement agreements.`
          },
          {
            title: "Lesson 10.3: Commercial Bidding, Proposal Formulation & Contract Execution",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            durationSec: 2200,
            isFreePreview: false,
            downloadableUrl: "/downloads/SOLAR101-M10-Client-Contract-Agreement-Template.docx",
            contentMarkdown: `### Writing Winning Solar Proposals
Essential elements of a bankable EPC contract:
1. Scope of Work (BoQ, Single-Line Diagram, physical layout).
2. Performance guarantee clauses (Weather-adjusted performance ratio $PR \\ge 80\\%$).
3. Payment milestone schedule (60% advance on equipment delivery, 30% on mechanical completion, 10% on commissioning).`
          }
        ],
        quiz: {
          title: "Module 10 Assessment: Solar Business & Commercial Contracting",
          passingScore: 70,
          questions: [
            {
              text: "Which recurring revenue service provides high-margin long-term cash flow for an established solar EPC contracting business?",
              options: [
                "Selling one-time scrap aluminum rails",
                "Operations & Maintenance (O&M) service contracts with performance monitoring",
                "Handing out flyers",
                "Refunding client deposits"
              ],
              correctOptionIndex: 1,
              explanation: "Long-term O&M agreements provide predictable annual recurring revenue through preventative maintenance, thermal scanning, and performance guarantees."
            },
            {
              text: "What quality assurance document should always be demanded from a solar panel manufacturer to verify rated output before accepting container delivery?",
              options: [
                "Shipping bill of lading only",
                "Individual module factory flash test data report and Electroluminescence (EL) crack test",
                "Color brochure",
                "Customs clearance stamp"
              ],
              correctOptionIndex: 1,
              explanation: "Factory flash test reports and EL crack imaging verify actual STC wattage, fill factor, and absence of micro-cracks before installation."
            },
            {
              text: "What is the industry-standard payment milestone structure for commercial solar installation projects to protect contractor working capital?",
              options: [
                "100% after 2 years",
                "60% deposit upon equipment procurement/delivery, 30% upon mechanical completion, 10% upon testing/commissioning",
                "0% deposit with full financing by the technician",
                "Barter exchange"
              ],
              correctOptionIndex: 1,
              explanation: "A 60/30/10 milestone structure covers equipment procurement upfront and matches milestone disbursements to physical project progress."
            }
          ]
        }
      },
      {
        title: "Module 11: Solar Companion Technical Reference",
        sortOrder: 11,
        lessons: [
          {
            title: "Lesson 11.1: Inverter Sizing, Surge Multipliers & Power Factor Calculations",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            durationSec: 2400,
            isFreePreview: true,
            downloadableUrl: "/downloads/SOLAR101-Solar-Companion-Calculations-Guide.pdf",
            contentMarkdown: `### Solar Companion: Inverter Sizing Engineering Reference
$$\\text{Inverter Continuous Rating (VA)} = \\frac{\\sum P_{\\text{continuous (W)}}}{\\text{Power Factor (PF)}} \\times 1.25\\text{ (Design Margin)}$$
$$\\text{Inverter Surge Rating} \\ge \\sum P_{\\text{continuous}} + \\left(\\sum P_{\\text{motor, FLA}} \\times 4.0\\right)$$`
          },
          {
            title: "Lesson 11.2: Battery Autonomy, Usable Capacity & Depth of Discharge Deratings",
            sortOrder: 2,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            durationSec: 2300,
            isFreePreview: false,
            contentMarkdown: `### Solar Companion: Battery Sizing Master Reference
$$\\text{Usable Energy (kWh)} = \\text{Nominal Capacity (kWh)} \\times \\text{DoD}_{\\text{max}}$$
$$\\text{Required Total Battery Bank (kWh)} = \\frac{\\text{Daily Energy Consumption (kWh)} \\times \\text{Days of Autonomy}}{\\text{DoD}_{\\text{max}} \\times \\eta_{\\text{inverter}} \\times \\eta_{\\text{battery}}}$$`
          },
          {
            title: "Lesson 11.3: PERC Monocrystalline Module Temperature Derating & MPPT Voltage Matching",
            sortOrder: 3,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
            durationSec: 2500,
            isFreePreview: false,
            contentMarkdown: `### Solar Companion: Temperature Coefficient & Voltage Limits
$$\\text{Max Array Voltage } V_{\\text{oc-max}} = V_{\\text{oc-stc}} \\times \\left[1 + \\beta_{V_{\\text{oc}}} \\times (T_{\\text{min}} - 25^\\circ\\text{C})\\right] \\le V_{\\text{max-inverter}}$$
$$\\text{Min MPPT Voltage } V_{\\text{mp-min}} = V_{\\text{mp-stc}} \\times \\left[1 + \\gamma_{P_{\\text{max}}} \\times (T_{\\text{cell-max}} - 25^\\circ\\text{C})\\right] \\ge V_{\\text{mppt-min}}$$`
          }
        ],
        quiz: {
          title: "Module 11 Assessment: Solar Companion Master Sizing Calculations",
          passingScore: 70,
          questions: [
            {
              text: "A commercial facility operates 6,500 Watts of running inductive loads with PF = 0.75 and one 1,500W compressor with a 3x startup surge multiplier. What minimum surge capacity must the inverter withstand?",
              options: [
                "6,500 Watts",
                "8,000 Watts",
                "11,000 Watts",
                "18,000 Watts"
              ],
              correctOptionIndex: 2,
              explanation: "Surge requirement = Continuous loads (6,500W) + Compressor surge addition (1,500W * 3 = 4,500W) = 11,000 Watts."
            },
            {
              text: "Under extreme hot summer ambient roof temperatures of 65°C cell temperature, what happens to a monocrystalline solar panel's maximum power output (Pmax)?",
              options: [
                "Power increases by 40%",
                "Power drops according to temperature coefficient (approx -0.35%/°C * (65 - 25) = -14% power derating)",
                "Power drops to zero",
                "Voltage doubles"
              ],
              correctOptionIndex: 1,
              explanation: "High cell temperatures reduce open-circuit and operating voltage. At 65°C (ΔT = +40°C), output power decreases by approximately 14% to 16%."
            },
            {
              text: "Why must string minimum Vmp be calculated at the maximum expected summer roof temperature?",
              options: [
                "To prevent the string voltage from dropping below the lower threshold of the inverter's MPPT tracking window",
                "To prevent rapid shutdown tripping",
                "To make sure wires don't freeze",
                "To satisfy utility anti-islanding"
              ],
              correctOptionIndex: 0,
              explanation: "If string Vmp drops below the minimum MPPT voltage window in hot weather, the inverter drops out of peak power tracking, causing severe generation loss."
            }
          ]
        }
      }
    ]
  },
  {
    code: "PVOL101",
    title: "Commercial & Industrial Solar PV Design",
    slug: "pvol101",
    instructor: "Engr. Asanga & Lead C&I Engineers",
    fieldAttachment: "Includes 2 Months Advanced Industrial Attachment",
    description:
      "A rigorous, code-compliant masterclass on designing commercial & industrial PV systems. Master solar irradiance modeling, extreme temperature string sizing, inverter clipping, NEC 690/705, and AutoCAD single-line diagrams.",
    level: "INTERMEDIATE",
    deliveryType: "SELF_PACED",
    contactHours: 40,
    price: 350,
    priceNgn: "₦150,000",
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
            contentMarkdown: "### Commercial Plane-of-Array Irradiance Calculations\nPOA is composed of beam, diffuse, and ground-reflected albedo components."
          }
        ],
        quiz: {
          title: "Module 1 Assessment: Solar Geometry & Irradiance Modeling",
          passingScore: 70,
          questions: [
            {
              text: "A commercial TPO white membrane roof exhibits an albedo coefficient of 0.80. If GHI is 900 W/m² and tilt is 10°, what is the ground-reflected component?",
              options: ["Approximately 5.4 W/m²", "45.2 W/m²", "128.0 W/m²", "360.0 W/m²"],
              correctOptionIndex: 0,
              explanation: "Reflected irradiance = 900 * 0.80 * (1 - cos(10°))/2 ≈ 5.47 W/m²."
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
    instructor: "Engr. Asanga & Deye/UL Certified Specialists",
    fieldAttachment: "Includes 2 Months Utility Energy Storage Attachment",
    description:
      "Advanced industrial battery engineering covering stationary energy storage. Master Lithium Iron Phosphate (LFP) vs NMC degradation, commercial peak shaving, microgrids, NFPA 855 fire protection, UL 9540/9540A testing, and Deye hybrid inverters.",
    level: "ADVANCED",
    deliveryType: "COHORT",
    contactHours: 24,
    price: 280,
    priceNgn: "₦120,000",
    isPublished: true,
    cohorts: [
      {
        name: "Spring 2026 Intensive Cohort",
        startDate: "2026-05-15T09:00:00Z",
        endDate: "2026-06-30T17:00:00Z",
        maxCapacity: 35
      }
    ],
    tools: [
      {
        title: "Commercial Demand Charge & Peak Shaving Simulator",
        format: ".XLSX / Python",
        fileSize: "4.8 MB",
        description: "15-minute interval 8760 utility load profile analyzer calculating ROI and optimal battery kW/kWh sizing."
      }
    ],
    modules: [
      {
        title: "Module 1: Battery Chemistries, Degradation Curves & C-Rates (LFP vs NMC)",
        sortOrder: 1,
        lessons: [
          {
            title: "Lesson 1.1: Electrochemistry Comparison: LFP vs NMC",
            sortOrder: 1,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            durationSec: 1800,
            isFreePreview: true,
            contentMarkdown: "### Stationary Storage Chemistries\nLFP provides exceptional thermal stability and 6,000+ cycle life."
          }
        ],
        quiz: {
          title: "Module 1 Assessment: Battery Chemistries & Degradation Dynamics",
          passingScore: 70,
          questions: [
            {
              text: "Why is Lithium Iron Phosphate (LFP) preferred for stationary industrial energy storage?",
              options: [
                "LFP has higher volumetric density",
                "LFP provides exceptional thermal stability (~270°C onset) and 6,000+ cycle life",
                "LFP requires no battery management system",
                "LFP uses no lithium"
              ],
              correctOptionIndex: 1,
              explanation: "LFP phospho-olivine structure does not release oxygen during thermal stress, preventing thermal runaway."
            }
          ]
        }
      }
    ]
  }
];
