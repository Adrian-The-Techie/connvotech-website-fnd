"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import { Testimonial } from '@/lib/types';
import { getMediaUrl } from '@/lib/utils';
import SectionHeading from '../ui/SectionHeading';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  if(!testimonials || testimonials.length === 0) return null;

  const current = testimonials[index];

  return (
    <section className="py-24 px-6 bg-brand-bg relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Quote size={600} className="text-brand-blue" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeading 
          badge="Testimonials"
          title="Client Success Stories"
          centered
        />

        <div className="relative min-h-[450px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full text-center"
            >
              <div className="flex justify-center gap-1.5 mb-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={24} 
                    className={i < current.rating ? "text-yellow-400 fill-yellow-400" : "text-soft-gray"} 
                  />
                ))}
              </div>
              
              <blockquote className="text-2xl md:text-3xl font-display font-black text-brand-black tracking-tight leading-[1.2] mb-12 max-w-4xl mx-auto">
                &quot;{current.body}&quot;
              </blockquote>

              <div className="flex flex-col items-center">
                {current.avatar && (
                  <div className="w-24 h-24 rounded-full relative overflow-hidden mb-6 border-2 border-brand-blue/20 p-1.5 shadow-premium-soft bg-white">
                    <Image src={getMediaUrl(current.avatar)} alt={current.client_name} fill className="object-cover rounded-full" />
                  </div>
                )}
                <h4 className="text-2xl font-display font-black text-brand-black tracking-tight">{current.client_name}</h4>
                <p className="text-brand-blue text-[10px] uppercase tracking-[0.3em] font-black mt-2">
                  {current.client_title} @ {current.client_company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-8 mt-16">
          <button 
            onClick={prev}
            className="w-14 h-14 rounded-full border border-border-gray bg-white flex items-center justify-center text-brand-black hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all shadow-premium-soft hover:shadow-glow"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={next}
            className="w-14 h-14 rounded-full border border-border-gray bg-white flex items-center justify-center text-brand-black hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all shadow-premium-soft hover:shadow-glow"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
}
