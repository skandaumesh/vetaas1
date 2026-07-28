"use client";
 
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Zap, Star, Heart, Sparkles, ArrowRight } from "lucide-react";
 
export default function HeroSection() {
  return (
    <section 
      className="relative w-full min-h-screen flex flex-col lg:flex-row bg-[#faf9f6] overflow-hidden z-30 pt-[var(--header-height)]"
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
        className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:pl-28 lg:pr-12 xl:pl-36 xl:pr-16 pt-16 pb-16 lg:py-0 relative z-10"
        style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
      >
        {/* Cream background is styled on the parent section */}

        {/* --- Mockup Background Elements --- */}


        {/* Yellow Sun - Left Boundary */}
        <div className="hidden lg:block absolute top-[60%] left-0 -translate-x-[50%] w-16 h-16 pointer-events-none -z-10">
          <svg viewBox="0 0 100 100" fill="#FFC107" className="w-full h-full">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>

        {/* Blue Zig-zag Line - Bottom Left */}
        <div className="hidden lg:block absolute top-[72%] left-[6%] w-16 h-8 pointer-events-none -z-10">
          <svg viewBox="0 0 80 30" fill="none" stroke="#7C3AED" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M 0,15 L 12,5 L 24,25 L 36,5 L 48,25 L 60,5 L 72,15" />
          </svg>
        </div>

        {/* Coral/Pink Dot Grid (3x3) - Bottom Left */}
        <div className="hidden lg:block absolute bottom-[16%] left-[8%] opacity-85 pointer-events-none -z-10">
          <svg width="36" height="36" viewBox="0 0 60 60" fill="#FF5C7A">
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
        <div className="hidden lg:block absolute bottom-0 left-0 w-full h-[90px] sm:h-[110px] lg:h-[130px] pointer-events-none -z-10">
          <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="w-full h-full text-[#7C3AED]">
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
          className="flex flex-col items-start text-left relative z-10 max-w-xl lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0"
        >


          {/* Small tag badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-5"
          >
            <span className="inline-block py-1.5 px-5 rounded-full bg-white border border-[#7C3AED]/10 text-[#7C3AED] font-bold text-[10px] tracking-[0.2em] uppercase shadow-sm">
              Nurturing young minds
            </span>
          </motion.div>

          <h1 className="text-2xl sm:text-3xl lg:text-[1.8rem] xl:text-[2rem] font-extrabold leading-[1.4] text-[#FF5C7A] tracking-tight mb-8 max-w-xl" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
            Enriching early childhood education by bringing{" "}
            <span className="text-[#1a2d4c]">Social Emotional Learning (SEL)</span>{" "}
            research to classrooms.
          </h1>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-20">
            <Link href="/children" className="w-full sm:w-auto whitespace-nowrap bg-[#00CDBA] text-white font-semibold text-sm px-5 py-2.5 rounded-full flex items-center justify-center gap-2 hover:brightness-105 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              SEL for Children <Sparkles size={15} fill="currentColor" />
            </Link>
            <Link href="/teachers" className="w-full sm:w-auto whitespace-nowrap bg-[#7C3AED] text-white font-semibold text-sm px-5 py-2.5 rounded-full flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              SEL for Teachers <Zap size={15} fill="currentColor" />
            </Link>
            <Link href="/parents" className="w-full sm:w-auto whitespace-nowrap bg-white text-[#111827] font-semibold text-sm px-5 py-2.5 rounded-full border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2">
              SEL for Parents <Heart size={15} className="text-[#FF5C7A]" fill="currentColor" />
            </Link>
          </div>

          {/* Membership plans CTA */}
          <div className="mt-5 z-20">
            <Link
              href="/services#membership"
              className="group inline-flex items-center gap-3 bg-white pl-2 pr-5 py-2 rounded-full border border-[#7C3AED]/20 shadow-sm hover:shadow-md hover:border-[#7C3AED]/40 hover:-translate-y-0.5 transition-all"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#7C3AED] text-white shadow-sm">
                <Star size={16} fill="currentColor" />
              </span>
              <span className="text-sm font-semibold text-[#111827]">
                Explore our{" "}
                <span className="text-[#7C3AED]">membership plans</span>
              </span>
              <ArrowRight
                size={16}
                className="text-[#7C3AED] group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Image Pane with Dynamic Wavy Divider */}
      <div className="w-full lg:w-[45%] h-[420px] sm:h-[520px] lg:h-auto relative z-10 overflow-hidden">
        {/* Child Photo cropped from landingpage.png (Shifted to object-[62%_20%] on mobile to display face and drawing fully) */}
        <Image 
          src="/landingpage.png" 
          alt="Nurturing Hope and Life" 
          fill 
          className="object-cover object-[15%_20%] lg:object-[15%_0%]" 
          priority
        />

        {/* Desktop Vertical Wavy Curve Mask (Sits on the left edge of Right pane) */}
        <div className="hidden lg:block absolute top-0 left-0 h-full w-[120px] -translate-x-[1px] z-20 pointer-events-none">
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
          className="hidden lg:block absolute top-0 left-0 h-full w-[120px] -translate-x-[1px] z-30 pointer-events-none"
          style={{ clipPath: 'url(#divider-left-clip)' }}
        >
          <div className="absolute bottom-0 left-0 w-full h-[130px]">
            <svg viewBox="0 0 120 120" preserveAspectRatio="none" className="w-full h-full text-[#7C3AED]">
              <path 
                d="M 0,90 C 20,85 70,105 120,120 L 120,120 L 0,120 Z" 
                fill="currentColor" 
              />
            </svg>
          </div>
        </div>

        {/* Gold Border Line Overlay */}
        <div className="hidden lg:block absolute top-0 left-0 h-full w-[120px] -translate-x-[1px] z-22 pointer-events-none">
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M 25,0 C 55,120 0,240 60,400 C 100,520 -5,700 35,1000"
              fill="none"
              stroke="#FFC107"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Mobile Horizontal Wavy Curve Mask (Sits on the top edge of Right pane) */}
        <div className="block lg:hidden absolute top-0 left-0 w-full h-[60px] -translate-y-[1px] z-20 pointer-events-none">
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
              stroke="#FFC107"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Mobile Bottom Wave (Sits on the bottom edge of Right pane to mask transition to next section) */}
        <div className="block lg:hidden absolute bottom-0 left-0 w-full h-[50px] z-20 pointer-events-none">
          <svg
            viewBox="0 0 600 120"
            preserveAspectRatio="none"
            className="w-full h-full text-[#faf9f6]"
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
