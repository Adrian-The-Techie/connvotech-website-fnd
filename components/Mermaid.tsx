"use client";

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.contentLoaded();
      // Force render
      const renderDiagram = async () => {
         try {
            const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart);
            if (ref.current) ref.current.innerHTML = svg;
         } catch (err) {
            console.error("Mermaid Render Error", err);
         }
      };
      renderDiagram();
    }
  }, [chart]);

  return <div key={chart} ref={ref} className="mermaid flex justify-center my-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 overflow-x-auto" />;
};

export default Mermaid;
