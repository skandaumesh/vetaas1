import ProductsTabs from "@/components/products/ProductsTabs";

export const metadata = {
  title: "Self-Assessments & Worksheets",
  description:
    "Short, reflective self-assessments and free printable worksheets for parents and children from Vetaas — explore your child's social-emotional skills or reflect on your own parenting.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Self-Assessments & Worksheets | Vetaas Education Foundation",
    description: "Reflective self-assessments and free printable worksheets for parents and children.",
    url: "/products",
    type: "website",
  },
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <ProductsTabs />
    </main>
  );
}
