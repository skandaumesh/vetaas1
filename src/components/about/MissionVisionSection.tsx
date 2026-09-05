"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import WaveDivider from "@/components/decor/WaveDivider";

export default function MissionVisionSection() {
  return (
    <section className="pt-12 pb-24 lg:pt-16 lg:pb-32 bg-white relative overflow-hidden font-sans">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center"
        >
          <span className="block text-[#7C3AED] text-xs font-black uppercase tracking-[0.25em] mb-4">
            Our Purpose
          </span>
          <h2 className="font-headline text-5xl md:text-6xl lg:text-7xl text-[#111827] tracking-tight leading-[1.05]">
            Driven by <span className="inline-block bg-[#ff5c7a] text-white px-6 py-1 rounded-[1.5rem] rotate-2 mt-2 shadow-sm font-bold">Purpose</span>
          </h2>
        </motion.div>

        {/* 2-Column Grid Layout with White Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 items-stretch">

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_15px_45px_rgba(0,0,0,0.05)] p-8 flex flex-col justify-between -rotate-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.09)] transition-all duration-500 hover:rotate-0 hover:border-[#00CDBA]/40"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-gray-50 mb-6 border border-gray-100">
                <Image
                  src="/about1.jpeg"
                  alt="Mission – children playing together"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-[center_30%]"
                />
              </div>

              {/* Title Badge */}
              <div className="mb-4">
                <span className="inline-block bg-[#00CDBA] text-white text-base font-bold px-4 py-1.5 rounded-xl -rotate-2 shadow-sm">
                  Our Mission
                </span>
              </div>

              {/* Text */}
              <p className="text-gray-600 text-base md:text-lg font-medium leading-relaxed mb-6">
                To transform the early years by embedding social and emotional learning into the everyday experiences of children, parents, and educators.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_15px_45px_rgba(0,0,0,0.05)] p-8 flex flex-col justify-between rotate-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.09)] transition-all duration-500 hover:rotate-0 hover:border-[#268bff]/40"
          >
            <div>
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-gray-50 mb-6 border border-gray-100">
                <Image
                  src="/about2.jpeg"
                  alt="Vision – diverse children's faces"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Title Badge */}
              <div className="mb-4">
                <span className="inline-block bg-[#268bff] text-white text-base font-bold px-4 py-1.5 rounded-xl rotate-2 shadow-sm">
                  Our Vision
                </span>
              </div>

              {/* Text */}
              <p className="text-gray-600 text-base md:text-lg font-medium leading-relaxed mb-6">
                To nurture a world where children, parents, and educators grow together with emotional awareness, meaningful relationships, creativity, and joy.
              </p>
            </div>
          </motion.div>

        </div>

      </div>

      <WaveDivider variant="zigzag" color="#EAFBF9" />
    </section>
  );
}
