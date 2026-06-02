"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  color: string;
  textColor: string;
  pColor: string;
  roleColor: string;
  image: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Kavita ma’am’s session provided valuable insights into recognising and managing our emotions in specific moments. I learned more about the crucial role emotions play in our daily lives.",
    name: "Afrin Maqsood",
    role: "Teacher participant - Socio-emotional wellbeing workshop",
    color: "bg-white",
    textColor: "text-[#111827]",
    pColor: "text-gray-700",
    roleColor: "text-gray-500",
    image: "/testimonial6.png",
  },
  {
    quote: "Kirti's expertise in Language and Curriculum Design helped us set up our Hindi curriculum from scratch. She guided our teachers and built their capacity. We still rely on her guidance! She brings a great amount of empathy and sensitivity to her work.",
    name: "Preethy Rao Patel",
    role: "Co-Founder, Gubbachi Learning Community",
    color: "bg-white",
    textColor: "text-[#111827]",
    pColor: "text-gray-700",
    roleColor: "text-gray-500",
    image: "/gubbachi_logo.webp",
  },
  {
    quote: "My child thoroughly enjoyed the summer camp! Kirti was the perfect guide and facilitator. I also wanted to appreciate the thought and research that went into the activities and how each activity aimed to bring out different aspects of learning.",
    name: "Parent Participant",
    role: "SEL Summer Camp",
    color: "bg-white",
    textColor: "text-[#111827]",
    pColor: "text-gray-700",
    roleColor: "text-gray-500",
    image: "/testimonial8.png",
  },
  {
    quote: "Kirti has always been Proactive with her tasks and assigned duties. As a consultant, her feedback has been balanced and constructive. Her inputs with lesson planning helped me in improving and modifying my teaching strategies for better outcomes.",
    name: "Shumaiya",
    role: "Teacher, Gubbachi Learning community",
    color: "bg-white",
    textColor: "text-[#111827]",
    pColor: "text-gray-700",
    roleColor: "text-gray-500",
    image: "/user1.webp",
  },
  {
    quote: "I am thankful to Vetaas Foundation for teaching me about the importance of early childhood education. Special thanks to Seetha and Kirti for explaining development domains of children through various activities and increasing my awareness for better development of children.",
    name: "Syed Fouzan Ahmed’s mother",
    role: "Brainy Stars Holistic School Jayanagar",
    color: "bg-white",
    textColor: "text-[#111827]",
    pColor: "text-gray-700",
    roleColor: "text-gray-500",
    image: "/testimonial10.png",
  },
];

export default function TestimonialsSection() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  
  // Two sets for seamless infinite loop
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS];
  const MAX_LENGTH = 130;

  return (
    <section 
      className="pt-12 pb-8 lg:pt-16 lg:pb-12 bg-gradient-to-b from-[#ecf7f4] to-[#fafaf7] overflow-hidden relative z-20"
      style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
    >
      {/* Background Decor — Layered Premium */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#FF5C7A]/4 blur-[100px] md:animate-pulse-slow pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[-8%] w-[400px] h-[400px] rounded-full bg-[#1E90FF]/4 blur-[110px] md:animate-pulse-slow pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[350px] h-[350px] rounded-full bg-[#00CDBA]/4 blur-[100px] md:animate-pulse-slow pointer-events-none z-0" />
 
      {/* Morphing organic blobs */}
      <div className="absolute top-[15%] right-[8%] w-[220px] h-[220px] bg-gradient-to-br from-[#FF5C7A]/6 to-[#FFC107]/5 md:animate-morph pointer-events-none z-0 blur-[50px]" />
      <div className="absolute bottom-[10%] left-[5%] w-[260px] h-[260px] bg-gradient-to-tr from-[#1E90FF]/6 to-[#00CDBA]/5 md:animate-morph pointer-events-none z-0 blur-[55px]" style={{ animationDelay: '-6s' }} />
 
      {/* Drifting geometric rings */}
      <div className="absolute top-[8%] left-[12%] w-[100px] h-[100px] rounded-full border-2 border-[#FF5C7A]/8 md:animate-drift pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[15%] w-[70px] h-[70px] rounded-full border-2 border-[#00CDBA]/10 md:animate-drift-reverse pointer-events-none z-0" />
      <div className="absolute top-[50%] left-[3%] w-[50px] h-[50px] rounded-full border border-[#FFC107]/12 md:animate-drift pointer-events-none z-0" style={{ animationDelay: '-8s' }} />
      {/* Orbiting dot */}
      <div className="absolute top-[25%] left-[25%] w-[8px] h-[8px] rounded-full bg-[#FF5C7A]/12 md:animate-orbit pointer-events-none z-0" />
      
      {/* Layered SVG journey lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 600" preserveAspectRatio="none" fill="none" className="w-full h-full">
          {/* Primary coral curve */}
          <path 
            d="M-50,250 C300,450 600,100 1000,350 C1200,450 1350,250 1500,300" 
            stroke="#FF5C7A" 
            strokeWidth="3" 
            strokeLinecap="round" 
            opacity="0.07"
          />
          {/* Secondary teal curve */}
          <path 
            d="M-50,180 C250,380 550,50 950,300 C1150,400 1300,180 1500,230" 
            stroke="#00CDBA" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.05"
          />
          {/* Dashed accent */}
          <path 
            d="M-50,400 C200,300 500,500 800,320 C1100,180 1350,400 1500,350" 
            stroke="#FFC107" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeDasharray="10 6"
            opacity="0.06"
          />
          {/* Decorative SVG circles */}
          <circle cx="150" cy="100" r="45" stroke="#FF5C7A" strokeWidth="1" opacity="0.04" />
          <circle cx="1300" cy="450" r="55" stroke="#1E90FF" strokeWidth="1" opacity="0.04" />
          <circle cx="800" cy="50" r="25" stroke="#00CDBA" strokeWidth="1.5" opacity="0.05" />
        </svg>
      </div>
 
      <div className="max-w-[1400px] mx-auto px-6 mb-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center bg-[#FF5C7A] text-white px-5 py-2 rounded-full mb-4 shadow-sm rotate-1">
            <span className="text-sm font-semibold uppercase tracking-wider">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#111827] font-bold font-headline tracking-tight leading-[1.2]">
            Voices from <span className="inline-block bg-[#00CDBA] text-white px-5 py-1 rounded-[1.5rem] shadow-sm rotate-2">Our Village</span>
          </h2>
        </motion.div>
      </div>
 
      {/* Marquee Wrapper */}
      <div className="relative overflow-hidden py-10 z-10 select-none w-full">
        <div className="flex flex-row gap-10 px-5 w-max flex-shrink-0 animate-marquee" style={{ willChange: 'transform' }}>
          {marqueeItems.map((item, i) => {
            const isLong = item.quote.length > MAX_LENGTH;
            const displayQuote = isLong ? `“${item.quote.slice(0, MAX_LENGTH)}...”` : `“${item.quote}”`;
            
            return (
              <motion.div 
                key={i}
                whileHover={{ y: -3, scale: 1.01 }}
                className={`relative flex-shrink-0 w-[240px] sm:w-[300px] md:w-[320px] lg:w-[340px] min-h-[160px] sm:min-h-0 ${item.color} border-2 border-black rounded-3xl p-4 sm:p-5 flex flex-col shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] group transition-all duration-300`}
              >
                <div className="relative z-20 flex flex-col h-full justify-between gap-4">
                  
                  {/* Header: Avatar + Info */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-black flex-shrink-0 bg-white shadow-sm">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover object-center scale-[1.15]" 
                        draggable={false}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm md:text-base font-bold ${item.textColor} leading-tight tracking-tight mb-0.5 truncate`}>
                        {item.name}
                      </h3>
                      <div className={`${item.roleColor} text-[8px] md:text-[9px] font-bold uppercase tracking-widest leading-snug truncate`}>
                        {item.role}
                      </div>
                    </div>
                  </div>
 
                  {/* Quote & Button */}
                  <div className="flex flex-col flex-1 justify-between mt-2">
                    {/* Mobile version (truncated) */}
                    <div className="block sm:hidden flex flex-col flex-1 justify-between">
                      <p className={`${item.pColor} text-[13px] font-medium leading-relaxed italic`}>
                        {displayQuote}
                      </p>
                      {isLong && (
                        <button
                          onClick={() => setSelectedTestimonial(item)}
                          className="mt-2 text-[11px] font-black text-[#00CDBA] hover:text-[#2d9e81] transition-colors flex items-center gap-1 cursor-pointer self-start"
                        >
                          Read More <span>→</span>
                        </button>
                      )}
                    </div>

                    {/* Desktop version (full text) */}
                    <div className="hidden sm:block">
                      <p className={`${item.pColor} text-[13px] md:text-sm font-medium leading-relaxed italic`}>
                        “{item.quote}”
                      </p>
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Testimonial Detail Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTestimonial(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-10 w-full max-w-xl overflow-hidden z-10"
            >
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#FF5C7A] to-[#00CDBA]" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-6 font-body">
                {/* Header: Avatar + Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-black bg-white shadow-sm shrink-0">
                    <Image 
                      src={selectedTestimonial.image} 
                      alt={selectedTestimonial.name} 
                      fill
                      className="object-cover object-center scale-[1.15]" 
                      draggable={false}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                      {selectedTestimonial.name}
                    </h3>
                    <div className="text-[#00CDBA] text-xs font-bold uppercase tracking-widest mt-1">
                      {selectedTestimonial.role}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative mt-2">
                  <span className="absolute -top-8 -left-4 text-7xl text-gray-100 font-serif leading-none select-none">“</span>
                  <p className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed italic relative z-10 pr-2">
                    {selectedTestimonial.quote}
                  </p>
                  <span className="absolute -bottom-10 right-2 text-7xl text-gray-100 font-serif leading-none select-none">”</span>
                </div>
                
                {/* OK Button */}
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="mt-6 py-3 px-6 bg-[#00CDBA] hover:bg-[#2d9e81] text-white font-bold rounded-xl transition shadow-lg shadow-teal-500/10 cursor-pointer self-end"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

