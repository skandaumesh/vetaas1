import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Vetaas Education Foundation. Reach out to learn about our Social Emotional Learning (SEL) programs, workshops, and partnerships in Bangalore, India.",
  keywords: ["contact Vetaas", "SEL Bangalore", "get in touch", "Vetaas Education Foundation contact"],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Vetaas Education Foundation",
    description:
      "Get in touch with Vetaas Education Foundation about our SEL programs and workshops.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
