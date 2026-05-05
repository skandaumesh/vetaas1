"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

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

export default function ImpactSection() {
  const stats = [
    { number: 700, suffix: "+", label: "Parents Empowered", description: "Through workshops and home SEL programs" },
    { number: 50, suffix: "+", label: "Teachers Trained", description: "With SEL integration toolkits" },
    { number: 300, suffix: "+", label: "Children Reached", description: "Across schools in Bangalore" },
    { number: 15, suffix: "+", label: "School Partnerships", description: "Building SEL ecosystems" },
  ];

  return (
    <section className="section-spacing bg-[#1a4895] text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#36ba98]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#ffd166]/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[#ffd166] font-semibold text-sm uppercase tracking-widest mb-4 block">Our Impact</span>
          <h2 className="font-headline text-4xl md:text-5xl lg:text-[3.5rem] tracking-tight leading-tight">
            Numbers That Tell<br />
            <span className="text-[#ffd166]">Our Story</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#ffd166] mb-3">
                <AnimatedCounter target={stat.number} suffix={stat.suffix} />
              </div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-white/60">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
