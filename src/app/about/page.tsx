import type { Metadata } from "next";
import AboutPageClient from "@/components/about/AboutPageClient";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Vetaas - The Tree of Hope. Reimagining early childhood education through Social Emotional Learning (SEL) in Bangalore, India.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Vetaas Education Foundation",
    description: "Reimagining early childhood education through Social Emotional Learning.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
