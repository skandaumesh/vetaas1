import Link from "next/link";
import Reveal from "@/components/AnimateOnScroll";
import {
  ArrowRight,
  Calendar,
  MapPin,
  ExternalLink,
  Sparkles,
  Bell,
} from "lucide-react";

export const metadata = {
  title: "Events — Vetaas Education Foundation",
  description:
    "Upcoming and past events by Vetaas Education Foundation.",
};

const pastEvents = [
  { date: "28 Mar 2026", location: "Online", highlight: "https://www.instagram.com/reel/DVc7iIYCC0P/" },
  { date: "26 Mar 2026", location: "JP Nagar" },
  { date: "05 Mar 2026", location: "JP Nagar", highlight: "https://www.instagram.com/reel/DVu_lQTD9XK/" },
  { date: "28 Feb 2026", location: "Online" },
  { date: "29 Jan 2026", location: "JP Nagar", highlight: "https://www.instagram.com/reel/DUNmqbACGjt/" },
  { date: "18 Dec 2025", location: "JP Nagar", highlight: "https://www.instagram.com/reel/DScHYcfCHKJ/" },
  { date: "22 Nov 2025", location: "JP Nagar", highlight: "https://www.instagram.com/reel/DRTj356j5i-/" },
  { date: "13 Jul 2025", location: "Samagata Foundation, Church Street", highlight: "https://www.instagram.com/reel/DMFrPk4Pl3m/" },
  { date: "19 Jun 2025", location: "JP Nagar", highlight: "https://www.instagram.com/reel/DLJXOdhPse7/" },
  { date: "12 May 2025", location: "JP Nagar", highlight: "https://www.instagram.com/reel/DJ1fpULPUOw/" },
  { date: "23 Dec 2024", location: "Kahani Box, Akshay Nagar", highlight: "https://www.instagram.com/p/DD077mCoH8g/" },
  { date: "22 Sep 2024", location: "JP Nagar" },
  { date: "13 Jul 2024", location: "Jaya Nagar", highlight: "https://www.instagram.com/reel/C9Xio-isadD/" },
];

export default function EventsPage() {
  return (
    <>
      <section className="page-hero dream" id="events-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-content">
          <Reveal>
            <div
              className="section-label"
              style={{ background: "white", color: "var(--grape)" }}
            >
              <Calendar className="label-icon" />
              Events
            </div>
            <h1>
              Our{" "}
              <span className="text-gradient-sunset">Events</span>
            </h1>
            <p>
              Fun-filled gatherings where learning meets play and joy meets
              growth
            </p>
          </Reveal>
        </div>
      </section>

      {/* Upcoming */}
      <section className="section" id="upcoming">
        <div className="section-inner">
          <div className="section-head">
            <Reveal>
              <div
                className="section-label"
                style={{
                  background: "var(--sunny-soft)",
                  color: "var(--tangerine)",
                }}
              >
                <Bell className="label-icon" />
                Coming Soon
              </div>
              <h2>Upcoming Events</h2>
            </Reveal>
          </div>
          <Reveal>
            <div
              style={{
                maxWidth: 600,
                margin: "0 auto",
                textAlign: "center",
                padding: "3rem 2rem",
                background: "var(--cloud)",
                borderRadius: 24,
                boxShadow: "var(--shadow-md)",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <Calendar
                style={{
                  width: 48,
                  height: 48,
                  color: "var(--grape)",
                  marginBottom: "1rem",
                }}
              />
              <h3
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: "1.4rem",
                  marginBottom: "0.5rem",
                }}
              >
                No upcoming events right now
              </h3>
              <p
                style={{
                  color: "var(--ink-soft)",
                  fontSize: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                But exciting things are on the way! Stay tuned.
              </p>
              <Link href="/contact" className="btn btn-sunset">
                Get Notified <ArrowRight className="btn-icon" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Past Events */}
      <section
        className="section"
        id="past-events"
        style={{ background: "var(--grape-soft)" }}
      >
        <div className="section-inner">
          <div className="section-head">
            <Reveal>
              <div
                className="section-label"
                style={{ background: "white", color: "var(--grape)" }}
              >
                <Sparkles className="label-icon" />
                Memories
              </div>
              <h2>Past Events</h2>
              <p>A timeline of joy, learning, and togetherness</p>
            </Reveal>
          </div>

          <div className="events-grid">
            {pastEvents.map((event, i) => (
              <Reveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="event-row">
                  <div className="event-date-box">
                    <div className="e-day">{event.date.split(" ")[0]}</div>
                    <div className="e-month">
                      {event.date.split(" ").slice(1).join(" ")}
                    </div>
                  </div>
                  <div className="event-details">
                    <h4>Vetaas Workshop</h4>
                    <div className="e-location">
                      <MapPin /> {event.location}
                    </div>
                  </div>
                  {event.highlight ? (
                    <a
                      href={event.highlight}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sunset"
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.45rem 1rem",
                      }}
                    >
                      Highlights <ExternalLink style={{ width: 14, height: 14 }} />
                    </a>
                  ) : (
                    <span
                      className="btn btn-outline"
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.45rem 1rem",
                        opacity: 0.4,
                        pointerEvents: "none",
                      }}
                    >
                      Soon
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" id="events-cta">
        <Reveal>
          <div className="cta-banner">
            <h2>Don&apos;t Miss Out</h2>
            <p>
              Register for upcoming events and be part of the Vetaas community.
            </p>
            <Link href="/contact" className="btn btn-white">
              Register Now <ArrowRight className="btn-icon" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
