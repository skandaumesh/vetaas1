import SelAssessment from "@/components/products/SelAssessment";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "SEL Assessment for Children",
  description:
    "A playful 5-minute assessment to explore your child's social and emotional skills across five key areas.",
  alternates: { canonical: "/products/sel-assessment" },
};

export default function SelAssessmentPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-[calc(var(--header-height)+1.5rem)]">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#7C3AED] transition-colors"
        >
          <ArrowLeft size={16} /> All assessments
        </Link>
      </div>
      <SelAssessment />
    </main>
  );
}
