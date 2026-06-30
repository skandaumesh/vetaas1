import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Vetaas' Social Emotional Learning (SEL) programs for children, teachers, and parents — workshops, curriculum, and training designed for early childhood in Bangalore.",
  keywords: ["SEL programs", "SEL workshops", "early childhood services", "Vetaas services", "Bangalore"],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Vetaas Education Foundation",
    description:
      "Social Emotional Learning programs for children, teachers, and parents across Bangalore.",
    url: "/services",
    type: "website",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
