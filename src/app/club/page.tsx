import ClubSection from "@/components/club/ClubSection";

export const metadata = {
  title: "Clubs",
  description:
    "Join a community club at The Nest by Vetaas — Book Club, Crochet Club, and Movie Screenings in Bangalore. Small, warm groups that meet regularly.",
  alternates: { canonical: "/club" },
  openGraph: {
    title: "Clubs | Vetaas Education Foundation",
    description:
      "Book Club, Crochet Club, and Movie Screenings at The Nest by Vetaas.",
    url: "/club",
    type: "website",
  },
};

export default function ClubPage() {
  return <ClubSection />;
}
