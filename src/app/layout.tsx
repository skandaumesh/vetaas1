import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import GoogleAnalytics from "@/components/GoogleAnalytics";

import Script from "next/script";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Social Emotional Learning (SEL) in Bengaluru | Vetaas Education Foundation",
    template: "%s | Vetaas Education Foundation",
  },
  description:
    "Social Emotional Learning (SEL) programs for children, parents and teachers in Bengaluru. Vetaas runs workshops, parent-child sessions and school partnerships from The Nest, our studio in J. P. Nagar.",
  keywords: [
    "SEL Bengaluru",
    "SEL Bangalore",
    "Social Emotional Learning Bengaluru",
    "Social Emotional Learning Bangalore",
    "SEL classes for children Bangalore",
    "SEL workshops for teachers",
    "parenting workshops Bengaluru",
    "early childhood education Bangalore",
    "child development JP Nagar",
    "SEL curriculum for schools",
    "Vetaas Education Foundation",
    "The Nest by Vetaas",
  ],
  authors: [{ name: "Vetaas Education Foundation" }],
  creator: "Vetaas Education Foundation",
  publisher: "Vetaas Education Foundation",
  metadataBase: new URL("https://www.vetaas.in"),
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Vetaas Education Foundation | Social Emotional Learning",
    description: "Nurturing Social Emotional Learning (SEL) in early childhood across Bangalore, India.",
    url: "/",
    siteName: "Vetaas Education Foundation",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Vetaas Education Foundation Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vetaas Education Foundation | Social Emotional Learning",
    description: "Nurturing Social Emotional Learning (SEL) in early childhood.",
    images: ["/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const SITE_URL = "https://www.vetaas.in";
const GA_MEASUREMENT_ID = "G-1JKRXKWR09";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // LocalBusiness matters for "…near me" / "…in Bengaluru" searches — it's
      // what lets Google associate the site with a physical place.
      "@type": ["LocalBusiness", "EducationalOrganization", "NGO"],
      "@id": `${SITE_URL}/#organization`,
      name: "Vetaas Education Foundation",
      alternateName: ["Vetaas — The Tree of Hope", "The Nest by Vetaas"],
      url: SITE_URL,
      logo: `${SITE_URL}/logo.webp`,
      image: `${SITE_URL}/logo.webp`,
      description:
        "Vetaas Education Foundation runs Social Emotional Learning (SEL) programs, workshops and parent-child sessions for early childhood in Bengaluru — working with parents, teachers and schools from our studio, The Nest, in J. P. Nagar.",
      telephone: "+91-89510-04160",
      email: "kirti@vetaas.in",
      priceRange: "₹₹",
      areaServed: [
        { "@type": "City", name: "Bengaluru" },
        { "@type": "City", name: "Bangalore" },
      ],
      address: {
        "@type": "PostalAddress",
        name: "The Nest by Vetaas",
        streetAddress:
          "Dhanalakshmi Building, D21, Kanakapura Main Road, opposite Total Energies petrol station, Shakambari Nagar, 1st Phase, J. P. Nagar",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        postalCode: "560078",
        addressCountry: "IN",
      },
      hasMap: "https://maps.app.goo.gl/eMUJokfKE8opyhhz5",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "11:00",
          closes: "18:00",
        },
      ],
      knowsAbout: [
        "Social Emotional Learning",
        "SEL curriculum",
        "Early childhood education",
        "Parent workshops",
        "Teacher training",
        "Child development",
      ],
      sameAs: [
        "https://www.instagram.com/vetaaseducation/",
        "https://www.linkedin.com/company/vetaas/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Vetaas Education Foundation",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
    },
    // Explicit main-navigation signal — the closest you can get to "hardcoding"
    // sitelinks. Google may use this to choose which links to surface.
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#nav`,
      name: "Primary navigation",
      itemListElement: [
        { "@type": "SiteNavigationElement", position: 1, name: "Home", url: SITE_URL },
        { "@type": "SiteNavigationElement", position: 2, name: "About", url: `${SITE_URL}/about` },
        { "@type": "SiteNavigationElement", position: 3, name: "Services", url: `${SITE_URL}/services` },
        { "@type": "SiteNavigationElement", position: 4, name: "SEL for Children", url: `${SITE_URL}/children` },
        { "@type": "SiteNavigationElement", position: 5, name: "SEL for Teachers", url: `${SITE_URL}/teachers` },
        { "@type": "SiteNavigationElement", position: 6, name: "SEL for Parents", url: `${SITE_URL}/parents` },
        { "@type": "SiteNavigationElement", position: 7, name: "Events", url: `${SITE_URL}/events` },
        { "@type": "SiteNavigationElement", position: 8, name: "Find Us", url: `${SITE_URL}/find-us` },
        { "@type": "SiteNavigationElement", position: 9, name: "Contact", url: `${SITE_URL}/contact` },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${playfair.variable} ${poppins.variable} min-h-screen flex flex-col antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script
          src="https://ozlabsprototype1.vercel.app/api/v1/track/script?key=d0a677c9-0c0e-4005-9876-3e091add411d"
          strategy="afterInteractive"
        />

        {/* Google Analytics 4 — sends page views manually so /admin is excluded
            (see GoogleAnalytics.tsx). Otherwise the team's own dashboard
            browsing shows up as visitor traffic. */}
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
