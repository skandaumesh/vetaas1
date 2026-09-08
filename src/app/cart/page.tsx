import CartClient from "@/components/cart/CartClient";

export const metadata = {
  title: "Your Cart",
  description: "Membership plans, worksheets and card decks from Vetaas Education Foundation.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartClient />;
}
