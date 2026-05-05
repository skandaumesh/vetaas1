"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function OfferingsSection() {
  const offerings = [
    {
      image: "/flow1.png",
      color: "bg-[#45bcf6]", // Sky Blue
      iconBg: "bg-[#8bd6f9]",
      btnColor: "bg-[#35a8df]", 
      title: "Products",
      subtitle: "SEL CURRICULUM & TOOLKITS",
      description: "Research-backed learning materials, story cards, and assessment frameworks designed for K-8 classrooms.",
      link: "/products",
      marginTop: "mt-16", // Push down to stagger
    },
    {
      image: "/flow2.png",
      color: "bg-[#36ba98]", // Emerald Green
      iconBg: "bg-[#7fd9bc]",
      btnColor: "bg-[#2da182]",
      title: "Services",
      subtitle: "TRAINING & WORKSHOPS",
      description: "Professional development for teachers, parent engagement programs, and end-to-end school partnerships.",
      link: "/services",
      marginTop: "mt-0", // Higher up
    },
    {
      image: "/flow3.png",
      color: "bg-[#ff7f68]", // Coral
      iconBg: "bg-[#ffa696]",
      btnColor: "bg-[#e56d58]",
      title: "Volunteer",
      subtitle: "JOIN THE MOVEMENT",
      description: "Be part of a community of changemakers. Volunteer your time and skills to transform education.",
      link: "/contact",
      marginTop: "mt-16", // Push down to stagger
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden font-sans z-20">
      
      {/* Background Accent Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)'
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center"
        >
          <div className="inline-flex items-center justify-center bg-[#0f172a] text-white px-5 py-1.5 rounded-lg mb-8 shadow-sm -rotate-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">What We Offer</span>
          </div>
          <h2 className="font-headline text-5xl md:text-6xl lg:text-7xl text-[#111827] tracking-tight leading-[1.05]">
            <span className="font-medium">Tools, Training &</span><br />
            <span className="inline-block bg-[#ffa3c9] text-white px-8 py-2 rounded-[2rem] rotate-2 mt-4 shadow-sm font-bold">Community</span>
          </h2>
        </motion.div>

        {/* Staggered Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {offerings.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -10 }}
              className={`relative ${item.color} p-8 lg:p-10 rounded-[3rem] shadow-xl border border-black/5 transition-all duration-500 flex flex-col min-h-[520px] overflow-hidden group ${item.marginTop}`}
            >
              
              {/* Animated Inner Blobs */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl pointer-events-none"
              />
              <motion.div 
                animate={{ 
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                  opacity: [0.05, 0.1, 0.05]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 -left-10 w-48 h-48 bg-black rounded-full blur-3xl pointer-events-none"
              />

              {/* Top Left Icon Container with Hover Animation */}
              <div className="relative z-10 w-24 h-24 mb-10 flex items-center justify-start transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  width={96} 
                  height={96} 
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-lg" 
                />
              </div>

              {/* Subtitle */}
              <div className="relative z-10 text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-[#111827]/70">
                {item.subtitle}
              </div>
              
              {/* Title */}
              <h3 className="relative z-10 font-headline text-4xl lg:text-5xl font-bold text-[#111827] mb-6 tracking-tight group-hover:-translate-y-1 transition-transform duration-500">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="relative z-10 text-lg lg:text-xl text-[#111827]/80 font-medium leading-relaxed mb-auto group-hover:-translate-y-1 transition-transform duration-500 delay-75">
                {item.description}
              </p>

              {/* Learn More Button */}
              <Link 
                href={item.link} 
                className={`relative z-10 mt-10 inline-flex items-center gap-2 font-bold text-sm text-[#111827] ${item.btnColor} px-6 py-3 rounded-full w-fit shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300`}
              >
                Learn More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
