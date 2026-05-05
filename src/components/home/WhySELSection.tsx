"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhySELSection() {
  const pillars = [
    {
      pin: "/pin1.png",
      pinPosition: "left-1/2 -translate-x-1/2", // Center
      color: "bg-[#36795f]", // Dark green
      textColor: "text-white",
      rotation: "-rotate-3 md:-rotate-6",
      zIndex: 10,
      title: "Self-Awareness",
      description: "Children learn to recognize their emotions, understand their strengths, and develop a positive self-image that fuels growth.",
    },
    {
      pin: "/pin2.png",
      pinPosition: "left-6 md:left-8", // Left side
      color: "bg-[#8299fa]", // Blue
      textColor: "text-black",
      rotation: "rotate-2 md:rotate-2",
      zIndex: 20,
      title: "Self-Management",
      description: "Students develop the ability to regulate their emotions, manage stress effectively, and set achievable personal and academic goals.",
    },
    {
      pin: "/pin3.png",
      pinPosition: "left-1/2 -translate-x-1/2", // Center
      color: "bg-[#ff7a43]", // Orange
      textColor: "text-black",
      rotation: "-rotate-2 md:-rotate-2",
      zIndex: 30,
      title: "Social Awareness",
      description: "By building empathy and appreciating diversity, children learn to understand perspectives and backgrounds different from their own.",
    },
    {
      pin: "/pin4.png",
      pinPosition: "left-6 md:left-8", // Left side
      color: "bg-[#9a3059]", // Maroon
      textColor: "text-white",
      rotation: "rotate-3 md:rotate-4",
      zIndex: 40,
      title: "Relationships",
      description: "SEL builds communication and cooperation — skills essential for healthy friendships and future professional success.",
    },
    {
      pin: "/pin5.png",
      pinPosition: "left-1/2 -translate-x-1/2", // Center
      color: "bg-[#e3a8fc]", // Light purple
      textColor: "text-black",
      rotation: "-rotate-2 md:-rotate-4",
      zIndex: 50,
      title: "Decisions",
      description: "Through guided frameworks, students develop critical thinking skills to make thoughtful, ethical choices in their daily lives.",
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#FDFBF7] relative overflow-hidden font-sans z-10">
      
      {/* Playful Background Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-50"
        style={{
          backgroundSize: '30px 30px',
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
          `
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Original Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center justify-center bg-[#ff6e79] text-white px-4 py-1.5 rounded-full mb-6 shadow-sm rotate-2">
            <span className="text-xs font-bold uppercase tracking-widest">Why Social Emotional Learning?</span>
          </div>
          
          <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl text-[#111827] tracking-tight leading-[1.1] mb-6">
            Education isn't just academics.<br />
            <span className="inline-block bg-[#0CB0D8] text-white px-4 py-1 rounded-2xl -rotate-1 mt-2 shadow-sm">It's about the whole child.</span>
          </h2>
          <p className="text-lg md:text-xl text-[#111827]/70 font-medium leading-relaxed max-w-2xl mx-auto">
            Research shows that children who develop social-emotional skills perform better academically, form healthier relationships, and become more resilient adults.
          </p>
        </motion.div>

        {/* 5 Sticky Note Cards */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch -space-y-6 md:space-y-0 md:-space-x-6 lg:-space-x-8 mt-12 px-4 pb-16">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -15, scale: 1.05, zIndex: 100 }}
              style={{ zIndex: pillar.zIndex }}
              className={`relative w-full md:w-[220px] lg:w-[260px] p-6 pt-12 md:pt-14 pb-10 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.15)] ${pillar.color} ${pillar.textColor} flex-shrink-0 transition-transform duration-300 ${pillar.rotation}`}
            >
              
              {/* Decorative Image Pin on top edge */}
              <div className={`absolute -top-10 ${pillar.pinPosition} w-20 h-20 md:-top-12 md:w-24 md:h-24 z-10 drop-shadow-md`}>
                <Image src={pillar.pin} alt="Pin decoration" fill className="object-contain" />
              </div>

              <h3 className="font-headline font-bold text-2xl mb-4 tracking-tight leading-none">
                {pillar.title}
              </h3>
              
              {/* Divider Line */}
              <div className={`h-px w-full mb-4 ${pillar.textColor === 'text-white' ? 'bg-white/30' : 'bg-black/20'}`} />
              
              <p className={`text-sm lg:text-base font-medium leading-relaxed ${pillar.textColor === 'text-white' ? 'text-white/90' : 'text-black/80'}`}>
                {pillar.description}
              </p>
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
