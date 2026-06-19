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

const OFFERINGS = [
  {
    title: "Joyful Learning Experiences",
    badge: "Joyful Learning",
    description: "Children learn best when they are actively engaged. Our sessions combine play, exploration, creativity, and meaningful interactions to build foundational skills for lifelong learning.",
    points: [
      "Literacy, language, and communication development",
      "Early numeracy and STEM exploration",
      "Creative arts, movement, and hands-on discovery"
    ],
    icon: <Sparkles className="w-6 h-6 text-[#F59E0B]" />,
    theme: {
      bg: "bg-[#F59E0B]/[0.03]",
      border: "border-[#F59E0B]/20",
      iconBg: "bg-[#F59E0B]/10",
      checkBg: "bg-[#F59E0B]/15",
      checkColor: "text-[#F59E0B]",
      separator: "border-[#F59E0B]/15",
      bottomText: "text-[#F59E0B]"
    }
  },
  {
    title: "Social and Emotional Growth",
    badge: "Social & Emotional Growth",
    description: "We create opportunities for children to understand themselves, build relationships, and develop confidence in expressing their thoughts and feelings.",
    points: [
      "Self-awareness and emotional expression",
      "Empathy, cooperation, and friendship skills",
      "Confidence, resilience, and decision-making"
    ],
    icon: <Heart className="w-6 h-6 text-[#F43F5E]" />,
    theme: {
      bg: "bg-[#F43F5E]/[0.03]",
      border: "border-[#F43F5E]/20",
      iconBg: "bg-[#F43F5E]/10",
      checkBg: "bg-[#F43F5E]/15",
      checkColor: "text-[#F43F5E]",
      separator: "border-[#F43F5E]/15",
      bottomText: "text-[#F43F5E]"
    }
  },
  {
    title: "Parent-Child Connection",
    badge: "Parent-Child Connection",
    description: "Learning extends beyond our space. We support meaningful parent-child engagement through activities and experiences that strengthen relationships and nurture development at home.",
    points: [
      "Guided parent-child activities and workshops",
      "Conversation starters and take-home resources",
      "Opportunities for shared play and learning"
    ],
    icon: <Users className="w-6 h-6 text-[#0EA5E9]" />,
    theme: {
      bg: "bg-[#0EA5E9]/[0.03]",
      border: "border-[#0EA5E9]/20",
      iconBg: "bg-[#0EA5E9]/10",
      checkBg: "bg-[#0EA5E9]/15",
      checkColor: "text-[#0EA5E9]",
      separator: "border-[#0EA5E9]/15",
      bottomText: "text-[#0EA5E9]"
    }
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

        {/* ── OUR OFFERINGS ── */}
        <section className="mb-32">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 font-headline">
              Our Offerings
            </h3>
            <div className="w-12 h-1 bg-[#0CB0D8] rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {OFFERINGS.map((offering, idx) => (
              <motion.div
                key={offering.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`rounded-[2.5rem] border p-8 md:p-10 flex flex-col justify-between transition-all duration-500 relative overflow-hidden group ${offering.theme.bg} ${offering.theme.border} hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="relative z-10 flex-grow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${offering.theme.iconBg}`}>
                      {offering.icon}
                    </div>
                    <h3 className="text-2xl md:text-[26px] font-extrabold tracking-tight text-[#111827]">
                      {offering.title}
                    </h3>
                  </div>

                  <p className="text-[#111827]/70 font-medium text-[15px] leading-relaxed mb-8">
                    {offering.description}
                  </p>

                  <ul className="space-y-4 mb-10">
                    {offering.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3.5">
                        <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 mt-[3px] ${offering.theme.checkBg}`}>
                          <Check className={`w-3.5 h-3.5 ${offering.theme.checkColor}`} strokeWidth={3} />
                        </div>
                        <span className="text-[15px] font-semibold text-[#111827]/80 leading-snug">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`relative z-10 pt-6 border-t ${offering.theme.separator} flex justify-center mt-auto`}>
                  <div
                    className={`inline-block text-[11px] font-black uppercase tracking-[0.15em] ${offering.theme.bottomText}`}
                  >
                    {offering.badge}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
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
