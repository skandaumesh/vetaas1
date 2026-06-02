"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function ServicesPage() {
  return (
    <main className="bg-white min-h-screen relative overflow-hidden font-sans pb-32 pt-[calc(var(--header-height)+2rem)]">
      {/* Background Decor — Premium Gradients */}
      <div className="absolute top-[10%] left-[-15%] w-[500px] h-[500px] rounded-full bg-[#7C3AED]/3 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-[#FF5C7A]/3 blur-[120px] pointer-events-none z-0" />
      
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
              WHAT WE DO
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-headline text-[#111827] tracking-tight mb-6"
          >
            Our <span className="inline-block bg-[#7C3AED] text-white px-5 py-1 rounded-2xl rotate-1 shadow-sm font-semibold">Services.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-500 font-medium text-base md:text-lg leading-relaxed"
          >
            Explore the customized social-emotional learning (SEL) programs and engagements we facilitate for children, teachers, and parents.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-32">
          
          {/* Card 1: SEL for Children */}
          <Link href="/events" className="flex group/card w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-[#38d38b] rounded-[2.5rem] p-8 relative overflow-hidden min-h-[520px] flex flex-col justify-between shadow-sm cursor-pointer w-full"
            >
              {/* Abstract Yellow Blob */}
              <svg className="absolute -bottom-10 -left-10 w-64 h-64 text-[#fce270] transition-transform duration-500 group-hover/card:scale-110" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M45.7,-76.3C58.9,-69.3,69,-55.3,77.3,-40.7C85.6,-26.1,92,-11.1,90.3,3.3C88.6,17.6,78.8,31.3,68.2,43.3C57.6,55.3,46.1,65.6,32.7,73.5C19.3,81.3,4,86.7,-10.8,85.2C-25.6,83.7,-39.9,75.4,-53.4,66C-66.9,56.6,-79.6,46.2,-85.9,32.6C-92.2,19,-92.1,2.2,-87.3,-12.6C-82.5,-27.4,-73.1,-40.1,-61,-50.2C-48.9,-60.2,-34.1,-67.5,-20,-73.4C-5.9,-79.3,7.5,-83.8,22,-82.4C36.5,-81,51,-73.8,45.7,-76.3Z" transform="translate(100 100) scale(1.1)" />
              </svg>

              <div className="relative z-10 flex justify-between items-start mb-8">
                <span className="border border-black px-3 py-1 rounded-full text-xs font-bold tracking-wide text-black bg-white/20">
                  For Children
                </span>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover/card:bg-black group-hover/card:text-white transition-colors text-black bg-white/10">
                  <ArrowRight size={20} className="-rotate-45" />
                </div>
              </div>

              <div className="relative z-10 text-left mt-auto flex-grow flex flex-col justify-end">
                <h3 className="text-[2.75rem] leading-none text-black mb-4">
                  <span className="font-bold block tracking-tight">SEL for</span>
                  <span className="font-serif italic text-[2.5rem]">Children</span>
                </h3>
                <p className="text-black/85 font-medium text-sm md:text-base leading-snug mb-6 max-w-[95%]">
                  Creating an ecosystem to support children in developing social and emotional skills.
                </p>

                {/* Bullet Points */}
                <ul className="space-y-3 mb-8 relative z-10">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-black shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-black/90 leading-snug">Play-based, reflective, and experiential learning activities.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-black shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-black/90 leading-snug">Building safe spaces where children can express and grow</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-black shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-black/90 leading-snug">Integrate SEL in curriculum and school culture</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-black group-hover/card:underline">
                    View children's events
                  </span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Card 2: SEL for Teachers */}
          <Link href="/contact" className="flex group/card w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-[#c8bdf5] rounded-[2.5rem] p-8 relative overflow-hidden min-h-[520px] flex flex-col justify-between shadow-sm cursor-pointer w-full"
            >
              {/* Abstract Light Green Line */}
              <svg className="absolute -top-10 -right-10 w-64 h-64 text-[#d4fca4] transition-transform duration-500 group-hover/card:rotate-12" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" d="M30,150 C50,50 150,50 170,150 C180,200 250,150 250,50" transform="rotate(-30 100 100) scale(0.8)"/>
              </svg>

              <div className="relative z-10 flex justify-between items-start mb-8">
                <span className="border border-black px-3 py-1 rounded-full text-xs font-bold tracking-wide text-black bg-white/20">
                  For Teachers
                </span>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover/card:bg-black group-hover/card:text-white transition-colors text-black bg-white/10">
                  <ArrowRight size={20} className="-rotate-45" />
                </div>
              </div>

              <div className="relative z-10 text-left mt-auto flex-grow flex flex-col justify-end">
                <h3 className="text-[2.75rem] leading-none text-black mb-4">
                  <span className="font-bold block tracking-tight">SEL for</span>
                  <span className="font-serif italic text-[2.5rem]">Teachers</span>
                </h3>
                <p className="text-black/85 font-medium text-sm md:text-base leading-snug mb-6 max-w-[95%]">
                  We support teachers learn about SEL, integrate SEL into their teaching, and creating a SEL-supportive environment.
                </p>

                {/* Bullet Points */}
                <ul className="space-y-3 mb-8 relative z-10">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-black shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-black/90 leading-snug">Helping teachers manage stress, emotions, and burnout.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-black shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-black/90 leading-snug">Making social-emotional learning part of daily teaching practices.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-black shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-black/90 leading-snug">Providing continuous guidance, reflection, and classroom support.</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-black group-hover/card:underline">
                    Learn more & partner
                  </span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Card 3: SEL for Parents */}
          <Link href="/parents" className="flex group/card w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-[#d4fca4] rounded-[2.5rem] p-8 relative overflow-hidden min-h-[520px] flex flex-col justify-between shadow-sm cursor-pointer w-full"
            >
              {/* Abstract Purple Asterisk */}
              <div className="absolute -bottom-16 -left-12 text-[#c8bdf5] transition-transform duration-500 group-hover/card:rotate-45">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 20C105.523 20 110 24.4772 110 30V85H165C170.523 85 175 89.4772 175 95C175 100.523 170.523 105 165 105H110V160C110 165.523 105.523 170 100 170C94.4772 170 90 165.523 90 160V105H35C29.4772 105 25 100.523 25 95C25 89.4772 29.4772 85 35 85H90V30C90 24.4772 94.4772 20 100 20Z" />
                  <path d="M43.4315 43.4315C47.3367 39.5262 53.6684 39.5262 57.5736 43.4315L96.462 82.3198L135.35 43.4315C139.256 39.5262 145.587 39.5262 149.492 43.4315C153.398 47.3367 153.398 53.6684 149.492 57.5736L110.604 96.462L149.492 135.35C153.398 139.256 153.398 145.587 149.492 149.492C145.587 153.398 139.256 153.398 135.35 149.492L96.462 110.604L57.5736 149.492C53.6684 153.398 47.3367 153.398 43.4315 149.492C39.5262 145.587 39.5262 139.256 43.4315 135.35L82.3198 96.462L43.4315 57.5736C39.5262 53.6684 39.5262 47.3367 43.4315 43.4315Z" />
                </svg>
              </div>

              <div className="relative z-10 flex justify-between items-start mb-8">
                <span className="border border-black px-3 py-1 rounded-full text-xs font-bold tracking-wide text-black bg-white/20">
                  For Parents
                </span>
                <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center group-hover/card:bg-black group-hover/card:text-white transition-colors text-black bg-white/10">
                  <ArrowRight size={20} className="-rotate-45" />
                </div>
              </div>

              <div className="relative z-10 text-left mt-auto flex-grow flex flex-col justify-end">
                <h3 className="text-[2.75rem] leading-none text-black mb-4">
                  <span className="font-bold block tracking-tight">SEL for</span>
                  <span className="font-serif italic text-[2.5rem]">Parents</span>
                </h3>
                <p className="text-black/85 font-medium text-sm md:text-base leading-snug mb-6 max-w-[95%]">
                  Bridging the gap between home environments and positive development through interactive, action-oriented workshops.
                </p>

                {/* Bullet Points */}
                <ul className="space-y-3 mb-8 relative z-10">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-black shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-black/90 leading-snug">Creating conversations and safe spaces.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-black shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-black/90 leading-snug">Meaningful parent & child engagements.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-black shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-semibold text-black/90 leading-snug">Exposure to SEL and early childhood theories.</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-black group-hover/card:underline">
                    Explore parent resources
                  </span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.div>
          </Link>

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
            <h3 className="text-3xl md:text-4xl font-headline text-gray-900 mb-4 tracking-tight">
              Interested in our <span className="inline-block bg-[#ffa3c9] text-white px-5 py-1 rounded-[1.5rem] shadow-sm font-bold -rotate-2">services?</span>
            </h3>
            <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
              We customize workshops, events, and capacity-building programs for schools, communities, and parents.
            </p>
          </div>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#7C3AED] text-white font-bold text-sm rounded-full hover:bg-[#6D28D9] hover:scale-105 transition-all shadow-md"
          >
            Get in touch
            <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
