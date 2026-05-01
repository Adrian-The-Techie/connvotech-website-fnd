"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/api';
import { Laptop } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await adminLogin({ username: email, password }); // Django default uses username
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      router.push('/admin');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-12 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-blue/20">
            <Laptop className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-brand-black">Admin Login</h1>
          <p className="text-gray-500 mt-2">Manage the Connvotech platform</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Username / Email</label>
            <input 
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to CMS"}
          </button>
        </form>
      </div>
    </div>
  );
}
