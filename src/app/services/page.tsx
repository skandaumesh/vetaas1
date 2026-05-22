"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, BookOpen, Sparkles, Check, ChevronRight } from "lucide-react";

const ENGAGEMENTS = [
  {
    title: "Parent Engagement",
    subtitle: "Action oriented workshops",
    description: "Action oriented workshops that cater to bridging the gap between home environments and positive development.",
    items: [
      "Creating conversation spaces.",
      "Meaningful parent and child engagements.",
      "Exposure to SEL and ECE theories."
    ],
    icon: Heart,
    colorTheme: "pink",
    bg: "bg-[#fffbfa]",
    border: "border-[#ff7f68]/20",
    hoverBorder: "hover:border-[#ff7f68]/40",
    accentBg: "bg-[#fff0f1]",
    accentText: "text-[#ff7f68]",
    pillBg: "bg-[#ff7f68]/10",
    bulletBg: "bg-[#ff7f68]/10",
    bulletIconColor: "text-[#ff7f68]"
  },
  {
    title: "Teacher Engagement",
    subtitle: "Capacity building sessions",
    description: "Carefully created sessions that cater to elevating the role of educators in managing learning journeys.",
    items: [
      "SEL 101 course for teachers' capacity building.",
      "SEL for teachers' wellbeing.",
      "Creating a SEL-supportive classroom environment."
    ],
    icon: BookOpen,
    colorTheme: "blue",
    bg: "bg-[#eff6ff]",
    border: "border-[#4285F4]/20",
    hoverBorder: "hover:border-[#4285F4]/40",
    accentBg: "bg-[#dbeafe]",
    accentText: "text-[#4285F4]",
    pillBg: "bg-[#4285F4]/10",
    bulletBg: "bg-[#4285F4]/10",
    bulletIconColor: "text-[#4285F4]"
  },
  {
    title: "Child Engagement",
    subtitle: "Fun filled events",
    description: "Fun filled events that cater to designing playful learning spaces and inspiring curious young minds.",
    items: [
      "Creating a rich learning experience for children.",
      "SEL-focused activities for children.",
      "Take-home projects to extend learning."
    ],
    icon: Sparkles,
    colorTheme: "green",
    bg: "bg-[#f0fdf4]",
    border: "border-[#36ba98]/20",
    hoverBorder: "hover:border-[#36ba98]/40",
    accentBg: "bg-[#eefcf7]",
    accentText: "text-[#36ba98]",
    pillBg: "bg-[#36ba98]/10",
    bulletBg: "bg-[#36ba98]/10",
    bulletIconColor: "text-[#36ba98]"
  }
];

export default function ServicesPage() {
  return (
    <main className="bg-white min-h-screen relative overflow-hidden font-sans pb-32 pt-[calc(var(--header-height)+2rem)]">
      {/* Background Decor — Premium Gradients */}
      <div className="absolute top-[10%] left-[-15%] w-[500px] h-[500px] rounded-full bg-[#1a4895]/3 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-[#ff6e79]/3 blur-[120px] pointer-events-none z-0" />
      
      {/* Subtle Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20" 
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
        }} 
      />

      {/* Main Container */}
      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-6 rounded-full bg-white border border-gray-200 text-gray-800 font-bold text-xs tracking-widest uppercase mb-4 shadow-sm">
              OUR SERVICES
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight mb-6"
          >
            Our <span className="inline-block bg-[#1a4895] text-white px-5 py-1 rounded-2xl rotate-1 shadow-sm font-semibold">Services.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-500 font-medium text-base md:text-lg leading-relaxed"
          >
            Explore the customized activity and wellness formats we facilitate across our engagements.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-32">
          
          {/* Card 1: Workshops */}
          <Link href="/contact" className="flex group/card w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-[#38d38b] rounded-[2.5rem] p-8 relative overflow-hidden h-[480px] flex flex-col justify-between shadow-sm cursor-pointer w-full"
            >
              {/* Abstract Yellow Blob */}
              <svg className="absolute -bottom-10 -left-10 w-64 h-64 text-[#fce270] transition-transform duration-500 group-hover/card:scale-110" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M45.7,-76.3C58.9,-69.3,69,-55.3,77.3,-40.7C85.6,-26.1,92,-11.1,90.3,3.3C88.6,17.6,78.8,31.3,68.2,43.3C57.6,55.3,46.1,65.6,32.7,73.5C19.3,81.3,4,86.7,-10.8,85.2C-25.6,83.7,-39.9,75.4,-53.4,66C-66.9,56.6,-79.6,46.2,-85.9,32.6C-92.2,19,-92.1,2.2,-87.3,-12.6C-82.5,-27.4,-73.1,-40.1,-61,-50.2C-48.9,-60.2,-34.1,-67.5,-20,-73.4C-5.9,-79.3,7.5,-83.8,22,-82.4C36.5,-81,51,-73.8,45.7,-76.3Z" transform="translate(100 100) scale(1.1)" />
              </svg>

              <div className="relative z-10 flex justify-between items-start">
                <span className="border border-black px-3 py-1 rounded-full text-xs font-bold tracking-wide text-black bg-white/20">
                  Ages 2-8
                </span>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover/card:bg-black group-hover/card:text-white transition-colors text-black bg-white/10">
                  <ArrowRight size={20} className="-rotate-45" />
                </div>
              </div>

              <div className="relative z-10 text-left mt-auto">
                <h3 className="text-[2.75rem] leading-none text-black mb-4">
                  <span className="font-bold block tracking-tight">Interactive</span>
                  <span className="font-serif italic text-[2.5rem]">Workshops</span>
                </h3>
                <p className="text-black/80 font-medium text-sm md:text-base leading-snug max-w-[95%]">
                  Experience rich, fun-filled sessions on relevant topics. Themes include Social Emotional Learning, Pre-literacy, and Parents Matter.
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Card 2: Events MCME */}
          <Link href="/contact" className="flex group/card w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-[#c8bdf5] rounded-[2.5rem] p-8 relative overflow-hidden h-[480px] flex flex-col justify-between shadow-sm cursor-pointer w-full"
            >
              {/* Abstract Light Green Line */}
              <svg className="absolute -top-10 -right-10 w-64 h-64 text-[#d4fca4] transition-transform duration-500 group-hover/card:rotate-12" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" d="M30,150 C50,50 150,50 170,150 C180,200 250,150 250,50" transform="rotate(-30 100 100) scale(0.8)"/>
              </svg>

              <div className="relative z-10 flex justify-between items-start">
                <span className="border border-black px-3 py-1 rounded-full text-xs font-bold tracking-wide text-black bg-white/20">
                  All Ages
                </span>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover/card:bg-black group-hover/card:text-white transition-colors text-black bg-white/10">
                  <ArrowRight size={20} className="-rotate-45" />
                </div>
              </div>

              <div className="relative z-10 flex-grow flex flex-col justify-center items-center py-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-[6px] border-[#c8bdf5] shadow-[0_0_0_2px_white] relative group-hover/card:scale-105 transition-transform">
                  <Image src="/child.png" alt="MCME Event" fill className="object-cover bg-white" />
                </div>
              </div>

              <div className="relative z-10 text-left mt-auto">
                <h3 className="text-[2.75rem] leading-none text-black mb-3">
                  <span className="font-bold block tracking-tight">Events</span>
                  <span className="font-serif italic text-[2.5rem]">MCME</span>
                </h3>
                <p className="text-black/80 font-medium text-sm md:text-base leading-snug">
                  Strengthen your bond with fun games, music, dance, and creative art projects.
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Card 3: Wellness Circles */}
          <Link href="/contact" className="flex group/card w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-[#d4fca4] rounded-[2.5rem] p-8 relative overflow-hidden h-[480px] flex flex-col justify-between shadow-sm cursor-pointer w-full"
            >
              {/* Abstract Purple Asterisk */}
              <div className="absolute -bottom-16 -left-12 text-[#c8bdf5] transition-transform duration-500 group-hover/card:rotate-45">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 20C105.523 20 110 24.4772 110 30V85H165C170.523 85 175 89.4772 175 95C175 100.523 170.523 105 165 105H110V160C110 165.523 105.523 170 100 170C94.4772 170 90 165.523 90 160V105H35C29.4772 105 25 100.523 25 95C25 89.4772 29.4772 85 35 85H90V30C90 24.4772 94.4772 20 100 20Z" />
                  <path d="M43.4315 43.4315C47.3367 39.5262 53.6684 39.5262 57.5736 43.4315L96.462 82.3198L135.35 43.4315C139.256 39.5262 145.587 39.5262 149.492 43.4315C153.398 47.3367 153.398 53.6684 149.492 57.5736L110.604 96.462L149.492 135.35C153.398 139.256 153.398 145.587 149.492 149.492C145.587 153.398 139.256 153.398 135.35 149.492L96.462 110.604L57.5736 149.492C53.6684 153.398 47.3367 153.398 43.4315 149.492C39.5262 145.587 39.5262 139.256 43.4315 135.35L82.3198 96.462L43.4315 57.5736C39.5262 53.6684 39.5262 47.3367 43.4315 43.4315Z" />
                </svg>
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <span className="border border-black px-3 py-1 rounded-full text-xs font-bold tracking-wide text-black bg-white/20">
                  For Parents
                </span>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover/card:bg-black group-hover/card:text-white transition-colors text-black bg-white/10">
                  <ArrowRight size={20} className="-rotate-45" />
                </div>
              </div>

              <div className="relative z-10 text-left mt-auto">
                <h3 className="text-[2.75rem] leading-none text-black mb-3">
                  <span className="font-bold block tracking-tight">Wellness</span>
                  <span className="font-serif italic text-[2.5rem]">Circles</span>
                </h3>
                <p className="text-black/80 font-medium text-sm md:text-base leading-snug">
                  Prioritize your well-being. Engage in self-care, mindfulness, and community building.
                </p>
              </div>
            </motion.div>
          </Link>

        </div>

        {/* ── OUR WORK SECTION ── */}
        <div className="relative mt-24 mb-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight mb-4">
              Our Work
            </h2>
            <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
              Thoughtfully crafted programs designed to build bridges between research and practice. We support the entire ecosystem around early childhood care and development.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {ENGAGEMENTS.map((eng, idx) => {
              const IconComponent = eng.icon;
              return (
                <Link href="/contact" key={idx} className="flex group/card">
                  <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: idx * 0.15 }}
                    whileHover={{ y: -8, scale: 1.01 }}
                    className={`${eng.bg} ${eng.border} ${eng.hoverBorder} border p-8 md:p-10 rounded-[3rem] shadow-[0_15px_30px_rgba(0,0,0,0.01)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between w-full`}
                  >
                    <div>
                      {/* Icon & Title */}
                      <div className="flex items-center justify-between mb-8">
                        <div className={`w-14 h-14 rounded-2xl ${eng.accentBg} flex items-center justify-center ${eng.accentText}`}>
                          <IconComponent size={28} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full ${eng.pillBg} ${eng.accentText}`}>
                          {eng.subtitle}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{eng.title}</h3>
                      <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed mb-8">{eng.description}</p>
                      
                      {/* Bullet Items */}
                      <ul className="space-y-4">
                        {eng.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full ${eng.bulletBg} flex items-center justify-center ${eng.bulletIconColor} shrink-0 mt-0.5`}>
                              <Check size={12} strokeWidth={3.5} />
                            </div>
                            <span className="text-sm font-semibold text-gray-600 leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card CTA Link */}
                    <div className="mt-10 pt-6 border-t border-dashed border-gray-200/60">
                      <span 
                        className={`inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${eng.accentText} group-hover/card:gap-3 transition-all`}
                      >
                        Learn more & partner <ChevronRight size={14} />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Closing Partner Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gray-50 rounded-[3rem] p-8 md:p-12 border border-gray-200 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Interested in our services?</h3>
            <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
              We customize workshops, events, and capacity-building programs for schools, community organizations, and parents.
            </p>
          </div>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0B1523] text-white font-bold text-sm rounded-full hover:bg-gray-800 hover:scale-105 transition-all shadow-md"
          >
            Get in touch
            <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
