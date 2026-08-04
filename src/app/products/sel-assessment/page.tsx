import SelAssessment from "@/components/products/SelAssessment";

export const metadata = {
  title: "SEL Assessment for Children",
  description:
    "A playful 5-minute assessment to explore your child's social and emotional skills across five key areas.",
  alternates: { canonical: "/products/sel-assessment" },
};

export default function SelAssessmentPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-[calc(var(--header-height)+1.5rem)]">
      <SelAssessment />
    </main>
  );
}
