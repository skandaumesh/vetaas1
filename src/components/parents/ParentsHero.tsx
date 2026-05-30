"use client";

import { motion } from "framer-motion";

export default function ParentsHero() {
  return (
    <div className="w-full relative z-10 flex flex-col items-center text-center mt-12 md:mt-20 mb-20">

      {/* Modern minimal pill badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-[#ffa3c9]/15 text-[#e0537d] border border-[#ffa3c9]/30 px-5 py-2 rounded-full text-xs font-extrabold tracking-wider uppercase mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-[#ffa3c9] animate-pulse" />
        <span>Empowering Families</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-headline text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] text-[#1a2d4c] tracking-tight mb-8 relative z-10"
      >
        SEL For <span className="inline-block bg-[#ffa3c9] text-white px-6 py-2 rounded-[2rem] -rotate-2 shadow-sm ml-2 font-bold">Parents</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-base md:text-lg text-[#1a2d4c]/75 font-semibold leading-relaxed max-w-3xl mx-auto mb-4 relative z-10"
      >
        At Vetaas, we empower parents with the knowledge and tools they need to nurture their child&apos;s emotional and social growth. By bridging the gap between cutting-edge research and daily parenting practices, we aim to transform complex theories into actionable strategies.
      </motion.p>
      
      {/* Subtle Divider Line */}
      <motion.div 
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "80px" }}
        transition={{ delay: 0.3 }}
        className="h-1 bg-[#ffa3c9]/50 rounded-full mt-8"
      />
    </div>
  );
}
