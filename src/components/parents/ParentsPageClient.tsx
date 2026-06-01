"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, Heart, Smile, Sparkles, Coffee, 
  BookOpen, Users, Sprout, MessageCircle, Gamepad2, Compass
} from "lucide-react";
import ParentsHero from "@/components/parents/ParentsHero";



const BELIEFS = [
  {
    text: "Parents are the foundation of every child's growth",
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    borderColor: "border-rose-100/80",
    topLineColor: "bg-rose-500"
  },
  {
    text: "Research & experience guide us to bring you best practices",
    icon: <BookOpen className="w-6 h-6 text-amber-500" />,
    borderColor: "border-amber-100/80",
    topLineColor: "bg-amber-500"
  },
  {
    text: "We build a bridge between research and real life",
    icon: <Compass className="w-6 h-6 text-teal-500" />,
    borderColor: "border-teal-100/80",
    topLineColor: "bg-teal-500"
  },
  {
    text: "Holistic care for body, mind, heart and relationships",
    icon: <Sprout className="w-6 h-6 text-emerald-500" />,
    borderColor: "border-emerald-100/80",
    topLineColor: "bg-emerald-500"
  },
  {
    text: "Aware parents create happier, resilient children",
    icon: <Users className="w-6 h-6 text-violet-500" />,
    borderColor: "border-violet-100/80",
    topLineColor: "bg-violet-500"
  }
];

const DIFFERENCES = [
  {
    title: "Research informed",
    description: "Built upon the latest academic insights in child development.",
    image: "/parents/image1.png"
  },
  {
    title: "Age appropriate (3\u20116\u00A0years)",
    description: "Curriculum tailored specifically for critical early childhood years.",
    image: "/parents/image2.png"
  },
  {
    title: "Holistic & SEL focused",
    description: "Balancing intellectual growth with emotional and social development.",
    image: "/parents/image3.png"
  },
  {
    title: "Practical, doable and joyful",
    description: "Simple routines designed to be easily woven into daily family life.",
    image: "/parents/image4.png"
  }
];

const EXPLORE_TOPICS = [
  {
    title: "Positive Parenting",
    icon: <Users className="w-6 h-6 text-emerald-500" />,
    bg: "hover:bg-emerald-50/20 border-gray-150 hover:border-emerald-300"
  },
  {
    title: "Emotional Well-being",
    icon: <Smile className="w-6 h-6 text-amber-500" />,
    bg: "hover:bg-amber-50/20 border-gray-150 hover:border-amber-300"
  },
  {
    title: "Play & Learning",
    icon: <Gamepad2 className="w-6 h-6 text-sky-500" />,
    bg: "hover:bg-sky-50/20 border-gray-150 hover:border-sky-300"
  },
  {
    title: "Communication & Connection",
    icon: <MessageCircle className="w-6 h-6 text-purple-500" />,
    bg: "hover:bg-purple-50/20 border-gray-150 hover:border-purple-300"
  },
  {
    title: "Behaviour Guidance",
    icon: <Sparkles className="w-6 h-6 text-rose-500" />,
    bg: "hover:bg-rose-50/20 border-gray-150 hover:border-rose-300"
  },
  {
    title: "Mindfulness & Self-care",
    icon: <Coffee className="w-6 h-6 text-indigo-500" />,
    bg: "hover:bg-indigo-50/20 border-gray-150 hover:border-indigo-300"
  }
];

const OFFERINGS = [
  {
    title: "Workshops",
    badge: "Immersive & Practical",
    description: "Immersive, hands-on experiences going beyond traditional advice. We provide a safe space to explore early childhood milestones, tailored for parents of children aged 3 to 6. These sessions combine evidence-based strategies with playful learning, ensuring actionable family routines.",
    color: "bg-[#45bcf6]", // Sky Blue
    btnColor: "bg-[#35a8df] text-[#111827] hover:bg-[#2fa0d5]",
    badgeColor: "bg-white/30 text-[#111827] border border-white/40",
    hoverShadow: "hover:shadow-[#45bcf6]/30",
    listTitle: "Key themes:",
    items: [
      "Social Emotional Learning (SEL)",
      "Pre-literacy and Pre-numeracy",
      "Parents Matter & Conscious Parenting"
    ]
  },
  {
    title: "Events - MCME",
    badge: "My Child & Me",
    description: "Unique celebrations of the special bond between you and your child. We believe shared joy is the best catalyst for growth, offering interactive activities, collaborative creative projects, and high-energy games that spark laughter and lasting memories.",
    color: "bg-[#ff7f68]", // Coral
    btnColor: "bg-[#e56d58] text-[#111827] hover:bg-[#d65f4b]",
    badgeColor: "bg-white/30 text-[#111827] border border-white/40",
    hoverShadow: "hover:shadow-[#ff7f68]/30",
    listTitle: "The agenda includes:",
    items: [
      "Fun developmental games",
      "Music, rhythm and dance",
      "Creative art and craft sessions"
    ]
  },
  {
    title: "Wellness circles",
    badge: "Parent Well-being",
    description: "A compassionate environment where parents prioritize their own well-being alongside their child's. These gatherings focus on holistic self-care, community support, and mindfulness, building the emotional resilience needed for daily life.",
    color: "bg-[#00CDBA]", // Emerald Green/Teal
    btnColor: "bg-[#2da182] text-[#111827] hover:bg-[#258f73]",
    badgeColor: "bg-white/30 text-[#111827] border border-white/40",
    hoverShadow: "hover:shadow-[#00CDBA]/30",
    listTitle: "Key engagements:",
    items: [
      "Well-being & mindfulness practices",
      "Supportive community building",
      "Holistic self-care routines"
    ]
  }
];

export default function ParentsPageClient() {
  return (
    <div className="w-full bg-[#fbfbf9] font-sans text-gray-900 min-h-screen pt-[calc(var(--header-height)+2rem)] pb-32 relative overflow-hidden">
      
      {/* Background Decor System (Typographical grid lines, no image vectors) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.22]"
        style={{
          backgroundSize: '60px 60px',
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)'
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Intro Hero Section */}
        <ParentsHero />





        {/* ── WHAT WE BELIEVE SECTION (Typographical card list) ── */}
        <section className="mb-32">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 font-headline">
              What We Believe
            </h3>
            <div className="w-12 h-1 bg-[#ffa3c9] rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {BELIEFS.map((belief, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`relative flex flex-col items-start p-7 rounded-3xl border ${belief.borderColor} bg-white shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden`}
              >
                {/* Horizontal colored top line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${belief.topLineColor}`} />

                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                  {belief.icon}
                </div>
                
                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed text-left">
                  {belief.text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── THE VETAAS DIFFERENCE ── */}
        <section className="mb-32">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 font-headline">
              The Vetaas Difference
            </h3>
            <div className="w-12 h-1 bg-[#0CB0D8] rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {DIFFERENCES.map((diff, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white rounded-3xl border border-slate-150 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left group"
              >
                {/* Illustration wrapper container - much larger to make early childhood details legible */}
                <div className="w-full aspect-[4/3] relative mb-6 rounded-2xl overflow-hidden bg-slate-50/70 border border-slate-100 flex items-center justify-center p-4">
                  <Image 
                    src={diff.image} 
                    alt={diff.title} 
                    fill 
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 250px"
                  />
                </div>
                <h4 className="text-base md:text-lg font-extrabold text-gray-900 mb-2 leading-snug">
                  {diff.title}
                </h4>
                <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                  {diff.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── OUR OFFERINGS (Redesigned as 3-column card grid, no images) ── */}
        <section className="mb-32">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-950 font-headline">
              Our Offerings
            </h2>
            <div className="w-12 h-1 bg-[#ffa3c9] rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {OFFERINGS.map((offering, idx) => (
              <motion.div
                key={offering.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`rounded-[2.5rem] border border-black/5 p-8 flex flex-col justify-between shadow-xl transition-all duration-500 relative overflow-hidden group ${offering.color} ${offering.hoverShadow}`}
              >
                {/* Animated Inner Blobs */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl pointer-events-none"
                />
                <motion.div 
                  animate={{ 
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    opacity: [0.05, 0.1, 0.05]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-10 -left-10 w-48 h-48 bg-black rounded-full blur-3xl pointer-events-none"
                />

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6 mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${offering.badgeColor}`}>
                      {offering.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold tracking-tight text-[#111827] mb-4">
                    {offering.title}
                  </h3>

                  <p className="text-[#111827] font-bold text-xs leading-relaxed mb-6 opacity-90">
                    {offering.description}
                  </p>

                  <div className="border-t border-dashed border-black/10 pt-5 mb-8">
                    <span className="text-[10px] font-black text-[#111827]/70 uppercase tracking-widest block mb-3">
                      {offering.listTitle}
                    </span>
                    <ul className="space-y-3">
                      {offering.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-white/40 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
                          </div>
                          <span className="text-xs font-bold text-[#111827] leading-snug">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href="/events"
                  className={`w-full inline-flex items-center justify-center gap-2 ${offering.btnColor} font-bold text-xs py-3.5 px-6 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-sm relative z-10`}
                >
                  Explore Program <ArrowRight size={14} />
                </Link>
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
            <div className="w-12 h-1 bg-amber-500 rounded-full mt-4" />
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
              className="group inline-flex items-center justify-center gap-2 px-10 py-4.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-sm rounded-full hover:scale-105 transition-all shadow-md active:scale-95"
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
