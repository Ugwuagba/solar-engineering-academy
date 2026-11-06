import { Metadata } from "next";
import SolarLandingClient from "./SolarLandingClient";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || "https://subwayschools.com"
  ),
  title:
    "Become a Certified Solar & Energy Storage Installation Professional | Subway Schools",
  description:
    "Master industry-standard photovoltaic sizing, inverter integration, and stationary battery storage through practical, field-tested engineering training with Subway Schools (Subway Energy Limited RC: 1837154).",
  keywords: [
    "Solar Engineering Training",
    "Energy Storage Installation",
    "Subway Schools",
    "Subway Energy Limited",
    "RC 1837154",
    "Solar Installation Certification",
    "Deye Inverter Training",
    "Lithium Battery BMS",
    "Solar Field Attachment",
    "Commercial Solar Audit",
  ],
  openGraph: {
    title:
      "Become a Certified Solar & Energy Storage Installation Professional | Subway Schools",
    description:
      "Master industry-standard photovoltaic sizing, inverter integration, and stationary battery storage through practical, field-tested engineering training.",
    url: "https://subwayschools.com/lp/solar",
    siteName: "Subway Schools",
    images: [
      {
        url: "/images/solutions/solutions-installation.jpg",
        width: 1200,
        height: 630,
        alt: "Subway Schools Solar Engineering Practical Training",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Become a Certified Solar & Energy Storage Installation Professional | Subway Schools",
    description:
      "Master industry-standard photovoltaic sizing, inverter integration, and stationary battery storage through practical, field-tested engineering training.",
    images: ["/images/solutions/solutions-installation.jpg"],
  },
};

export default function SolarLandingPage() {
  return <SolarLandingClient />;
}
