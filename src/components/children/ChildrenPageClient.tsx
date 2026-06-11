"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, Heart, Smile, Sparkles, Coffee, 
  BookOpen, Users, Sprout, MessageCircle, Gamepad2, Compass, Check, Calendar, Activity,
  Brain, Puzzle, Lightbulb
} from "lucide-react";
import ChildrenHero from "@/components/children/ChildrenHero";

const BELIEFS = [
  {
    title: "Every child deserves to thrive.",
    text: "Children learn best when they feel safe, connected, and valued.",
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    borderColor: "border-rose-100/80",
    topLineColor: "bg-rose-500"
  },
  {
    title: "Play is the foundation of learning.",
    text: "Meaningful play helps children develop cognitive, social, emotional, language, and problem-solving skills.",
    icon: <Gamepad2 className="w-6 h-6 text-amber-500" />,
    borderColor: "border-amber-100/80",
    topLineColor: "bg-amber-500"
  },
  {
    title: "Social and emotional skills improve academics.",
    text: "Self-awareness, emotional regulation, empathy, and relationship skills create a mindset for lifelong learning.",
    icon: <BookOpen className="w-6 h-6 text-emerald-500" />,
    borderColor: "border-emerald-100/80",
    topLineColor: "bg-emerald-500"
  },
  {
    title: "Relationships shape development.",
    text: "Children grow through nurturing interactions with caring adults and positive experiences with peers.",
    icon: <Users className="w-6 h-6 text-sky-500" />,
    borderColor: "border-sky-100/80",
    topLineColor: "bg-sky-500"
  },
  {
    title: "Learning should be joyful and holistic.",
    text: "Children flourish when learning experiences nurture their minds, emotions, creativity, curiosity, and sense of belonging.",
    icon: <Sparkles className="w-6 h-6 text-purple-500" />,
    borderColor: "border-purple-100/80",
    topLineColor: "bg-purple-500"
  }
];

const DIFFERENCES = [
  {
    title: "Experiential Learning",
    description: "Learning through play, exploration, and real-life experiences that make concepts meaningful and memorable.",
    icon: <Gamepad2 className="w-7 h-7" />,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    title: "Meaningful Activities",
    description: "Thoughtfully designed experiences that foster curiosity, creativity, social skills, and a love for learning.",
    icon: <Sparkles className="w-7 h-7" />,
    color: "text-sky-500",
    bg: "bg-sky-50"
  },
  {
    title: "Mindfulness and Well-being",
    description: "Helping children build self-awareness, emotional resilience, focus, and positive relationships from an early age.",
    icon: <Smile className="w-7 h-7" />,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    title: "Research Backed",
    description: "Rooted in evidence-based practices from child development, social-emotional learning, and early childhood education.",
    icon: <BookOpen className="w-7 h-7" />,
    color: "text-purple-500",
    bg: "bg-purple-50"
  }
];

const EXPLORE_TOPICS = [
  {
    title: "Emotional Awareness",
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    bg: "hover:bg-rose-50/20 border-gray-150 hover:border-rose-300"
  },
  {
    title: "Growth Mindset",
    icon: <Sprout className="w-6 h-6 text-emerald-500" />,
    bg: "hover:bg-emerald-50/20 border-gray-150 hover:border-emerald-300"
  },
  {
    title: "Self-awareness",
    icon: <Smile className="w-6 h-6 text-amber-500" />,
    bg: "hover:bg-amber-50/20 border-gray-150 hover:border-amber-300"
  },
  {
    title: "Relationship Building",
    icon: <Users className="w-6 h-6 text-sky-500" />,
    bg: "hover:bg-sky-50/20 border-gray-150 hover:border-sky-300"
  },
  {
    title: "Problem Solving",
    icon: <Puzzle className="w-6 h-6 text-purple-500" />,
    bg: "hover:bg-purple-50/20 border-gray-150 hover:border-purple-300"
  },
  {
    title: "Decision Making",
    icon: <Compass className="w-6 h-6 text-indigo-500" />,
    bg: "hover:bg-indigo-50/20 border-gray-150 hover:border-indigo-300"
  }
];

export default function ChildrenPageClient() {
  return (
    <div className="w-full bg-[#fbfbf9] font-sans text-gray-900 min-h-screen pt-[calc(var(--header-height)+2rem)] pb-32 relative overflow-hidden">
      
      {/* Background Decor System */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.22]"
        style={{
          backgroundSize: '60px 60px',
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)'
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        <ChildrenHero />

        {/* ── WHAT WE BELIEVE SECTION ── */}
        <section className="mb-32">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 font-headline">
              What We Believe
            </h3>
            <div className="w-12 h-1 bg-[#38d38b] rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BELIEFS.map((belief, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`relative flex flex-col items-start p-7 rounded-3xl border ${belief.borderColor} bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${belief.topLineColor}`} />

                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                  {belief.icon}
                </div>
                
                <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{belief.title}</h4>
                <p className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed text-left">
                  {belief.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── THE VETAAS WAY ── */}
        <section className="mb-32">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 font-headline">
              The Vetaas Way
            </h3>
            <div className="w-12 h-1 bg-[#0CB0D8] rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DIFFERENCES.map((diff, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white rounded-[2rem] border border-slate-150 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left group overflow-hidden relative"
              >
                {/* Subtle gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className={`relative z-10 w-16 h-16 rounded-2xl ${diff.bg} ${diff.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {diff.icon}
                </div>
                
                <h4 className="relative z-10 text-xl font-extrabold text-gray-900 mb-3 leading-snug">
                  {diff.title}
                </h4>
                <p className="relative z-10 text-sm font-medium text-gray-500 leading-relaxed">
                  {diff.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── TOPICS WE EXPLORE ── */}
        <section className="mb-32">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 font-headline">
              Topics We Explore
            </h3>
            <div className="w-12 h-1 bg-[#38d38b] rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {EXPLORE_TOPICS.map((topic, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`flex items-center gap-5 p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 group ${topic.bg}`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {topic.icon}
                </div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900">
                  {topic.title}
                </h4>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link 
              href="/events" 
              className="group inline-flex items-center justify-center gap-2 px-10 py-4.5 bg-[#38d38b] text-[#111827] font-extrabold text-sm rounded-full hover:bg-[#2ebc7a] hover:scale-105 transition-all shadow-md active:scale-95"
            >
              <span>View upcoming children events</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
