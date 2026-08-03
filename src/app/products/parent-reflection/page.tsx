import ParentReflectionQuiz from "@/components/products/ParentReflectionQuiz";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "In Sync: Parent Reflection & Beliefs",
  description:
    "A gentle, judgment-free self-reflection on your beliefs and everyday moments as a parent.",
  alternates: { canonical: "/products/parent-reflection" },
};

export default function ParentReflectionPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-[calc(var(--header-height)+1.5rem)]">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#7C3AED] transition-colors"
        >
          <ArrowLeft size={16} /> All assessments
        </Link>
      </div>
      <ParentReflectionQuiz />
    </main>
  );
}
