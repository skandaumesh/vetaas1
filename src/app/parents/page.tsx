import type { Metadata } from "next";
import ParentsPageClient from "@/components/parents/ParentsPageClient";

export const metadata: Metadata = {
  title: "SEL Workshops for Parents in Bengaluru",
  description: "Social Emotional Learning workshops for parents of children aged 3 to 6 in Bengaluru. Practical, judgment-free sessions at The Nest, J. P. Nagar, bridging home and healthy child development.",
  alternates: { canonical: "/parents" },
  openGraph: {
    title: "SEL for Parents | Vetaas Education Foundation",
    description: "Thoughtfully crafted workshops for parents of children aged 3 to 6.",
    url: "/parents",
    type: "website",
  },
};

export default function ParentsPage() {
  return <ParentsPageClient />;
}
