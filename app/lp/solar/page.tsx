import { Metadata } from "next";
import SolarLandingClient from "./SolarLandingClient";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || "https://subwayschools.com"
  ),
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
  openGraph: {
    title: "Free Solar Energy Career & Business Webinar | Subway Schools",
    description:
      "Tap from the $268.93 billion solar energy market. Attend the free Subway Schools webinar and discover how to build a career or business in solar energy.",
    url: "https://subwayschools.com/lp/solar",
    siteName: "Subway Schools",
    images: [
      {
        url: "/images/solutions/solutions-installation.jpg",
        width: 1200,
        height: 630,
        alt: "Subway Schools Free Solar Energy Career & Business Webinar",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Solar Energy Career & Business Webinar | Subway Schools",
    description:
      "Tap from the $268.93 billion solar energy market. Attend the free Subway Schools webinar and discover how to build a career or business in solar energy.",
    images: ["/images/solutions/solutions-installation.jpg"],
  },
};

export default function SolarLandingPage() {
  return <SolarLandingClient />;
}
