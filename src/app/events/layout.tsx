import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Join Vetaas Education Foundation's upcoming events, workshops, and community gatherings on Social Emotional Learning (SEL) for early childhood in Bangalore.",
  keywords: ["SEL events", "parenting workshops", "Vetaas events", "Bangalore", "early childhood workshops"],
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Events | Vetaas Education Foundation",
    description:
      "Upcoming workshops, events, and community gatherings on Social Emotional Learning.",
    url: "/events",
    type: "website",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
