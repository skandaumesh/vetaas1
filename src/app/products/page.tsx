import SelAssessment from "@/components/products/SelAssessment";

export const metadata = {
  title: "SEL Assessment",
  description: "Understanding your child beyond academics with the Vetaas SEL Assessment Game — a playful way to measure social and emotional growth.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "SEL Assessment | Vetaas Education Foundation",
    description: "Understanding your child beyond academics with our SEL Assessment Game.",
    url: "/products",
    type: "website",
  },
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-blue-50 py-12">
      <SelAssessment />
    </main>
  );
}
