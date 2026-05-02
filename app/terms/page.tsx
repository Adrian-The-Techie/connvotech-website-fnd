"use client";

import React from 'react';
import PageHeader from '@/components/ui/PageHeader';

export default function TermsPage() {
  const lastUpdated = "May 1, 2026";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using the Connvotech website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      title: "2. Description of Service",
      content: "Connvotech provides ICT consultancy, software development, cloud infrastructure management, and digital transformation services. We reserve the right to modify or discontinue any service with or without notice."
    },
    {
      title: "3. Intellectual Property Rights",
      content: "All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of Connvotech or its content suppliers and is protected by international copyright laws. The compilation of all content on this site is the exclusive property of Connvotech."
    },
    {
      title: "4. User Conduct",
      content: "You agree not to use the website for any purpose that is unlawful or prohibited by these Terms. You may not use the website in any manner that could damage, disable, overburden, or impair any Connvotech server, or the network(s) connected to any Connvotech server."
    },
    {
      title: "5. Limitation of Liability",
      content: "In no event shall Connvotech or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Connvotech's website, even if Connvotech or a Connvotech authorized representative has been notified orally or in writing of the possibility of such damage."
    },
    {
      title: "6. Disclaimer",
      content: "The materials on Connvotech's website are provided on an 'as is' basis. Connvotech makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
    },
    {
      title: "7. Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws of Kenya and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location."
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      <PageHeader 
        badge="Legal"
        title={<>Terms of <span className="text-gradient">Service</span></>}
        subtitle={`Last Updated: ${lastUpdated}. Please read these terms carefully before using our services.`}
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
            <h3 className="text-xl font-display font-black text-brand-black mb-4">Questions?</h3>
            <p className="text-text-gray font-medium mb-6">
              If you have any questions about our Terms of Service, please contact our legal team.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center text-brand-blue font-black text-sm uppercase tracking-widest hover:gap-3 transition-all group"
            >
              Contact Legal 
              <svg className="ml-2 group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
