"use client"
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [phoneInput, setPhoneInput] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        async function fetchProfile() {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (!session || error) {
                router.push('/auth/login');
                return;
            }

            // Fetch from user_profiles table based on your current setup
            const { data, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data) {
                setProfile(data);
                setPhoneInput(data.phone_number || '');
            } else {
                console.error("Profile not found:", profileError);
            }
            setLoading(false);
        }

        fetchProfile();
    }, [router]);

    const handleUpdatePhone = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ phone_number: phoneInput })
                .eq('id', profile.id);

            if (error) throw error;
            
            setProfile({ ...profile, phone_number: phoneInput });
            setMessage({ text: 'Phone number updated successfully.', type: 'success' });
        } catch (error: any) {
            setMessage({ text: error.message || 'Failed to update phone number.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-serif text-2xl">Loading Settings...</div>;

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Dashboard Navigation */}
            <nav className="bg-[#0D0D0D] text-white py-6 px-6 lg:px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/"><h1 className="font-serif text-2xl tracking-wide">Luxe Estate.</h1></Link>
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-white transition-colors">Portfolio</Link>
                    <div className="w-px h-4 bg-stone-700"></div>
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Settings</span>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-6 lg:p-12">
                <div className="mb-12 border-b border-stone-200 pb-8">
                    <h2 className="text-4xl font-serif text-stone-900 mb-2">Account Settings</h2>
                    <p className="text-stone-500 text-sm">Manage your compliance profile and M-Pesa disbursement details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    
                    {/* KYC Status Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white border border-stone-200 p-6 shadow-sm">
                            <h3 className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-4">KYC Status</h3>
                            
                            {profile?.kyc_verified ? (
                                <div className="bg-emerald-50 border border-emerald-100 p-4 flex items-center gap-3">
                                    <span className="text-emerald-600 text-xl">✓</span>
                                    <div>
                                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Verified</p>
                                        <p className="text-[10px] text-emerald-600 mt-1">Trading & Payouts Enabled</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-amber-50 border border-amber-100 p-4 flex items-center gap-3">
                                    <span className="text-amber-600 text-xl">⚠️</span>
                                    <div>
                                        <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">Action Required</p>
                                        <p className="text-[10px] text-amber-700 mt-1">Documents pending review</p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 space-y-4">
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-stone-400">Legal Name</p>
                                    <p className="font-medium text-stone-900 text-sm mt-1">{profile?.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-stone-400">National ID/PASSPORT</p>
                                    <p className="font-mono text-stone-900 text-sm mt-1">{profile?.national_id}</p>
                                </div>
                                <p className="text-[9px] text-stone-400 italic mt-4 border-t border-stone-100 pt-4">
                                    Name and ID cannot be changed after submission to prevent fraud. Contact support for legal name changes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Editable Settings */}
                    <div className="md:col-span-2 space-y-8">
                        
                        {message.text && (
                            <div className={`p-4 text-xs font-bold uppercase tracking-widest ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="bg-white border border-stone-200 p-8 shadow-sm">
                            <h3 className="font-serif text-2xl text-stone-900 mb-6">Financial Details</h3>
                            
                            <form onSubmit={handleUpdatePhone} className="space-y-6">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">M-Pesa Disbursement Number</label>
                                    <p className="text-xs text-stone-500 mb-4">This number is used for purchasing shares via STK Push and receiving your automated monthly rental yields.</p>
                                    <input 
                                        required 
                                        type="tel" 
                                        className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 font-mono text-lg transition-colors"
                                        value={phoneInput}
                                        onChange={(e) => setPhoneInput(e.target.value)}
                                    />
                                </div>

                                <button 
                                    disabled={saving || phoneInput === profile?.phone_number}
                                    type="submit" 
                                    className="bg-[#0D0D0D] text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors disabled:opacity-50 font-bold"
                                >
                                    {saving ? 'Updating...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}