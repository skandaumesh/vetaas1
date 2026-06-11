"use client";

import { motion } from "framer-motion";

export default function TeachersHero() {
  return (
    <div className="w-full relative z-10 flex flex-col items-center text-center mt-12 md:mt-20 mb-20">

      {/* Modern minimal pill badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-[#c8bdf5]/30 text-[#6D28D9] border border-[#c8bdf5]/50 px-5 py-2 rounded-full text-xs font-extrabold tracking-wider uppercase mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
        <span>Supporting Educators</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-headline text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] text-[#1a2d4c] tracking-tight mb-8 relative z-10"
      >
        SEL For <span className="inline-block bg-[#c8bdf5] text-[#111827] px-6 py-2 rounded-[2rem] -rotate-2 shadow-sm ml-2 font-bold">Teachers</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-base md:text-lg text-[#1a2d4c]/75 font-semibold leading-relaxed max-w-3xl mx-auto mb-4 relative z-10"
      >
        At Vetaas, we believe that every meaningful learning experience begins with a teacher who feels supported, valued, and empowered. We help educators develop the knowledge, skills, and self-awareness needed to foster children's social and emotional growth.
      </motion.p>
      
      {/* Subtle Divider Line */}
      <motion.div 
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "80px" }}
        transition={{ delay: 0.3 }}
        className="h-1 bg-[#c8bdf5]/80 rounded-full mt-8"
      />
    </div>
  );
}
