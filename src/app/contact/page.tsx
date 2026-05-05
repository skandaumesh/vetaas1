"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Send, Phone, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden font-sans">
      
      {/* Background Accent Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)'
        }}
      />

      {/* Floating Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-[#45bcf6]/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 60, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#36ba98]/20 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center bg-[#0f172a] text-white px-5 py-1.5 rounded-lg mb-8 shadow-sm -rotate-2"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contact Us</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-headline text-6xl md:text-8xl text-[#111827] tracking-tight leading-[0.95] mb-8"
          >
            Build the <span className="text-[#36ba98]">Village</span> <br />
            with <span className="text-[#45bcf6]">Us.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Ready to nurture emotional intelligence in your community? Send us a message and we'll reply shortly.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-gray-50/50 p-6 md:p-12 rounded-[4rem] border border-gray-100 backdrop-blur-xl">
            
            {/* Form Side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-black/5 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-[#45bcf6]/10 flex items-center justify-center text-[#45bcf6]">
                  <MessageSquare size={24} />
                </div>
                <h2 className="font-headline text-3xl text-[#111827] font-bold">Send a Message</h2>
              </div>

              <form 
                action="mailto:kirti.vetaas@gmail.com"
                method="POST"
                encType="text/plain"
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block ml-4">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Jane Doe"
                    className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 text-gray-800 font-bold focus:ring-4 focus:ring-[#45bcf6]/20 transition-all placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block ml-4">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="jane@example.com"
                    className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 text-gray-800 font-bold focus:ring-4 focus:ring-[#45bcf6]/20 transition-all placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 block ml-4">Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    placeholder="How can we help?"
                    className="w-full bg-gray-50 border-none rounded-3xl px-8 py-5 text-gray-800 font-bold focus:ring-4 focus:ring-[#45bcf6]/20 transition-all placeholder:text-gray-300 resize-none"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-[#0f172a] text-white py-6 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-2xl shadow-black/20"
                >
                  Send Message <Send size={16} />
                </button>
              </form>
            </motion.div>

            {/* Info Side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col justify-center p-4 md:p-8"
            >
              <h2 className="font-headline text-4xl md:text-5xl text-[#111827] font-bold mb-8">
                Let's <span className="text-[#ff6e79]">Connect.</span>
              </h2>
              <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
                Whether you're a school principal, a parent, or a potential volunteer, we'd love to hear from you.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center text-[#45bcf6] shadow-xl group-hover:scale-110 transition-transform">
                    <Phone size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Call Us</span>
                    <a href="tel:+918951004160" className="text-2xl font-bold text-[#111827] group-hover:text-[#45bcf6] transition-colors tracking-tight">+91 89510 04160</a>
                  </div>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center text-[#36ba98] shadow-xl group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Email Us</span>
                    <a href="mailto:kirti.vetaas@gmail.com" className="text-xl md:text-2xl font-bold text-[#111827] group-hover:text-[#36ba98] transition-colors break-all tracking-tight">kirti.vetaas@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-16 h-16 rounded-[2rem] bg-white flex items-center justify-center text-[#ff6e79] shadow-xl group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Visit Us</span>
                    <p className="text-2xl font-bold text-[#111827] tracking-tight">Bangalore, India</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </main>
  );
}
