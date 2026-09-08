/**
 * Server-side read of the events collection, used to put real event data into
 * the HTML the crawler receives.
 *
 * The events page itself is a client component that loads from Firestore in
 * the browser, which means the served HTML contains no events at all — fine
 * for Google, which renders JavaScript, but AI crawlers generally don't. They
 * read the raw response, so "what's the next Vetaas event" was unanswerable.
 *
 * This uses the Firestore REST API rather than the web SDK: the SDK's
 * WebChannel transport is unreliable in a server runtime, and the collection
 * is public-read, so an unauthenticated GET is enough.
 */

const PROJECT_ID = "vetaas-7aeae";
const API_KEY = "AIzaSyCPX8GqGLLFDzRGnjhjJj_ovy88ulpK-D4";

export interface PublicEvent {
  id: string;
  title: string;
  /** ISO date, e.g. "2026-09-05". */
  date: string;
  endDate?: string;
  timeSlot?: string;
  location?: string;
  image?: string;
  registrationUrl?: string;
}

type RestValue = {
  stringValue?: string;
  timestampValue?: string;
  integerValue?: string;
  booleanValue?: boolean;
};

const str = (v?: RestValue) => {
  if (!v) return undefined;
  if (typeof v.stringValue === "string") return v.stringValue;
  if (typeof v.timestampValue === "string") return v.timestampValue.slice(0, 10);
  return undefined;
};

export async function fetchEvents(): Promise<PublicEvent[]> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
    `/databases/(default)/documents/events?pageSize=200&key=${API_KEY}`;

  try {
    // Re-read every 10 minutes: new events should surface without a redeploy,
    // but every crawl shouldn't hit Firestore.
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      documents?: { name: string; fields?: Record<string, RestValue> }[];
    };

    return (data.documents ?? [])
      .map((doc): PublicEvent | null => {
        const f = doc.fields ?? {};
        const date = str(f.date);
        const title = str(f.title);
        if (!date || !title) return null;
        return {
          id: doc.name.split("/").pop() ?? "",
          title,
          date,
          endDate: str(f.endDate),
          timeSlot: str(f.timeSlot),
          location: str(f.location),
          image: str(f.image),
          registrationUrl: str(f.registrationUrl),
        };
      })
      .filter((e): e is PublicEvent => e !== null)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (err) {
    console.error("Could not read events for SEO:", err);
    return [];
  }
}

/** Events today or later, soonest first. */
export function upcoming(events: PublicEvent[]) {
  const today = new Date().toISOString().slice(0, 10);
  return events.filter((e) => (e.endDate ?? e.date) >= today);
}

export const prettyDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
