import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/AnimateOnScroll";
import {
  ArrowRight,
  GraduationCap,
  Handshake,
  Monitor,
  School,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "SEL For Teachers — Vetaas Education Foundation",
  description:
    "Thoughtfully crafted teacher training programs for SEL integration, wellbeing, and capacity building.",
};

export default function TeachersPage() {
  return (
    <>
      <section className="page-hero ocean" id="teachers-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-content">
          <Reveal>
            <div
              className="section-label"
              style={{ background: "white", color: "var(--ocean)" }}
            >
              <GraduationCap className="label-icon" />
              For Teachers
            </div>
            <h1>
              SEL For{" "}
              <span className="text-gradient-ocean">Teachers</span>
            </h1>
            <p>
              Supporting teachers in their most rewarding yet challenging journeys
            </p>
          </Reveal>
        </div>
      </section>

      <section className="split-section" id="teachers-intro">
        <div className="split-grid">
          <Reveal>
            <div className="split-visual">
              <div className="accent-shape top-right" />
              <div className="split-img">
                <Image
                  src="/teachers.png"
                  alt="Teacher in a bright classroom with children"
                  width={600}
                  height={450}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="split-text">
              <h2>Nurturing the Nurturers</h2>
              <p>
                At Vetaas, we think that teachers need support in replenishing
                their repertoire of techniques to scaffold the development of
                children and more importantly in renewing their physical, mental
                and emotional energies.
              </p>
              <p>
                Vetaas provides thoughtfully crafted programs for teachers to
                help themselves enjoy their teaching journeys happily. Because
                when teachers thrive, children flourish!
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="section"
        id="teacher-offerings"
        style={{ background: "var(--sky-blue-soft)" }}
      >
        <div className="section-inner">
          <div className="section-head">
            <Reveal>
              <div
                className="section-label"
                style={{ background: "white", color: "var(--ocean)" }}
              >
                <Sparkles className="label-icon" />
                Programs
              </div>
              <h2>Our Offerings</h2>
              <p>Programs designed to empower, rejuvenate, and inspire educators</p>
            </Reveal>
          </div>

          <div className="offerings-grid">
            <Reveal delay={1}>
              <div className="offer-card">
                <div className="offer-card-accent" />
                <div className="offer-card-body">
                  <div className="offer-icon">
                    <Handshake />
                  </div>
                  <h3>Teacher Meet-Ups</h3>
                  <p>
                    The responsibility of education is huge. The meet-up offers a
                    chance to:
                  </p>
                  <ul>
                    <li>Forge new collaborations</li>
                    <li>Learn about latest education innovation</li>
                    <li>Enliven the community of educators</li>
                  </ul>
                  <Link href="/events" className="btn btn-sunset">
                    Explore <ArrowRight className="btn-icon" />
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={2}>
              <div className="offer-card">
                <div className="offer-card-accent" />
                <div className="offer-card-body">
                  <div className="offer-icon">
                    <Monitor />
                  </div>
                  <h3>TTT Online Platform</h3>
                  <p>
                    An online platform to explore one&apos;s teacherhood. TTT
                    offers:
                  </p>
                  <ul>
                    <li>Reflect on your teaching practice</li>
                    <li>Join an active community of teachers</li>
                    <li>Develop SEL competencies</li>
                  </ul>
                  <Link href="/events" className="btn btn-ocean">
                    Explore <ArrowRight className="btn-icon" />
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={3}>
              <div className="offer-card">
                <div className="offer-card-accent" />
                <div className="offer-card-body">
                  <div className="offer-icon">
                    <School />
                  </div>
                  <h3>In-School Programs</h3>
                  <p>
                    In-person courses conducted on demand at your school premises:
                  </p>
                  <ul>
                    <li>Wellbeing practices</li>
                    <li>Stress management techniques</li>
                    <li>Routines aligned with SEL frameworks</li>
                  </ul>
                  <Link href="/events" className="btn btn-forest">
                    Explore <ArrowRight className="btn-icon" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cta-section" id="teachers-cta">
        <Reveal>
          <div className="cta-banner">
            <h2>Empower Your Teaching</h2>
            <p>
              Join our community of passionate educators making a difference
              every day.
            </p>
            <Link href="/contact" className="btn btn-white">
              Get In Touch <ArrowRight className="btn-icon" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
