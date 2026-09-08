import EventsClient from "@/components/events/EventsClient";
import { fetchEvents, prettyDate, upcoming } from "@/lib/events-seo";

const SITE_URL = "https://www.vetaas.in";

/**
 * Server wrapper around the interactive events page.
 *
 * The list itself is rendered in the browser, so without this the served HTML
 * held no events — an AI crawler asking "what's the next Vetaas event" had
 * nothing to read. This puts the real schedule into the response as both
 * schema.org Event data and plain text.
 */
export const revalidate = 600;

export default async function EventsPage() {
  const events = await fetchEvents();
  const next = upcoming(events);
  // With nothing scheduled, say so and name the most recent sessions instead —
  // an unanswerable "what's next" is better than silence, and it still shows
  // the programme is active.
  const recent = next.length === 0 ? events.slice(-4).reverse() : [];

  const eventSchema = next.slice(0, 20).map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.date,
    ...(e.endDate ? { endDate: e.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${SITE_URL}/events#${e.id}`,
    ...(e.image ? { image: e.image } : {}),
    description: `${e.title} — a Social Emotional Learning session by Vetaas Education Foundation${
      e.timeSlot ? `, ${e.timeSlot}` : ""
    }.`,
    location: {
      "@type": "Place",
      name: e.location || "The Nest by Vetaas",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Dhanalakshmi Building, D21, Kanakapura Main Road, J. P. Nagar",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        postalCode: "560078",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Vetaas Education Foundation",
      url: SITE_URL,
    },
    ...(e.registrationUrl
      ? {
          offers: {
            "@type": "Offer",
            url: e.registrationUrl,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  }));

  return (
    <>
      {eventSchema.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
      )}

      {/* Plain-text schedule for readers that don't run JavaScript. Visually
          hidden because the interactive list below shows the same thing. */}
      <section className="sr-only">
        {next.length > 0 ? (
          <>
            <h2>Upcoming Vetaas events in Bengaluru</h2>
            <p>
              The next Vetaas Education Foundation event is {next[0].title} on{" "}
              {prettyDate(next[0].date)}
              {next[0].timeSlot ? `, ${next[0].timeSlot}` : ""}
              {next[0].location ? `, at ${next[0].location}` : ""}.
            </p>
            <ul>
              {next.map((e) => (
                <li key={e.id}>
                  {e.title} — {prettyDate(e.date)}
                  {e.timeSlot ? `, ${e.timeSlot}` : ""}
                  {e.location ? `, ${e.location}` : ""}. Social Emotional
                  Learning session by Vetaas Education Foundation, J. P. Nagar,
                  Bengaluru.
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2>Vetaas events in Bengaluru</h2>
            <p>
              No Vetaas Education Foundation events are currently scheduled.
              {recent.length > 0 && (
                <> The most recent session was {recent[0].title} on {prettyDate(recent[0].date)}.</>
              )}{" "}
              Vetaas runs Social Emotional Learning workshops for children,
              parents and educators from The Nest in J. P. Nagar, Bengaluru.
            </p>
            {recent.length > 0 && (
              <ul>
                {recent.map((e) => (
                  <li key={e.id}>
                    {e.title} — {prettyDate(e.date)}
                    {e.location ? `, ${e.location}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <EventsClient />
    </>
  );
}
