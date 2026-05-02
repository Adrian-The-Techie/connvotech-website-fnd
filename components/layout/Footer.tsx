"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Laptop, Linkedin, Twitter, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { getSiteSettings } from '@/lib/api';
import { SiteSettings } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';

const footerLinks = [
  { 
    title: "Quick Links", 
    links: [
      { name: "Services", href: "/services" },
      { name: "Portfolio", href: "/portfolio" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ] 
  },
  { 
    title: "Services", 
    links: [
      { name: "Web Development", href: "/services/web-development" },
      { name: "System Development", href: "/services/system-development" },
      { name: "UI/UX Design", href: "/services/ui-ux-design" },
      { name: "Cloud Infrastructure", href: "/services/cloud-infrastructure" },
    ] 
  }
];

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  const companyName = settings?.company_name || "Connvotech Solutions";
  const address = settings?.address || "Nairobi, Kenya";
  const email = settings?.email || "info@connvotech.com";
  const phone = settings?.phone || "+254 700 000000";

  return (
    <footer className="bg-brand-bg text-brand-black pt-20 pb-10 border-t border-border-gray">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              {settings?.logo ? (
                <div className="h-12 w-auto relative">
                   <img src={getMediaUrl(settings.logo)} alt={companyName} className="h-full w-auto object-contain" />
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center shadow-premium-soft">
                    <Laptop className="text-white" size={24} />
                  </div>
                  <span className="font-display font-bold text-xl tracking-tight uppercase text-brand-black">{companyName}</span>
                </>
              )}
            </Link>
            <p className="text-text-gray leading-relaxed max-w-xs font-medium">
              {settings?.tagline || "Empowering businesses through innovative ICT solutions. We don't just build systems; we engineer growth."}
            </p>
            <div className="flex space-x-4">
              {settings?.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-border-gray rounded-full flex items-center justify-center text-text-gray hover:text-white hover:bg-brand-blue hover:border-transparent hover:shadow-premium-soft transition-all">
                  <Linkedin size={18} />
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-border-gray rounded-full flex items-center justify-center text-text-gray hover:text-white hover:bg-brand-blue hover:border-transparent hover:shadow-premium-soft transition-all">
                  <Twitter size={18} />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-border-gray rounded-full flex items-center justify-center text-text-gray hover:text-white hover:bg-brand-blue hover:border-transparent hover:shadow-premium-soft transition-all">
                  <Facebook size={18} />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-border-gray rounded-full flex items-center justify-center text-text-gray hover:text-white hover:bg-brand-blue hover:border-transparent hover:shadow-premium-soft transition-all">
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Links Cols */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-black text-lg mb-8 text-brand-black uppercase tracking-tight">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-text-gray hover:text-brand-blue transition-colors font-medium">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Col */}
          <div>
            <h4 className="font-display font-black text-lg mb-8 text-brand-black uppercase tracking-tight">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start space-x-4 text-text-gray font-medium">
                <MapPin className="text-brand-blue shrink-0" size={20} />
                <span className="whitespace-pre-line">{address}</span>
              </li>
              <li className="flex items-center space-x-4 text-text-gray font-medium">
                <Phone className="text-brand-blue shrink-0" size={20} />
                <span>{phone}</span>
              </li>
              <li className="flex items-center space-x-4 text-text-gray font-medium">
                <Mail className="text-brand-blue shrink-0" size={20} />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-border-gray flex flex-col md:flex-row justify-between items-center text-text-gray text-xs font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {companyName} Ltd. All rights reserved.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <Link href="/privacy" className="hover:text-brand-blue transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-blue transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>

  );
}
