"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Sparkles, Smile, Sprout, Check, BookOpen, Heart, ChevronRight } from "lucide-react";
import AboutHero from "@/components/about/AboutHero";

const LinkedinIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24" className="inline-block shrink-0">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TEAM = [
  {
    name: "Sameer Bansal",
    initials: "SB",
    role: "Co-Founder | Pulmonologist | Guitar Player",
    bio: "As a dedicated doctor and passionate advocate for education, I believe that health and education are fundamental human rights. Through Vetaas, I employ my strengths and skills to create environments where learning never stops and where growth and well-being are at the heart of everything we do. At Vetaas we focus on early childhood so that there are greater chances of the children becoming well-rounded adults.",
    gradient: "from-[#45bcf6] to-[#7C3AED]",
    borderColor: "border-[#45bcf6]",
    textColor: "text-[#7C3AED]",
    bgHover: "hover:bg-[#45bcf6]/5",
    activeBg: "bg-[#eff6ff]",
    activeBorder: "border-[#45bcf6]/30",
    image: "/sameer.webp",
    roleTags: ["Co-Founder", "Doctor", "Guitarist"],
    linkedin: "https://www.linkedin.com/in/sameer-bansal-5498a831/?originalSubdomain=in"
  },
  {
    name: "Kirti Krishna",
    initials: "KK",
    role: "Co-Founder | Teacher Educator | Esperantist",
    bio: "Education has been my ticket to happiness. All the years that I served in the education sector makes me believe that investing in early childhood education is our best bet at creating happy childhoods. Vetaas was born out of this bold hunger to foster the best early childhood care practices and support parents in their parenting journeys.",
    gradient: "from-[#ff7f68] to-[#e04f35]",
    borderColor: "border-[#ff7f68]",
    textColor: "text-[#e04f35]",
    bgHover: "hover:bg-[#ff7f68]/5",
    activeBg: "bg-[#fff5f5]",
    activeBorder: "border-[#ff7f68]/30",
    image: "/kirti.webp",
    roleTags: ["Co-Founder", "Teacher Educator", "Esperantist"],
    linkedin: "https://www.linkedin.com/in/kirti-k-9a1729227/?originalSubdomain=in"
  },
  {
    name: "Tanisha",
    initials: "T",
    role: "Social Media Head | OneZeroLabs",
    bio: "Representing OneZeroLabs, I lead the social media presence and digital campaigns for Vetaas. I specialize in creative storytelling, visual communication, and building interactive online communities to spread awareness about Social Emotional Learning (SEL) in early childhood.",
    gradient: "from-[#00CDBA] to-[#1f7860]",
    borderColor: "border-[#00CDBA]",
    textColor: "text-[#1f7860]",
    bgHover: "hover:bg-[#00CDBA]/5",
    activeBg: "bg-[#f0fdf4]",
    activeBorder: "border-[#00CDBA]/30",
    image: "/tanisha.jpeg",
    roleTags: ["Social Media Head", "OneZeroLabs"],
    linkedin: "https://www.linkedin.com/in/tanisha-karve/",
    website: "https://onezerolabs.in"
  },
  {
    name: "Skanda Umesh",
    initials: "SU",
    role: "Founder, OneZeroLabs | Tech Support",
    bio: "As the founder of OneZeroLabs, I provide the foundational tech support and technical direction for Vetaas, ensuring our digital platforms are robust, modern, and capable of scaling our impact in early childhood education.",
    gradient: "from-[#FFC107] to-[#e6a800]",
    borderColor: "border-[#FFC107]",
    textColor: "text-[#e6a800]",
    bgHover: "hover:bg-[#FFC107]/5",
    activeBg: "bg-[#fffbf0]",
    activeBorder: "border-[#FFC107]/30",
    image: "/skanda.jpeg",
    roleTags: ["Founder, OneZeroLabs", "Tech Support"],
    linkedin: "https://www.linkedin.com/in/skanda-umesh-88b16432b/",
    website: "https://onezerolabs.in"
  },
];

export default function AboutPageClient() {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  return (
    <main className="bg-white min-h-screen font-sans text-[#1e293b] overflow-hidden">
      
      <AboutHero />

      {/* ── THE FORMULA: PREMIUM REDESIGN ── */}
      <section id="formula-section" className="py-24 bg-[#fafaf9] relative overflow-hidden rounded-[3.5rem] mx-4 md:mx-8 border border-gray-100 shadow-[inset_0_0_80px_rgba(0,0,0,0.01)]">
        
        {/* Glowing blur background blobs */}
        <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#00CDBA]/4 blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#ff7f68]/4 blur-[100px] pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#7C3AED]/3 blur-[120px] pointer-events-none z-0" />

        {/* Refined Dot Grid Pattern */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.25]"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: `radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)`
          }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#7C3AED]/10 text-[#7C3AED] px-4.5 py-1.5 rounded-full mb-6 shadow-sm border border-[#7C3AED]/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">The Framework</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#111827] font-extrabold tracking-tight leading-[1.15] mb-6">
            The Magic{" "}
            <span className="relative inline-block px-5 py-1.5 ml-1">
              {/* Slanted backdrop badge */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#ff7a43] to-[#ff9800] rounded-2xl -rotate-1 shadow-md shadow-orange-500/10" />
              <span className="relative text-white font-serif italic font-medium">Formula.</span>
            </span>
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-500 font-semibold text-base md:text-lg leading-relaxed">
              Social Emotional Learning (SEL) is the most progressive framework we have to perceive education holistically.
            </p>
            <div className="w-12 h-1 bg-[#00CDBA]/40 rounded-full mx-auto my-6" />
            <p className="text-[#00CDBA] font-extrabold text-lg md:text-xl tracking-tight leading-relaxed max-w-lg mx-auto">
              And what best time to embrace this framework than early childhood education?
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
          
          {/* Card 1: Reimagining */}
          <motion.div 
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative p-8 md:p-10 bg-white/70 backdrop-blur-md rounded-[3rem] border border-[#00CDBA]/10 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-[#00CDBA]/5 hover:border-[#00CDBA]/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Subtle card accent pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#00CDBA]/5 to-transparent rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex justify-between items-start mb-8">
                {/* Icon wrapper */}
                <div className="w-16 h-16 rounded-[1.5rem] bg-[#eefcf7] flex items-center justify-center text-[#00CDBA] shadow-inner relative group-hover:scale-105 transition-transform duration-300">
                  <Sparkles size={26} className="transition-transform duration-700 group-hover:rotate-45" />
                </div>
                
                {/* Badge */}
                <span className="bg-[#00CDBA]/10 text-[#2a9d7e] text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border border-[#00CDBA]/5 shadow-sm">
                  Curriculum
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-[#00CDBA] transition-colors duration-300">
                Reimagining
              </h3>
              
              <p className="text-gray-500 font-semibold leading-relaxed text-sm md:text-base mb-8">
                Vetaas strives to reimagine the early childhood education curriculum from the lens of SEL.
              </p>

              {/* Checklist details */}
              <ul className="space-y-3.5 border-t border-dashed border-gray-100 pt-6">
                {[
                  "Social-emotional framework integration",
                  "Age-appropriate ECE learning journeys",
                  "Holistic milestones and growth mapping"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#00CDBA]/10 flex items-center justify-center text-[#00CDBA] shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Card 2: Empowering */}
          <motion.div 
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative p-8 md:p-10 bg-white/70 backdrop-blur-md rounded-[3rem] border border-[#ff7f68]/10 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-[#ff7f68]/5 hover:border-[#ff7f68]/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Subtle card accent pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#ff7f68]/5 to-transparent rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex justify-between items-start mb-8">
                {/* Icon wrapper */}
                <div className="w-16 h-16 rounded-[1.5rem] bg-[#fff0f1] flex items-center justify-center text-[#ff7f68] shadow-inner relative group-hover:scale-105 transition-transform duration-300">
                  <Smile size={26} className="transition-transform duration-500 group-hover:scale-110" />
                </div>

                {/* Badge */}
                <span className="bg-[#ff7f68]/10 text-[#ff7f68] text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border border-[#ff7f68]/5 shadow-sm">
                  Enablement
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-[#ff7f68] transition-colors duration-300">
                Empowering
              </h3>
              
              <p className="text-gray-500 font-semibold leading-relaxed text-sm md:text-base mb-8">
                Empowering teachers and parents with skills, knowledge and perspectives for their journeys.
              </p>

              {/* Checklist details */}
              <ul className="space-y-3.5 border-t border-dashed border-gray-100 pt-6">
                {[
                  "SEL 101 course for educators' capacity",
                  "Playful parenting workshop frameworks",
                  "Dedicated parent & school support groups"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#ff7f68]/10 flex items-center justify-center text-[#ff7f68] shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── WORK: PARENTS & TEACHERS (Zero Images, Beautiful SVG Info Cards) ── */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-[1100px] mx-auto space-y-36">
          
          {/* Parents */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight leading-[1.1] mb-6">
                Our Work With <br />
                <span className="inline-block bg-[#ff7a43] text-white px-4 py-0.5 rounded-xl rotate-1 shadow-sm font-semibold mt-2">Parents.</span>
              </h2>
              <div className="space-y-5 text-gray-500 font-medium leading-relaxed mb-8 text-base md:text-lg">
                <p>
                  Every child deserves both holistic and wholesome care, especially during their early years. Research and experience provide sufficient evidence that informed parenting offers the best shot at promising happy childhoods.
                </p>
                <div className="bg-[#fffbfa] p-6 rounded-2xl border-l-4 border-[#ff7f68] border border-gray-100">
                   <p className="text-[#111827] font-bold text-sm md:text-base">At Vetaas, we provide resources for home activities and deep SEL support.</p>
                </div>
              </div>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 bg-[#ff7a43] hover:bg-[#e06530] text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-md active:scale-95"
              >
                Get Resources <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Redesigned Parent Kit Card (No Image) */}
            <div className="lg:w-1/2 w-full max-w-[480px]">
              <div className="bg-[#fffbfa] p-8 md:p-10 rounded-[2.5rem] border border-[#ff7f68]/20 shadow-md rotate-2 transition-transform duration-500 hover:rotate-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#fff0f1] flex items-center justify-center text-[#ff7f68]">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <h3 className="font-bold text-xl text-[#111827]">SEL Parent Kit</h3>
                </div>
                
                <ul className="space-y-4">
                  {[
                    "Research-backed parenting support",
                    "Interactive parent-child learning sessions",
                    "SEL kits for meaningful engagement"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#ff7f68]/10 flex items-center justify-center text-[#ff7f68] shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-semibold text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-[#ff7f68]/10 text-center">
                  <span className="text-xs font-bold text-[#ff7f68] uppercase tracking-wider">Empowering happy childhoods</span>
                </div>
              </div>
            </div>
          </div>

          {/* Teachers */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight leading-[1.1] mb-6">
                Our Work With <br />
                <span className="inline-block bg-[#1E90FF] text-white px-4 py-0.5 rounded-xl -rotate-1 shadow-sm font-semibold mt-2">Teachers.</span>
              </h2>
              <div className="space-y-5 text-gray-500 font-medium leading-relaxed mb-8 text-base md:text-lg">
                <p>
                  We believe teachers need the right support and care to help children learn well. 
                </p>
                <p>
                  Our programs help teachers build new skills, feel supported, and enjoy their teaching with more confidence and happiness.
                </p>
              </div>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 bg-[#1E90FF] hover:bg-[#2d70db] text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-md active:scale-95"
              >
                Teacher Programs <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Redesigned Teacher Hub Card (No Image) */}
            <div className="lg:w-1/2 w-full max-w-[480px]">
              <div className="bg-[#eff6ff] p-8 md:p-10 rounded-[2.5rem] border border-[#1E90FF]/20 shadow-md -rotate-2 transition-transform duration-500 hover:rotate-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#dbeafe] flex items-center justify-center text-[#1E90FF]">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="font-bold text-xl text-[#111827]">SEL Teacher Hub</h3>
                </div>

                <ul className="space-y-4">
                  {[
                    "Helping teachers understand SEL in practical ways",
                    "Support the well-being of teachers",
                    "Creating a community of teachers."
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#1E90FF]/10 flex items-center justify-center text-[#1E90FF] shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-semibold text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-[#1E90FF]/10 text-center">
                  <span className="text-xs font-bold text-[#1E90FF] uppercase tracking-wider">Creating active learning ecosystems</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── TEAM: DYNAMIC HOVER ACCORDION LIST ── */}
      <section className="py-24 md:py-32 bg-[#f8fafc] border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Typographic Intro */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center justify-center bg-[#FFC107] text-[#111827] px-4 py-1.5 rounded-full mb-6 shadow-sm rotate-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Meet the Visionaries</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[#111827] tracking-tight leading-[1.15] mb-6">
                The Team <br />
                Behind <span className="inline-block bg-[#00CDBA] text-white px-4 py-0.5 rounded-xl -rotate-1 shadow-sm font-semibold mt-1">Vetaas.</span>
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-8 max-w-md">
                We are doctors, teachers, developers, and parents united by a shared vision to build support systems around childhood learning and mental well-being.
              </p>
            </div>

            {/* Right Column: Interactive Accordion List */}
            <div className="lg:col-span-8 w-full flex flex-col gap-5">
              {TEAM.map((member, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={`rounded-[2rem] border transition-all duration-500 overflow-hidden cursor-pointer ${
                      isActive 
                        ? `${member.activeBg} ${member.activeBorder} shadow-[0_15px_30px_rgba(0,0,0,0.03)]` 
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {/* Collapsed Header Bar */}
                    <div className="p-6 md:p-8 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          isActive 
                            ? `bg-gradient-to-tr ${member.gradient} text-white` 
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                          {!isActive && (
                            <p className="text-xs font-semibold text-gray-400 mt-0.5">{member.role.split('|')[0].trim()}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: isActive ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                            isActive ? "border-gray-300 bg-white" : "border-gray-200"
                          }`}
                        >
                          <ChevronRight size={16} className={isActive ? "text-gray-600" : "text-gray-400"} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Animated Expanded Body */}
                    <motion.div
                      initial={false}
                      animate={{ height: isActive ? "auto" : 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 md:px-8 md:pb-10 pt-2 border-t border-dashed border-gray-200/60 flex flex-col md:flex-row items-center md:items-start gap-8">
                        
                        {/* Avatar Image Frame */}
                        <div className="relative w-36 h-36 md:w-40 md:h-40 shrink-0">
                          <div className={`absolute inset-0 rounded-[2.2rem] bg-gradient-to-tr ${member.gradient} opacity-20 blur-sm`} />
                          <div className={`w-full h-full rounded-[2.2rem] bg-gradient-to-tr ${member.gradient} p-[3px] shadow-sm`}>
                            <div className="w-full h-full rounded-[2rem] bg-white overflow-hidden relative">
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 144px, 160px"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Bio & Details */}
                        <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                            {member.roleTags.map((tag, tIdx) => (
                              <span 
                                key={tIdx} 
                                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                                  tIdx === 0 
                                    ? `bg-gradient-to-tr ${member.gradient} text-white` 
                                    : "bg-white text-gray-500 border border-gray-200"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6 max-w-xl">
                            {member.bio}
                          </p>

                          <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
                            <a 
                              href={member.linkedin} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${member.textColor} hover:gap-3 transition-all pb-1 border-b-2 border-transparent hover:border-current`}
                            >
                              Let&apos;s Connect <LinkedinIcon size={14} />
                            </a>
                            
                            {member.website && (
                              <a 
                                href={member.website} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${member.textColor} hover:gap-3 transition-all pb-1 border-b-2 border-transparent hover:border-current`}
                              >
                                onezerolabs.in <ArrowRight size={14} />
                              </a>
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
