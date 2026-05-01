"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getSiteSettings } from '@/lib/api';
import api from '@/lib/api';
import { Save, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();
  const currentLogo = watch('logo');
  const currentFavicon = watch('favicon');

  useEffect(() => {
    getSiteSettings().then(data => {
      reset(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    setSuccess(false);
    
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'logo' || key === 'favicon') {
        // Only append if it's a FileList (new upload)
        if (data[key] instanceof FileList && data[key][0]) {
          formData.append(key, data[key][0]);
        }
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    try {
      // PATCH to singleton
      await api.patch('/site-settings/1/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Refresh data to show new image URLs
      const updated = await getSiteSettings();
      reset(updated);
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-black">Site Settings</h1>
          <p className="text-gray-500">Configure your company information, branding, and SEO metadata.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 pb-20">
        {/* Section: Branding */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-display font-bold text-brand-black mb-8 border-b border-gray-50 pb-4">Branding</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                 <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Company Logo</label>
                 <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                       {typeof currentLogo === 'string' && currentLogo ? (
                         <img src={currentLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                       ) : (
                         <span className="text-gray-300 text-xs text-center p-2">No Logo Uploaded</span>
                       )}
                    </div>
                    <input type="file" {...register('logo')} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 transition-all cursor-pointer" />
                 </div>
              </div>
              <div className="space-y-4">
                 <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Favicon (32x32)</label>
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                       {typeof currentFavicon === 'string' && currentFavicon ? (
                         <img src={currentFavicon} alt="Favicon" className="w-8 h-8 object-contain" />
                       ) : (
                         <span className="text-gray-300 text-[10px] text-center p-1">No Favicon</span>
                       )}
                    </div>
                    <input type="file" {...register('favicon')} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 transition-all cursor-pointer" />
                 </div>
              </div>
           </div>
        </div>
        {/* Section: Basic Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-display font-bold text-brand-black mb-8 border-b border-gray-50 pb-4">General Information</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Company Name</label>
                <input {...register('company_name')} className="form-input-admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Tagline</label>
                <input {...register('tagline')} className="form-input-admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                <input {...register('email')} className="form-input-admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Phone Number</label>
                <input {...register('phone')} className="form-input-admin" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Physical Address</label>
                <textarea {...register('address')} rows={2} className="form-input-admin resize-none" />
              </div>
           </div>
        </div>

        {/* Section: Socials */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-display font-bold text-brand-black mb-8 border-b border-gray-50 pb-4">Social Media Links</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">LinkedIn URL</label>
                <input {...register('linkedin_url')} className="form-input-admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Twitter URL</label>
                <input {...register('twitter_url')} className="form-input-admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Facebook URL</label>
                <input {...register('facebook_url')} className="form-input-admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Instagram URL</label>
                <input {...register('instagram_url')} className="form-input-admin" />
              </div>
           </div>
        </div>

        {/* Section: Stats */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-display font-bold text-brand-black mb-8 border-b border-gray-50 pb-4">Platform Stats</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Projects</label>
                <input type="number" {...register('stat_projects')} className="form-input-admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Clients</label>
                <input type="number" {...register('stat_clients')} className="form-input-admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Years</label>
                <input type="number" {...register('stat_years')} className="form-input-admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Industries</label>
                <input type="number" {...register('stat_industries')} className="form-input-admin" />
              </div>
           </div>
        </div>

        {/* Section: Hero */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-display font-bold text-brand-black mb-8 border-b border-gray-50 pb-4">Hero Section</h3>
           <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Main Headline</label>
                <input {...register('hero_headline')} className="form-input-admin font-display font-bold text-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Sub-headline</label>
                <textarea {...register('hero_subheadline')} rows={3} className="form-input-admin resize-none" />
              </div>
           </div>
        </div>

        {/* Section: SEO */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-display font-bold text-brand-black mb-8 border-b border-gray-50 pb-4">SEO & Metadata</h3>
           <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Meta Title</label>
                <input {...register('meta_title')} className="form-input-admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Meta Description</label>
                <textarea {...register('meta_description')} rows={3} className="form-input-admin resize-none" />
              </div>
           </div>
        </div>

        {/* Global Action Bar */}
        <div className="fixed bottom-10 right-10 flex items-center gap-4">
           {success && (
             <div className="bg-green-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl animate-bounce-short">
               <AlertCircle size={18} />
               <span className="font-bold text-sm">Settings saved successfully!</span>
             </div>
           )}
           <button 
             type="submit"
             disabled={saving}
             className="bg-brand-blue hover:bg-brand-blue-dark text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-2xl shadow-brand-blue/30 disabled:opacity-50"
           >
             <Save size={20} />
             {saving ? "Saving Changes..." : "Save All Settings"}
           </button>
        </div>
      </form>

      <style jsx global>{`
        .form-input-admin {
          width: 100%;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          outline: none;
          transition: all 0.2s;
        }
        .form-input-admin:focus {
          border-color: #1A9ED4;
          background: white;
          box-shadow: 0 0 0 2px rgba(26, 158, 212, 0.1);
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s ease;
        }
      `}</style>
    </div>
  );
}
