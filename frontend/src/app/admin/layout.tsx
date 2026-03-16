"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            // 1. Check if logged in
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                router.push('/auth/login');
                return;
            }

            // 2. Check if the user has the 'admin' role in our new public table
            const { data: profile } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (profile?.role === 'admin') {
                setIsAuthorized(true);
            } else {
                // Kick them back to the investor dashboard
                router.push('/dashboard'); 
            }
            setIsLoading(false);
        };

        checkAdminStatus();
    }, [router]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-2xl font-serif">Verifying Credentials...</div>;
    }

    if (!isAuthorized) return null; // Prevent flash of content before redirect

    return (
        <div className="min-h-screen bg-stone-50 flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-[#0D0D0D] text-white flex flex-col hidden md:flex">
                <div className="p-6">
                    <h2 className="text-xl font-serif tracking-wide">Luxe Admin.</h2>
                    <p className="text-[10px] text-emerald-500 uppercase tracking-widest mt-1">Command Center</p>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <a href="/admin" className="block px-4 py-3 text-sm text-stone-300 hover:bg-white/10 hover:text-white rounded transition-colors">Overview</a>
                    <a href="/admin/users" className="block px-4 py-3 text-sm text-stone-300 hover:bg-white/10 hover:text-white rounded transition-colors">Manage Users</a>
                    <a href="/admin/properties" className="block px-4 py-3 text-sm text-stone-300 hover:bg-white/10 hover:text-white rounded transition-colors">Properties & Shares</a>
                    <a href="/admin/yield-distribution" className="block px-4 py-3 text-sm text-stone-300 hover:bg-white/10 hover:text-white rounded transition-colors">Yield Distribution</a>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button onClick={() => { supabase.auth.signOut(); router.push('/auth/login'); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 rounded transition-colors">
                        Secure Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}