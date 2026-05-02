"use client";

import React, { useEffect, useState } from 'react';
import { getAdminSubmissions, getAdminSubmission, updateLeadStatus, addLeadInteraction } from '@/lib/api';
import { ContactSubmission, LeadInteraction } from '@/lib/types';
import { Mail, CheckCircle, Clock, X, Send, User, Building, Phone, AlertCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const LEAD_STATUSES = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700' },
  potential: { label: 'Potential Lead', color: 'bg-purple-100 text-purple-700' },
  hot: { label: 'Hot Lead', color: 'bg-red-100 text-red-700' },
  cold: { label: 'Cold Lead', color: 'bg-gray-100 text-gray-700' },
  closed: { label: 'Closed', color: 'bg-green-100 text-green-700' },
};

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [newNote, setNewNote] = useState('');
  const [interactionType, setInteractionType] = useState('note');

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getAdminSubmissions();
      const results = data.results || data;
      setSubmissions(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const openSubmission = async (id: string) => {
    try {
      // Opening submission fetches full details and automatically marks it as read in backend
      const data = await getAdminSubmission(id);
      setSelectedSubmission(data);
      // Update local list state to mark as read so UI feels fast
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, is_read: true, read_by: data.read_by, read_at: data.read_at } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedSubmission) return;
    try {
      await updateLeadStatus(selectedSubmission.id, status);
      setSelectedSubmission(prev => prev ? { ...prev, lead_status: status as any } : null);
      setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, lead_status: status as any } : s));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !newNote.trim()) return;
    try {
      const interaction = await addLeadInteraction(selectedSubmission.id, {
        interaction_type: interactionType,
        notes: newNote
      });
      setSelectedSubmission(prev => prev ? {
        ...prev,
        interactions: [interaction, ...(prev.interactions || [])]
      } : null);
      setNewNote('');
    } catch (err) {
      console.error("Failed to add interaction", err);
    }
  };

  return (
    <div className="flex h-full gap-6">
      {/* List View */}
      <div className={cn("flex-1 space-y-6 transition-all duration-300", selectedSubmission ? "hidden lg:block lg:w-1/3" : "w-full")}>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-black">Lead CRM</h1>
            <p className="text-gray-500">Manage enquiries and potential clients.</p>
          </div>
          <button 
            onClick={fetchSubmissions}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-bold transition-all"
          >
            Refresh Data
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Lead Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 hidden md:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                   <td colSpan={2} className="px-6 py-10 text-center text-gray-400">Loading leads...</td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                   <td colSpan={2} className="px-6 py-10 text-center text-gray-400">No leads found.</td>
                </tr>
              ) : submissions.map((sub) => (
                <tr 
                  key={sub.id} 
                  onClick={() => openSubmission(sub.id)}
                  className={cn(
                  "cursor-pointer hover:bg-gray-50 transition-colors",
                  !sub.is_read ? "bg-amber-50/10 border-l-4 border-amber-400" : "border-l-4 border-transparent",
                  selectedSubmission?.id === sub.id && "bg-brand-blue/5 border-l-brand-blue"
                )}>
                  <td className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-brand-black text-sm">{sub.full_name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{sub.service_interest}</p>
                      </div>
                      {!sub.is_read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 mt-1"></span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                     <span className={cn(
                       "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest whitespace-nowrap",
                       (LEAD_STATUSES[sub.lead_status as keyof typeof LEAD_STATUSES] || LEAD_STATUSES.new).color
                     )}>
                       {(LEAD_STATUSES[sub.lead_status as keyof typeof LEAD_STATUSES] || LEAD_STATUSES.new).label}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail View Panel */}
      {selectedSubmission && (
        <div className="flex-1 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col h-[calc(100vh-8rem)] overflow-hidden animate-in slide-in-from-right-8 duration-300">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-display font-bold text-brand-black">{selectedSubmission.full_name}</h2>
                <select 
                  value={selectedSubmission.lead_status || 'new'}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full outline-none border-none cursor-pointer appearance-none",
                    (LEAD_STATUSES[selectedSubmission.lead_status as keyof typeof LEAD_STATUSES] || LEAD_STATUSES.new).color
                  )}
                >
                  {Object.entries(LEAD_STATUSES).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-500">Interested in: <span className="font-bold text-brand-black">{selectedSubmission.service_interest}</span></p>
            </div>
            <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
               <AlertCircle className="text-brand-blue mt-0.5" size={18} />
               <div>
                  <p className="text-sm font-bold text-brand-blue">Automated Receipt Sent</p>
                  <p className="text-xs text-blue-800/80 mt-1">An automated email was sent to the client acknowledging their request. Further email conversations should happen directly via your email client using the address below.</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                <Mail className="text-gray-400" size={18} />
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Email Address</p>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-sm font-medium text-brand-black hover:text-brand-blue truncate block">{selectedSubmission.email}</a>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                <Phone className="text-gray-400" size={18} />
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-bold text-gray-400">Phone Number</p>
                  <a href={`tel:${selectedSubmission.phone}`} className="text-sm font-medium text-brand-black hover:text-brand-blue truncate block">{selectedSubmission.phone || 'N/A'}</a>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 col-span-2">
                <Building className="text-gray-400" size={18} />
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Company</p>
                  <p className="text-sm font-medium text-brand-black">{selectedSubmission.company || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <FileText size={14} /> Client Message
              </h3>
              <div className="bg-gray-50 p-5 rounded-2xl text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100">
                {selectedSubmission.message}
              </div>
            </div>

            {selectedSubmission.read_by && selectedSubmission.read_at && (
              <p className="text-xs text-gray-400 text-right italic">
                First read by {selectedSubmission.read_by.first_name || selectedSubmission.read_by.username} on {new Date(selectedSubmission.read_at).toLocaleString()}
              </p>
            )}

            <hr className="border-gray-100 my-2" />

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Lead Interactions & Notes</h3>
              
              <form onSubmit={handleAddInteraction} className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex gap-2 mb-3">
                  {['note', 'email', 'call'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInteractionType(type)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors",
                        interactionType === type ? "bg-brand-blue text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder={`Add a ${interactionType}...`}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-blue resize-none mb-3"
                  rows={3}
                  required
                />
                <div className="flex justify-end">
                  <button type="submit" className="bg-brand-black hover:bg-gray-800 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                    <Send size={14} /> Save {interactionType}
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {!selectedSubmission.interactions || selectedSubmission.interactions.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No interactions recorded yet.</p>
                ) : (
                  selectedSubmission.interactions.map(interaction => (
                    <div key={interaction.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-brand-blue bg-blue-50 px-2 py-1 rounded">
                          {interaction.interaction_type}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(interaction.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{interaction.notes}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 border-t border-gray-50 pt-2">
                        <User size={12} />
                        {interaction.user?.first_name || interaction.user?.username || 'Unknown User'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
