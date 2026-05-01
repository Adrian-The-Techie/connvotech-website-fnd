"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Clock, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { submitContactForm } from '@/lib/api';
import { getSiteSettings } from '@/lib/api';
import { SiteSettings } from '@/lib/types';
import SectionHeading from '../ui/SectionHeading';

const contactSchema = z.object({
  full_name: z.string().min(3, "Full name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  service_interest: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection({ hideHeading = false }: { hideHeading?: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContactForm(data);
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
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-brand-blue font-bold hover:text-brand-accent transition-colors uppercase text-sm tracking-widest"
                >
                  Send another message
                </button>
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

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-gray ml-1">Service of Interest *</label>
                  <select 
                    {...register('service_interest')}
                    className="w-full bg-white border border-border-gray rounded-xl px-4 py-3 text-brand-black focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all appearance-none cursor-pointer font-medium"
                  >
                    <option value="">Select a service...</option>
                    <option value="Web Development">Web Development</option>
                    <option value="System Development">System Development</option>
                    <option value="ICT Consultancy">ICT Consultancy</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                  {errors.service_interest && <p className="text-red-500 text-xs mt-1">{errors.service_interest.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-gray ml-1">Message *</label>
                  <textarea 
                    {...register('message')}
                    placeholder="Tell us about your project..."
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
