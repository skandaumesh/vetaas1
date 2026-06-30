import type { Metadata } from "next";
import ParentsPageClient from "@/components/parents/ParentsPageClient";

export const metadata: Metadata = {
  title: "SEL for Parents",
  description: "Thoughtfully crafted Social Emotional Learning workshops for parents of children aged 3 to 6, by Vetaas Education Foundation in Bangalore.",
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
