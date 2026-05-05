import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ParentsHero from "@/components/parents/ParentsHero";

export const metadata = {
  title: "SEL For Parents — Vetaas Education Foundation",
  description: "Thoughtfully crafted workshops for parents of children aged 2 to 8.",
};

export default function ParentsPage() {
  return (
    <div className="w-full bg-white font-sans text-gray-900 min-h-screen pt-24 pb-20 relative overflow-hidden">
      
      {/* Subtle Background Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      />

      {/* Decorative sun right side */}
      <div className="absolute top-[-50px] right-[-150px] md:top-[50px] md:right-[-50px] w-[250px] h-[250px] md:w-[320px] md:h-[320px] z-0 pointer-events-none opacity-50">
         <Image src="/sun.jpg" alt="" fill className="object-contain mix-blend-multiply" />
      </div>

      <div className="w-full px-6 md:px-12 lg:px-16 mx-auto relative z-10">
        
        {/* Intro Section (Hero Style) using Client Component for animations */}
        <ParentsHero />

        {/* Our Offerings Title */}
        <h2 className="text-center font-body font-normal text-[3rem] md:text-[4.5rem] leading-[1.05] text-[#111111] mb-16 tracking-tight">
          Our Offerings
        </h2>

        <div className="flex flex-col gap-16 md:gap-24">
          
          {/* Workshops */}
          <div className="relative">
             <div className="border-b-[2.5px] border-[#111111] pb-2 mb-8 w-full md:w-[95%]">
               <h3 className="font-headline text-3xl font-bold tracking-wide">Workshops</h3>
             </div>
             
             <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
               <div className="w-full md:w-[45%] bg-[#fdfaf6] rounded-xl overflow-hidden aspect-[4/3] relative flex justify-center items-center shadow-sm border border-gray-100 p-6">
                 <Image src="/Childrens Playing.png" alt="Workshops" fill className="object-contain p-4" />
               </div>
               <div className="w-full md:w-[55%] font-body">
                 <p className="text-lg md:text-xl text-[#333] mb-6 font-medium leading-relaxed">
                   Our workshops are designed to be immersive, hands-on experiences that go beyond traditional parenting advice. We provide a safe space for parents to explore the nuances of early childhood development, specifically tailored for those with children between the ages of 2 and 8. These sessions combine evidence-based strategies with playful learning, ensuring that every theme discussed is practical and immediately applicable to your daily routine. Join us as we dive deep into the foundations of lifelong learning and emotional resilience.<br/>
                   <span className="block mt-4 font-bold">Key themes of our workshops:</span>
                 </p>
                 <ul className="space-y-3 mb-8 text-lg md:text-xl text-[#333] font-medium ml-2">
                   <li className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-black"></div> Social Emotional Learning
                   </li>
                   <li className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-black"></div> Pre-literacy and Pre-numeracy
                   </li>
                   <li className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-black"></div> Parents Matter
                   </li>
                 </ul>
                 <Link href="/events" className="inline-flex items-center gap-2 bg-[#0CB0D8] text-white px-7 py-2.5 rounded-full font-bold text-lg hover:shadow-md hover:-translate-y-0.5 transition-all">
                   Explore <ArrowRight size={20} />
                 </Link>
               </div>
             </div>
             
             {/* Decor */}
             <div className="absolute right-[-8%] top-[30%] w-24 h-24 pointer-events-none opacity-80 mix-blend-multiply hidden md:block">
               <Image src="/flower.jpg" alt="" fill className="object-cover rounded-full" />
             </div>
          </div>

          {/* Events - MCME */}
          <div className="relative">
             <div className="border-b-[2.5px] border-[#111111] pb-2 mb-8 w-full md:w-[95%]">
               <h3 className="font-headline text-3xl font-bold tracking-wide">Events - MCME</h3>
             </div>
             
             <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-16 items-center">
               <div className="w-full md:w-[55%] font-body">
                 <p className="text-lg md:text-xl text-[#333] mb-6 font-medium leading-relaxed">
                   The 'My Child and Me' (MCME) events are unique celebrations of the special bond between you and your little one. We believe that shared joy is the most powerful catalyst for growth, which is why these events are packed with interactive activities designed to foster deeper connections. From high-energy games that spark laughter to collaborative creative projects, every moment is an opportunity to build lasting memories.<br/>
                   <span className="block mt-4 font-bold">The agenda usually includes:</span>
                 </p>
                 <ul className="space-y-3 mb-8 text-lg md:text-xl text-[#333] font-medium ml-2">
                   <li className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-black"></div> Fun games
                   </li>
                   <li className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-black"></div> Music and dance
                   </li>
                   <li className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-black"></div> Art and craft
                   </li>
                 </ul>
                 <Link href="/events" className="inline-flex items-center gap-2 bg-[#0CB0D8] text-white px-7 py-2.5 rounded-full font-bold text-lg hover:shadow-md hover:-translate-y-0.5 transition-all">
                   Explore <ArrowRight size={20} />
                 </Link>
               </div>
               <div className="w-full md:w-[45%] bg-[#fef6fb] rounded-xl overflow-hidden aspect-[4/3] relative flex justify-center items-center shadow-sm border border-gray-100 p-6">
                 {/* Reusing child image or playing image as placeholder for events */}
                 <Image src="/brightest rays of sunshine.jpg" alt="Events" fill className="object-cover opacity-30" />
                 <Image src="/child.png" alt="Events" fill className="object-contain p-8 z-10" />
               </div>
             </div>
             
             {/* Decor */}
             <div className="absolute left-[-10%] bottom-[-5%] w-20 h-20 pointer-events-none opacity-80 mix-blend-multiply hidden md:block">
               <Image src="/star1.jpg" alt="" fill className="object-cover rounded-full" />
             </div>
          </div>

          {/* Wellness circles */}
          <div className="relative">
             <div className="border-b-[2.5px] border-[#111111] pb-2 mb-8 w-full md:w-[95%]">
               <h3 className="font-headline text-3xl font-bold tracking-wide">Wellness circles</h3>
             </div>
             
             <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
               <div className="w-full md:w-[45%] bg-[#f5fbfa] rounded-xl overflow-hidden aspect-[4/3] relative flex justify-center items-center shadow-sm border border-gray-100 p-6">
                 <Image src="/Childrens Playing.png" alt="Wellness circles" fill className="object-contain p-6" />
               </div>
               <div className="w-full md:w-[55%] font-body">
                 <p className="text-lg md:text-xl text-[#333] mb-6 font-medium leading-relaxed">
                   We recognize that parenting is a journey of both immense joy and significant challenges. Our Wellness Circles offer a compassionate environment where parents can prioritize their own well-being alongside their child's. These gatherings focus on holistic self-care, community support, and the practice of mindfulness. By coming together to share experiences, parents build the emotional capacity needed to show up fully for their families.<br/>
                   <span className="block mt-4 font-bold">Engage in:</span>
                 </p>
                 <ul className="space-y-3 mb-8 text-lg md:text-xl text-[#333] font-medium ml-2">
                   <li className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-black"></div> Wellbeing practices
                   </li>
                   <li className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-black"></div> Community building
                   </li>
                   <li className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-black"></div> Self care
                   </li>
                 </ul>
                 <Link href="/events" className="inline-flex items-center gap-2 bg-[#0CB0D8] text-white px-7 py-2.5 rounded-full font-bold text-lg hover:shadow-md hover:-translate-y-0.5 transition-all">
                   Explore <ArrowRight size={20} />
                 </Link>
               </div>
             </div>
             
             {/* Decor */}
             <div className="absolute right-[-10%] bottom-[10%] w-16 h-16 pointer-events-none opacity-80 mix-blend-multiply hidden md:block">
               <Image src="/star2.jpg" alt="" fill className="object-cover rounded-full" />
             </div>
          </div>
        </div>

        {/* Decorative Diagram (Bottom) */}
        <div className="mt-32 flex justify-center w-full relative">
          <div className="relative w-full max-w-lg aspect-square">
            {/* Circle borders representing the diagram connection */}
            <div className="absolute inset-[15%] rounded-full border-[1.5px] border-gray-300 pointer-events-none"></div>
            
            {/* Center SEL for Parents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center bg-white w-32 h-32 flex flex-col justify-center items-center z-10">
              <span className="font-headline text-5xl text-[#111111]">SEL</span>
              <span className="font-body text-xl text-gray-600">for Parents</span>
            </div>

            {/* 4 Nodes */}
            {/* Top Node */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-[#f6aa61] text-white flex flex-col justify-center items-center text-center shadow-sm z-20 hover:scale-105 transition-transform">
              <span className="font-bold text-sm leading-tight px-2">Emotional<br/>Awareness</span>
            </div>
            {/* Right Node */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-32 h-32 rounded-full bg-[#7bc3a9] text-white flex flex-col justify-center items-center text-center shadow-sm z-20 hover:scale-105 transition-transform">
              <span className="font-bold text-sm leading-tight px-2">Positive<br/>Communication</span>
            </div>
            {/* Bottom Node */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-[#a394ca] text-white flex flex-col justify-center items-center text-center shadow-sm z-20 hover:scale-105 transition-transform">
              <span className="font-bold text-sm leading-tight px-2">Supportive<br/>Environment</span>
            </div>
            {/* Left Node */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-32 rounded-full bg-[#ec6a66] text-white flex flex-col justify-center items-center text-center shadow-sm z-20 hover:scale-105 transition-transform">
              <span className="font-bold text-sm leading-tight px-2">Self Care &<br/>Wellbeing</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
