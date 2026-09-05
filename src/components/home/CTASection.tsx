"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CTASection() {
  return (
    <section className="pt-8 pb-24 md:pt-10 md:pb-32 relative overflow-hidden font-[family-name:var(--font-poppins)] bg-[#FFF9E6]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col items-center justify-center text-center"
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="block text-[#7C3AED] text-xs font-black uppercase tracking-[0.25em] mb-3">
              Join the Community
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline tracking-tight text-[#111827] leading-[1.1] mb-8 mt-3">
              It takes a village to <br className="hidden md:block"/> raise a child.
            </h2>
          </div>

          <div className="z-20">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 bg-[#7C3AED] text-white font-bold text-xs sm:text-sm rounded-lg hover:bg-[#6D28D9] hover:scale-105 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
            >
              Join the tribe
              <ArrowRight size={18} strokeWidth={2} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

