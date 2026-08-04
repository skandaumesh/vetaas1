"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

const QUIZZES = [
  {
    title: "SEL Assessment for Children",
    description:
      "A playful 5-minute assessment to explore your child's social and emotional skills across five key areas — and uncover their strengths.",
    href: "/products/sel-assessment",
    accent: "#7C3AED",
    tint: "#f5f3ff",
    tag: "For Parents · ~2 min",
    icon: Sparkles,
  },
  {
    title: "In Sync: Parent Reflection & Beliefs",
    description:
      "A gentle, judgment-free reflection on your beliefs and everyday moments as a parent. No right or wrong answers — just a chance to pause and notice.",
    href: "/products/parent-reflection",
    accent: "#FF5C7A",
    tint: "#fff0f2",
    tag: "For Parents · ~2 min",
    icon: Heart,
  },
];

export default function QuizzesSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-[calc(var(--header-height)+2.5rem)] pb-24">
      {/* Heading */}
      <div className="max-w-3xl mb-14">
        <span className="inline-block py-1.5 px-5 rounded-full bg-white border border-gray-200 text-[#7C3AED] font-bold text-[10px] tracking-[0.2em] uppercase shadow-sm mb-5">
          Self-Assessments
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#111827] leading-[1.15] tracking-tight">
          Not sure where to start? Take one of our{" "}
          <span className="text-[#7C3AED]">self-assessments.</span>
        </h1>
        <p className="text-gray-500 font-medium text-base md:text-lg mt-5 leading-relaxed">
          Short, reflective tools for parents and children — a simple way to notice
          where you are and discover gentle next steps.
        </p>
      </div>

      {/* Quiz cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {QUIZZES.map((quiz, i) => {
          const Icon = quiz.icon;
          return (
            <motion.div
              key={quiz.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex"
            >
              <Link
                href={quiz.href}
                className="group flex flex-col w-full rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                style={{ backgroundColor: quiz.tint }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="flex items-center justify-center w-12 h-12 rounded-2xl text-white shadow-sm"
                    style={{ backgroundColor: quiz.accent }}
                  >
                    <Icon size={20} fill="currentColor" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {quiz.tag}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-extrabold text-[#111827] mb-3 leading-snug">
                  {quiz.title}
                </h2>
                <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed flex-grow">
                  {quiz.description}
                </p>

                <span
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold"
                  style={{ color: quiz.accent }}
                >
                  Take the assessment
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
