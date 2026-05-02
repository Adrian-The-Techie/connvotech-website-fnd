"use client";

import React from 'react';
import PageHeader from '@/components/ui/PageHeader';

export default function PrivacyPage() {
  const lastUpdated = "May 1, 2026";

  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, fill out a contact form, or communicate with us. This may include your name, email address, company name, phone number, and any other information you choose to provide."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, to communicate with you about your projects, and to respond to your inquiries. We may also use information for internal analytical purposes to better understand how our services are used."
    },
    {
      title: "3. Data Sharing and Disclosure",
      content: "We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf, or when required by law to comply with legal process or protect the rights and safety of Connvotech, our users, or others."
    },
    {
      title: "4. Data Security",
      content: "Connvotech takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. We implement industry-standard encryption and security protocols across our infrastructure."
    },
    {
      title: "5. Your Data Protection Rights",
      content: "In accordance with the Data Protection Act (Kenya), you have the right to access, rectify, or erase your personal data. You also have the right to object to or restrict certain processing of your data. To exercise these rights, please contact us at privacy@connvotech.com."
    },
    {
      title: "6. Cookies and Tracking",
      content: "We use cookies and similar tracking technologies to analyze trends, administer the website, and track users' movements around the website. You can control the use of cookies at the individual browser level."
    },
    {
      title: "7. Changes to this Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date."
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      <PageHeader 
        badge="Legal"
        title={<>Privacy <span className="text-gradient">Policy</span></>}
        subtitle={`Last Updated: ${lastUpdated}. Your privacy is critical to our success. Learn how we protect your data.`}
      />
      
      <div className="max-w-4xl mx-auto px-6 pb-24 relative z-10">
        <div className="prose prose-xl prose-slate max-w-none">
          {sections.map((section, index) => (
            <div key={index} className="mb-16">
              <h2 className="text-2xl md:text-3xl font-display font-black text-brand-black mb-6 tracking-tight">
                {section.title}
              </h2>
              <p className="text-text-gray font-medium leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
          
          <div className="mt-20 p-10 bg-brand-bg rounded-[40px] border border-border-gray">
            <h3 className="text-xl font-display font-black text-brand-black mb-4">Data Protection Officer</h3>
            <p className="text-text-gray font-medium mb-6">
              If you have concerns about your data privacy, our Data Protection Officer is here to help.
            </p>
            <a 
              href="mailto:privacy@connvotech.com" 
              className="inline-flex items-center text-brand-blue font-black text-sm uppercase tracking-widest hover:gap-3 transition-all group"
            >
              Email Privacy Team 
              <svg className="ml-2 group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
