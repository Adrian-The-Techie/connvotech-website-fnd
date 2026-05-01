"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

interface StatsBarProps {
  projects: number;
  clients: number;
  years: number;
  industries: number;
}

export default function StatsBar({ projects, clients, years, industries }: StatsBarProps) {
  const stats: Stat[] = [
    { label: "Successful Projects", value: projects || 45, suffix: "+" },
    { label: "Happy Clients", value: clients || 32, suffix: "+" },
    { label: "Years Experience", value: years || 8, suffix: "" },
    { label: "Industries Served", value: industries || 12, suffix: "" },
  ];

  return (
    <div className="bg-brand-bg border-y border-border-gray py-20 px-6 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, i) => (
          <StatItem key={i} stat={stat} index={i} />
        ))}
      </div>
    </div>
  );
}

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = stat.value;
      const duration = 2000;
      const step = (end / duration) * 10;
      
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 10);
      return () => clearInterval(timer);
    }
  }, [isInView, stat.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center group"
    >
      <div className="text-4xl md:text-6xl font-display font-black text-brand-black mb-3 group-hover:scale-105 transition-transform tracking-tighter">
        {count}{stat.suffix}
      </div>
      <div className="text-text-gray text-[10px] uppercase tracking-[0.2em] font-black opacity-80">
        {stat.label}
      </div>
    </motion.div>
  );
}
