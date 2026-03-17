"use client"
import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent & Developer Portal',
  description: 'List your luxury properties on Luxe Estate. Reach global Web3 investors and tokenize your architectural inventory for faster liquidity.',
  keywords: [
    'list luxury property Kenya',
    'real estate agent portal',
    'tokenize real estate development',
    'sell luxury homes Nairobi, Kisii, Mombasa, Nakuru, Kenya, Kisumu, Malindi, Kwale, Joska',
    'property fractionalization services'
  ],
};

export default function AgentLogin() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            router.push('/agent/dashboard')
        } catch (error: any) {
            alert(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-black">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            <div className="w-full max-w-md bg-[#1A1A1A]/90 border border-white/10 p-12 relative overflow-hidden z-10 shadow-2xl backdrop-blur-md">

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E91E63] to-transparent"></div>

                <div className="text-center mb-12">
                    <Link href="/">
                        <h1 className="font-serif text-3xl text-white cursor-pointer mb-2">Luxe Estate.</h1>
                    </Link>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-6">Agent Portal</p>

                    <Link href="/" className="text-[10px] uppercase tracking-widest text-[#E91E63] hover:text-white transition-colors border-b border-[#E91E63] pb-1">
                        &larr; Back to Home
                    </Link>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-stone-400">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0D0D0D] border border-white/10 text-white p-4 outline-none focus:border-[#E91E63] transition-colors font-light text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-stone-400">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0D0D0D] border border-white/10 text-white p-4 outline-none focus:border-[#E91E63] transition-colors font-light text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black hover:bg-[#E91E63] hover:text-white transition-all py-4 text-xs uppercase tracking-[0.3em] mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Access Portal'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-stone-500 text-xs">
                        Don't have an account? <span className="text-white cursor-not-allowed">Contact Admin</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
