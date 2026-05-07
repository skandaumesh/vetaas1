"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Check, Star, Zap, Heart } from "lucide-react";

const CATEGORIES = ["All", "Curriculum", "Toolkits", "Resources"];

const PRODUCTS = [
  {
    id: 1,
    category: "Curriculum",
    title: "SEL Starter Kit",
    subtitle: "Foundational Learning",
    description: "A comprehensive introduction to Social Emotional Learning designed for early childhood classrooms.",
    image: "/product1.png",
    color: "#f0f9ff", // Light Blue
    accent: "#45bcf6",
    tag: "Most Popular"
  },
  {
    id: 2,
    category: "Toolkits",
    title: "Parent Toolkit",
    subtitle: "Home Integration",
    description: "Equip parents with simple, science-backed activities to nurture emotional intelligence at home.",
    image: "/product2.png",
    color: "#fff1f2", // Light Pink
    accent: "#ff6e79",
    tag: "Essential"
  },
  {
    id: 3,
    category: "Curriculum",
    title: "Training Manual",
    subtitle: "Educator Empowerment",
    description: "A structured training program that transforms teachers into SEL practitioners.",
    image: "/teacher2.png",
    color: "#f0fdf4", // Light Green
    accent: "#36ba98",
    tag: "For Schools"
  },
  {
    id: 4,
    category: "Resources",
    title: "Assessment Tool",
    subtitle: "Impact Tracking",
    description: "Data-driven tools to track and measure SEL development across classrooms.",
    image: "/testimonial4.png",
    color: "#fffbeb", // Light Amber
    accent: "#fbbf24",
    tag: "Data-Driven"
  },
  {
    id: 5,
    category: "Resources",
    title: "Story Cards",
    subtitle: "Creative Starters",
    description: "A beautifully illustrated deck of cards featuring diverse characters and emotional scenarios.",
    image: "/children.png",
    color: "#fdf2f8", // Light Pink/Purple
    accent: "#ffa3c9",
    tag: "Interactive"
  },
  {
    id: 6,
    category: "Toolkits",
    title: "Volunteer Pack",
    subtitle: "Community Outreach",
    description: "Everything a volunteer needs to run an SEL program in their community.",
    image: "/testimonial5.png",
    color: "#eef2ff", // Light Indigo
    accent: "#6366f1",
    tag: "Scalable"
  }
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <main className="bg-[#f8fafc] min-h-screen font-sans selection:bg-[#36ba98]/30">
      {/* Playful & Bold Hero Section */}
      <section className="relative pt-44 pb-24 overflow-hidden">
        {/* Floating Abstract Shapes */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[15%] w-20 h-20 bg-[#45bcf6]/20 rounded-full blur-xl"
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-[10%] w-32 h-32 bg-[#36ba98]/10 rounded-full blur-2xl"
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#111827] text-white px-5 py-2 rounded-2xl mb-10 shadow-xl">
              <Star size={16} fill="#fbbf24" stroke="none" />
              <span className="text-[11px] font-black uppercase tracking-widest">Explore Our Universe</span>
            </div>
            
            <h1 className="font-headline text-6xl md:text-9xl text-gray-900 leading-[0.85] tracking-tight mb-8">
              Tools for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#45bcf6] to-[#36ba98]">Extraordinary</span> Minds.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl font-medium leading-relaxed mb-16">
              Empowering educators, parents, and children with the world's most engaging SEL toolkits.
            </p>

            {/* Premium Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3.5 rounded-2xl text-sm font-black transition-all ${
                    activeCategory === cat 
                      ? "bg-[#111827] text-white shadow-2xl scale-110" 
                      : "bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-900 border border-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Grid - Staggered Creative Tiles */}
      <section className="pb-40 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative"
                >
                  {/* Card Container */}
                  <div className="bg-white rounded-[3rem] p-8 h-full flex flex-col border border-gray-100 transition-all duration-500 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-4">
                    
                    {/* Badge */}
                    <div className="absolute top-6 right-6 z-20">
                      <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-900/60">{product.tag}</span>
                      </div>
                    </div>

                    {/* Image Area with Decorative Platform */}
                    <div className="relative w-full aspect-square mb-10 group-hover:scale-105 transition-transform duration-700">
                      <div 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1/4 rounded-[100%] blur-3xl opacity-30 transition-opacity group-hover:opacity-60"
                        style={{ backgroundColor: product.accent }}
                      />
                      <Image 
                        src={product.image} 
                        alt={product.title} 
                        fill 
                        className="object-contain drop-shadow-2xl z-10"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 block" style={{ color: product.accent }}>
                        {product.category}
                      </span>
                      <h3 className="font-headline text-3xl text-gray-900 mb-3 leading-tight">{product.title}</h3>
                      <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <Link 
                      href={`/products/${product.id}`}
                      className="inline-flex items-center justify-between w-full p-2 bg-gray-50 rounded-2xl group/btn hover:bg-[#111827] transition-all duration-500"
                    >
                      <span className="pl-4 text-xs font-black uppercase tracking-widest text-gray-900 group-hover/btn:text-white transition-colors">View Toolkit</span>
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover/btn:bg-[#36ba98] transition-colors">
                        <ArrowRight size={20} className="text-gray-900 group-hover/btn:text-white transition-colors" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Impact Footer */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-2xl shadow-gray-200/50 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden border border-gray-100">
            {/* Background Hand-Drawn Elements */}
            <div className="absolute top-10 left-10 opacity-5">
               <Zap size={100} className="text-gray-900" />
            </div>
            
            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-2 mb-8 bg-[#36ba98]/10 text-[#36ba98] px-4 py-1 rounded-full">
                <Heart size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest">Built for humans</span>
              </div>
              <h2 className="font-headline text-5xl md:text-7xl text-gray-900 leading-tight mb-10 tracking-tight">
                Can't find what <br /> you're <span className="text-[#45bcf6]">looking for?</span>
              </h2>
              <p className="text-xl text-gray-500 font-medium max-w-xl mb-12">
                We offer custom development for schools and organizations that need tailored SEL solutions.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-3 bg-[#111827] text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl"
              >
                Let's Talk Shop <ArrowRight size={20} />
              </Link>
            </div>

            <div className="flex-1 relative w-full aspect-square max-w-md">
              <div className="absolute inset-0 bg-[#f0fdf4] rounded-[3.5rem] rotate-6 border border-[#36ba98]/20" />
              <div className="absolute inset-0 bg-white rounded-[3.5rem] shadow-xl flex flex-col items-center justify-center p-10 text-center">
                 <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                    <Zap size={32} className="text-[#36ba98]" />
                 </div>
                 <h4 className="font-headline text-2xl text-gray-900 mb-4">Custom Workshop?</h4>
                 <p className="text-gray-500 text-sm font-medium mb-8">We can design a custom training manual or toolkit just for your team.</p>
                 <Link href="/services" className="text-[#36ba98] font-black uppercase tracking-widest text-[10px] hover:gap-3 flex items-center gap-2 transition-all">
                   Explore Services <ArrowRight size={14} />
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
