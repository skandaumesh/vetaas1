"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden font-[family-name:var(--font-poppins)] bg-gradient-to-b from-[#f0f6fa] to-white">
      {/* Background Decor — Layered Premium */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-[#1a4895]/4 blur-[100px] animate-pulse-slow pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[450px] h-[450px] rounded-full bg-[#ff6e79]/4 blur-[100px] animate-pulse-slow pointer-events-none z-0" />
      <div className="absolute top-[-5%] right-[10%] w-[350px] h-[350px] rounded-full bg-[#36ba98]/3 blur-[110px] animate-pulse-slow pointer-events-none z-0" />

      {/* Morphing organic blobs */}
      <div className="absolute top-[8%] left-[10%] w-[250px] h-[250px] bg-gradient-to-br from-[#1a4895]/6 to-[#4285F4]/5 animate-morph pointer-events-none z-0 blur-[55px]" />
      <div className="absolute bottom-[5%] right-[8%] w-[280px] h-[280px] bg-gradient-to-tr from-[#ff6e79]/6 to-[#ffd166]/5 animate-morph pointer-events-none z-0 blur-[60px]" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-[50%] left-[40%] w-[220px] h-[220px] bg-gradient-to-br from-[#36ba98]/5 to-[#ffd166]/4 animate-morph pointer-events-none z-0 blur-[50px]" style={{ animationDelay: '-7s' }} />

      {/* Drifting geometric rings */}
      <div className="absolute top-[12%] right-[18%] w-[100px] h-[100px] rounded-full border-2 border-[#1a4895]/8 animate-drift pointer-events-none z-0" />
      <div className="absolute bottom-[15%] left-[12%] w-[80px] h-[80px] rounded-full border-2 border-[#ff6e79]/8 animate-drift-reverse pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[5%] w-[60px] h-[60px] rounded-full border border-[#36ba98]/10 animate-drift pointer-events-none z-0" style={{ animationDelay: '-12s' }} />
      {/* Orbiting dots */}
      <div className="absolute top-[25%] right-[30%] w-[10px] h-[10px] rounded-full bg-[#1a4895]/12 animate-orbit pointer-events-none z-0" />
      <div className="absolute bottom-[35%] left-[20%] w-[7px] h-[7px] rounded-full bg-[#ff6e79]/15 animate-orbit pointer-events-none z-0" style={{ animationDelay: '-18s' }} />

      {/* Layered SVG journey lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 700" preserveAspectRatio="none" fill="none" className="w-full h-full">
          {/* Primary blue curve */}
          <path 
            d="M-50,200 C300,400 600,100 1000,350 C1200,480 1350,200 1500,280" 
            stroke="#1a4895" 
            strokeWidth="3" 
            strokeLinecap="round" 
            opacity="0.06"
          />
          {/* Secondary coral curve */}
          <path 
            d="M-50,350 C250,150 550,450 950,200 C1150,100 1350,350 1500,300" 
            stroke="#ff6e79" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.05"
          />
          {/* Dashed teal accent */}
          <path 
            d="M-50,500 C200,350 500,550 800,380 C1100,250 1300,480 1500,420" 
            stroke="#36ba98" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeDasharray="10 7"
            opacity="0.05"
          />
          {/* Decorative circles */}
          <circle cx="180" cy="150" r="55" stroke="#1a4895" strokeWidth="1" opacity="0.04" />
          <circle cx="1250" cy="500" r="70" stroke="#ff6e79" strokeWidth="1" opacity="0.04" />
          <circle cx="750" cy="80" r="30" stroke="#36ba98" strokeWidth="1.5" opacity="0.05" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col items-center justify-center text-center"
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block py-1.5 px-6 rounded-full bg-white border border-gray-200/80 text-gray-800 font-bold text-xs tracking-widest uppercase mb-4 shadow-sm">
              JOIN THE COMMUNITY
            </span>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-[#111827] leading-[1.2] mb-4">
              It takes a village to <br className="hidden md:block"/> raise a child.
            </h2>
          </div>
          
          <div className="relative w-full max-w-[1250px] mx-auto mt-4 mb-8 aspect-[1464/497] scale-105 sm:scale-110">
            <Image 
              src="/cta.png" 
              alt="Call to Action Illustration" 
              fill 
              className="object-contain object-top" 
              priority
            />
          </div>

          <div className="z-20">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 bg-[#0B1523] text-white font-bold text-sm sm:text-base rounded-full hover:bg-gray-800 hover:scale-105 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Join the tribe
              <ArrowRight size={18} strokeWidth={2} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

