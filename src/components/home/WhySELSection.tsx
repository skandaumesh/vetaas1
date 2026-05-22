"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhySELSection() {
  const pillars = [
    {
      pin: "/pin1.png",
      pinPosition: "left-1/2 -translate-x-1/2", 
      color: "bg-[#36ba98]", // Green
      textColor: "text-white",
      rotation: "-rotate-3 md:-rotate-6",
      zIndex: 10,
      title: "Self-Awareness",
      description: "Children learn to recognize their emotions, understand their strengths, and develop a positive self-image that fuels growth.",
    },
    {
      pin: "/pin2.png",
      pinPosition: "left-6 md:left-8", 
      color: "bg-[#4285F4]", // Blue
      textColor: "text-white",
      rotation: "rotate-2 md:rotate-2",
      zIndex: 20,
      title: "Self-Management",
      description: "Students develop the ability to regulate their emotions, manage stress effectively, and set achievable personal and academic goals.",
    },
    {
      pin: "/pin3.png",
      pinPosition: "left-1/2 -translate-x-1/2", 
      color: "bg-[#ff7a43]", // Orange
      textColor: "text-white",
      rotation: "-rotate-2 md:-rotate-2",
      zIndex: 30,
      title: "Social Awareness",
      description: "By building empathy and appreciating diversity, children learn to understand perspectives and backgrounds different from their own.",
    },
    {
      pin: "/pin4.png",
      pinPosition: "left-6 md:left-8", 
      color: "bg-[#ffd166]", // Yellow
      textColor: "text-black",
      rotation: "rotate-3 md:rotate-4",
      zIndex: 40,
      title: "Relationships",
      description: "SEL builds communication and cooperation — skills essential for healthy friendships and future professional success.",
    },
    {
      pin: "/pin5.png",
      pinPosition: "left-1/2 -translate-x-1/2", 
      color: "bg-[#1a4895]", // Dark Blue
      textColor: "text-white",
      rotation: "-rotate-2 md:-rotate-4",
      zIndex: 50,
      title: "Decisions",
      description: "Through guided frameworks, students develop critical thinking skills to make thoughtful, ethical choices in their daily lives.",
    }
  ];

  return (
    <section 
      className="pt-10 pb-12 lg:pt-12 lg:pb-16 bg-gradient-to-b from-[#faf9f6] to-[#ecf7f4] relative overflow-hidden z-10"
      style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
    >
      {/* Background Decor — Layered Premium */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#36ba98]/5 blur-[120px] animate-pulse-slow pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#ffd166]/5 blur-[130px] animate-pulse-slow pointer-events-none z-0" />

      {/* Morphing organic blob — top right */}
      <div className="absolute top-[5%] right-[5%] w-[280px] h-[280px] bg-gradient-to-br from-[#36ba98]/8 to-[#4285F4]/6 animate-morph pointer-events-none z-0 blur-[60px]" />
      {/* Morphing organic blob — bottom left */}
      <div className="absolute bottom-[8%] left-[3%] w-[320px] h-[320px] bg-gradient-to-tr from-[#ffd166]/8 to-[#ff7a43]/6 animate-morph pointer-events-none z-0 blur-[70px]" style={{ animationDelay: '-4s' }} />

      {/* Drifting geometric ring accent — top left */}
      <div className="absolute top-[12%] left-[8%] w-[120px] h-[120px] rounded-full border-2 border-[#36ba98]/10 animate-drift pointer-events-none z-0" />
      {/* Drifting geometric ring accent — bottom right */}
      <div className="absolute bottom-[15%] right-[10%] w-[90px] h-[90px] rounded-full border-2 border-[#ffd166]/12 animate-drift-reverse pointer-events-none z-0" />
      {/* Small orbiting dot */}
      <div className="absolute top-[30%] right-[20%] w-[10px] h-[10px] rounded-full bg-[#4285F4]/15 animate-orbit pointer-events-none z-0" />

      {/* Layered SVG journey lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none" className="w-full h-full">
          {/* Primary curve */}
          <path 
            d="M-50,300 C300,100 600,450 900,200 C1200,50 1350,380 1500,250" 
            stroke="#ffd166" 
            strokeWidth="3" 
            strokeLinecap="round" 
            opacity="0.08"
          />
          {/* Secondary offset curve */}
          <path 
            d="M-50,380 C350,180 650,520 950,280 C1250,100 1400,450 1550,320" 
            stroke="#36ba98" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.06"
          />
          {/* Thin accent curve */}
          <path 
            d="M-50,500 C200,350 500,600 800,400 C1100,250 1300,500 1500,420" 
            stroke="#4285F4" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeDasharray="12 8"
            opacity="0.06"
          />
          {/* Decorative circles */}
          <circle cx="200" cy="150" r="60" stroke="#36ba98" strokeWidth="1" opacity="0.05" />
          <circle cx="1200" cy="700" r="80" stroke="#ffd166" strokeWidth="1" opacity="0.05" />
          <circle cx="700" cy="100" r="35" stroke="#ff7a43" strokeWidth="1.5" opacity="0.06" />
        </svg>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Original Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center bg-[#4285F4] text-white px-4 py-1.5 rounded-full mb-4 shadow-sm rotate-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Why Social Emotional Learning?</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#111827] font-bold tracking-tight leading-[1.2] mb-5">
            Education isn't just academics.<br />
            <span className="inline-block bg-[#36ba98] text-white px-3 py-0.5 rounded-xl -rotate-1 mt-2 shadow-sm font-semibold">It's about the whole child.</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Research shows that children who develop social-emotional skills perform better academically, form healthier relationships, and become more resilient adults.
          </p>
        </motion.div>

        {/* 5 Sticky Note Cards with mobile decorations */}
        <div className="relative flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap justify-center items-center md:items-stretch gap-10 md:gap-8 lg:gap-0 lg:-space-x-3 xl:-space-x-4 2xl:-space-x-6 mt-12 px-4 pb-16">
          
          {/* Mobile-only decorative connector line running behind cards */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 md:hidden z-0 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-[#36ba98]/15 via-[#4285F4]/12 to-[#ffd166]/15 rounded-full" />
          </div>

          {/* Mobile-only floating accents scattered between card positions */}
          <div className="absolute left-[10%] top-[12%] w-[40px] h-[40px] rounded-full border-2 border-[#36ba98]/15 animate-drift pointer-events-none z-[1] md:hidden" />
          <div className="absolute right-[8%] top-[25%] w-[28px] h-[28px] rounded-full bg-gradient-to-br from-[#4285F4]/12 to-[#36ba98]/8 animate-float pointer-events-none z-[1] md:hidden" />
          <div className="absolute left-[5%] top-[40%] w-[22px] h-[22px] rounded-full border border-[#ff7a43]/15 animate-drift-reverse pointer-events-none z-[1] md:hidden" />
          <div className="absolute right-[12%] top-[55%] w-[35px] h-[35px] rounded-full border-2 border-[#ffd166]/15 animate-drift pointer-events-none z-[1] md:hidden" />
          <div className="absolute left-[8%] top-[70%] w-[18px] h-[18px] rounded-full bg-gradient-to-br from-[#ff7a43]/10 to-[#ff6e79]/8 animate-float-reverse pointer-events-none z-[1] md:hidden" />
          <div className="absolute right-[6%] top-[85%] w-[30px] h-[30px] rounded-full border border-[#1a4895]/12 animate-drift-reverse pointer-events-none z-[1] md:hidden" />

          {/* Mobile-only small dots — scattered like confetti */}
          <div className="absolute left-[18%] top-[8%] w-[8px] h-[8px] rounded-full bg-[#36ba98]/20 animate-pulse-slow pointer-events-none z-[1] md:hidden" />
          <div className="absolute right-[20%] top-[18%] w-[6px] h-[6px] rounded-full bg-[#4285F4]/18 animate-pulse-slow pointer-events-none z-[1] md:hidden" style={{ animationDelay: '-2s' }} />
          <div className="absolute left-[15%] top-[35%] w-[10px] h-[10px] rounded-full bg-[#ff7a43]/15 animate-pulse-slow pointer-events-none z-[1] md:hidden" style={{ animationDelay: '-4s' }} />
          <div className="absolute right-[15%] top-[48%] w-[7px] h-[7px] rounded-full bg-[#ffd166]/20 animate-pulse-slow pointer-events-none z-[1] md:hidden" style={{ animationDelay: '-3s' }} />
          <div className="absolute left-[20%] top-[62%] w-[9px] h-[9px] rounded-full bg-[#1a4895]/15 animate-pulse-slow pointer-events-none z-[1] md:hidden" style={{ animationDelay: '-5s' }} />
          <div className="absolute right-[18%] top-[78%] w-[8px] h-[8px] rounded-full bg-[#36ba98]/18 animate-pulse-slow pointer-events-none z-[1] md:hidden" style={{ animationDelay: '-6s' }} />

          {/* Mobile SVG curves between cards */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1] md:hidden" preserveAspectRatio="none" viewBox="0 0 400 1200" fill="none">
            <path d="M50,100 C150,180 300,120 350,200" stroke="#36ba98" strokeWidth="1.5" strokeLinecap="round" opacity="0.1" />
            <path d="M350,300 C250,380 100,320 50,400" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" opacity="0.08" />
            <path d="M50,500 C150,580 300,520 350,600" stroke="#ff7a43" strokeWidth="1.5" strokeLinecap="round" opacity="0.1" />
            <path d="M350,700 C250,780 100,720 50,800" stroke="#ffd166" strokeWidth="1.5" strokeLinecap="round" opacity="0.1" />
            <path d="M50,900 C150,980 300,920 350,1000" stroke="#1a4895" strokeWidth="1.5" strokeLinecap="round" opacity="0.08" />
            <circle cx="80" cy="250" r="20" stroke="#4285F4" strokeWidth="1" opacity="0.06" />
            <circle cx="320" cy="450" r="25" stroke="#ff7a43" strokeWidth="1" opacity="0.06" />
            <circle cx="100" cy="650" r="18" stroke="#ffd166" strokeWidth="1" opacity="0.07" />
            <circle cx="300" cy="850" r="22" stroke="#36ba98" strokeWidth="1" opacity="0.06" />
          </svg>

          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -15, scale: 1.05, zIndex: 100 }}
              style={{ zIndex: pillar.zIndex }}
              className={`relative w-full sm:w-[280px] md:w-[220px] lg:w-[180px] xl:w-[220px] 2xl:w-[260px] p-5 pt-14 md:pt-14 pb-8 xl:p-6 xl:pt-16 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.15)] ${pillar.color} ${pillar.textColor} flex-shrink-0 transition-transform duration-300 ${pillar.rotation}`}
            >
              {/* Pin image — positioned above the card */}
              <div className={`absolute -top-12 ${pillar.pinPosition} w-20 h-20 md:-top-14 md:w-24 md:h-24 z-20 drop-shadow-lg`}>
                <Image src={pillar.pin} alt="Pin decoration" fill className="object-contain" />
              </div>

              <div className={`${i % 2 === 0 ? 'animate-float' : 'animate-float-reverse'} h-full flex flex-col justify-between relative`}>
                <div className="pt-0">
                  <h3 className="font-bold text-lg lg:text-xl mb-3 tracking-tight leading-none">
                    {pillar.title}
                  </h3>
                  
                  {/* Divider Line */}
                  <div className={`h-px w-full mb-3 ${pillar.textColor === 'text-white' ? 'bg-white/30' : 'bg-black/20'}`} />
                </div>
                
                <p className={`text-xs lg:text-sm font-medium leading-relaxed ${pillar.textColor === 'text-white' ? 'text-white/90' : 'text-black/80'} mt-auto`}>
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
