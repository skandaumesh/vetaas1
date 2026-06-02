import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | Vetaas",
  description: "Privacy Policy for Vetaas Education Foundation.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <Header />
      <main className="flex-grow pt-[var(--header-height)]">
        <div className="bg-[#faf9f6] py-20 px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h1 className="text-3xl md:text-5xl font-bold font-headline text-[#111827] mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg text-gray-700 max-w-none space-y-6">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-2xl font-bold font-headline text-[#111827] mt-8 mb-4">1. Introduction</h2>
              <p>
                Welcome to Vetaas Education Foundation. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at kirti.vetaas@gmail.com.
              </p>

              <h2 className="text-2xl font-bold font-headline text-[#111827] mt-8 mb-4">2. Information We Collect</h2>
              <p>
                We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website or otherwise when you contact us.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Names</li>
                <li>Phone Numbers</li>
                <li>Email Addresses</li>
                <li>School Affiliations</li>
              </ul>

              <h2 className="text-2xl font-bold font-headline text-[#111827] mt-8 mb-4">3. How We Use Your Information</h2>
              <p>
                We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
              </p>
              
              <h2 className="text-2xl font-bold font-headline text-[#111827] mt-8 mb-4">4. Will Your Information Be Shared?</h2>
              <p>
                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your personal data to third parties.
              </p>

              <h2 className="text-2xl font-bold font-headline text-[#111827] mt-8 mb-4">5. Contact Us</h2>
              <p>
                If you have questions or comments about this notice, you may email us at kirti.vetaas@gmail.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
