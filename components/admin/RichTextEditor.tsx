"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-50 border border-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Loading Editor...</div>
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden focus-within:border-brand-blue transition-all">
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="h-64 mb-12 bg-white"
      />
    </div>
  );
}
