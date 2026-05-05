"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Check } from "lucide-react";

const CATEGORIES = ["All", "Curriculum", "Toolkits", "Resources"];

const PRODUCTS = [
  {
    id: 1,
    category: "Curriculum",
    title: "SEL Starter Kit",
    subtitle: "For K-5 Classrooms",
    description: "A comprehensive introduction to Social Emotional Learning designed for early childhood classrooms.",
    image: "/product1.png",
    color: "#45bcf6", // Sky Blue
    btnColor: "bg-[#1e293b]",
    height: "h-[500px]",
    outcomes: ["Improved student self-regulation", "30% reduction in classroom conflicts"],
    forWhom: ["Primary Schools", "Early Childhood Centers"],
  },
  {
    id: 2,
    category: "Toolkits",
    title: "Parent Toolkit",
    subtitle: "At-Home SEL Activities",
    description: "Equip parents with simple, science-backed activities to nurture emotional intelligence at home.",
    image: "/product2.png",
    color: "#ff6e79", // Coral
    btnColor: "bg-[#0f172a]",
    height: "h-[600px]",
    outcomes: ["Stronger communication", "Better emotional vocabulary"],
    forWhom: ["Parents", "Family Counselors"],
  },
  {
    id: 3,
    category: "Curriculum",
    title: "Training Manual",
    subtitle: "Comprehensive Integration",
    description: "A structured training program that transforms teachers into SEL practitioners.",
    image: "/teacher2.png",
    color: "#36ba98", // Emerald
    btnColor: "bg-[#1e293b]",
    height: "h-[550px]",
    outcomes: ["SEL-certified teaching staff", "Embedded SEL in daily routines"],
    forWhom: ["Schools", "Teacher Training"],
  },
  {
    id: 4,
    category: "Resources",
    title: "Assessment Tool",
    subtitle: "Measure SEL Outcomes",
    description: "Data-driven tools to track and measure SEL development across classrooms.",
    image: "/testimonial4.png",
    color: "#fbbf24", // Amber
    btnColor: "bg-[#0f172a]",
    height: "h-[520px]",
    outcomes: ["Evidence-based tracking", "Stakeholder-ready reports"],
    forWhom: ["Schools", "NGOs"],
  },
  {
    id: 5,
    category: "Resources",
    title: "Story Cards",
    subtitle: "Illustrated Starters",
    description: "A beautifully illustrated deck of cards featuring diverse characters and emotional scenarios.",
    image: "/children.png",
    color: "#ffa3c9", // Pink
    btnColor: "bg-[#1e293b]",
    height: "h-[580px]",
    outcomes: ["Increased empathy expression", "Richer classroom discussions"],
    forWhom: ["Teachers", "Parents"],
  },
  {
    id: 6,
    category: "Toolkits",
    title: "Volunteer Pack",
    subtitle: "Community SEL Program",
    description: "Everything a volunteer needs to run an SEL program in their community.",
    image: "/testimonial5.png",
    color: "#6366f1", // Indigo
    btnColor: "bg-[#0f172a]",
    height: "h-[540px]",
    outcomes: ["Scalable community programs", "Trained volunteer facilitators"],
    forWhom: ["Volunteers", "Community Leaders"],
  },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = activeCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <main className="bg-white min-h-screen font-sans">

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div 
            className="absolute inset-0"
            style={{
              backgroundSize: '40px 40px',
              backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center bg-[#0f172a] text-white px-5 py-1.5 rounded-lg mb-8 shadow-sm -rotate-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Catalog</span>
            </div>
            <h1 className="font-headline text-6xl md:text-8xl text-[#111827] tracking-tight leading-[0.9] mb-8">
              Tools for <span className="text-[#36ba98]">Change</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Research-backed toolkits and resources designed to make SEL practical and measurable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Exact Alignment Grid */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-12 grid-flow-row-dense">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => {
                
                // Exact alignment logic mapping to the reference image
                const getCardStyle = (id: number) => {
                  switch(id) {
                    case 1: 
                      // 01: Top Left (Image Left)
                      return { span: "md:col-start-1 md:col-span-1 md:row-start-1 md:row-span-1", layout: "flex-col md:flex-row", minH: "h-full min-h-[220px]" };
                    case 2: 
                      // 02: Bottom Left (Image Right)
                      return { span: "md:col-start-1 md:col-span-1 md:row-start-2 md:row-span-1", layout: "flex-col md:flex-row-reverse", minH: "h-full min-h-[280px]" };
                    case 3: 
                      // 03: Right Tall
                      return { span: "md:col-start-2 md:col-span-1 md:row-start-1 md:row-span-2", layout: "flex-col md:flex-row", minH: "h-full min-h-[400px] md:min-h-[600px]" };
                    case 4: 
                      // 04: Full Width Bottom (Image Right)
                      return { span: "md:col-span-2", layout: "flex-col md:flex-row-reverse", minH: "h-full min-h-[350px]" };
                    case 5: 
                      // 05: Extra Card
                      return { span: "md:col-span-1", layout: "flex-col md:flex-row", minH: "h-full min-h-[280px]" };
                    case 6: 
                      // 06: Extra Card
                      return { span: "md:col-span-1", layout: "flex-col md:flex-row-reverse", minH: "h-full min-h-[280px]" };
                    default: 
                      return { span: "md:col-span-1", layout: "flex-col", minH: "h-full min-h-[280px]" };
                  }
                };

                const style = getCardStyle(product.id);
                const isHorizontal = style.layout.includes('flex-row');

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative rounded-[2.5rem] overflow-visible p-6 lg:p-10 flex transition-all duration-500 ${style.span} ${style.layout} ${style.minH} gap-6 lg:gap-8`}
                    style={{ backgroundColor: product.color }}
                  >
                    {/* Image Area */}
                    <div className={`relative z-10 flex items-center justify-center shrink-0 ${isHorizontal ? 'w-full md:w-5/12 h-48 md:h-full' : 'w-full h-56 md:h-1/2'}`}>
                      <div className="relative w-full h-full">
                        <Image 
                          src={product.image} 
                          alt={product.title} 
                          fill 
                          className={`object-contain transition-transform duration-700 
                            ${product.id === 1 
                              ? 'scale-[1.2] md:scale-[1.5] origin-center -translate-x-0 md:-translate-x-8 translate-y-0 md:translate-y-4 drop-shadow-[0_35px_45px_rgba(0,0,0,0.6)]' 
                              : product.id === 2
                              ? 'scale-[1.2] md:scale-[1.5] origin-center translate-x-0 md:translate-x-8 translate-y-0 md:translate-y-4 drop-shadow-[0_35px_45px_rgba(0,0,0,0.6)]'
                              : product.id === 3
                              ? 'scale-[1.3] md:scale-[2.2] origin-center md:origin-left -translate-x-0 md:-translate-x-32 drop-shadow-[0_35px_45px_rgba(0,0,0,0.6)]'
                              : 'drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]'
                            }
                          `} 
                        />
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className={`relative z-10 flex flex-col justify-center text-left ${isHorizontal ? 'w-full md:w-7/12' : 'w-full flex-grow mt-4'}`}>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-900/60 mb-2">
                        {product.category}
                      </span>
                      
                      <h3 className="font-headline text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-none tracking-tight">
                        {product.title}
                      </h3>
                      
                      <p className={`text-gray-900/80 font-medium text-sm leading-relaxed mb-4 ${isHorizontal ? 'line-clamp-3' : 'line-clamp-5'}`}>
                        {product.description}
                      </p>

                      {/* Points / Outcomes */}
                      <ul className="space-y-2 mb-8">
                        {product.outcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs font-bold text-gray-800 leading-tight">
                            <Check size={14} className="text-gray-900 shrink-0 mt-0.5" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                      
                      <Link 
                        href={`/products/${product.id}`} 
                        className="mt-auto w-fit bg-gray-900 text-white font-bold text-[10px] uppercase tracking-widest px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white hover:text-gray-900 transition-colors shadow-lg"
                      >
                        Explore <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* High-Impact CTA */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-[#0f172a] rounded-[3rem] p-12 md:p-20 overflow-hidden text-center shadow-2xl">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#36ba98]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#45bcf6]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="font-headline text-5xl md:text-7xl text-white leading-tight mb-8 tracking-tight">
                Need a <span className="text-[#36ba98]">Custom Solution?</span>
              </h2>
              <p className="text-xl text-white/70 font-medium mb-12 leading-relaxed">
                We partner with schools and organizations to create tailored SEL toolkits and training programs for their unique needs.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-3 bg-[#36ba98] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl shadow-[#36ba98]/20"
              >
                Start a Partnership <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
