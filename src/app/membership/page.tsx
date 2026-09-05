import MembershipStatus from "@/components/membership/MembershipStatus";

export const metadata = {
  title: "Check Your Membership",
  description:
    "Check the status, plan and validity of your Vetaas membership using your membership ID and registered email address.",
  alternates: { canonical: "/membership" },
  robots: { index: false, follow: true },
};

export default function MembershipStatusPage() {
  return <MembershipStatus />;
}
