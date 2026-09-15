import type { Metadata } from "next";
import TicketClient from "@/components/tickets/TicketClient";

// A ticket is personal — it's reachable only through the link in the
// registrant's email, and must never end up in search results.
export const metadata: Metadata = {
  title: "Your ticket | Vetaas",
  robots: { index: false, follow: false },
};

export default async function TicketPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <TicketClient token={token} />;
}
