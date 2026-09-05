"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { BookOpen, Users, Smile } from "lucide-react";
import WaveDivider from "@/components/decor/WaveDivider";

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
    number: 370,
    suffix: "+",
    label: "Teachers",
    icon: BookOpen,
    color: "text-[#00CDBA] bg-[#00CDBA]/10",
  },
  {
    id: 2,
    number: 48,
    suffix: "+",
    label: "Parents",
    icon: Users,
    color: "text-[#268bff] bg-[#268bff]/10",
  },
  {
    id: 3,
    number: 400,
    suffix: "+",
    label: "Children",
    icon: Smile,
    color: "text-[#FF5C7A] bg-[#FF5C7A]/10",
  }
];

export default function OurImpactSection() {
  return (
    <section className="relative w-full pt-8 pb-24 lg:pt-12 lg:pb-32 bg-white overflow-hidden z-10">
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
              className="bg-white border border-gray-200 rounded-2xl py-4 px-6 sm:px-8 w-full flex items-center justify-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1 group"
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

      <WaveDivider color="#F7EAC6" />
    </section>
  );
}
