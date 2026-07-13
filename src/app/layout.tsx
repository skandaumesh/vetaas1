import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

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
    default: "Vetaas Education Foundation | Social Emotional Learning",
    template: "%s | Vetaas Education Foundation",
  },
  description: "Vetaas partners with parents, teachers, and schools to nurture Social Emotional Learning (SEL) in early childhood across Bangalore, India. Discover our resources, curriculum, and community initiatives.",
  keywords: ["Social Emotional Learning", "SEL", "Early Childhood Education", "Vetaas Education Foundation", "Bangalore", "Child Development", "Parenting", "Teacher Training"],
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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "EducationalOrganization", "NGO"],
      "@id": `${SITE_URL}/#organization`,
      name: "Vetaas Education Foundation",
      alternateName: "Vetaas — The Tree of Hope",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.webp`,
      description:
        "Vetaas partners with parents, teachers, and schools to nurture Social Emotional Learning (SEL) in early childhood across Bangalore, India.",
      areaServed: {
        "@type": "City",
        name: "Bangalore",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bangalore",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
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
