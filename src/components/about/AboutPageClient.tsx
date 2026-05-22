"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Sparkles, Smile, Sprout, Check, BookOpen, Heart, ChevronRight } from "lucide-react";
import AboutHero from "@/components/about/AboutHero";

const TEAM = [
  {
    name: "Sameer Bansal",
    initials: "SB",
    role: "Co-Founder | Pulmonologist | Guitar Player",
    bio: "As a dedicated doctor and passionate advocate for education, I believe that health and education are fundamental human rights. Through Vetaas, I employ my strengths and skills to create environments where learning never stops and where growth and well-being are at the heart of everything we do. At Vetaas we focus on early childhood so that there are greater chances of the children becoming well-rounded adults.",
    gradient: "from-[#45bcf6] to-[#1a4895]",
    borderColor: "border-[#45bcf6]",
    textColor: "text-[#1a4895]",
    bgHover: "hover:bg-[#45bcf6]/5",
    activeBg: "bg-[#eff6ff]",
    activeBorder: "border-[#45bcf6]/30",
    image: "/team_sameer.png",
    roleTags: ["Co-Founder", "Doctor", "Guitarist"]
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
    image: "/team_kirti.png",
    roleTags: ["Co-Founder", "Teacher Educator", "Esperantist"]
  },
  {
    name: "Charan",
    initials: "C",
    role: "Curriculum developer | Tech support",
    bio: "I work at the crossroads of education and technology. I love turning big, brainy concepts into fun, interactive experiences that make learning exciting. With a foot in both teaching and tech, I build everything from websites to creative learning tools, all aimed at making things click (sometimes literally).",
    gradient: "from-[#36ba98] to-[#1f7860]",
    borderColor: "border-[#36ba98]",
    textColor: "text-[#1f7860]",
    bgHover: "hover:bg-[#36ba98]/5",
    activeBg: "bg-[#f0fdf4]",
    activeBorder: "border-[#36ba98]/30",
    image: "/team_charan.png",
    roleTags: ["Curriculum Developer", "Tech Support"]
  },
];

export default function AboutPageClient() {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  return (
    <main className="bg-white min-h-screen font-sans text-[#1e293b] overflow-hidden">
      
      <AboutHero />

      {/* ── THE FORMULA: BOLD & ICONIC ── */}
      <section id="formula-section" className="py-24 bg-white relative overflow-hidden rounded-[3rem] mx-6 border border-gray-200">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40" style={{
          backgroundSize: '30px 30px',
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)`,
        }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center justify-center bg-[#1a4895] text-white px-4 py-1.5 rounded-full mb-4 shadow-sm rotate-1">
            <span className="text-xs font-semibold uppercase tracking-wider">The Framework</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-[#111827] font-bold tracking-tight leading-[1.2] mb-5">
            The Magic <span className="inline-block bg-[#ff7a43] text-white px-4 py-0.5 rounded-xl -rotate-1 shadow-sm font-semibold">Formula.</span>
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4 text-base md:text-lg font-medium text-gray-600 leading-relaxed">
            <p>
              Social Emotional Learning (SEL) is the most progressive framework we have to perceive education holistically.
            </p>
            <p className="text-[#36ba98] font-bold">
              And what best time to embrace this framework than early childhood education?
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-8 relative z-10">
          
          {/* Card 1: Reimagining */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-8 md:p-10 bg-[#fbfdfa] rounded-[2.5rem] border border-[#36ba98]/10 shadow-[0_15px_30px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 relative -rotate-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#eefcf7] flex items-center justify-center text-[#36ba98] mb-6">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#36ba98]">Reimagining</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">
                Vetaas strives to reimagine the early childhood education curriculum from the lens of SEL.
              </p>
            </div>
          </motion.div>
          
          {/* Card 2: Empowering */}
          <motion.div 
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-8 md:p-10 bg-[#fffbfa] rounded-[2.5rem] border border-[#ff7f68]/10 shadow-[0_15px_30px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 relative rotate-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#fff0f1] flex items-center justify-center text-[#ff7f68] mb-6">
                <Smile size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#ff7f68]">Empowering</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">
                Empowering teachers and parents with skills, knowledge and perspectives for their journeys.
              </p>
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
                    "Daily mindfulness & emotion check-ins",
                    "Playful conversation prompts & games",
                    "Community support & sharing circles",
                    "Expert parenting guides & newsletters"
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
                <span className="inline-block bg-[#4285F4] text-white px-4 py-0.5 rounded-xl -rotate-1 shadow-sm font-semibold mt-2">Teachers.</span>
              </h2>
              <div className="space-y-5 text-gray-500 font-medium leading-relaxed mb-8 text-base md:text-lg">
                <p>
                  The role of teachers is vital. We support teachers in providing excellent support and resources to manage complex learning journeys.
                </p>
                <p>
                  Our programs help teachers integrate SEL, renew their energies, and create supportive environments.
                </p>
              </div>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 bg-[#4285F4] hover:bg-[#2d70db] text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-md active:scale-95"
              >
                Teacher Programs <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Redesigned Teacher Hub Card (No Image) */}
            <div className="lg:w-1/2 w-full max-w-[480px]">
              <div className="bg-[#eff6ff] p-8 md:p-10 rounded-[2.5rem] border border-[#4285F4]/20 shadow-md -rotate-2 transition-transform duration-500 hover:rotate-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#dbeafe] flex items-center justify-center text-[#4285F4]">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="font-bold text-xl text-[#111827]">SEL Teacher Hub</h3>
                </div>

                <ul className="space-y-4">
                  {[
                    "Classroom integration modules & toolkits",
                    "Teacher well-being & stress-relief programs",
                    "Peer-to-peer lesson sharing networks",
                    "Dynamic assessment & feedback templates"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#4285F4]/10 flex items-center justify-center text-[#4285F4] shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-semibold text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-[#4285F4]/10 text-center">
                  <span className="text-xs font-bold text-[#4285F4] uppercase tracking-wider">Creating active learning ecosystems</span>
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
              <div className="inline-flex items-center justify-center bg-[#ffd166] text-[#111827] px-4 py-1.5 rounded-full mb-6 shadow-sm rotate-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Meet the Visionaries</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[#111827] tracking-tight leading-[1.15] mb-6">
                The Team <br />
                Behind <span className="inline-block bg-[#36ba98] text-white px-4 py-0.5 rounded-xl -rotate-1 shadow-sm font-semibold mt-1">Vetaas.</span>
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

                          <Link 
                            href="/contact" 
                            className={`inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${member.textColor} hover:gap-3 transition-all pb-1 border-b-2 border-transparent hover:border-current`}
                          >
                            Let&apos;s Connect <Mail size={14} />
                          </Link>
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
