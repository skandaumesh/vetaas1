"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const stats = [
  {
    id: 1,
    number: "50+",
    label: "Teachers",
    image: "/teacher.png",
    hoverBg: "hover:bg-[#ffa3c9]", // Pink
  },
  {
    id: 2,
    number: "50+",
    label: "Parents",
    image: "/parents.png",
    hoverBg: "hover:bg-[#ffd166]", // Yellow
  },
  {
    id: 3,
    number: "300+",
    label: "Children",
    image: "/children.png",
    hoverBg: "hover:bg-[#45bcf6]", // Blue
  }
];

export default function OurImpactSection() {
  return (
    <section className="w-full bg-white pt-24 pb-20 md:pt-32 lg:pt-40 lg:pb-24 relative z-30 overflow-x-clip font-sans">

      {/* Decorative Top Left Flower Background */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
        className="absolute top-[-10%] left-[-30%] md:top-[-15%] md:left-[-15%] w-[300px] h-[300px] md:w-[450px] md:h-[450px] z-0 pointer-events-none"
      >
        <Image src="/impactflower.png" alt="Decorative flower" fill className="object-contain mix-blend-multiply opacity-100 drop-shadow-sm" />
      </motion.div>

      <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-headline text-[#111827] leading-[1.1] tracking-tight"
          >
            Our <span className="inline-block bg-[#ff7f68] text-white px-4 py-1 rounded-2xl rotate-2 shadow-sm">Impact</span>
          </motion.h2>
        </div>
        
        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 pb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -10 }}
              className={`relative bg-[#f8fafc] border border-gray-200 ${stat.hoverBg} hover:border-transparent h-[320px] md:h-[360px] p-8 md:p-10 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] text-center transition-all duration-500 flex flex-col items-center group overflow-hidden`}
            >
              
              {/* Stat Numbers (Top) */}
              <div className="relative z-10 w-full flex flex-col items-center transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-5xl lg:text-6xl font-headline font-bold text-[#111827] mb-2 tracking-tight transition-colors duration-300">
                  {stat.number}
                </h3>
                <p className="text-xl md:text-2xl text-[#111827]/80 font-bold tracking-wide transition-colors duration-300">
                  {stat.label}
                </p>
              </div>

              {/* Image (Bottom) - Visible by default as grayscale, blooms on hover */}
              <div className="absolute top-[32%] left-1/2 -translate-x-1/2 w-[180%] h-[95%] translate-y-8 scale-90 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-500 ease-out pointer-events-none">
                 <Image 
                   src={stat.image} 
                   alt={stat.label} 
                   fill 
                   className="object-contain mix-blend-multiply drop-shadow-sm group-hover:drop-shadow-lg transition-all duration-500 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100" 
                 />
              </div>
              
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
