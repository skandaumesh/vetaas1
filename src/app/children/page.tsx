import type { Metadata } from "next";
import ChildrenPageClient from "@/components/children/ChildrenPageClient";

export const metadata: Metadata = {
  title: "SEL for Children in Bengaluru",
  description: "Social Emotional Learning programs for children aged 3-6 in Bengaluru. Play-based, experiential SEL sessions at The Nest, J. P. Nagar — helping children name feelings, build empathy and grow resilient.",
  alternates: { canonical: "/children" },
  openGraph: {
    title: "SEL for Children | Vetaas Education Foundation",
    description: "Nurturing children's social and emotional skills for lifelong well-being.",
    url: "/children",
    type: "website",
  },
};

export default function ChildrenPage() {
  return <ChildrenPageClient />;
}
