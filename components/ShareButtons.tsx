"use client";

import React from 'react';
import { Linkedin, Twitter, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
  hashtags?: string[];
}

export default function ShareButtons({ title, url, hashtags = [] }: ShareButtonsProps) {
  const formattedHashtags = hashtags
    .map(tag => tag.replace(/\s+/g, ''))
    .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
    .join(' ');

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    // Note: LinkedIn doesn't support pre-filled text/hashtags in the simple share URL anymore, 
    // but we can copy it to clipboard or provide a suggested post text.
    window.open(linkedinUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n${formattedHashtags}`)}&url=${encodeURIComponent(url)}`;
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
          if (navigator.share) {
            navigator.share({ title, url }).catch(console.error);
          } else {
            navigator.clipboard.writeText(url);
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
