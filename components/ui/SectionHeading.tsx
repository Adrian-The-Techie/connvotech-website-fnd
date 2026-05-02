import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
}

export default function SectionHeading({ 
  badge, 
  title, 
  subtitle, 
  centered = true, 
  dark = false 
}: SectionHeadingProps) {
  return (
    <div className={cn(
      "mb-16 max-w-3xl",
      centered ? "mx-auto text-center" : "text-left"
    )}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4",
            "bg-brand-blue/5 text-brand-blue border border-brand-blue/10"
          )}
        >
          {badge}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={cn(
          "text-3xl md:text-4xl font-display font-bold leading-tight mb-6",
          "text-brand-black"
        )}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={cn(
            "text-lg leading-relaxed",
            "text-text-gray"
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
