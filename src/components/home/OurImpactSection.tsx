"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  {
    id: 1,
    number: 50,
    suffix: "+",
    label: "Teachers",
    image: "/teacher1.png",
  },
  {
    id: 2,
    number: 50,
    suffix: "+",
    label: "Parents",
    image: "/parents2.png",
  },
  {
    id: 3,
    number: 300,
    suffix: "+",
    label: "Children",
    image: "/children1.png",
  }
];

export default function OurImpactSection() {
  return (
    <section className="relative w-full pt-8 pb-12 lg:pt-12 lg:pb-16 bg-gradient-to-b from-[#fafaf7] to-[#f0f6fa] overflow-hidden z-10">
      
      {/* Decorative Top Left Flower */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[5%] left-[-15%] md:top-[0%] md:left-[-5%] w-[350px] h-[350px] md:w-[450px] md:h-[450px] z-0 pointer-events-none opacity-80"
      >
        <Image src="/impactflower.png" alt="Decorative flower" fill className="object-contain mix-blend-multiply" />
      </motion.div>

      {/* Morphing organic blobs */}
      <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] bg-gradient-to-br from-[#36ba98]/6 to-[#4285F4]/5 animate-morph pointer-events-none z-0 blur-[65px]" />
      <div className="absolute bottom-[5%] left-[8%] w-[280px] h-[280px] bg-gradient-to-tr from-[#ff6e79]/6 to-[#ffd166]/5 animate-morph pointer-events-none z-0 blur-[60px]" style={{ animationDelay: '-5s' }} />
      <div className="absolute top-[40%] left-[50%] w-[200px] h-[200px] bg-gradient-to-br from-[#ffd166]/5 to-[#ff7a43]/4 animate-morph pointer-events-none z-0 blur-[50px]" style={{ animationDelay: '-9s' }} />

      {/* Drifting geometric rings */}
      <div className="absolute top-[15%] right-[12%] w-[110px] h-[110px] rounded-full border-2 border-[#36ba98]/8 animate-drift pointer-events-none z-0" />
      <div className="absolute bottom-[18%] left-[15%] w-[80px] h-[80px] rounded-full border-2 border-[#ff6e79]/10 animate-drift-reverse pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[5%] w-[60px] h-[60px] rounded-full border border-[#4285F4]/8 animate-drift pointer-events-none z-0" style={{ animationDelay: '-10s' }} />
      {/* Orbiting dots */}
      <div className="absolute top-[20%] left-[30%] w-[10px] h-[10px] rounded-full bg-[#36ba98]/12 animate-orbit pointer-events-none z-0" />
      <div className="absolute bottom-[30%] right-[25%] w-[7px] h-[7px] rounded-full bg-[#ffd166]/15 animate-orbit pointer-events-none z-0" style={{ animationDelay: '-15s' }} />

      {/* Layered SVG journey lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 600" preserveAspectRatio="none" fill="none" className="w-full h-full">
          {/* Primary teal curve */}
          <path 
            d="M-50,150 C300,350 600,50 1000,400 C1200,550 1350,200 1500,250" 
            stroke="#36ba98" 
            strokeWidth="3" 
            strokeLinecap="round" 
            opacity="0.07"
          />
          {/* Secondary coral curve */}
          <path 
            d="M-50,250 C350,450 650,100 1050,350 C1250,480 1400,250 1550,300" 
            stroke="#ff6e79" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.05"
          />
          {/* Dashed gold accent */}
          <path 
            d="M-50,450 C200,300 500,550 800,350 C1100,200 1300,450 1500,380" 
            stroke="#ffd166" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeDasharray="8 6"
            opacity="0.06"
          />
          {/* Decorative circles */}
          <circle cx="250" cy="120" r="50" stroke="#36ba98" strokeWidth="1" opacity="0.04" />
          <circle cx="1100" cy="480" r="65" stroke="#ff6e79" strokeWidth="1" opacity="0.04" />
          <circle cx="600" cy="80" r="30" stroke="#ffd166" strokeWidth="1.5" opacity="0.05" />
        </svg>
      </div>

      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3"
          >
            <h2 className="text-5xl md:text-6xl font-headline text-[#111827]">
              Our
            </h2>
            <div className="bg-[#ff6e79] text-white px-6 py-2 rounded-2xl -rotate-2">
              <h2 className="text-5xl md:text-6xl font-headline tracking-wide">
                Impact
              </h2>
            </div>
          </motion.div>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative h-[250px] sm:h-[340px] md:h-[380px] rounded-[2rem] sm:rounded-[2.5rem] bg-white border-2 border-black shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col items-center pt-6 sm:pt-10"
            >
              {/* Number and Label */}
              <div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="text-5xl sm:text-6xl lg:text-[4rem] font-headline font-bold text-[#111827] mb-2 sm:mb-3">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </h3>
                <div 
                  className="font-bold text-lg sm:text-xl text-gray-700 tracking-wide"
                  style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
                >
                  {stat.label}
                </div>
              </div>

              {/* Illustration */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] sm:w-[160%] h-[155px] sm:h-[220px] transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 pointer-events-none">
                <Image
                  src={stat.image}
                  alt={stat.label}
                  fill
                  className="object-contain object-bottom grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
