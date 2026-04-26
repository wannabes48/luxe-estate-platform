"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { UploadCloud, CheckCircle2, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function KYCVerificationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [status, setStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');

    // Form State
    const [fullName, setFullName] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [kraPin, setKraPin] = useState('');
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);

    // Check existing KYC status on mount
    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('user_profiles').select('kyc_status, full_name, national_id').eq('id', user.id).single();
                if (data) {
                    setStatus(data.kyc_status || 'unverified');
                    if (data.full_name) setFullName(data.full_name);
                    if (data.national_id) setNationalId(data.national_id);
                }
            }
        }
        fetchProfile();
    }, []);

    const handleUpload = async (file: File, userId: string, side: 'front' | 'back') => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/${side}_${Date.now()}.${fileExt}`; // e.g., UID/front_1680000.jpg
        
        const { error: uploadError, data } = await supabase.storage
            .from('kyc_documents')
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;
        return data.path;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        
        if (!frontFile || !backFile) {
            setErrorMsg("Please upload both the front and back of your ID.");
            return;
        }

        setLoading(true);

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error("Authentication error. Please log in again.");

            // 1. Upload Files
            const frontPath = await handleUpload(frontFile, user.id, 'front');
            const backPath = await handleUpload(backFile, user.id, 'back');

            // 2. Update Profile
            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({
                    full_name: fullName,
                    national_id: nationalId,
                    kra_pin: kraPin,
                    id_front_url: frontPath,
                    id_back_url: backPath,
                    kyc_status: 'pending' // Move status to pending review
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setStatus('pending');
            window.scrollTo(0, 0);

        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'pending') {
        return (
            <div className="max-w-2xl mx-auto py-20 px-6 text-center animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert size={40} />
                </div>
                <h2 className="text-3xl font-serif text-stone-900 mb-4">Verification Under Review</h2>
                <p className="text-stone-500 leading-relaxed mb-8">
                    Your documents have been securely uploaded to the Luxe Estate compliance team. Verification typically takes 1-2 business days. You will be notified via email once approved to begin trading fractional assets.
                </p>
                <button onClick={() => router.push('/dashboard')} className="px-8 py-4 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors">
                    Return to Portfolio
                </button>
            </div>
        );
    }

    if (status === 'verified') {
        return (
            <div className="max-w-2xl mx-auto py-20 px-6 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-serif text-stone-900 mb-4">Account Verified</h2>
                <p className="text-stone-500">Your identity has been fully verified. You have unrestricted access to the Luxe Estate exchange.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <Link 
                href="/dashboard/settings" 
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400 hover:text-stone-900 font-bold mb-8 transition-colors group"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Settings
            </Link>

            <div className="mb-10">
                <span className="text-[#E91E63] tracking-[0.2em] text-[10px] uppercase font-bold block mb-2">Compliance</span>
                <h1 className="text-4xl font-serif text-stone-900">Identity Verification</h1>
                <p className="text-sm text-stone-500 mt-2">To comply with CMA regulations regarding real-world asset fractionalization, we require government-issued identification.</p>
            </div>

            {errorMsg && (
                <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-10 border border-stone-200 shadow-xl">
                
                {/* Text Data Section */}
                <div className="space-y-5">
                    <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold border-b border-stone-100 pb-2">Personal Details</h3>
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">Full Legal Name (As it appears on ID)</label>
                        <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 transition-all" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">National ID / Passport Number</label>
                            <input required type="text" value={nationalId} onChange={e => setNationalId(e.target.value)} className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-bold">KRA PIN (Optional for foreign investors)</label>
                            <input type="text" value={kraPin} onChange={e => setKraPin(e.target.value)} className="w-full bg-[#FAFAFA] border border-stone-200 p-4 outline-none focus:border-emerald-500 transition-all" />
                        </div>
                    </div>
                </div>

                {/* Document Upload Section */}
                <div className="space-y-5 pt-4">
                    <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold border-b border-stone-100 pb-2">Document Scans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Front ID */}
                        <div className="relative border-2 border-dashed border-stone-300 bg-[#FAFAFA] hover:bg-stone-50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden group">
                            <input required type="file" accept="image/jpeg, image/png, application/pdf" onChange={e => setFrontFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <UploadCloud className="text-stone-400 mb-3 group-hover:text-emerald-500 transition-colors" size={32} />
                            <span className="text-xs font-bold text-stone-700 block mb-1">Front of ID / Passport</span>
                            <span className="text-[10px] text-stone-400 uppercase tracking-widest">{frontFile ? frontFile.name : 'Tap to upload (JPG, PNG, PDF)'}</span>
                            {frontFile && <div className="absolute inset-0 border-2 border-emerald-500 rounded-xl pointer-events-none"></div>}
                        </div>

                        {/* Back ID */}
                        <div className="relative border-2 border-dashed border-stone-300 bg-[#FAFAFA] hover:bg-stone-50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden group">
                            <input required type="file" accept="image/jpeg, image/png, application/pdf" onChange={e => setBackFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <UploadCloud className="text-stone-400 mb-3 group-hover:text-emerald-500 transition-colors" size={32} />
                            <span className="text-xs font-bold text-stone-700 block mb-1">Back of ID</span>
                            <span className="text-[10px] text-stone-400 uppercase tracking-widest">{backFile ? backFile.name : 'Tap to upload (JPG, PNG, PDF)'}</span>
                            {backFile && <div className="absolute inset-0 border-2 border-emerald-500 rounded-xl pointer-events-none"></div>}
                        </div>

                    </div>
                </div>

                <button disabled={loading} type="submit" className="w-full mt-8 bg-black text-white py-5 text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all font-bold shadow-lg disabled:opacity-50">
                    {loading ? 'Encrypting & Submitting...' : 'Submit Documents Securely'}
                </button>
                <p className="text-center text-[10px] text-stone-400 uppercase tracking-widest mt-4 flex justify-center gap-2 items-center">
                    <ShieldAlert size={12} /> 256-bit encryption active
                </p>
            </form>
        </div>
    );
}