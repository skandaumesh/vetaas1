import type { Metadata } from "next";
import TeachersPageClient from "@/components/teachers/TeachersPageClient";

export const metadata: Metadata = {
  title: "SEL Training for Teachers in Bengaluru",
  description: "SEL workshops and capacity-building for educators and schools in Bengaluru. Vetaas helps teachers manage stress, embed Social Emotional Learning in daily teaching, and build SEL-supportive classrooms.",
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
