"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white overflow-x-clip pt-44 md:pt-36 flex flex-col items-center font-sans z-40">
      
      {/* Subtle Background Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      />

      <div className="w-full max-w-[900px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        


        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative w-full max-w-3xl mb-5"
        >
          {/* Decorative Doodles matching screenshot */}
          <div className="absolute -left-8 md:-left-0 top-0 md:-top-2 w-14 h-14 opacity-90">
            <Image src="/star.jpeg" alt="Star decoration" fill className="object-contain mix-blend-multiply grayscale contrast-[1.2]" />
          </div>
          <div className="absolute -right-2 md:-right-6 top-10 md:top-14 w-24 h-24 opacity-90">
            <Image src="/arrow.jpeg" alt="Arrow decoration" fill className="object-contain mix-blend-multiply grayscale contrast-[1.2]" />
          </div>

          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[#111827] tracking-tight">
            Where Talent Finds <span className="inline-block bg-[#45bcf6] text-white px-4 py-1 rounded-2xl -rotate-1 shadow-sm">Opportunity</span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-xl text-sm md:text-base mb-8 leading-relaxed font-medium"
        >
          We help students discover meaningful opportunities through creativity, learning, and real-world experiences that build confidence.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-8 md:mb-12 z-20 relative"
        >
          <Link href="/products" className="w-full sm:w-auto bg-[#111827] text-white font-semibold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-md">
            SEL for Children <Zap size={16} fill="currentColor" />
          </Link>
          <Link href="/services" className="w-full sm:w-auto bg-white text-[#111827] font-semibold text-sm px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
            SEL for Parents
          </Link>
        </motion.div>

      </div>

      {/* Bottom Cards Area (Overlapping vertically) */}
      <motion.div 
        initial={{ opacity: 0, y: 150 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1, type: "spring", stiffness: 60 }}
        className="relative w-full h-[280px] md:h-[400px] lg:h-[500px] max-w-5xl mx-auto flex justify-center items-end px-4 md:px-0 mt-2 md:mt-12 z-40"
      >
        {/* Card 1 (Left) */}
        <div className="absolute left-[5%] md:left-[8%] bottom-0 w-[35%] md:w-[32%] h-[65%] md:h-[80%] bg-[#45bcf6] rounded-t-[1.8rem] md:rounded-t-[3.5rem] z-10 flex flex-col items-center justify-end pb-0 shadow-lg origin-bottom -rotate-6 md:-rotate-[8deg] transition-transform duration-500 hover:-rotate-3 overflow-visible group">
          <motion.div 
            whileHover={{ y: -30, scale: 1.15, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative w-[155%] md:w-[145%] aspect-square opacity-90 mb-[-10%] md:mb-[-8%]"
          >
             <Image src="/hero2.png" alt="" fill className="object-contain mix-blend-multiply" />
          </motion.div>
        </div>

        {/* Card 3 (Right) */}
        <div className="absolute right-[5%] md:right-[8%] bottom-0 w-[35%] md:w-[32%] h-[70%] md:h-[85%] bg-[#ff7f68] rounded-t-[1.8rem] md:rounded-t-[3.5rem] z-10 flex flex-col items-center justify-end pb-0 shadow-lg origin-bottom rotate-6 md:rotate-[8deg] transition-transform duration-500 hover:rotate-3 overflow-visible group">
           <motion.div 
            whileHover={{ y: -30, scale: 1.15, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative w-[155%] md:w-[145%] aspect-square opacity-90 mb-[-10%] md:mb-[-8%]"
          >
             <Image src="/hero3.png" alt="" fill className="object-contain mix-blend-multiply" />
          </motion.div>
        </div>

        {/* Card 2 (Center) - overlaps the others */}
        <div className="absolute bottom-0 w-[42%] md:w-[38%] h-[90%] md:h-[100%] bg-[#ffa3c9] rounded-t-[1.8rem] md:rounded-t-[3.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 flex flex-col items-center justify-end pb-0 border border-black/5 hover:-translate-y-4 transition-all duration-500 overflow-visible group">
          <motion.div 
            whileHover={{ y: -40, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative w-[165%] md:w-[155%] aspect-square mb-[-10%] md:mb-[-8%]"
          >
             <Image src="/hero1.png" alt="" fill className="object-contain drop-shadow-lg" />
          </motion.div>
        </div>

        {/* Subtle Horizon Line / Floor */}
        <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[120%] h-[100px] bg-gradient-to-t from-gray-50/50 to-transparent rounded-[100%] blur-2xl z-10" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent z-10 opacity-50" />
      </motion.div>

      {/* Background SVG Wave - Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-50 pointer-events-none transform translate-y-[2px]">
        <svg 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] md:h-[120px] drop-shadow-[0_-10px_20px_rgba(0,0,0,0.06)] text-white"
        >
          <path 
            d="M0,160L80,176C160,192,320,224,480,213.3C640,203,800,149,960,128C1120,107,1280,117,1360,122.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" 
            fill="currentColor"
          />
        </svg>
      </div>

    </section>
  );
}
