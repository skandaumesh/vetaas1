"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MissionVisionSection() {
  return (
    <section className="pt-12 pb-10 lg:pt-16 lg:pb-12 bg-[#faf9f6] relative overflow-hidden font-sans">
      {/* Background Decor — Layered Premium */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-[#00CDBA]/6 blur-[100px] md:animate-pulse-slow pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#ff7a43]/6 blur-[120px] md:animate-pulse-slow pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[-5%] w-[380px] h-[380px] rounded-full bg-[#1E90FF]/4 blur-[110px] md:animate-pulse-slow pointer-events-none z-0" />

      {/* Morphing organic blobs */}
      <div className="absolute top-[5%] right-[10%] w-[260px] h-[260px] bg-gradient-to-br from-[#00CDBA]/7 to-[#1E90FF]/5 md:animate-morph pointer-events-none z-0 blur-[55px]" />
      <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-gradient-to-tr from-[#ff7a43]/6 to-[#FFC107]/5 md:animate-morph pointer-events-none z-0 blur-[65px]" style={{ animationDelay: '-4s' }} />
      <div className="absolute top-[45%] left-[45%] w-[200px] h-[200px] bg-gradient-to-br from-[#ffa3c9]/5 to-[#ff7a43]/4 md:animate-morph pointer-events-none z-0 blur-[45px]" style={{ animationDelay: '-8s' }} />

      {/* Drifting geometric rings */}
      <div className="absolute top-[10%] left-[15%] w-[110px] h-[110px] rounded-full border-2 border-[#00CDBA]/8 md:animate-drift pointer-events-none z-0" />
      <div className="absolute bottom-[12%] right-[12%] w-[85px] h-[85px] rounded-full border-2 border-[#ff7a43]/10 md:animate-drift-reverse pointer-events-none z-0" />
      <div className="absolute top-[55%] left-[3%] w-[65px] h-[65px] rounded-full border border-[#1E90FF]/8 md:animate-drift pointer-events-none z-0" style={{ animationDelay: '-10s' }} />
      {/* Orbiting dots */}
      <div className="absolute top-[20%] right-[25%] w-[10px] h-[10px] rounded-full bg-[#00CDBA]/12 md:animate-orbit pointer-events-none z-0" />
      <div className="absolute bottom-[25%] left-[30%] w-[8px] h-[8px] rounded-full bg-[#ff7a43]/15 md:animate-orbit pointer-events-none z-0" style={{ animationDelay: '-15s' }} />

      {/* Layered SVG journey lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="none" fill="none" className="w-full h-full">
          {/* Primary teal curve */}
          <path
            d="M-50,150 C400,200 600,50 1000,300 C1200,420 1300,550 1490,500"
            stroke="#00CDBA"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.07"
          />
          {/* Secondary orange curve */}
          <path
            d="M-50,280 C350,100 650,350 1050,150 C1250,70 1400,300 1550,250"
            stroke="#ff7a43"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.05"
          />
          {/* Dashed blue accent */}
          <path
            d="M-50,500 C250,400 500,600 800,450 C1100,320 1350,520 1500,470"
            stroke="#1E90FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="12 8"
            opacity="0.05"
          />
          {/* Decorative circles */}
          <circle cx="220" cy="180" r="55" stroke="#00CDBA" strokeWidth="1" opacity="0.04" />
          <circle cx="1150" cy="600" r="70" stroke="#ff7a43" strokeWidth="1" opacity="0.04" />
          <circle cx="650" cy="90" r="30" stroke="#1E90FF" strokeWidth="1.5" opacity="0.05" />
        </svg>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center"
        >
          <div className="inline-flex items-center justify-center bg-[#0f172a] text-white px-5 py-1.5 rounded-lg mb-6 shadow-sm -rotate-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Purpose</span>
          </div>
          <h2 className="font-headline text-5xl md:text-6xl lg:text-7xl text-[#111827] tracking-tight leading-[1.05]">
            Driven by <span className="inline-block bg-[#ffa3c9] text-white px-6 py-1 rounded-[1.5rem] rotate-2 mt-2 shadow-sm font-bold">Purpose</span>
          </h2>
        </motion.div>

        {/* 2-Column Grid Layout with White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 items-stretch">

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_15px_45px_rgba(0,0,0,0.05)] p-8 flex flex-col justify-between -rotate-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.09)] transition-all duration-500 hover:rotate-0 hover:border-[#00CDBA]/40"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-gray-50 mb-6 border border-gray-100">
                <Image
                  src="/about1.jpeg"
                  alt="Mission – children playing together"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-[center_30%]"
                />
              </div>

              {/* Title Badge */}
              <div className="mb-4">
                <span className="inline-block bg-[#00CDBA] text-white text-base font-bold px-4 py-1.5 rounded-xl -rotate-2 shadow-sm">
                  Our Mission
                </span>
              </div>

              {/* Text */}
              <p className="text-gray-600 text-base md:text-lg font-medium leading-relaxed mb-6">
                To transform the early years by embedding social and emotional learning into the everyday experiences of children, parents, and educators.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_15px_45px_rgba(0,0,0,0.05)] p-8 flex flex-col justify-between rotate-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.09)] transition-all duration-500 hover:rotate-0 hover:border-[#1E90FF]/40"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-gray-50 mb-6 border border-gray-100">
                <Image
                  src="/about2.jpeg"
                  alt="Vision – diverse children's faces"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Title Badge */}
              <div className="mb-4">
                <span className="inline-block bg-[#1E90FF] text-white text-base font-bold px-4 py-1.5 rounded-xl rotate-2 shadow-sm">
                  Our Vision
                </span>
              </div>

              {/* Text */}
              <p className="text-gray-600 text-base md:text-lg font-medium leading-relaxed mb-6">
                To nurture a world where children, parents, and educators grow together with emotional awareness, meaningful relationships, creativity, and joy.
              </p>
            </div>
          </motion.div>

        </div>



      </div>
    </section>
  );
}
