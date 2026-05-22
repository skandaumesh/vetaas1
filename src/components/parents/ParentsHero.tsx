"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ParentsHero() {
  return (
    <div className="w-full relative z-10 flex flex-col items-center text-center mt-12 md:mt-20 mb-24">

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
        At Vetaas, we believe that parents are the heartbeat of a child's developmental journey. Our services are thoughtfully crafted to empower parents with the knowledge and tools they need to nurture their child's emotional and social growth. By bridging the gap between cutting-edge research and daily parenting practices, we aim to transform complex theories into actionable, heart-centered strategies. We are dedicated to creating a supportive community where parents can explore the best available practices, ensuring every child receives the foundation they deserve to thrive in an ever-changing world.
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
  );
}
