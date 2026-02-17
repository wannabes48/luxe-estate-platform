"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PropertyForm from '@/components/agent/PropertyForm'

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = React.use(params)
    const [agentId, setAgentId] = useState<string | null>(null)
    const [propertyData, setPropertyData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/agent/login')
                return
            }

            // 1. Get Agent ID
            const { data: agent } = await supabase
                .from('agents')
                .select('id')
                .eq('user_id', session.user.id)
                .single()

            if (agent) {
                setAgentId(agent.id)

                // 2. Get Property Data (Ensure ownership)
                const { data: property, error } = await supabase
                    .from('properties')
                    .select('*, location:locations(*), images:property_images(*)')
                    .eq('property_id', id)
                    .single() // Remove agent_id check initially to debug ownership

                if (property) {
                    // Start Debugging Security
                    if (property.agent_id !== agent.id) {
                        console.error("Ownership Mismatch", { expected: agent.id, actual: property.agent_id })
                        alert("You do not have permission to edit this property.")
                        router.push('/agent/dashboard')
                        return
                    }
                    // End Debugging Security

                    setPropertyData(property)
                } else {
                    console.error("Property fetch error", error)
                    alert("Property not found.")
                    router.push('/agent/dashboard')
                }
            }
            setLoading(false)
        }
        fetchData()
    }, [router, id])

    if (loading) return <div>Loading...</div>
    if (!agentId || !propertyData) return <div>Access Denied</div>

    return (
        <div className="min-h-screen bg-[#FCFAFA] pb-20">
            <nav className="bg-[#0D0D0D] text-white py-6 px-12 flex justify-between items-center mb-12">
                <Link href="/agent/dashboard"><h1 className="font-serif text-2xl">Luxe Estate.</h1></Link>
                <Link href="/agent/dashboard" className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-white">Back to Dashboard</Link>
            </nav>

            <div className="max-w-4xl mx-auto px-6">
                <h1 className="font-serif text-4xl mb-2 text-[#0D0D0D]">Edit Listing</h1>
                <p className="text-stone-400 text-xs uppercase tracking-widest mb-10">Updating: {propertyData.title}</p>
                <PropertyForm agentId={agentId} initialData={propertyData} />
            </div>
        </div>
    )
}
