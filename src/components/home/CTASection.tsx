"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-[#FDFBF7] relative overflow-hidden font-sans z-10">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-[#ffd166] rounded-[3rem] p-12 md:p-20 text-[#111827] text-center relative shadow-[0_20px_50px_rgba(255,209,102,0.3)] border border-black/5 rotate-1 hover:rotate-0 transition-transform duration-500"
        >
          {/* Decorative Doodles */}
          <div className="absolute top-10 left-10 opacity-60 w-12 h-12 -rotate-12">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div className="absolute bottom-12 right-12 opacity-60 w-10 h-10 rotate-12">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3v6" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-headline text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-8">
              Ready to Transform <br/>
              <span className="inline-block bg-white px-5 py-2 rounded-3xl -rotate-2 mt-2 shadow-sm text-[#ff6e79]">Education?</span>
            </h2>
            <p className="text-xl md:text-2xl text-[#111827]/80 font-medium mb-12 leading-relaxed">
              Whether you're a school, a parent, or a passionate volunteer — there's a place for you in the Vetaas village.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className="w-full sm:w-auto bg-[#111827] text-white font-bold text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg hover:-translate-y-1">
                Get Started <ArrowRight size={20} strokeWidth={2.5} />
              </Link>
              <Link href="/contact" className="w-full sm:w-auto bg-white text-[#111827] font-bold text-lg px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm hover:-translate-y-1">
                <MessageCircle size={20} strokeWidth={2.5} /> Talk to Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
