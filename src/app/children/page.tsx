import type { Metadata } from "next";
import ChildrenPageClient from "@/components/children/ChildrenPageClient";

export const metadata: Metadata = {
  title: "SEL for Children",
  description: "Nurturing children's social and emotional skills for lifelong well-being through Vetaas' early childhood SEL programs in Bangalore.",
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
