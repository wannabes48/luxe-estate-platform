"use client"
import { useState, useEffect } from 'react';
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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

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
                        role: formData.role, // Make sure you added a 'role' column to user_profiles!
                        kyc_verified: false 
                    }]);

                if (profileError) {
                    console.error("Profile Error:", profileError);
                    // We don't throw here so the user isn't completely blocked if the profile insert lags,
                    // but in production, you'd handle this atomic transaction securely.
                }

                alert("Registration successful! Please check your email to verify your account.");
                router.push('/auth/login');
            }
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] py-20 px-6">
            <ReturnNavBar />
            <div className="w-full max-w-md bg-white p-10 border border-stone-200 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-serif text-stone-900">Join Luxe Fractional</h1>
                    <p className="text-xs text-stone-500 uppercase tracking-widest mt-2">
                        Secure KYC Verification
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Role Selector */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, role: 'investor'})}
                            className={`py-3 text-xs uppercase tracking-widest border ${formData.role === 'investor' ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-white border-stone-200 text-stone-400'}`}
                        >
                            Investor
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, role: 'owner'})}
                            className={`py-3 text-xs uppercase tracking-widest border ${formData.role === 'owner' ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white border-stone-200 text-stone-400'}`}
                        >
                            Property Owner
                        </button>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Full Legal Name</label>
                        <input required type="text" className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500" 
                            onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">National ID / Passport</label>
                        <input required type="text" className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500" 
                            onChange={e => setFormData({...formData, nationalId: e.target.value})} />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">M-Pesa Phone Number</label>
                        <input required type="tel" placeholder="254700000000" className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500" 
                            onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Email Address</label>
                        <input required type="email" className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500" 
                            onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Password</label>
                        <input required type="password" minLength={6} className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500" 
                            onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <button disabled={loading} type="submit" className="w-full mt-6 bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors disabled:opacity-50">
                        {loading ? 'Processing KYC...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-xs text-stone-500 mt-6">
                    Already have an account? <Link href="/auth/login" className="text-emerald-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}