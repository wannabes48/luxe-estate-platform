"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PropertyForm from '@/components/agent/PropertyForm'

export default function NewPropertyPage() {
    const router = useRouter()
    const [agentId, setAgentId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/agent/login')
                return
            }

            const { data: agent } = await supabase
                .from('agents')
                .select('id')
                .eq('user_id', session.user.id)
                .single()

            if (agent) setAgentId(agent.id)
            setLoading(false)
        }
        checkSession()
    }, [router])

    if (loading) return <div>Loading...</div>
    if (!agentId) return <div>Access Denied</div>

    return (
        <div className="min-h-screen bg-[#FCFAFA] pb-20">
            <nav className="bg-[#0D0D0D] text-white py-6 px-12 flex justify-between items-center mb-12">
                <Link href="/agent/dashboard"><h1 className="font-serif text-2xl">Luxe Estate.</h1></Link>
                <Link href="/agent/dashboard" className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-white">Back to Dashboard</Link>
            </nav>

            <div className="max-w-4xl mx-auto px-6">
                <h1 className="font-serif text-4xl mb-2 text-[#0D0D0D]">New Listing</h1>
                <p className="text-stone-400 text-xs uppercase tracking-widest mb-10">Add a new masterpiece to your collection</p>
                <PropertyForm agentId={agentId} />
            </div>
        </div>
    )
}
