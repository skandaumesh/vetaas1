"use client";
 
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Zap, Star, Heart, Sparkles } from "lucide-react";
 
export default function HeroSection() {
  return (
    <section 
      className="relative w-full min-h-screen flex flex-col md:flex-row bg-[#faf9f6] overflow-hidden z-30 pt-[var(--header-height)]"
    >
      {/* Global SVG Definitions for Clip Paths */}
      <svg width="0" height="0" className="absolute" style={{ pointerEvents: 'none' }}>
        <defs>
          <clipPath id="divider-left-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 0.25,0 C 0.55,0.12 0,0.24 0.6,0.4 C 1.0,0.52 -0.05,0.7 0.35,1.0 L 0,1.0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Left Column: Content Pane (Uses Left side of finalhero.png for exact background decor & doodles) */}
      <div 
        className="w-full md:w-[55%] flex flex-col justify-center px-6 sm:px-12 md:pl-20 md:pr-8 lg:pl-28 lg:pr-12 xl:pl-36 xl:pr-16 pt-16 pb-16 md:py-0 relative z-10"
        style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
      >
        {/* Cream background is styled on the parent section */}

        {/* --- Mockup Background Elements --- */}

        {/* Paper Airplane with Yellow Dashed Loop - Top Left */}
        <div className="absolute top-[2%] left-[2%] md:top-[6%] md:left-[4%] w-28 h-28 md:w-36 md:h-36 pointer-events-none -z-10">
          <svg viewBox="0 0 150 150" fill="none" className="w-full h-full">
            {/* Yellow Dashed Loop */}
            <path 
              d="M 15,110 C 10,80 60,70 50,50 C 40,30 15,45 30,65 C 45,85 85,55 105,40" 
              stroke="#ffd166" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeDasharray="6 6" 
            />
            {/* Paper Airplane (Blue outline) */}
            <g transform="translate(100, 25) rotate(-15)">
              <path 
                d="M 0,15 L 30,0 L 20,30 L 12,20 Z" 
                fill="none" 
                stroke="#1a4895" 
                strokeWidth="2.2" 
                strokeLinejoin="round" 
              />
              <path 
                d="M 30,0 L 12,20" 
                stroke="#1a4895" 
                strokeWidth="1.5" 
              />
            </g>
          </svg>
        </div>

        {/* Navy Blue Dot Grid (4x3) - Top Right */}
        <div className="absolute top-[4%] right-[5%] md:top-[8%] md:right-[10%] opacity-85 pointer-events-none -z-10 scale-75 md:scale-100">
          <svg width="48" height="36" viewBox="0 0 80 60" fill="#1a4895">
            <circle cx="10" cy="10" r="3.5" />
            <circle cx="30" cy="10" r="3.5" />
            <circle cx="50" cy="10" r="3.5" />
            <circle cx="70" cy="10" r="3.5" />
            <circle cx="10" cy="30" r="3.5" />
            <circle cx="30" cy="30" r="3.5" />
            <circle cx="50" cy="30" r="3.5" />
            <circle cx="70" cy="30" r="3.5" />
            <circle cx="10" cy="50" r="3.5" />
            <circle cx="30" cy="50" r="3.5" />
            <circle cx="50" cy="50" r="3.5" />
            <circle cx="70" cy="50" r="3.5" />
          </svg>
        </div>

        {/* Yellow Sun - Left Boundary */}
        <div className="hidden md:block absolute top-[60%] left-0 -translate-x-[50%] w-16 h-16 pointer-events-none -z-10">
          <svg viewBox="0 0 100 100" fill="#ffd166" className="w-full h-full">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>

        {/* Blue Zig-zag Line - Bottom Left */}
        <div className="hidden md:block absolute top-[72%] left-[6%] w-16 h-8 pointer-events-none -z-10">
          <svg viewBox="0 0 80 30" fill="none" stroke="#1a4895" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M 0,15 L 12,5 L 24,25 L 36,5 L 48,25 L 60,5 L 72,15" />
          </svg>
        </div>

        {/* Coral/Pink Dot Grid (3x3) - Bottom Left */}
        <div className="hidden md:block absolute bottom-[16%] left-[8%] opacity-85 pointer-events-none -z-10">
          <svg width="36" height="36" viewBox="0 0 60 60" fill="#ff6e79">
            <circle cx="10" cy="10" r="3.5" />
            <circle cx="30" cy="10" r="3.5" />
            <circle cx="50" cy="10" r="3.5" />
            <circle cx="10" cy="30" r="3.5" />
            <circle cx="30" cy="30" r="3.5" />
            <circle cx="50" cy="30" r="3.5" />
            <circle cx="10" cy="50" r="3.5" />
            <circle cx="30" cy="50" r="3.5" />
            <circle cx="50" cy="50" r="3.5" />
          </svg>
        </div>

        {/* Large Navy Blue Bottom Wave */}
        <div className="hidden md:block absolute bottom-0 left-0 w-full h-[90px] sm:h-[110px] md:h-[130px] pointer-events-none -z-10">
          <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="w-full h-full text-[#1a4895]">
            <path 
              d="M 0,90 C 80,110 160,115 220,105 C 300,90 400,60 480,70 C 520,75 560,95 600,90 L 600,120 L 0,120 Z" 
              fill="currentColor" 
            />
          </svg>
        </div>

        {/* --- Content Column --- */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start text-left relative z-10 max-w-xl md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto md:mx-0"
        >
          {/* Small tag badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-5"
          >
            <span className="inline-block py-1.5 px-5 rounded-full bg-white border border-[#1a4895]/10 text-[#1a4895] font-bold text-[10px] tracking-[0.2em] uppercase shadow-sm">
              Nurturing young minds
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.08] text-[#111827] tracking-tight mb-6">
            Nurturing <span className="text-[#36ba98]">Hope</span><br />And Life
          </h1>

          <p className="text-gray-600 text-sm sm:text-base md:text-sm lg:text-base xl:text-lg mb-8 leading-relaxed font-medium">
            We help students discover meaningful opportunities through creativity, learning, and real-world experiences that build confidence.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-20">
            <Link href="/teachers" className="w-full sm:w-auto bg-[#1a4895] text-white font-semibold text-sm px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#153a7a] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              SEL for Teachers <Zap size={16} fill="currentColor" />
            </Link>
            <Link href="/services" className="w-full sm:w-auto bg-white text-[#111827] font-semibold text-sm px-8 py-4 rounded-full border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center">
              SEL for Parents
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Image Pane with Dynamic Wavy Divider */}
      <div className="w-full md:w-[45%] h-[350px] sm:h-[450px] md:h-auto relative z-10 overflow-hidden">
        {/* Child Photo cropped from finalhero.png (Shifted to object-top to display face and drawing fully) */}
        <Image 
          src="/finalhero.png" 
          alt="Nurturing Hope and Life" 
          fill 
          className="object-cover object-[62%_0%] md:object-[62%_0%]" 
          priority
        />

        {/* Desktop Vertical Wavy Curve Mask (Sits on the left edge of Right pane) */}
        <div className="hidden md:block absolute top-0 left-0 h-full w-[120px] -translate-x-[1px] z-20 pointer-events-none">
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            className="w-full h-full text-[#faf9f6]"
          >
            {/* Cream masking path that shapes the left edge of the image */}
            <path
              d="M 0,0 L 40,0 C 70,120 15,240 75,400 C 115,520 10,700 50,1000 L 0,1000 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Blue Wave Continuation (Fixed 130px height at bottom, clipped to the left of the gold line) */}
        <div 
          className="hidden md:block absolute top-0 left-0 h-full w-[120px] -translate-x-[1px] z-30 pointer-events-none"
          style={{ clipPath: 'url(#divider-left-clip)' }}
        >
          <div className="absolute bottom-0 left-0 w-full h-[130px]">
            <svg viewBox="0 0 120 120" preserveAspectRatio="none" className="w-full h-full text-[#1a4895]">
              <path 
                d="M 0,90 C 20,85 70,105 120,120 L 120,120 L 0,120 Z" 
                fill="currentColor" 
              />
            </svg>
          </div>
        </div>

        {/* Gold Border Line Overlay */}
        <div className="hidden md:block absolute top-0 left-0 h-full w-[120px] -translate-x-[1px] z-22 pointer-events-none">
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M 25,0 C 55,120 0,240 60,400 C 100,520 -5,700 35,1000"
              fill="none"
              stroke="#ffd166"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Mobile Horizontal Wavy Curve Mask (Sits on the top edge of Right pane) */}
        <div className="block md:hidden absolute top-0 left-0 w-full h-[60px] -translate-y-[1px] z-20 pointer-events-none">
          <svg
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
            className="w-full h-full text-[#faf9f6]"
          >
            {/* Cream masking path that shapes the top edge of the image */}
            <path
              d="M 0,0 L 1000,0 L 1000,40 C 850,70 700,20 500,60 C 300,100 150,30 0,50 Z"
              fill="currentColor"
            />
            {/* Gold parallel line accent */}
            <path
              d="M 1000,25 C 850,55 700,5 500,45 C 300,85 150,15 0,35"
              fill="none"
              stroke="#ffd166"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Mobile Bottom Wave (Sits on the bottom edge of Right pane to mask transition to next section) */}
        <div className="block md:hidden absolute bottom-0 left-0 w-full h-[50px] z-20 pointer-events-none">
          <svg
            viewBox="0 0 600 120"
            preserveAspectRatio="none"
            className="w-full h-full text-[#1a4895]"
          >
            <path
              d="M 0,90 C 80,110 160,115 220,105 C 300,90 400,60 480,70 C 520,75 560,95 600,90 L 600,120 L 0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
