import type { Metadata } from "next";
import TeachersPageClient from "@/components/teachers/TeachersPageClient";

export const metadata: Metadata = {
  title: "SEL for Teachers",
  description: "Supporting educators' social-emotional growth and well-being with Vetaas' teacher training and SEL programs in Bangalore.",
  alternates: { canonical: "/teachers" },
  openGraph: {
    title: "SEL for Teachers | Vetaas Education Foundation",
    description: "Supporting educators' social-emotional growth and well-being.",
    url: "/teachers",
    type: "website",
  },
};

export default function TeachersPage() {
  return <TeachersPageClient />;
}
