"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Sparkles, Sprout, Palette, Star, Smile, ArrowRight } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative w-full bg-white overflow-hidden pt-36 pb-20 md:pb-28 flex flex-col items-center font-sans z-40">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60" style={{
        backgroundSize: '40px 40px',
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
      }} />

      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-[#fef9f0]/40 via-transparent to-transparent z-0 pointer-events-none" />

      {/* Decorative Floating SVGs */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[5%] top-[20%] text-[#ffd166] opacity-75"
        >
          <Star size={36} fill="currentColor" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-[18%] text-[#ff7a43] opacity-65"
        >
          <Heart size={32} fill="currentColor" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[3%] bottom-[20%] text-[#36ba98] opacity-75"
        >
          <Palette size={36} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[5%] bottom-[20%] text-[#4285F4] opacity-80"
        >
          <Smile size={36} />
        </motion.div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Column: Text content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-7/12 max-w-2xl lg:max-w-none">
          
          {/* Top Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.05 }} 
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-[#f8fafc] border border-gray-200 text-[#1e293b] text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm">
              <Sprout size={14} className="text-[#36ba98]" />
              Holistic Early Childhood Education
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="w-full mb-6"
          >
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl leading-[1.15] text-[#111827] tracking-tight">
              Nurturing <span className="inline-block bg-[#36ba98] text-white px-5 py-1 rounded-2xl -rotate-1 shadow-sm mx-1.5 font-bold font-sans">Hope</span> And Life
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }} 
            className="text-gray-500 text-sm md:text-base mb-8 leading-relaxed font-medium max-w-xl"
          >
            At Vetaas (the Tree of Hope), we believe in reimagining early childhood learning. By integrating social-emotional learning into early education, we nurture empathy, resilience, and lifelong growth to build a supportive ecosystem for every child.
          </motion.p>

          {/* Action button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <a 
              href="#formula-section"
              className="inline-flex items-center gap-2 bg-[#36ba98] hover:bg-[#2da182] text-white font-semibold text-sm px-8 py-4 rounded-full hover:scale-105 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Explore Our Story <ArrowRight size={16} />
            </a>
          </motion.div>

        </div>

        {/* Right Column: Custom illustration of the Tree of Hope */}
        <div className="flex items-center justify-center lg:w-5/12 w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative w-full max-w-[400px] lg:max-w-[450px] aspect-square flex items-center justify-center"
          >
            {/* Background glowing gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#36ba98]/10 via-[#eff6ff]/10 to-[#ff7a43]/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Floating illustration container */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full p-4 flex items-center justify-center"
            >
              <Image
                src="/about_hero_tree.png"
                alt="Vetaas - The Tree of Hope Illustration"
                width={420}
                height={420}
                className="object-contain drop-shadow-[0_12px_24px_rgba(54,186,152,0.12)]"
                priority
              />
            </motion.div>
          </motion.div>
        </div>

      </div>

    </section>
  );
}
