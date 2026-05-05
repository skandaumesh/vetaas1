"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const TESTIMONIALS = [
  {
    quote: "My daughter now comes home and tells me how she felt during the day. That never happened before Vetaas. She has words for her emotions now.",
    name: "Priya Sharma",
    role: "Parent, Bangalore",
    color: "bg-[#45bcf6]", // Sky Blue
    image: "/testimonial4.png",
  },
  {
    quote: "The SEL toolkit completely changed my classroom. Students resolve conflicts on their own. I spend less time managing behavior and more time teaching.",
    name: "Anita Rao",
    role: "Teacher, Grade 3",
    color: "bg-[#36ba98]", // Emerald Green
    image: "/testimonial5.png",
  },
  {
    quote: "Vetaas doesn't just drop a curriculum and leave. They walk with you, train your team, and build capacity. It's a true partnership.",
    name: "Rajesh Menon",
    role: "School Principal",
    color: "bg-[#ff6e79]", // Coral/Red
    image: "/testimonial3.png",
  },
  {
    quote: "Volunteering with Vetaas gave me a sense of purpose I was missing. Watching children grow emotionally is the most rewarding experience.",
    name: "Kavitha Nair",
    role: "Volunteer",
    color: "bg-[#ffa3c9]", // Pink
    image: "/testimonial2.png", 
  },
];

export default function TestimonialsSection() {
  // Two sets for seamless infinite loop
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-24 lg:py-32 bg-[#fcf5eb] overflow-hidden font-sans relative z-20">
      
      {/* CSS for Seamless Marquee */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container {
          display: flex;
          gap: 40px;
          padding: 0 20px;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Background Accent Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)'
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center bg-[#0f172a] text-white px-5 py-1.5 rounded-lg mb-8 shadow-sm -rotate-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Testimonials</span>
          </div>
          <h2 className="font-headline text-5xl md:text-6xl text-[#111827] tracking-tight leading-[1.05]">
            Voices from <span className="text-[#36ba98]">Our Village</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative flex overflow-hidden py-10 z-10 select-none">
        <div className="marquee-container">
          {marqueeItems.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative flex-shrink-0 w-[360px] md:w-[400px] h-[480px] ${item.color} rounded-[2.5rem] p-10 flex flex-col shadow-xl shadow-black/5 group select-none`}
            >
              {/* Content */}
              <div className="relative z-20 pointer-events-none">
                <h3 className="font-headline text-3xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
                  {item.name}
                </h3>
                <p className="text-white/95 text-lg md:text-xl font-medium leading-relaxed italic mb-4 line-clamp-5">
                  "{item.quote}"
                </p>
                <div className="text-white/80 text-xs font-black uppercase tracking-widest">
                  {item.role}
                </div>
              </div>

              {/* Overlapping Person Image - Medium at bottom right */}
              <div className="absolute bottom-[-30px] right-[-60px] w-[250px] md:w-[280px] h-[250px] md:h-[280px] transition-transform duration-700 group-hover:scale-105 group-hover:-translate-x-4 pointer-events-none z-30 select-none">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] pointer-events-none" 
                  draggable={false}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
