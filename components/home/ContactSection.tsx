"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Clock, Linkedin, Twitter, Facebook, Instagram, Package, Settings, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { submitContactForm, getProducts, getServices, getSiteSettings } from '@/lib/api';
import { SiteSettings, Product } from '@/lib/types';
import SectionHeading from '../ui/SectionHeading';

const contactSchema = z.object({
  full_name: z.string().min(3, "Full name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  interest_type: z.enum(['product', 'service'], {
    required_error: "Please select an interest type",
  }),
  interest_id: z.string().min(1, "Please select an item"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

function ContactFormContent({ hideHeading }: { hideHeading?: boolean }) {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      interest_type: 'service',
    }
  });

  const interestType = watch('interest_type');

  useEffect(() => {
    // Fetch data
    getSiteSettings().then(setSettings).catch(console.error);
    getServices().then(data => setServices(data.results || data)).catch(console.error);
    getProducts().then(data => setProducts(data.results || data)).catch(console.error);

    // Handle Prefill from Query Params
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const intent = searchParams.get('intent');

    if (type === 'product' || type === 'service') {
      setValue('interest_type', type as 'product' | 'service');
      
      if (id) {
        setValue('interest_id', id);
      }

      if (name && intent) {
        const prefilledMsg = intent === 'notify' 
          ? `I am interested in ${name}. Please notify me when it is released and provide more details about the roadmap.`
          : intent === 'service'
          ? `I am interested in ${name}. I would like to discuss how this service can help my business and request a consultation.`
          : `I am interested in requesting enterprise access for ${name}. I would like to schedule a demo and discuss implementation for my organization.`;
        setValue('message', prefilledMsg);
      }
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Find the name of the product/service for the backend if needed, 
      // or just send the ID. The backend serializer might need the name.
      const currentList = interestType === 'product' ? products : services;
      const selectedItem = currentList.find(item => (item.slug || item.id) === data.interest_id);
      
      const payload = {
        ...data,
        service_interest: selectedItem ? (selectedItem.name || selectedItem.title) : data.interest_id
      };

      await submitContactForm(payload);
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      alert("There was an error submitting your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      {/* Form Side */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-brand-bg p-8 md:p-12 rounded-[40px] border border-border-gray shadow-premium-soft"
      >
        {submitted ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center mb-6 shadow-premium-soft">
              <Send size={40} />
            </div>
            <h3 className="text-3xl font-display font-bold text-brand-black mb-4">Message Sent!</h3>
            <p className="text-text-gray font-medium">Thank you for reaching out. Our team will get back to you shortly.</p>
            <Link 
              href="/contact"
              onClick={() => setSubmitted(false)}
              className="mt-8 text-brand-blue font-bold hover:text-brand-accent transition-colors uppercase text-sm tracking-widest"
            >
              Send another message
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-gray ml-1">Full Name *</label>
                <input 
                  {...register('full_name')}
                  placeholder="John Doe"
                  className="w-full bg-white border border-border-gray rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-300 font-medium"
                />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-gray ml-1">Company (Optional)</label>
                <input 
                  {...register('company')}
                  placeholder="Acme Inc."
                  className="w-full bg-white border border-border-gray rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-300 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-gray ml-1">Email *</label>
                <input 
                  {...register('email')}
                  placeholder="john@example.com"
                  className="w-full bg-white border border-border-gray rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-300 font-medium"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-gray ml-1">Phone Number</label>
                <input 
                  {...register('phone')}
                  placeholder="+254..."
                  className="w-full bg-white border border-border-gray rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-300 font-medium"
                />
              </div>
            </div>

            {/* Product / Service Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-gray ml-1">I am interested in a:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setValue('interest_type', 'product');
                    setValue('interest_id', '');
                  }}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all font-bold text-sm ${
                    interestType === 'product' 
                    ? 'bg-brand-blue border-brand-blue text-white shadow-glow' 
                    : 'bg-white border-border-gray text-text-gray hover:border-brand-blue/30'
                  }`}
                >
                  <Package size={18} /> Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue('interest_type', 'service');
                    setValue('interest_id', '');
                  }}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all font-bold text-sm ${
                    interestType === 'service' 
                    ? 'bg-brand-blue border-brand-blue text-white shadow-glow' 
                    : 'bg-white border-border-gray text-text-gray hover:border-brand-blue/30'
                  }`}
                >
                  <Settings size={18} /> Service
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-gray ml-1">
                Select {interestType === 'product' ? 'Product' : 'Service'} *
              </label>
              <div className="relative">
                <select 
                  {...register('interest_id')}
                  className="w-full bg-white border border-border-gray rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="">Choose a {interestType}...</option>
                  {interestType === 'product' ? (
                    products.map(p => (
                      <option key={p.id} value={p.slug || p.id}>{p.name}</option>
                    ))
                  ) : (
                    services.map(s => (
                      <option key={s.id} value={s.slug || s.id}>{s.title}</option>
                    ))
                  )}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-gray">
                  <ChevronDown size={18} />
                </div>
              </div>
              {errors.interest_id && <p className="text-red-500 text-xs mt-1">{errors.interest_id.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-gray ml-1">Message *</label>
              <textarea 
                {...register('message')}
                placeholder="Tell us about your requirements..."
                rows={5}
                className="w-full bg-white border border-border-gray rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all resize-none placeholder:text-slate-300 font-medium"
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-gradient text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-premium-soft hover:shadow-glow hover:-translate-y-1"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send size={20} />
            </button>
          </form>
        )}
      </motion.div>

      {/* Info Side */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-12 py-6"
      >
        <div className="space-y-8">
          <h3 className="text-3xl font-display font-black text-brand-black tracking-tighter">Contact Information</h3>
          <div className="space-y-8">
            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-soft-gray rounded-2xl flex items-center justify-center text-brand-blue shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-premium-soft border border-border-gray">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-gray mb-1">Email Us</p>
                <p className="text-lg font-bold text-brand-black group-hover:text-brand-blue transition-colors">{settings?.email || "info@connvotech.com"}</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-soft-gray rounded-2xl flex items-center justify-center text-brand-blue shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-premium-soft border border-border-gray">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-gray mb-1">Call Us</p>
                <p className="text-lg font-bold text-brand-black group-hover:text-brand-blue transition-colors">{settings?.phone || "+254 700 000000"}</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-soft-gray rounded-2xl flex items-center justify-center text-brand-blue shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-premium-soft border border-border-gray">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-gray mb-1">Visit Us</p>
                <p className="text-lg font-bold text-brand-black group-hover:text-brand-blue transition-colors whitespace-pre-line">{settings?.address || "Nairobi, Kenya"}</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-soft-gray rounded-2xl flex items-center justify-center text-brand-blue shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-premium-soft border border-border-gray">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-gray mb-1">Business Hours</p>
                <p className="text-lg font-bold text-brand-black group-hover:text-brand-blue transition-colors">Mon - Fri: 8 AM - 5 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xl font-display font-black text-brand-black tracking-tight">Follow Our Journey</h4>
          <div className="flex gap-4">
             {settings?.linkedin_url && <SocialBtn href={settings.linkedin_url} icon={<Linkedin size={20} />} />}
             {settings?.twitter_url && <SocialBtn href={settings.twitter_url} icon={<Twitter size={20} />} />}
             {settings?.facebook_url && <SocialBtn href={settings.facebook_url} icon={<Facebook size={20} />} />}
             {settings?.instagram_url && <SocialBtn href={settings.instagram_url} icon={<Instagram size={20} />} />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContactSection({ hideHeading = false }: { hideHeading?: boolean }) {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden" id="contact">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-brand-blue/5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {!hideHeading && (
          <SectionHeading 
            badge="Get In Touch"
            title="Let's Build Something Great"
            subtitle="Ready to transform your business scale? Reach out to us for a consultation."
          />
        )}

        <Suspense fallback={<div className="h-[600px] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>}>
          <ContactFormContent hideHeading={hideHeading} />
        </Suspense>
      </div>
    </section>
  );
}

function SocialBtn({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="w-14 h-14 bg-white hover:bg-brand-blue hover:text-white rounded-2xl flex items-center justify-center text-text-gray transition-all border border-border-gray shadow-premium-soft"
    >
      {icon}
    </a>
  );
}
