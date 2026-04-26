"use client"
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Check, X, Eye, ShieldCheck, Clock } from 'lucide-react';

export default function AdminKYCDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [urls, setUrls] = useState<{ front: string; back: string }>({ front: '', back: '' });

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    async function fetchPendingUsers() {
        setLoading(true);
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('kyc_status', 'pending')
            .order('created_at', { ascending: false });

        if (!error) setUsers(data || []);
        setLoading(false);
    }

    async function handleReview(user: any) {
        setSelectedUser(user);
        
        // Generate temporary Signed URLs for private files (valid for 15 mins)
        const { data: frontData } = await supabase.storage
            .from('kyc_documents')
            .createSignedUrl(user.id_front_url, 900);
            
        const { data: backData } = await supabase.storage
            .from('kyc_documents')
            .createSignedUrl(user.id_back_url, 900);

        setUrls({
            front: frontData?.signedUrl || '',
            back: backData?.signedUrl || ''
        });
    }

    async function updateStatus(status: 'verified' | 'unverified') {
        if (!selectedUser) return;
        setActionLoading(true);

        try {
            const response = await fetch('/api/admin/kyc-approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    status: status,
                    userName: selectedUser.full_name
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update status');
            }

            // Success: Close the panel and refresh the list
            setSelectedUser(null);
            fetchPendingUsers();
            
        } catch (error) {
            console.error(error);
            alert("Error updating KYC status. Please check the logs.");
        } finally {
            setActionLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <span className="text-[#E91E63] tracking-[0.3em] text-[10px] uppercase font-bold">Compliance Portal</span>
                    <h1 className="text-4xl font-serif text-stone-900 mt-2">KYC Review Queue</h1>
                </header>

                {loading ? (
                    <div className="text-stone-400 text-xs uppercase tracking-widest">Loading queue...</div>
                ) : (
                    <div className="bg-white border border-stone-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-stone-50 border-b border-stone-200">
                                    <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold">Investor</th>
                                    <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold">ID Number</th>
                                    <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold">Submission Date</th>
                                    <th className="p-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-stone-900 text-sm">{user.full_name}</div>
                                            <div className="text-xs text-stone-500">{user.email || 'Phone Verified'}</div>
                                        </td>
                                        <td className="p-4 text-sm font-mono text-stone-600">{user.national_id}</td>
                                        <td className="p-4 text-xs text-stone-500 flex items-center gap-2">
                                            <Clock size={12} />
                                            {new Date(user.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleReview(user)}
                                                className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-2 ml-auto"
                                            >
                                                <Eye size={14} /> Review Docs
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && (
                            <div className="p-20 text-center text-stone-400 text-sm">No pending verifications.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Slide-over Review Panel */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
                    <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                        <header className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-2xl font-serif text-stone-900">{selectedUser.full_name}</h2>
                                <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">ID: {selectedUser.national_id} // KRA: {selectedUser.kra_pin || 'N/A'}</p>
                            </div>
                            <button onClick={() => setSelectedUser(null)} className="text-stone-400 hover:text-stone-900"><X /></button>
                        </header>

                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block mb-4">Document Scans</label>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <span className="text-[10px] text-stone-500 uppercase font-bold">Front Side</span>
                                        <img src={urls.front} className="w-full border border-stone-200 rounded-lg" alt="Front" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[10px] text-stone-500 uppercase font-bold">Back Side</span>
                                        <img src={urls.back} className="w-full border border-stone-200 rounded-lg" alt="Back" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <footer className="mt-12 pt-8 border-t border-stone-100 flex gap-4">
                            <button 
                                disabled={actionLoading}
                                onClick={() => updateStatus('unverified')}
                                className="flex-1 border border-red-200 text-red-600 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-red-50 transition-colors"
                            >
                                Reject Submission
                            </button>
                            <button 
                                disabled={actionLoading}
                                onClick={() => updateStatus('verified')}
                                className="flex-1 bg-emerald-600 text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                            >
                                <ShieldCheck size={16} /> Approve Investor
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}