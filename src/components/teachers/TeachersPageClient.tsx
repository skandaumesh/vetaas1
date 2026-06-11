"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, Heart, Smile, Sparkles, Coffee, 
  BookOpen, Users, Sprout, MessageCircle, Target, Compass, Check, Calendar, Activity,
  Briefcase, GraduationCap, ShieldCheck
} from "lucide-react";
import TeachersHero from "@/components/teachers/TeachersHero";

const BELIEFS = [
  {
    title: "Teacher well-being is foundational to child well-being.",
    text: "When teachers feel supported, valued, and emotionally equipped, they create a nurturing environment for children to flourish.",
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    borderColor: "border-rose-100/80",
    topLineColor: "bg-rose-500"
  },
  {
    title: "SEL strengthens both teachers and classrooms.",
    text: "By building self-awareness, emotional resilience, and relationship skills, SEL helps teachers experience greater well-being, professional fulfilment, and effectiveness.",
    icon: <Sprout className="w-6 h-6 text-emerald-500" />,
    borderColor: "border-emerald-100/80",
    topLineColor: "bg-emerald-500"
  },
  {
    title: "School leaders shape the conditions for children to thrive.",
    text: "When school leaders create supportive cultures where teachers feel valued, heard, and empowered, children flourish.",
    icon: <Users className="w-6 h-6 text-amber-500" />,
    borderColor: "border-amber-100/80",
    topLineColor: "bg-amber-500"
  }
];

const DIFFERENCES = [
  {
    title: "Research informed",
    description: "Built upon evidence from SEL, teacher well-being, and child development research.",
    icon: <BookOpen className="w-7 h-7" />,
    color: "text-indigo-500",
    bg: "bg-indigo-50"
  },
  {
    title: "Teacher well-being centred",
    description: "Supporting teachers' social-emotional growth because thriving teachers create thriving classrooms.",
    icon: <Heart className="w-7 h-7" />,
    color: "text-rose-500",
    bg: "bg-rose-50"
  },
  {
    title: "Practical and actionable",
    description: "Simple, relevant strategies that fit naturally into everyday teaching and school life.",
    icon: <Target className="w-7 h-7" />,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    title: "Whole-school impact",
    description: "Engaging teachers, leaders, and families to create nurturing learning environments for children.",
    icon: <Users className="w-7 h-7" />,
    color: "text-amber-500",
    bg: "bg-amber-50"
  }
];

const EXPLORE_TOPICS = [
  {
    title: "Teacher Well-being",
    icon: <Smile className="w-6 h-6 text-amber-500" />,
    bg: "hover:bg-amber-50/20 border-gray-150 hover:border-amber-300"
  },
  {
    title: "Burnout & Stress Management",
    icon: <Coffee className="w-6 h-6 text-indigo-500" />,
    bg: "hover:bg-indigo-50/20 border-gray-150 hover:border-indigo-300"
  },
  {
    title: "SEL Integration",
    icon: <Target className="w-6 h-6 text-sky-500" />,
    bg: "hover:bg-sky-50/20 border-gray-150 hover:border-sky-300"
  },
  {
    title: "Teacher–Student Relationships",
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    bg: "hover:bg-rose-50/20 border-gray-150 hover:border-rose-300"
  },
  {
    title: "Practical SEL",
    icon: <Compass className="w-6 h-6 text-emerald-500" />,
    bg: "hover:bg-emerald-50/20 border-gray-150 hover:border-emerald-300"
  },
  {
    title: "SEL-Supportive School Culture",
    icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
    bg: "hover:bg-purple-50/20 border-gray-150 hover:border-purple-300"
  }
];

const OFFERINGS = [
  {
    title: "Teacher Well-being",
    badge: "Teacher Well-being",
    description: "A supportive space where teachers strengthen their social-emotional competencies, prioritise their well-being, and build resilience to navigate the demands of teaching with confidence and purpose.",
    icon: <Smile className="w-6 h-6 text-[#9333EA]" />,
    theme: {
      bg: "bg-[#9333EA]/[0.03]",
      border: "border-[#9333EA]/20",
      iconBg: "bg-[#9333EA]/10",
      checkBg: "bg-[#9333EA]/15",
      checkColor: "text-[#9333EA]",
      separator: "border-[#9333EA]/15",
      bottomText: "text-[#9333EA]"
    },
    items: [
      "Well-being & mindfulness practices",
      "Stress management & emotional resilience",
      "Reflection and professional fulfilment"
    ]
  },
  {
    title: "SEL Integration in the Classroom",
    badge: "SEL Integration",
    description: "Practical learning experiences that help teachers embed social and emotional learning into everyday classroom routines, interactions, and teaching practices.",
    icon: <BookOpen className="w-6 h-6 text-[#00CDBA]" />,
    theme: {
      bg: "bg-[#00CDBA]/[0.03]",
      border: "border-[#00CDBA]/20",
      iconBg: "bg-[#00CDBA]/10",
      checkBg: "bg-[#00CDBA]/15",
      checkColor: "text-[#00CDBA]",
      separator: "border-[#00CDBA]/15",
      bottomText: "text-[#00CDBA]"
    },
    items: [
      "Classroom-ready SEL strategies",
      "Integrating SEL into daily routines",
      "Supporting children's social-emotional growth"
    ]
  },
  {
    title: "Leadership for Well-being and School Culture",
    badge: "School Leadership",
    description: "Empowering school leaders to create environments where teachers feel supported, valued, and equipped to foster children's social, emotional, and academic growth.",
    icon: <Briefcase className="w-6 h-6 text-[#ff7f68]" />,
    theme: {
      bg: "bg-[#ff7f68]/[0.03]",
      border: "border-[#ff7f68]/20",
      iconBg: "bg-[#ff7f68]/10",
      checkBg: "bg-[#ff7f68]/15",
      checkColor: "text-[#ff7f68]",
      separator: "border-[#ff7f68]/15",
      bottomText: "text-[#ff7f68]"
    },
    items: [
      "Building a positive school culture",
      "Supporting teacher well-being and retention",
      "Leading whole-school SEL implementation"
    ]
  }
];

export default function TeachersPageClient() {
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
        
        <TeachersHero />

        {/* ── WHAT WE BELIEVE SECTION ── */}
        <section className="mb-32">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 font-headline">
              What We Believe
            </h3>
            <div className="w-12 h-1 bg-[#c8bdf5] rounded-full mt-4" />
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

        {/* ── OUR OFFERINGS ── */}
        <section className="mb-32">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-950 font-headline">
              Our Offerings
            </h2>
            <div className="w-12 h-1 bg-[#c8bdf5] rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    {offering.items.map((item) => (
                      <li key={item} className="flex items-start gap-3.5">
                        <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 mt-[3px] ${offering.theme.checkBg}`}>
                          <Check className={`w-3.5 h-3.5 ${offering.theme.checkColor}`} strokeWidth={3} />
                        </div>
                        <span className="text-[15px] font-semibold text-[#111827]/80 leading-snug">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`relative z-10 pt-6 border-t ${offering.theme.separator} flex justify-center mt-auto`}>
                  <Link
                    href="/contact"
                    className={`inline-block text-[11px] font-black uppercase tracking-[0.15em] hover:scale-105 transition-transform ${offering.theme.bottomText}`}
                  >
                    {offering.badge}
                  </Link>
                </div>
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
            <div className="w-12 h-1 bg-[#9333EA] rounded-full mt-4" />
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
              href="/contact" 
              className="group inline-flex items-center justify-center gap-2 px-10 py-4.5 bg-[#7C3AED] text-white font-extrabold text-sm rounded-full hover:bg-[#6D28D9] hover:scale-105 transition-all shadow-md active:scale-95"
            >
              <span>View all topics & upcoming sessions</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
