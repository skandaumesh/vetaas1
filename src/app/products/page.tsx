import QuizzesSection from "@/components/products/QuizzesSection";

export const metadata = {
  title: "Self-Assessments",
  description:
    "Short, reflective self-assessments for parents and children from Vetaas — explore your child's social-emotional skills or reflect on your own parenting.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Self-Assessments | Vetaas Education Foundation",
    description: "Reflective self-assessments for parents and children.",
    url: "/products",
    type: "website",
  },
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <QuizzesSection />
    </main>
  );
}
