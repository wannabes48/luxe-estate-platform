"use client"
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ReturnNavBar from '@/components/ReturnNavBar';

// 1. We rename your original component to RegisterForm (and remove 'export default')
function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = searchParams.get('role') === 'owner' ? 'owner' : 'investor';

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Auth Mode State for Phone OTP
    const [authMode, setAuthMode] = useState<'standard' | 'phone_otp'>('standard');
    const [otpPhone, setOtpPhone] = useState('');

    // Standard Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        nationalId: '',
        role: initialRole
    });

    // --- GOOGLE SSO ---
    const handleGoogleLogin = async () => {
        setErrorMsg('');
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'select_account',
                },
            },
        });
        if (error) setErrorMsg(error.message);
    };

    // --- WEB3 WALLET (MetaMask) ---
    const handleWeb3Login = async () => {
        setErrorMsg('');
        if (typeof window === 'undefined' || !(window as any).ethereum) {
            setErrorMsg("MetaMask is not installed. Please install it to use Web3 login.");
            return;
        }

        try {
            setLoading(true);
            const eth = (window as any).ethereum;
            const accounts = await eth.request({ method: 'eth_requestAccounts' });
            const address = accounts[0];
            
            setSuccessMsg(`Wallet Connected: ${address.substring(0, 6)}...${address.substring(38)}. Proceeding...`);
            setTimeout(() => router.push('/dashboard'), 2000);

        } catch (error: any) {
            setErrorMsg(error.message || "Wallet connection failed.");
        } finally {
            setLoading(false);
        }
    };

    // --- PHONE OTP ---
    const handlePhoneOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            let formattedPhone = otpPhone.replace(/[^0-9]/g, '');
            if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.substring(1);
            if (!formattedPhone.startsWith('+')) formattedPhone = '+' + formattedPhone;

            const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });

            if (error) throw error;
            setSuccessMsg(`OTP sent to ${formattedPhone}. Check your messages.`);
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- STANDARD MANUAL REGISTRATION ---
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                data: {
                    full_name: formData.fullName, // Storing in metadata as backup
                },
                },
            });

            if (authError) throw authError;

            if (authData.user) {
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

                if (profileError) console.error("Profile Error:", profileError);

                setIsSubmitted(true);

            }
        } catch (error: any) {
            setErrorMsg(error.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex w-full relative bg-[#FAFAFA]">


            {/* --- LEFT SIDE: Image & Glass Overlay --- */}
            <section className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{ backgroundImage: "url('https://vaal.co.ke/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-11-at-09.27.43-jpeg.webp')" }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

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
                    {isSubmitted ? (
                        /* SUCCESS / VERIFICATION VIEW */
                        <div className="text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-serif text-stone-900 mb-4">Verify your email</h1>
                            <p className="text-sm text-stone-500 leading-relaxed mb-8">
                                we have sent a verification link to <span className="font-bold text-stone-900">{formData.email}</span>. 
                                Please check your inbox and click the link to activate your account.
                            </p>
                            <button 
                                onClick={() => router.push('/auth/login')}
                                className="w-full bg-black text-white py-5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-emerald-600 transition-all shadow-lg"
                            >
                                Go to Login
                            </button>
                            <p className="mt-6 text-[10px] text-stone-400 uppercase tracking-widest">
                                Did not receive it? Check your spam folder.
                            </p>
                        </div>
                    ) : (
                        <>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif text-stone-900">Join Luxe</h1>
                        <p className="text-xs text-stone-500 uppercase tracking-widest mt-2">
                            Choose your preferred method
                        </p>
                    </div>

                    {errorMsg && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs">{errorMsg}</div>}
                    {successMsg && <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-xs">{successMsg}</div>}

                    {authMode === 'standard' && (
                        <div className="space-y-3 mb-8">
                            <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200 text-stone-700 py-3 text-xs uppercase tracking-widest font-bold hover:bg-stone-50 transition-colors">
                                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                Continue with Google
                            </button>
                            <button onClick={handleWeb3Login} type="button" className="w-full flex items-center justify-center gap-3 bg-[#F6851B]/10 border border-[#F6851B]/30 text-[#F6851B] py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#F6851B]/20 transition-colors">
                                <svg className="w-4 h-4" viewBox="0 0 100 100" fill="none"><path d="M91.8 45.4L50 14.1 8.2 45.4l11.4 34.1h60.8l11.4-34.1z" fill="#E2761B"/><path d="M50 14.1L8.2 45.4l26.9 8.2L50 14.1z" fill="#E4761B"/><path d="M50 14.1l41.8 31.3-26.9 8.2L50 14.1z" fill="#F6851B"/><path d="M50 82.2L35.1 53.6l14.9-20.9 14.9 20.9L50 82.2z" fill="#E4761B"/></svg>
                                Connect Web3 Wallet
                            </button>
                            <button onClick={() => setAuthMode('phone_otp')} type="button" className="w-full flex items-center justify-center gap-3 bg-stone-900 border border-stone-900 text-white py-3 text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors">
                                📱 Continue with Phone (SMS)
                            </button>
                        </div>
                    )}

                    {authMode === 'standard' && (
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px bg-stone-200 flex-1"></div>
                            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Or register with email</span>
                            <div className="h-px bg-stone-200 flex-1"></div>
                        </div>
                    )}

                    {authMode === 'phone_otp' ? (
                        <form onSubmit={handlePhoneOtp} className="space-y-5 animate-in fade-in zoom-in duration-300">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">Phone Number (For SMS OTP)</label>
                                <input required type="tel" placeholder="+254 7..." className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-lg" value={otpPhone} onChange={e => setOtpPhone(e.target.value)} />
                            </div>
                            <button disabled={loading} type="submit" className="w-full bg-black text-white py-5 text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all disabled:opacity-50 font-bold shadow-lg">
                                {loading ? 'Sending Code...' : 'Send SMS Code'}
                            </button>
                            <button type="button" onClick={() => setAuthMode('standard')} className="w-full text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 font-bold mt-4">
                                ← Back to Email Registration
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <button type="button" onClick={() => setFormData({...formData, role: 'investor'})} className={`py-4 text-[10px] uppercase tracking-widest border transition-all font-bold ${formData.role === 'investor' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-inner' : 'bg-white border-stone-200 text-stone-400 hover:border-emerald-300'}`}>Investor</button>
                                <button type="button" onClick={() => setFormData({...formData, role: 'owner'})} className={`py-4 text-[10px] uppercase tracking-widest border transition-all font-bold ${formData.role === 'owner' ? 'bg-stone-900 border-stone-900 text-white shadow-inner' : 'bg-white border-stone-200 text-stone-400 hover:border-stone-400'}`}>Property Owner</button>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">Full Legal Name</label>
                                <input required type="text" className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" onChange={e => setFormData({...formData, fullName: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">National ID / Passport</label>
                                    <input required type="text" className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" onChange={e => setFormData({...formData, nationalId: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">M-Pesa Number</label>
                                    <input required type="tel" placeholder="2547..." className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">Email Address</label>
                                <input required type="email" className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">Password</label>
                                <input required type="password" minLength={6} className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" onChange={e => setFormData({...formData, password: e.target.value})} />
                            </div>
                            <button disabled={loading} type="submit" className="w-full mt-8 bg-black text-white py-5 text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all disabled:opacity-50 font-bold shadow-lg">
                                {loading ? 'Processing...' : 'Create Account'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-8 border-t border-stone-100 text-center">
                        <p className="text-xs text-stone-500">
                            Already have an account? <br/>
                            <Link href="/auth/login" className="text-emerald-600 font-bold hover:underline mt-1 inline-block uppercase tracking-widest text-[10px]">
                                Log in to your portfolio
                            </Link>
                        </p>
                    </div>
                </>
            )}
                </div>
            </section>
        </main>
    );
}

// 2. We create a new default export that wraps the form in a Suspense boundary
export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-stone-500 text-xs uppercase tracking-widest">
                Loading secure portal...
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}