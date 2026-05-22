"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const TESTIMONIALS = [
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
  // Two sets for seamless infinite loop
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section 
      className="pt-12 pb-8 lg:pt-16 lg:pb-12 bg-gradient-to-b from-[#ecf7f4] to-[#fafaf7] overflow-hidden relative z-20"
      style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
    >
      {/* Background Decor — Layered Premium */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#ff6e79]/4 blur-[100px] animate-pulse-slow pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[-8%] w-[400px] h-[400px] rounded-full bg-[#4285F4]/4 blur-[110px] animate-pulse-slow pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[350px] h-[350px] rounded-full bg-[#36ba98]/4 blur-[100px] animate-pulse-slow pointer-events-none z-0" />

      {/* Morphing organic blobs */}
      <div className="absolute top-[15%] right-[8%] w-[220px] h-[220px] bg-gradient-to-br from-[#ff6e79]/6 to-[#ffd166]/5 animate-morph pointer-events-none z-0 blur-[50px]" />
      <div className="absolute bottom-[10%] left-[5%] w-[260px] h-[260px] bg-gradient-to-tr from-[#4285F4]/6 to-[#36ba98]/5 animate-morph pointer-events-none z-0 blur-[55px]" style={{ animationDelay: '-6s' }} />

      {/* Drifting geometric rings */}
      <div className="absolute top-[8%] left-[12%] w-[100px] h-[100px] rounded-full border-2 border-[#ff6e79]/8 animate-drift pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[15%] w-[70px] h-[70px] rounded-full border-2 border-[#36ba98]/10 animate-drift-reverse pointer-events-none z-0" />
      <div className="absolute top-[50%] left-[3%] w-[50px] h-[50px] rounded-full border border-[#ffd166]/12 animate-drift pointer-events-none z-0" style={{ animationDelay: '-8s' }} />
      {/* Orbiting dot */}
      <div className="absolute top-[25%] left-[25%] w-[8px] h-[8px] rounded-full bg-[#ff6e79]/12 animate-orbit pointer-events-none z-0" />
      
      {/* Layered SVG journey lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 600" preserveAspectRatio="none" fill="none" className="w-full h-full">
          {/* Primary coral curve */}
          <path 
            d="M-50,250 C300,450 600,100 1000,350 C1200,450 1350,250 1500,300" 
            stroke="#ff6e79" 
            strokeWidth="3" 
            strokeLinecap="round" 
            opacity="0.07"
          />
          {/* Secondary teal curve */}
          <path 
            d="M-50,180 C250,380 550,50 950,300 C1150,400 1300,180 1500,230" 
            stroke="#36ba98" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.05"
          />
          {/* Dashed accent */}
          <path 
            d="M-50,400 C200,300 500,500 800,320 C1100,180 1350,400 1500,350" 
            stroke="#ffd166" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeDasharray="10 6"
            opacity="0.06"
          />
          {/* Decorative SVG circles */}
          <circle cx="150" cy="100" r="45" stroke="#ff6e79" strokeWidth="1" opacity="0.04" />
          <circle cx="1300" cy="450" r="55" stroke="#4285F4" strokeWidth="1" opacity="0.04" />
          <circle cx="800" cy="50" r="25" stroke="#36ba98" strokeWidth="1.5" opacity="0.05" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 mb-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center bg-[#ff6e79] text-white px-5 py-2 rounded-full mb-4 shadow-sm rotate-1">
            <span className="text-sm font-semibold uppercase tracking-wider">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#111827] font-bold tracking-tight leading-[1.2]">
            Voices from <span className="text-[#36ba98]">Our Village</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative overflow-hidden py-10 z-10 select-none w-full">
        <div className="flex flex-row gap-10 px-5 w-max flex-shrink-0 animate-marquee">
          {marqueeItems.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative flex-shrink-0 w-[290px] sm:w-[420px] md:w-[500px] lg:w-[550px] xl:w-[600px] ${item.color} border-2 border-black rounded-[2rem] p-6 sm:p-8 md:p-10 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] group select-none transition-all duration-300`}
            >
              <div className="relative z-20 pointer-events-none flex flex-col h-full justify-between gap-6">
                
                {/* Header: Avatar + Info */}
                <div className="flex items-center gap-5">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-black flex-shrink-0 bg-white shadow-sm">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover object-center scale-[1.15]" 
                      draggable={false}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl md:text-2xl font-bold ${item.textColor} leading-tight tracking-tight mb-1`}>
                      {item.name}
                    </h3>
                    <div className={`${item.roleColor} text-[11px] md:text-xs font-bold uppercase tracking-widest leading-snug`}>
                      {item.role}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <p className={`${item.pColor} text-lg md:text-xl font-medium leading-relaxed italic`}>
                  "{item.quote}"
                </p>
                
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
