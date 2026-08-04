import ParentReflectionQuiz from "@/components/products/ParentReflectionQuiz";

export const metadata = {
  title: "In Sync: Parent Reflection & Beliefs",
  description:
    "A gentle, judgment-free self-reflection on your beliefs and everyday moments as a parent.",
  alternates: { canonical: "/products/parent-reflection" },
};

export default function ParentReflectionPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-[calc(var(--header-height)+1.5rem)]">
      <ParentReflectionQuiz />
    </main>
  );
}
