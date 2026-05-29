"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { BookOpen, Users, Smile } from "lucide-react";

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
    icon: BookOpen,
    color: "text-[#00CDBA] bg-[#00CDBA]/10",
  },
  {
    id: 2,
    number: 50,
    suffix: "+",
    label: "Parents",
    icon: Users,
    color: "text-[#1E90FF] bg-[#1E90FF]/10",
  },
  {
    id: 3,
    number: 300,
    suffix: "+",
    label: "Children",
    icon: Smile,
    color: "text-[#FF5C7A] bg-[#FF5C7A]/10",
  }
];

export default function OurImpactSection() {
  return (
    <section className="relative w-full pt-8 pb-12 lg:pt-12 lg:pb-16 bg-gradient-to-b from-[#fafaf7] to-[#f0f6fa] overflow-hidden z-10">
      


      {/* Morphing organic blobs */}
      <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] bg-gradient-to-br from-[#00CDBA]/6 to-[#1E90FF]/5 animate-morph pointer-events-none z-0 blur-[65px]" />
      <div className="absolute bottom-[5%] left-[8%] w-[280px] h-[280px] bg-gradient-to-tr from-[#FF5C7A]/6 to-[#FFC107]/5 animate-morph pointer-events-none z-0 blur-[60px]" style={{ animationDelay: '-5s' }} />
      <div className="absolute top-[40%] left-[50%] w-[200px] h-[200px] bg-gradient-to-br from-[#FFC107]/5 to-[#ff7a43]/4 animate-morph pointer-events-none z-0 blur-[50px]" style={{ animationDelay: '-9s' }} />

      {/* Drifting geometric rings */}
      <div className="absolute top-[15%] right-[12%] w-[110px] h-[110px] rounded-full border-2 border-[#00CDBA]/8 animate-drift pointer-events-none z-0" />
      <div className="absolute bottom-[18%] left-[15%] w-[80px] h-[80px] rounded-full border-2 border-[#FF5C7A]/10 animate-drift-reverse pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[5%] w-[60px] h-[60px] rounded-full border border-[#1E90FF]/8 animate-drift pointer-events-none z-0" style={{ animationDelay: '-10s' }} />
      {/* Orbiting dots */}
      <div className="absolute top-[20%] left-[30%] w-[10px] h-[10px] rounded-full bg-[#00CDBA]/12 animate-orbit pointer-events-none z-0" />
      <div className="absolute bottom-[30%] right-[25%] w-[7px] h-[7px] rounded-full bg-[#FFC107]/15 animate-orbit pointer-events-none z-0" style={{ animationDelay: '-15s' }} />

      {/* Layered SVG journey lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 600" preserveAspectRatio="none" fill="none" className="w-full h-full">
          {/* Primary teal curve */}
          <path 
            d="M-50,150 C300,350 600,50 1000,400 C1200,550 1350,200 1500,250" 
            stroke="#00CDBA" 
            strokeWidth="3" 
            strokeLinecap="round" 
            opacity="0.07"
          />
          {/* Secondary coral curve */}
          <path 
            d="M-50,250 C350,450 650,100 1050,350 C1250,480 1400,250 1550,300" 
            stroke="#FF5C7A" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.05"
          />
          {/* Dashed gold accent */}
          <path 
            d="M-50,450 C200,300 500,550 800,350 C1100,200 1300,450 1500,380" 
            stroke="#FFC107" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeDasharray="8 6"
            opacity="0.06"
          />
          {/* Decorative circles */}
          <circle cx="250" cy="120" r="50" stroke="#00CDBA" strokeWidth="1" opacity="0.04" />
          <circle cx="1100" cy="480" r="65" stroke="#FF5C7A" strokeWidth="1" opacity="0.04" />
          <circle cx="600" cy="80" r="30" stroke="#FFC107" strokeWidth="1.5" opacity="0.05" />
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
            <div className="bg-[#FF5C7A] text-white px-6 py-2 rounded-2xl -rotate-2">
              <h2 className="text-5xl md:text-6xl font-headline tracking-wide">
                Impact
              </h2>
            </div>
          </motion.div>
        </div>

        {/* Impact Separate Pills Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 w-full">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-gray-200 rounded-3xl lg:rounded-full py-4 px-6 sm:px-8 w-full flex items-center justify-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1 group"
              style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
            >
              {/* Icon */}
              <div className={`p-3 rounded-xl ${stat.color} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                <stat.icon size={26} strokeWidth={2} className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
  
              {/* Number and Label */}
              <div className="flex flex-col items-start text-left">
                <h3 className="text-3xl sm:text-4xl font-medium text-[#111827] leading-none tracking-tight">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </h3>
                <div className="font-semibold text-sm sm:text-base text-gray-500 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
