"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Heart } from "lucide-react";

const CATEGORIES = ["All", "Curriculum", "Toolkits", "Resources"];

const PRODUCTS = [
  {
    id: 1,
    category: "Curriculum",
    title: "SEL Starter Kit",
    subtitle: "Foundational Learning",
    description:
      "A comprehensive introduction to Social Emotional Learning designed for early childhood classrooms.",
    image: "/product1.png",
    accent: "#1a4895",
    tag: "Most Popular",
  },
  {
    id: 2,
    category: "Toolkits",
    title: "Parent Toolkit",
    subtitle: "Home Integration",
    description:
      "Equip parents with simple, science-backed activities to nurture emotional intelligence at home.",
    image: "/product2.png",
    accent: "#ff6e79",
    tag: "Essential",
  },
  {
    id: 3,
    category: "Curriculum",
    title: "Training Manual",
    subtitle: "Educator Empowerment",
    description:
      "A structured training program that transforms teachers into SEL practitioners.",
    image: "/product3.png",
    accent: "#36ba98",
    tag: "For Schools",
  },
  {
    id: 4,
    category: "Resources",
    title: "Assessment Tool",
    subtitle: "Impact Tracking",
    description:
      "Data-driven tools to track and measure SEL development across classrooms.",
    image: "/product1.png",
    accent: "#ffd166",
    tag: "Data-Driven",
  },
  {
    id: 5,
    category: "Resources",
    title: "Story Cards",
    subtitle: "Creative Starters",
    description:
      "A beautifully illustrated deck of cards featuring diverse characters and emotional scenarios.",
    image: "/product2.png",
    accent: "#ff6e79",
    tag: "Interactive",
  },
  {
    id: 6,
    category: "Toolkits",
    title: "Volunteer Pack",
    subtitle: "Community Outreach",
    description:
      "Everything a volunteer needs to run an SEL program in their community.",
    image: "/product3.png",
    accent: "#1a4895",
    tag: "Scalable",
  },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <main
      className="relative min-h-screen bg-[#faf9f6] overflow-hidden selection:bg-[#36ba98]/30"
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
      <div className="absolute top-[45%] left-[2%] opacity-70 pointer-events-none z-0">
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
      <div className="absolute top-[58%] right-0 translate-x-[52%] w-20 h-20 pointer-events-none z-0">
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
            d="M-50,600 C200,420 550,700 900,500 C1150,350 1350,580 1500,520"
            stroke="#36ba98"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="10 8"
            opacity="0.045"
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

      {/* ── Hero ── */}
      <section className="relative z-10 pt-[calc(var(--header-height)+4rem)] pb-16 px-6 md:px-12 max-w-[1300px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            {/* Pill badge */}
            <span className="inline-block py-1.5 px-5 rounded-full bg-white border border-[#1a4895]/10 text-[#1a4895] font-bold text-[10px] tracking-[0.2em] uppercase shadow-sm mb-5">
              Our Toolkits
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] text-[#111827] tracking-tight">
              Tools for <span className="text-[#36ba98]">Extraordinary</span>
              <br className="hidden md:block" /> Minds.
            </h1>
          </div>
          <p className="text-gray-500 text-base sm:text-lg font-medium max-w-sm md:text-right leading-relaxed shrink-0">
            Empowering educators, parents, and children with engaging SEL toolkits.
          </p>
        </motion.div>

        {/* Category filter — home-style rounded-full pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap gap-3 mt-10"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#1a4895] text-white shadow-md hover:-translate-y-0.5"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 shadow-sm"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </section>

      {/* ── Product Grid ── */}
      <section className="relative z-10 pb-52 px-6 md:px-12">
        <div className="max-w-[1300px] mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="group"
                >
                  <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/8 hover:-translate-y-2 transition-all duration-400 flex flex-col h-full">

                    {/* Image panel */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#f5f3f0]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Category pill over image */}
                      <div className="absolute top-4 left-4 z-10">
                        <span
                          className="inline-block text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm"
                          style={{ color: product.accent }}
                        >
                          {product.category}
                        </span>
                      </div>
                      {/* Tag badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#111827]/80 text-white backdrop-blur-sm">
                          {product.tag}
                        </span>
                      </div>
                      {/* Bottom accent bar */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
                        style={{ backgroundColor: product.accent }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-7">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                        {product.subtitle}
                      </p>
                      <h3 className="text-xl font-bold text-[#111827] mb-3 leading-snug">
                        {product.title}
                      </h3>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed flex-1 mb-6">
                        {product.description}
                      </p>

                      {/* CTA */}
                      <Link
                        href={`/products/${product.id}`}
                        className="inline-flex items-center justify-between w-full bg-[#faf9f6] hover:bg-[#1a4895] rounded-2xl px-5 py-3.5 group/btn transition-all duration-300 border border-gray-100 hover:border-[#1a4895]"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#111827] group-hover/btn:text-white transition-colors">
                          View Toolkit
                        </span>
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/btn:bg-white/20"
                          style={{ backgroundColor: `${product.accent}20` }}
                        >
                          <ArrowRight
                            size={15}
                            style={{ color: product.accent }}
                            className="group-hover/btn:!text-white transition-colors"
                          />
                        </div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative z-10 pb-52 px-6 md:px-12">
        <div className="max-w-[1300px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#1a4895] rounded-3xl p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-10"
          >
            {/* Inner doodles */}
            <div className="absolute top-0 right-0 w-60 h-60 opacity-10 pointer-events-none">
              <svg viewBox="0 0 150 150" fill="none">
                <path
                  d="M 15,110 C 10,80 60,70 50,50 C 40,30 15,45 30,65 C 45,85 85,55 105,40"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                />
              </svg>
            </div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute bottom-6 right-16 w-20 h-20 rounded-full bg-[#ffd166]/20 pointer-events-none" />

            {/* Left */}
            <div className="flex-1 relative z-10 text-center md:text-left">
              <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest mb-5 border border-white/20">
                <Heart size={12} fill="currentColor" /> Built for humans
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5 tracking-tight">
                Can't find what you're <span className="text-[#ffd166]">looking for?</span>
              </h2>
              <p className="text-white/70 font-medium text-base max-w-md mb-8 leading-relaxed">
                We offer custom development for schools and organizations that need tailored SEL solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#ffd166] text-[#111827] font-bold text-sm px-8 py-4 rounded-full hover:bg-yellow-300 hover:-translate-y-0.5 transition-all shadow-md"
                >
                  Let's Talk <ArrowRight size={16} />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold text-sm px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            {/* Right — decorative card */}
            <div className="flex-1 flex justify-center relative z-10 w-full max-w-xs">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center w-full">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Zap size={28} className="text-[#ffd166]" />
                </div>
                <h4 className="text-white font-bold text-xl mb-3 leading-snug">
                  Custom Workshop?
                </h4>
                <p className="text-white/60 text-sm font-medium mb-6 leading-relaxed">
                  We can design a training manual or toolkit just for your team.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-[#ffd166] text-[10px] font-black uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Explore Services <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
