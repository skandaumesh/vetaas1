import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/AnimateOnScroll";
import {
  ArrowRight,
  TreePine,
  Lightbulb,
  Users,
  GraduationCap,
  Stethoscope,
  Music,
  Globe,
  Code,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "About Us — Vetaas Education Foundation",
  description:
    "Learn about Vetaas - The Tree of Hope. Reimagining early childhood education through Social Emotional Learning.",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero ocean" id="about-hero">
        <div className="page-hero-bg" />
        <div className="page-hero-content">
          <Reveal>
            <div
              className="section-label"
              style={{ background: "white", color: "var(--ocean)" }}
            >
              <Sparkles className="label-icon" />
              Our Story
            </div>
            <h1>
              About <span className="text-gradient-ocean">Vetaas</span>
            </h1>
            <p>
              The Tree of Hope — reimagining early childhood education through
              Social Emotional Learning
            </p>
          </Reveal>
        </div>
      </section>

      {/* Origin Story */}
      <section className="split-section" id="origin">
        <div className="split-grid">
          <Reveal>
            <div className="split-visual">
              <div className="accent-shape top-right" />
              <div className="split-img">
                <Image
                  src="/about.png"
                  alt="The magical tree of hope"
                  width={600}
                  height={450}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="split-text">
              <h2>
                <TreePine
                  style={{
                    display: "inline",
                    width: 28,
                    height: 28,
                    color: "var(--lime-pop)",
                    marginRight: 8,
                    verticalAlign: "middle",
                  }}
                />
                The Tree of Hope
              </h2>
              <p>
                Nature is the greatest inspiration one can ask for and it is hard
                to imagine anything more nurturing than the tree. When research
                and experience convinced us that engaging with early childhood is
                the best investment in education, we looked no further than
                Mother Nature for direction.
              </p>
              <p>
                &lsquo;Veth&rsquo; in many Indian languages refers to trees and
                &lsquo;aas&rsquo; refers to hope. These beautiful ideas come
                together to form &lsquo;Vetaas&rsquo; — the Tree of Hope.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SEL */}
      <section
        className="split-section"
        id="sel"
        style={{ background: "var(--sky-blue-soft)" }}
      >
        <div className="split-grid reverse">
          <Reveal>
            <div className="split-visual">
              <div className="accent-shape bottom-left" />
              <div className="split-img">
                <Image
                  src="/sel.png"
                  alt="Social Emotional Learning"
                  width={600}
                  height={450}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="split-text">
              <h2>
                <Lightbulb
                  style={{
                    display: "inline",
                    width: 28,
                    height: 28,
                    color: "var(--sunny)",
                    marginRight: 8,
                    verticalAlign: "middle",
                  }}
                />
                What is SEL?
              </h2>
              <p>
                Social Emotional Learning (SEL) is the most progressive
                framework we have to perceive education holistically. In an age
                where technological advances have increased our average life
                expectancies considerably and artificial intelligence is
                contesting our relevance, adopting a learning mindset is key to
                our own survival.
              </p>
              <p>
                Vetaas strives to reimagine the early childhood education
                curriculum from the lens of SEL and empower the teachers and the
                parents with skills, knowledge and perspectives to make SEL part
                of their teaching and learning journeys.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* For Parents */}
      <section className="split-section" id="for-parents">
        <div className="split-grid">
          <Reveal>
            <div className="split-visual">
              <div className="accent-shape top-right" />
              <div className="split-img">
                <Image
                  src="/parents.png"
                  alt="Parents and children"
                  width={600}
                  height={450}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="split-text">
              <h2>
                <Users
                  style={{
                    display: "inline",
                    width: 28,
                    height: 28,
                    color: "var(--tangerine)",
                    marginRight: 8,
                    verticalAlign: "middle",
                  }}
                />
                For Parents
              </h2>
              <p>
                Every child deserves both holistic and wholesome care, especially
                during their early years. At Vetaas, we provide parents with
                resources to engage with their child through SEL-focused
                activities.
              </p>
              <div style={{ marginTop: "1.5rem" }}>
                <Link href="/parents" className="btn btn-sunset">
                  Explore Programs <ArrowRight className="btn-icon" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* For Teachers */}
      <section
        className="split-section"
        id="for-teachers"
        style={{ background: "var(--sunny-soft)" }}
      >
        <div className="split-grid reverse">
          <Reveal>
            <div className="split-visual">
              <div className="accent-shape bottom-left" />
              <div className="split-img">
                <Image
                  src="/teachers.png"
                  alt="Teachers in a bright classroom"
                  width={600}
                  height={450}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="split-text">
              <h2>
                <GraduationCap
                  style={{
                    display: "inline",
                    width: 28,
                    height: 28,
                    color: "var(--ocean)",
                    marginRight: 8,
                    verticalAlign: "middle",
                  }}
                />
                For Teachers
              </h2>
              <p>
                Our teacher training programs help teachers learn about SEL,
                integrate SEL into their teaching practices, and create a
                SEL-supportive classroom environment. We work with teachers to
                help them enjoy their teaching journeys more.
              </p>
              <div style={{ marginTop: "1.5rem" }}>
                <Link href="/teachers" className="btn btn-ocean">
                  Explore Programs <ArrowRight className="btn-icon" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="section" id="team">
        <div className="section-inner">
          <div className="section-head">
            <Reveal>
              <div
                className="section-label"
                style={{
                  background: "var(--grape-soft)",
                  color: "var(--grape)",
                }}
              >
                <Sparkles className="label-icon" />
                The Dreamers
              </div>
              <h2>Meet Our Team</h2>
              <p>The passionate people behind the Tree of Hope</p>
            </Reveal>
          </div>

          <div className="team-grid">
            <Reveal delay={1}>
              <div className="team-tile">
                <div className="team-avatar">
                  <Stethoscope />
                </div>
                <h3>Sameer Bansal</h3>
                <p className="t-role">
                  Co-Founder &bull; Pulmonologist &bull; Guitar Player
                </p>
                <Link
                  href="/contact"
                  className="btn btn-ocean"
                  style={{ fontSize: "0.85rem", padding: "0.55rem 1.3rem" }}
                >
                  Connect <ArrowRight className="btn-icon" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={2}>
              <div className="team-tile">
                <div className="team-avatar">
                  <GraduationCap />
                </div>
                <h3>Kirti Krishna</h3>
                <p className="t-role">
                  Co-Founder &bull; Teacher Educator &bull; Esperantist
                </p>
                <Link
                  href="/contact"
                  className="btn btn-sunset"
                  style={{ fontSize: "0.85rem", padding: "0.55rem 1.3rem" }}
                >
                  Connect <ArrowRight className="btn-icon" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={3}>
              <div className="team-tile">
                <div className="team-avatar">
                  <Code />
                </div>
                <h3>Charan</h3>
                <p className="t-role">
                  Curriculum Developer &bull; Tech Support
                </p>
                <Link
                  href="/contact"
                  className="btn btn-dream"
                  style={{ fontSize: "0.85rem", padding: "0.55rem 1.3rem" }}
                >
                  Connect <ArrowRight className="btn-icon" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cta-section" id="about-cta">
        <Reveal>
          <div className="cta-banner">
            <h2>Join the Village</h2>
            <p>
              Let us build that village together — for every child, every parent,
              every teacher.
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
