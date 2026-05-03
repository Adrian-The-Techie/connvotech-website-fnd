"use client";

import React from 'react';
import { Linkedin, Twitter, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
  hashtags?: string[];
}

export default function ShareButtons({ title, url: initialUrl, hashtags = [] }: ShareButtonsProps) {
  const [url, setUrl] = React.useState(initialUrl || '');

  React.useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, [url]);

  const formattedHashtags = hashtags
    .map(tag => tag.replace(/\s+/g, ''))
    .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
    .join(' ');

  const handleLinkedInShare = () => {
    const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(finalUrl)}`;
    window.open(linkedinUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n${formattedHashtags}`)}&url=${encodeURIComponent(finalUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div className="flex items-center gap-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2">Share Case Study:</p>
      <button 
        onClick={handleLinkedInShare}
        className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0077b5] hover:border-[#0077b5]/30 transition-all shadow-sm group"
        title="Share on LinkedIn"
      >
        <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
      </button>
      <button 
        onClick={handleTwitterShare}
        className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-black hover:border-brand-black/30 transition-all shadow-sm group"
        title="Share on X"
      >
        <Twitter size={18} className="group-hover:scale-110 transition-transform" />
      </button>
      <button 
        onClick={() => {
          const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
          if (navigator.share) {
            navigator.share({ title, url: finalUrl }).catch(console.error);
          } else {
            navigator.clipboard.writeText(finalUrl);
            alert('Link copied to clipboard!');
          }
        }}
        className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-blue hover:border-brand-blue/30 transition-all shadow-sm group"
        title="Copy Link"
      >
        <Share2 size={18} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
