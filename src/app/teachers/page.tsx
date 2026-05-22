"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Handshake,
  Monitor,
  School,
  Check,
} from "lucide-react";

const OFFERINGS = [
  {
    icon: Handshake,
    title: "Educator's Meet",
    badge: "Community",
    accent: "#1a4895",
    accentBg: "rgba(26,72,149,0.08)",
    description:
      "The responsibility of education is a huge one. The meet up offers a chance to:",
    items: [
      "Forge new collaborations",
      "Learn about latest education innovation",
      "Enliven the community of educators",
    ],
  },
  {
    icon: Monitor,
    title: "Teacher Tribe Time",
    badge: "Online · TTT",
    accent: "#36ba98",
    accentBg: "rgba(54,186,152,0.08)",
    description:
      "TTT is an online platform to explore one's teacherhood. TTT offers a chance to:",
    items: [
      "Reflect on your teaching practice",
      "Become a part of an active community of teachers",
      "Develop SEL competencies",
    ],
  },
  {
    icon: School,
    title: "Teacher Wellbeing Course",
    badge: "In-Person",
    accent: "#ff6e79",
    accentBg: "rgba(255,110,121,0.08)",
    description:
      "An in-person course conducted on demand at your school premises where you can:",
    items: [
      "Learn about wellbeing practices",
      "Practice stress management techniques",
      "Create routines in line with SEL frameworks",
    ],
  },
];

export default function TeachersPage() {
  return (
    <main
      className="relative min-h-screen bg-[#faf9f6] overflow-hidden"
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      {/* ── SVG Doodles (home hero style) ── */}

      {/* Paper airplane + dashed loop — top left */}
      <div className="absolute top-[6%] left-[3%] w-44 h-44 pointer-events-none z-0">
        <svg viewBox="0 0 150 150" fill="none" className="w-full h-full">
          <path
            d="M 15,110 C 10,80 60,70 50,50 C 40,30 15,45 30,65 C 45,85 85,55 105,40"
            stroke="#ffd166"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 6"
          />
          <g transform="translate(100, 25) rotate(-15)">
            <path
              d="M 0,15 L 30,0 L 20,30 L 12,20 Z"
              fill="none"
              stroke="#1a4895"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path d="M 30,0 L 12,20" stroke="#1a4895" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* Navy dot grid — top right */}
      <div className="absolute top-[10%] right-[5%] opacity-80 pointer-events-none z-0">
        <svg width="56" height="42" viewBox="0 0 80 60" fill="#1a4895">
          {[10, 30, 50, 70].map((cx) =>
            [10, 30, 50].map((cy) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
            ))
          )}
        </svg>
      </div>

      {/* Coral dot grid — mid left */}
      <div className="absolute top-[48%] left-[2%] opacity-70 pointer-events-none z-0">
        <svg width="36" height="36" viewBox="0 0 60 60" fill="#ff6e79">
          {[10, 30, 50].map((cx) =>
            [10, 30, 50].map((cy) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
            ))
          )}
        </svg>
      </div>

      {/* Blue zigzag — lower left */}
      <div className="absolute bottom-[22%] left-[4%] w-20 h-10 pointer-events-none z-0">
        <svg
          viewBox="0 0 80 30"
          fill="none"
          stroke="#1a4895"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M 0,15 L 12,5 L 24,25 L 36,5 L 48,25 L 60,5 L 72,15" />
        </svg>
      </div>

      {/* Half-circle sun — right mid */}
      <div className="absolute top-[62%] right-0 translate-x-[52%] w-20 h-20 pointer-events-none z-0">
        <svg viewBox="0 0 100 100" fill="#ffd166" className="w-full h-full">
          <circle cx="50" cy="50" r="50" />
        </svg>
      </div>

      {/* Subtle flowing SVG curves */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 1000"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M-50,250 C300,450 700,100 1100,380 C1280,470 1400,220 1500,300"
            stroke="#1a4895"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.04"
          />
          <path
            d="M-50,650 C200,470 550,750 900,550 C1150,400 1350,620 1500,560"
            stroke="#36ba98"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="10 8"
            opacity="0.04"
          />
        </svg>
      </div>

      {/* ── Navy bottom wave ── */}
      <div className="absolute bottom-0 left-0 w-full h-[90px] sm:h-[110px] md:h-[130px] pointer-events-none z-0">
        <svg
          viewBox="0 0 600 120"
          preserveAspectRatio="none"
          className="w-full h-full text-[#1a4895]"
        >
          <path
            d="M 0,90 C 80,110 160,115 220,105 C 300,90 400,60 480,70 C 520,75 560,95 600,90 L 600,120 L 0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 pt-[calc(var(--header-height)+4rem)] pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            <span className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-white border border-[#1a4895]/10 text-[#1a4895] font-bold text-[10px] tracking-[0.2em] uppercase shadow-sm mb-5">
              <GraduationCap size={14} /> For Teachers
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] text-[#111827] tracking-tight">
              SEL For <span className="text-[#36ba98]">Teachers</span>
            </h1>
          </div>
          <p className="text-gray-500 text-base sm:text-lg font-medium max-w-sm md:text-right leading-relaxed shrink-0">
            Supporting teachers in their most rewarding yet challenging journeys.
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════
          OUR APPROACH  (split section)
      ══════════════════════════════ */}
      <section className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl shadow-black/8">
              <Image
                src="/teacher1.png"
                alt="Teacher with children in a classroom"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Overlay accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1a4895]" />
            </div>
            {/* Floating quote bubble */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-6 -right-4 md:-right-8 bg-white rounded-2xl shadow-lg border border-gray-100 px-5 py-4 max-w-[220px]"
            >
              <p className="text-xs font-semibold text-gray-700 leading-snug">
                "When teachers thrive, children flourish!"
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-[#36ba98]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Vetaas
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#36ba98] mb-4 block">
              Our Approach
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] leading-tight mb-6">
              Nurturing <br className="hidden sm:block" />
              the Nurturers
            </h2>
            <p className="text-gray-600 font-medium text-base leading-relaxed mb-5">
              At Vetaas, we think that teachers need support in replenishing their
              repertoire of techniques to scaffold the development of children
              and more importantly in renewing their physical, mental and
              emotional energies.
            </p>
            <p className="text-gray-600 font-medium text-base leading-relaxed mb-8">
              Vetaas provides thoughtfully crafted programs for teachers to help
              themselves enjoy their teaching journeys happily.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#1a4895] text-white font-bold text-sm px-8 py-4 rounded-full hover:bg-[#153a7a] hover:-translate-y-0.5 transition-all shadow-md"
            >
              Get Involved <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════
          OUR OFFERINGS
      ══════════════════════════════ */}
      <section className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 pb-32">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff6e79] mb-3 block">
            Programs
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] leading-tight">
              Our Offerings
            </h2>
            <p className="text-gray-500 font-medium text-base max-w-sm md:text-right leading-relaxed">
              Programs designed to empower, rejuvenate, and inspire educators.
            </p>
          </div>
          <div className="mt-6 h-px bg-gray-200 w-full" />
        </motion.div>

        {/* Offering cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {OFFERINGS.map((offering, i) => {
            const Icon = offering.icon;
            return (
              <motion.div
                key={offering.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/8 hover:-translate-y-2 transition-all duration-400 flex flex-col overflow-hidden"
              >
                {/* Accent top bar */}
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: offering.accent }}
                />

                <div className="flex flex-col flex-1 p-7 md:p-8">
                  {/* Icon + badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: offering.accentBg,
                        color: offering.accent,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: offering.accentBg,
                        color: offering.accent,
                      }}
                    >
                      {offering.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#111827] mb-3 leading-snug">
                    {offering.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                    {offering.description}
                  </p>

                  {/* Bullet items */}
                  <ul className="space-y-3 flex-1">
                    {offering.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            backgroundColor: offering.accentBg,
                            color: offering.accent,
                          }}
                        >
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className="text-sm font-medium text-gray-600 leading-snug">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-8 pt-6 border-t border-dashed border-gray-100">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all hover:gap-3"
                      style={{ color: offering.accent }}
                    >
                      Learn more <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════
          BOTTOM CTA
      ══════════════════════════════ */}
      <section className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-12 pb-52">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#1a4895] rounded-3xl px-10 md:px-16 py-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
        >
          {/* Inner doodles */}
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-4 right-20 w-16 h-16 rounded-full bg-[#ffd166]/20 pointer-events-none" />
          <div className="absolute top-6 left-32 opacity-10 pointer-events-none">
            <svg width="48" height="36" viewBox="0 0 80 60" fill="white">
              {[10, 30, 50, 70].map((cx) =>
                [10, 30, 50].map((cy) => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
                ))
              )}
            </svg>
          </div>

          <div className="relative z-10 text-center md:text-left max-w-xl">
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest mb-4 border border-white/20">
              Join the Community
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              Empower Your <span className="text-[#ffd166]">Teaching Journey</span>
            </h2>
            <p className="text-white/70 font-medium text-base leading-relaxed">
              Join our community of passionate educators making a difference every day.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#ffd166] text-[#111827] font-bold text-sm px-8 py-4 rounded-full hover:bg-yellow-300 hover:-translate-y-0.5 transition-all shadow-md whitespace-nowrap"
            >
              Get In Touch <ArrowRight size={16} />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold text-sm px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              View Events
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
