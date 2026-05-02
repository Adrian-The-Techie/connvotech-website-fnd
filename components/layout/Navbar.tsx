"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Laptop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getMediaUrl } from '@/lib/utils';
import { getSiteSettings } from '@/lib/api';
import { SiteSettings } from '@/lib/types';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Products', href: '/products' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'News', href: '/news' },
  { name: 'Insights', href: '/insights' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
      scrolled 
        ? "bg-white/80 backdrop-blur-md py-3 border-b border-border-gray shadow-premium-soft" 
        : isHome 
          ? "bg-transparent py-6" 
          : "bg-white/80 backdrop-blur-md py-3 border-b border-border-gray"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 group">
          {settings?.logo ? (
            <div className="h-12 w-auto relative transform group-hover:scale-105 transition-transform duration-500">
               <img src={getMediaUrl(settings.logo)} alt={settings.company_name} className="h-full w-auto object-contain relative z-10" />
            </div>
          ) : (
            <>
              <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg shadow-brand-blue/20">
                <Laptop className="text-white" size={24} />
              </div>
              <span className="text-brand-black font-display font-bold text-xl tracking-tight uppercase group-hover:text-brand-blue transition-colors">
                {settings?.company_name || 'CONNVOTECH'}
              </span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative text-sm font-bold tracking-wide transition-all duration-300 py-1",
                  isActive ? "text-brand-blue" : "text-brand-black hover:text-brand-blue"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="navUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-blue shadow-[0_0_15px_rgba(47,128,237,0.3)]"
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="bg-primary-gradient hover:shadow-glow text-white px-7 py-3 rounded-2xl text-sm font-bold transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-brand-black p-2 hover:bg-black/5 rounded-xl transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-border-gray overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col p-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-bold transition-colors",
                    pathname === link.href ? "text-brand-blue" : "text-brand-black hover:text-brand-blue"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="bg-primary-gradient text-white py-4 rounded-2xl text-center font-bold shadow-lg shadow-brand-blue/20"
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
