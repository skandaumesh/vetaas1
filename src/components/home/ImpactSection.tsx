"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, GraduationCap, HeartHandshake, School } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2500;
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
    { 
      number: 700, 
      suffix: "+", 
      label: "Parents Empowered", 
      description: "Through workshops and home SEL programs",
      icon: HeartHandshake,
      color: "#ff6e79" // Coral
    },
    { 
      number: 50, 
      suffix: "+", 
      label: "Teachers Trained", 
      description: "With SEL integration toolkits",
      icon: GraduationCap,
      color: "#ffd166" // Gold
    },
    { 
      number: 300, 
      suffix: "+", 
      label: "Children Reached", 
      description: "Across schools in Bangalore",
      icon: Users,
      color: "#36ba98" // Teal
    },
    { 
      number: 15, 
      suffix: "+", 
      label: "School Partnerships", 
      description: "Building SEL ecosystems",
      icon: School,
      color: "#b4e0f9" // Sky
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 bg-[#111827] overflow-hidden text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[#1a4895]/40 blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#36ba98]/20 blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-[#ff6e79]/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-[#ffd166] font-semibold text-sm uppercase tracking-widest mb-6 backdrop-blur-sm shadow-sm">
            Our Impact
          </span>
          <h2 className="font-headline text-5xl md:text-6xl lg:text-7xl tracking-tight leading-tight">
            Numbers That Tell <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd166] to-[#ff6e79]">
              Our Story
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${stat.color} 0%, transparent 70%)` }}
                />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
                  >
                    <Icon size={32} color={stat.color} />
                  </div>
                  
                  <div className="text-5xl lg:text-6xl font-headline font-bold mb-4 tracking-tight" style={{ color: stat.color }}>
                    <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 tracking-wide text-white" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {stat.label}
                  </h3>
                  
                  <p className="text-white/60 leading-relaxed mt-auto text-sm md:text-base">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
