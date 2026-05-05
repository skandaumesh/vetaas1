"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesPage() {
  return (
    <main className="bg-white min-h-screen relative overflow-hidden font-sans pb-32">
      
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

      {/* Decorative sun right side */}
      <div className="absolute top-[-50px] right-[-150px] md:top-[50px] md:right-[-50px] w-[250px] h-[250px] md:w-[320px] md:h-[320px] z-0 pointer-events-none opacity-50">
         <Image src="/sun.jpg" alt="" fill className="object-contain mix-blend-multiply" />
      </div>
      
      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 pt-24 md:pt-32">
        
        {/* Intro Section (Hero Style) */}
        <div className="flex flex-col items-center text-center mt-12 md:mt-20 mb-24 relative">
          
          {/* Decorative Doodles matching homepage hero */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute left-[5%] md:left-[20%] top-0 md:-top-5 w-12 h-12 hidden md:block"
          >
            <Image src="/star.jpeg" alt="Star decoration" fill className="object-contain mix-blend-multiply grayscale contrast-[1.2]" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute right-[5%] md:right-[15%] top-20 md:top-10 w-20 h-20 hidden md:block"
          >
            <Image src="/arrow.jpeg" alt="Arrow decoration" fill className="object-contain mix-blend-multiply grayscale contrast-[1.2]" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-headline text-5xl md:text-6xl lg:text-[5rem] leading-[1.05] text-[#111827] tracking-tight mb-8 relative z-10"
          >
            SEL For <span className="inline-block bg-[#ffa3c9] text-white px-6 py-2 rounded-[2rem] -rotate-2 shadow-sm ml-2">Parents</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#111827]/75 font-medium leading-relaxed max-w-4xl mx-auto mb-16 relative z-10"
          >
            The services offered by Vetaas are thoughtfully crafted with the notion that parents are central to the child's development. Vetaas seeks to build a bridge between research and practice and create awareness among parents about best theories and practices available for their children.
          </motion.p>

          {/* Hero Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative w-full max-w-[600px] aspect-[16/10] md:aspect-[16/9] flex justify-center items-center z-20"
          >
            {/* Playful background shapes */}
            <div className="absolute inset-0 bg-[#fef6fb] rounded-[2.5rem] -rotate-2 z-0 shadow-sm border border-black/5"></div>
            <div className="absolute inset-0 bg-[#0CB0D8]/5 rounded-[2.5rem] rotate-1 z-0 border border-black/5"></div>
            
            {/* The child illustration */}
            <div className="relative w-[280px] md:w-[400px] h-full z-10">
              <Image src="/child.png" alt="SEL For Parents" fill className="object-contain drop-shadow-xl" priority />
            </div>
          </motion.div>
        </div>

        {/* Offerings Section */}
        <div className="relative mt-32 mb-20">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-center text-[#111827] mb-20">
            Our Offerings
          </h2>

          {/* Floating Tags (Above Card 3) */}
          <div className="hidden lg:block absolute top-12 right-[5%] z-20 pointer-events-none">
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -left-20 bg-[#ffe873] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm rotate-[-10deg]"
            >
              <span className="text-xl">✨</span>
            </motion.div>
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-4 -left-12 bg-[#2bdc8b] text-white font-bold px-4 py-2 rounded-full shadow-sm rotate-[-5deg]"
            >
              #Community
            </motion.div>
            <motion.div 
              animate={{ y: [0, -8, 0] }} 
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-12 right-0 bg-[#d8cbf9] text-black font-bold px-4 py-2 rounded-full shadow-sm rotate-[5deg]"
            >
              #SelfCare
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-4 bg-[#ffb3e6] w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
            >
              <span className="text-black text-xs">♥</span>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-end">
            
            {/* Card 1: Workshops */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-[#38d38b] rounded-[2.5rem] p-8 relative overflow-hidden h-[450px] flex flex-col justify-between shadow-sm cursor-pointer group"
            >
              {/* Abstract Yellow Blob */}
              <svg className="absolute -bottom-10 -left-10 w-64 h-64 text-[#fce270] transition-transform duration-500 group-hover:scale-110" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M45.7,-76.3C58.9,-69.3,69,-55.3,77.3,-40.7C85.6,-26.1,92,-11.1,90.3,3.3C88.6,17.6,78.8,31.3,68.2,43.3C57.6,55.3,46.1,65.6,32.7,73.5C19.3,81.3,4,86.7,-10.8,85.2C-25.6,83.7,-39.9,75.4,-53.4,66C-66.9,56.6,-79.6,46.2,-85.9,32.6C-92.2,19,-92.1,2.2,-87.3,-12.6C-82.5,-27.4,-73.1,-40.1,-61,-50.2C-48.9,-60.2,-34.1,-67.5,-20,-73.4C-5.9,-79.3,7.5,-83.8,22,-82.4C36.5,-81,51,-73.8,45.7,-76.3Z" transform="translate(100 100) scale(1.1)" />
              </svg>

              <div className="relative z-10 flex justify-between items-start">
                <span className="border border-black px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                  Ages 2-8
                </span>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <ArrowRight size={20} className="-rotate-45" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-[2.75rem] leading-none text-black mb-4">
                  <span className="font-bold block tracking-tight">Interactive</span>
                  <span className="font-serif italic text-[2.5rem]">Workshops</span>
                </h3>
                <p className="text-black/80 font-medium text-sm md:text-base leading-snug max-w-[90%]">
                  Experience rich, fun-filled sessions on relevant topics. Themes include Social Emotional Learning, Pre-literacy, and Parents Matter.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Events MCME */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-[#c8bdf5] rounded-[2.5rem] p-8 relative overflow-hidden h-[500px] flex flex-col shadow-sm cursor-pointer group"
            >
              {/* Abstract Light Green Line */}
              <svg className="absolute -top-10 -right-10 w-64 h-64 text-[#d4fca4] transition-transform duration-500 group-hover:rotate-12" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" d="M30,150 C50,50 150,50 170,150 C180,200 250,150 250,50" transform="rotate(-30 100 100) scale(0.8)"/>
              </svg>

              <div className="relative z-10">
                <span className="border border-black px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                  All Ages
                </span>
              </div>

              <div className="relative z-10 flex-grow flex flex-col justify-center items-center py-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-[6px] border-[#c8bdf5] shadow-[0_0_0_2px_white] relative group-hover:scale-105 transition-transform">
                  <Image src="/child.png" alt="MCME Event" fill className="object-cover bg-white" />
                </div>
              </div>

              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <h3 className="text-[2.75rem] leading-none text-black mb-3">
                    <span className="font-bold block tracking-tight">Events</span>
                    <span className="font-serif italic text-[2.5rem]">MCME</span>
                  </h3>
                  <p className="text-black/80 font-medium text-sm md:text-base leading-snug">
                    Strengthen your bond with fun games, music, dance, and creative art projects.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors ml-4 mb-2">
                  <ArrowRight size={20} className="-rotate-45" />
                </div>
              </div>
            </motion.div>

            {/* Card 3: Wellness Circles */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-[#d4fca4] rounded-[2.5rem] p-8 relative overflow-hidden h-[420px] flex flex-col justify-between shadow-sm cursor-pointer group"
            >
              {/* Abstract Purple Asterisk */}
              <div className="absolute -bottom-16 -left-12 text-[#c8bdf5] transition-transform duration-500 group-hover:rotate-45">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 20C105.523 20 110 24.4772 110 30V85H165C170.523 85 175 89.4772 175 95C175 100.523 170.523 105 165 105H110V160C110 165.523 105.523 170 100 170C94.4772 170 90 165.523 90 160V105H35C29.4772 105 25 100.523 25 95C25 89.4772 29.4772 85 35 85H90V30C90 24.4772 94.4772 20 100 20Z" />
                  <path d="M43.4315 43.4315C47.3367 39.5262 53.6684 39.5262 57.5736 43.4315L96.462 82.3198L135.35 43.4315C139.256 39.5262 145.587 39.5262 149.492 43.4315C153.398 47.3367 153.398 53.6684 149.492 57.5736L110.604 96.462L149.492 135.35C153.398 139.256 153.398 145.587 149.492 149.492C145.587 153.398 139.256 153.398 135.35 149.492L96.462 110.604L57.5736 149.492C53.6684 153.398 47.3367 153.398 43.4315 149.492C39.5262 145.587 39.5262 139.256 43.4315 135.35L82.3198 96.462L43.4315 57.5736C39.5262 53.6684 39.5262 47.3367 43.4315 43.4315Z" />
                </svg>
              </div>

              <div className="relative z-10">
                <span className="border border-black px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                  For Parents
                </span>
              </div>

              <div className="relative z-10 flex justify-between items-end mt-12">
                <div>
                  <h3 className="text-[2.75rem] leading-none text-black mb-3">
                    <span className="font-bold block tracking-tight">Wellness</span>
                    <span className="font-serif italic text-[2.5rem]">Circles</span>
                  </h3>
                  <p className="text-black/80 font-medium text-sm md:text-base leading-snug">
                    Prioritize your well-being. Engage in self-care, mindfulness, and community building.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors ml-4 mb-2">
                  <ArrowRight size={20} className="-rotate-45" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
        
        {/* Infographic Image */}
        <div className="mt-24 w-full max-w-[600px] mx-auto relative aspect-square">
          <Image src="/infographic.png" alt="SEL For Parents Infographic" fill className="object-contain" />
        </div>

      </div>
    </main>
  );
}
