import SelAssessment from "@/components/products/SelAssessment";

export const metadata = {
  title: "SEL Assessment | Vetaas",
  description: "Understanding Your Child Beyond Academics with our SEL Assessment Game.",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-blue-50 py-12">
      <SelAssessment />
    </main>
  );
}
