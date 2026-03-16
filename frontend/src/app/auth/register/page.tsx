"use client"
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ReturnNavBar from '@/components/ReturnNavBar';

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = searchParams.get('role') === 'owner' ? 'owner' : 'investor';

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        nationalId: '',
        role: initialRole
    });
    const [errorMsg, setErrorMsg] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            // 1. Create the user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Save KYC and Role data to our user_profiles table
                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .insert([{
                        id: authData.user.id,
                        full_name: formData.fullName,
                        phone_number: formData.phoneNumber,
                        national_id: formData.nationalId,
                        role: formData.role,
                        kyc_verified: false 
                    }]);

                if (profileError) {
                    console.error("Profile Error:", profileError);
                }

                alert("Registration successful! Please check your email to verify your account.");
                router.push('/auth/login');
            }
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex w-full relative bg-[#FAFAFA]">
            {/* Absolute positioning for the Return Navbar */}
            <div className="absolute top-0 left-0 w-full z-50">
                <ReturnNavBar />
            </div>

            {/* --- LEFT SIDE: Image & Glass Overlay (Hidden on Mobile) --- */}
            <section className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
                {/* Background Image (Different angle/vibe for registration) */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613490900233-0402ef0a2db7?q=80&w=1974&auto=format&fit=crop')" }}
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Glassmorphism Content Box */}
                <div className="relative z-10 w-full max-w-md p-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl text-white transform translate-y-8">
                    <div className="w-12 h-1 bg-emerald-500 mb-6"></div>
                    <h2 className="text-4xl font-serif leading-tight mb-4">
                        Build Your <br />
                        <span className="text-emerald-400">Digital Legacy.</span>
                    </h2>
                    <p className="text-stone-300 font-light leading-relaxed mb-8">
                        Join Luxe Fractional today. Whether you are tokenizing a premium development or investing your first 10,000 KES, the future of real estate is here.
                    </p>
                    
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Strict KYC Security
                        </span>
                    </div>
                </div>
            </section>

            {/* --- RIGHT SIDE: The Registration Form --- */}
            <section className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20 pt-32 lg:pt-20 overflow-y-auto">
                <div className="w-full max-w-md bg-white p-10 border border-stone-200 shadow-xl my-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif text-stone-900">Join Luxe</h1>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mt-2">
                            Secure KYC Verification
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, role: 'investor'})}
                                className={`py-4 text-[10px] uppercase tracking-widest border transition-all font-bold ${formData.role === 'investor' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-inner' : 'bg-white border-stone-200 text-stone-400 hover:border-emerald-300'}`}
                            >
                                Investor
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, role: 'owner'})}
                                className={`py-4 text-[10px] uppercase tracking-widest border transition-all font-bold ${formData.role === 'owner' ? 'bg-stone-900 border-stone-900 text-white shadow-inner' : 'bg-white border-stone-200 text-stone-400 hover:border-stone-400'}`}
                            >
                                Property Owner
                            </button>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">Full Legal Name</label>
                            <input 
                                required 
                                type="text" 
                                className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                                onChange={e => setFormData({...formData, fullName: e.target.value})} 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">National ID / Passport</label>
                                <input 
                                    required 
                                    type="text" 
                                    className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                                    onChange={e => setFormData({...formData, nationalId: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">M-Pesa Number</label>
                                <input 
                                    required 
                                    type="tel" 
                                    placeholder="2547..." 
                                    className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                                    onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
                                />
                            </div>
                        </div>

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
                            <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">Password</label>
                            <input 
                                required 
                                type="password" 
                                minLength={6} 
                                className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                                onChange={e => setFormData({...formData, password: e.target.value})} 
                            />
                        </div>

                        <button 
                            disabled={loading} 
                            type="submit" 
                            className="w-full mt-8 bg-black text-white py-5 text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all disabled:opacity-50 font-bold shadow-lg"
                        >
                            {loading ? 'Processing KYC...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-stone-100 text-center">
                        <p className="text-xs text-stone-500">
                            Already have an account? <br/>
                            <Link href="/auth/login" className="text-emerald-600 font-bold hover:underline mt-1 inline-block uppercase tracking-widest text-[10px]">
                                Log in to your portfolio
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}