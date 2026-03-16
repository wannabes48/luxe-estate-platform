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
        <main className="min-h-screen flex w-full relative bg-[#FAFAFA]">
            {/* Absolute positioning for the Return Navbar so it hovers over the layout */}
            <div className="absolute top-0 left-0 w-full z-50">
                <ReturnNavBar />
            </div>

            {/* --- LEFT SIDE: Image & Glass Overlay (Hidden on Mobile) --- */}
            <section className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')" }}
                />
                
                {/* Dark Gradient Overlay for readability */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Glassmorphism Content Box */}
                <div className="relative z-10 w-full max-w-md p-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-white transform translate-y-8">
                    <div className="w-12 h-1 bg-emerald-500 mb-6"></div>
                    <h2 className="text-4xl font-serif leading-tight mb-4">
                        Your Gateway to <br />
                        <span className="text-emerald-400">Fractional Wealth.</span>
                    </h2>
                    <p className="text-stone-300 font-light leading-relaxed mb-8">
                        Monitor your digital assets, track M-Pesa yields, and manage your climate-resilient property portfolio from one unified dashboard.
                    </p>
                    
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Polygon Web3</span>
                        <span className="text-white/30">|</span>
                        <span>M-Pesa Integrated</span>
                    </div>
                </div>
            </section>

            {/* --- RIGHT SIDE: The Login Form --- */}
            <section className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20 pt-32 lg:pt-20">
                <div className="w-full max-w-md bg-white p-10 border border-stone-200 shadow-xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif text-stone-900">Welcome Back</h1>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mt-2">
                            Secure Account Access
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">Email Address</label>
                            <input 
                                required 
                                type="email" 
                                className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Password</label>
                                <Link href="#" className="text-[10px] uppercase tracking-widest text-emerald-600 hover:underline">Forgot?</Link>
                            </div>
                            <input 
                                required 
                                type="password" 
                                className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                                onChange={e => setFormData({...formData, password: e.target.value})} 
                            />
                        </div>

                        <button 
                            disabled={loading} 
                            type="submit" 
                            className="w-full mt-8 bg-black text-white py-5 text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all disabled:opacity-50 font-bold shadow-lg"
                        >
                            {loading ? 'Authenticating...' : 'Log In to Portfolio'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-stone-100 text-center">
                        <p className="text-xs text-stone-500">
                            Don't have an account yet? <br/>
                            <Link href="/how-it-works" className="text-emerald-600 font-bold hover:underline mt-1 inline-block uppercase tracking-widest text-[10px]">
                                Learn how to start investing
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}