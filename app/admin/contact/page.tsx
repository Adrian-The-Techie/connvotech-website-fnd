"use client";

import React, { useEffect, useState } from 'react';
import { getAdminSubmissions, markSubmissionAsRead } from '@/lib/api';
import { ContactSubmission } from '@/lib/types';
import { Mail, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const data = await getAdminSubmissions();
      // Django DRF paginated returns results
      setSubmissions(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markSubmissionAsRead(id);
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, is_read: true } : s));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-black">Contact Submissions</h1>
          <p className="text-gray-500">View and respond to client enquiries from the website.</p>
        </div>
        <button 
          onClick={fetchSubmissions}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-bold transition-all"
        >
          Refresh Data
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Client</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Service</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500">Submitted</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500 text-center">Status</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                   <td colSpan={5} className="px-8 py-10 text-center text-gray-400">Loading submissions...</td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-8 py-10 text-center text-gray-400">No submissions found.</td>
                </tr>
              ) : submissions.map((sub) => (
                <tr key={sub.id} className={cn(
                  "hover:bg-gray-50/50 transition-colors",
                  !sub.is_read && "bg-amber-50/20"
                )}>
                  <td className="px-8 py-5">
                    <p className="font-bold text-brand-black">{sub.full_name}</p>
                    <p className="text-xs text-gray-500">{sub.email}</p>
                  </td>
                  <td className="px-8 py-5 font-medium text-sm text-gray-600">
                    {sub.service_interest}
                  </td>
                  <td className="px-8 py-5 text-xs text-gray-500">
                    {new Date(sub.submitted_at).toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-center">
                    {!sub.is_read ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        <Clock size={10} />
                        Unread
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        <CheckCircle size={10} />
                        Read
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    {!sub.is_read && (
                      <button 
                        onClick={() => handleMarkRead(sub.id)}
                        className="text-brand-blue font-bold text-xs hover:underline"
                      >
                        Mark as Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
