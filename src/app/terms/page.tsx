import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | Vetaas",
  description: "Terms of Service and Conditions for Vetaas Education Foundation.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <Header />
      <main className="flex-grow pt-[var(--header-height)]">
        <div className="bg-[#faf9f6] py-20 px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h1 className="text-3xl md:text-5xl font-bold font-headline text-[#111827] mb-8">
              Terms & Conditions
            </h1>
            
            <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-2xl font-bold font-headline text-[#111827] mt-8 mb-4">1. Agreement to Terms</h2>
              <p>
                These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Vetaas Education Foundation ("Company," "we," "us," or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
              </p>

              <h2 className="text-2xl font-bold font-headline text-[#111827] mt-8 mb-4">2. Intellectual Property Rights</h2>
              <p>
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
              </p>

              <h2 className="text-2xl font-bold font-headline text-[#111827] mt-8 mb-4">3. User Representations</h2>
              <p>
                By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Use.
              </p>
              
              <h2 className="text-2xl font-bold font-headline text-[#111827] mt-8 mb-4">4. Prohibited Activities</h2>
              <p>
                You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
              </p>

              <h2 className="text-2xl font-bold font-headline text-[#111827] mt-8 mb-4">5. Modifications and Interruptions</h2>
              <p>
                We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
              </p>

              <h2 className="text-2xl font-bold font-headline text-[#111827] mt-8 mb-4">6. Contact Us</h2>
              <p>
                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: kirti.vetaas@gmail.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
