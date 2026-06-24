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
  metadataBase: new URL("http://localhost:3005"), // Replace with your production domain
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
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://ozlabsprototype1.vercel.app/api/v1/track/script?key=d0a677c9-0c0e-4005-9876-3e091add411d"></script>
      </head>
      <body className={`${plusJakarta.variable} ${playfair.variable} ${poppins.variable} min-h-screen flex flex-col antialiased`}>
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
