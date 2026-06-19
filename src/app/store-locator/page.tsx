import React from "react";
import { MapPin } from "lucide-react";

export const metadata = {
  title: "Store Locator | Vetaas",
  description: "Find Vetaas Education Foundation's physical location.",
};

export default function StoreLocatorPage() {
  return (
    <div className="min-h-screen flex flex-col font-body bg-[#faf9f7] pt-[calc(var(--header-height)+3rem)] pb-24">
      <main className="flex-grow">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          
          <div className="text-center mb-16">
            <h1 className="font-headline text-5xl md:text-7xl font-bold text-[#111827] tracking-tight mb-6">
              Our Location
            </h1>
            <div className="w-16 h-1.5 bg-[#00CDBA] mx-auto rounded-full" />
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col items-center">
            
            <div className="w-16 h-16 rounded-full bg-[#00CDBA]/10 flex items-center justify-center text-[#00CDBA] mb-8">
              <MapPin size={32} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-headline">
              Visit Us
            </h2>

            <div className="text-center text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
              <p>21, Dhanlalshmi,</p>
              <p>The Nest Studio, 2nd floor,</p>
              <p>Kanakapura Main Rd,</p>
              <p>J. P. Nagar, Phase 1</p>
              <p>Bengaluru, Karnataka 560082</p>
            </div>

            <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
              <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                src="https://maps.google.com/maps?q=21,+Dhanlalshmi,+The+Nest+Studio,+2nd+floor,+Kanakapura+Main+Rd,+J.+P.+Nagar,+Phase+1,+Bengaluru,+Karnataka+560082&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="mt-10 text-center">
              <a 
                href="https://maps.app.goo.gl/eDUjxb3UagczEzxz6?g_st=ic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#111827] text-white font-bold rounded-full hover:bg-[#2a3852] transition-colors shadow-md"
              >
                Open in Google Maps
              </a>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
