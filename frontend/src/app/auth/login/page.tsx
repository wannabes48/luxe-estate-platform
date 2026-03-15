"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ReturnNavBar from "@/components/ReturnNavBar";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            // 1. Authenticate with Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Fetch their role to route them correctly
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', authData.user.id)
                    .single();

                const userRole = profile?.role || 'investor';

                // 3. Smart Routing
                if (userRole === 'owner') {
                    router.push('/agent/dashboard');
                } else if (userRole === 'admin') {
                    router.push('/admin/yield-distribution');
                } else {
                    router.push('/dashboard'); // Investor Portfolio
                }
            }
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] py-20 px-6">
            <ReturnNavBar />
            <div className="w-full max-w-md bg-white p-10 border border-stone-200 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif text-stone-900">Welcome Back</h1>
                    <p className="text-xs text-stone-500 uppercase tracking-widest mt-2">
                        Access Your Luxe Portfolio
                    </p>
                </div>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs text-center">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Email Address</label>
                        <input required type="email" className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500" 
                            onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Password</label>
                        <input required type="password" className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500" 
                            onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <button disabled={loading} type="submit" className="w-full mt-6 bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors disabled:opacity-50">
                        {loading ? 'Authenticating...' : 'Secure Log In'}
                    </button>
                </form>

                <p className="text-center text-xs text-stone-500 mt-6">
                    Don't have an account? <Link href="/how-it-works" className="text-emerald-600 hover:underline">Start here</Link>
                </p>
            </div>
        </div>
    );
}