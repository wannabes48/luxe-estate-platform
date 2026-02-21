"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AgentAvatar from '@/components/AgentAvatar'
import VerifiedBadge from '@/components/VerifiedBadge'
import { QRCodeCanvas } from 'qrcode.react';
import PropertyAnalytics from '@/components/agent/PropertyAnalytics'
import GetVerifiedBadge from '@/components/agent/GetVerifiedBadge'
import LuxuryToast from '@/components/ui/LuxuryToast'
import { getLeadsForAgent } from '@/app/actions'

export default function AgentDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [agent, setAgent] = useState<any>(null)
    const [properties, setProperties] = useState<any[]>([])
    const [leads, setLeads] = useState<any[]>([])
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error', show: boolean }>({ msg: '', type: 'success', show: false })

    // Helper for showing toast
    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type, show: true })
    }

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/agent/login')
                return
            }

            // Fetch Agent Profile
            const { data: agentData } = await supabase
                .from('agents')
                .select('*')
                .eq('user_id', session.user.id)
                .single()

            if (agentData) {
                setAgent(agentData)

                // Fetch Properties (with images)
                const { data: props } = await supabase
                    .from('properties')
                    .select('*, images:property_images(*)')
                    .eq('agent_id', agentData.id)
                    .order('created_at', { ascending: false })

                setProperties(props || [])

                // Fetch Leads using Server Action (with Masking)
                const agentLeads = await getLeadsForAgent(agentData.id)
                setLeads(agentLeads || [])
            }

            setLoading(false)
        }

        checkSession()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/agent/login')
    }

    // Admin Contact Handler
    const handleContactAdmin = async (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value

        if (!message) return;

        const { error } = await supabase
            .from('admin_messages')
            .insert([{
                agent_id: agent?.id,
                message,
                sender: 'agent'
            }])

        if (error) {
            showToast('Failed to send message', 'error')
        } else {
            showToast('Message sent to Admin', 'success')
            form.reset()
        }
    }

    // Upgrade Handler
    const handleUpgrade = async () => {
        // if (!confirm("Request an upgrade to Professional Tier? An admin will review your account.")) return;

        const { error } = await supabase
            .from('admin_messages')
            .insert([{
                agent_id: agent?.id,
                message: `Agent ${agent?.name} requested an upgrade to Professional Tier.`,
                sender: 'agent'
            }])

        if (error) {
            showToast("Request failed: " + error.message, 'error')
        } else {
            showToast("Upgrade request sent! An admin will contact you shortly.", 'success')
        }
    }

    // Boost Handler
    const handleBoost = async (propertyId: string) => {
        const BOOST_COST = 50;
        if ((agent?.credits || 0) < BOOST_COST) {
            showToast(`Insufficient Credits. You need ${BOOST_COST} credits.`, 'error');
            return;
        }

        // if (!confirm(`Boost this listing for ${BOOST_COST} credits?`)) return;

        setLoading(true)
        try {
            // 1. Boost Property (Attempt first so we don't charge if it fails)
            const { error: propError } = await supabase
                .from('properties')
                .update({
                    is_boosted: true,
                })
                .eq('property_id', propertyId)

            if (propError) {
                console.error("Property Update Failed:", propError)
                throw new Error("Could not update property. " + propError.message)
            }

            // 2. Deduct Credits (Only if property update succeeded)
            const { error: creditError } = await supabase
                .from('agents')
                .update({ credits: (agent.credits - BOOST_COST) })
                .eq('id', agent.id)

            if (creditError) {
                console.error("Credit Deduction Failed:", creditError)
                showToast("Warning: Property boosted but credit deduction failed.", 'error')
            }

            // 3. Refresh Data
            showToast("Property Boosted! Your listing is now promoted.", 'success')
            // Optimistic Update or Reload
            setTimeout(() => window.location.reload(), 1500)
        } catch (error: any) {
            showToast("Boost failed: " + error.message, 'error')
            setLoading(false)
        }
    }

    if (loading) return <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">Loading Portal...</div>

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Toast Notification */}
            <LuxuryToast
                message={toast.msg}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />

            {/* Top Navigation */}
            <nav className="bg-[#0D0D0D] text-white py-6 px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/"><h1 className="font-serif text-2xl">Luxe Estate.</h1></Link>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                        <GetVerifiedBadge isVerified={agent?.is_verified} onVerifyClick={handleUpgrade} />
                        <span className="text-xs uppercase tracking-widest">{agent?.name || 'Agent'}</span>
                        <span className="text-[10px] bg-stone-800 px-3 py-1 rounded-full text-[#E91E63]">
                            {agent?.credits || 0} Credits
                        </span>
                    </div>
                    <button onClick={handleLogout} className="text-[10px] uppercase tracking-widest text-[#E91E63] hover:text-white transition-colors">Logout</button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-12">
                {/* Monetization Banner/Credits */}
                <div className="flex gap-6 mb-12">
                    {agent?.tier === 'standard' && (
                        <div className="flex-1 bg-[#E91E63] text-white p-8 flex justify-between items-center rounded-sm shadow-xl">
                            <div>
                                <h3 className="font-serif text-2xl mb-2">Upgrade to Professional</h3>
                                <p className="text-sm opacity-90">Get verified, boost your listings to the top, and unlock unlimited lead details.</p>
                            </div>
                            <button
                                onClick={handleUpgrade}
                                className="bg-white text-[#E91E63] px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-stone-100 transition-colors"
                            >
                                Upgrade Now
                            </button>
                        </div>
                    )}
                    {/* Digital Business Card Generator */}
                    <div className="bg-[#0D0D0D] text-white p-8 rounded-sm shadow-xl flex-1 flex items-center justify-between">
                        <div>
                            <h3 className="font-serif text-xl mb-1">Digital Business Card</h3>
                            <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-4">Scan to view profile</p>
                            <a href={`/agents/${agent?.id}`} target="_blank" className="text-xs text-[#E91E63] underline">View Public Profile</a>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-white p-2 border border-stone-100 rounded-lg shadow-sm">
                                <QRCodeCanvas
                                    id="agent-qr"
                                    value={`https://luxe-estate-platform.vercel.app/agents/${agent?.id}`}
                                    size={100}
                                    level={"H"}
                                    includeMargin={true}
                                    imageSettings={{
                                        src: "/favicon.png", // Path to your company logo in the public folder
                                        x: undefined, // Centers automatically
                                        y: undefined, // Centers automatically
                                        height: 50,
                                        width: 50,
                                        excavate: true, // This clears the QR pixels behind the logo
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    const canvas = document.getElementById('agent-qr') as HTMLCanvasElement;
                                    if (canvas) {
                                        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                                        let downloadLink = document.createElement("a");
                                        downloadLink.href = pngUrl;
                                        downloadLink.download = `${agent?.name?.replace(' ', '_')}_QR.png`;
                                        document.body.appendChild(downloadLink);
                                        downloadLink.click();
                                        document.body.removeChild(downloadLink);
                                    }
                                }}
                                className="text-[9px] uppercase tracking-widest text-[#E91E63] hover:text-white"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Stats & Tools Column */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 border border-stone-100 shadow-sm">
                            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Total Listings</p>
                            <p className="font-serif text-5xl text-[#0D0D0D]">{properties.length}</p>
                        </div>
                        <div className="bg-white p-8 border border-stone-100 shadow-sm">
                            <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Active Leads</p>
                            <p className="font-serif text-5xl text-[#0D0D0D]">{leads.length}</p>
                        </div>

                        {/* Admin Contact Form */}
                        <div className="bg-stone-100 p-8 border border-stone-200">
                            <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-4 font-bold">Contact Admin</p>
                            <form onSubmit={handleContactAdmin} className="space-y-4">
                                <textarea
                                    name="message"
                                    className="w-full bg-white border border-stone-300 p-3 text-sm outline-none focus:border-black resize-none"
                                    rows={3}
                                    placeholder="Request support or credits..."
                                    required
                                />
                                <button className="w-full bg-black text-white py-2 text-[10px] uppercase tracking-widest hover:bg-[#E91E63] transition-colors">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Leads Column */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="font-serif text-3xl text-[#0D0D0D]">Recent Inquiries</h2>
                        </div>
                        <div className="space-y-4">
                            {leads.length === 0 ? (
                                <p className="text-stone-400 text-sm">No inquiries yet. Boost your listings to get more leads.</p>
                            ) : (
                                leads.map((lead, index) => (
                                    <div key={lead.id || index} className="bg-white p-6 border border-stone-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-serif text-xl mb-1">{lead.full_name}</p>
                                                {lead.is_masked && <span className="text-[9px] bg-stone-100 text-stone-500 px-2 py-1 uppercase tracking-widest">Protected</span>}
                                            </div>
                                            <p className="text-stone-500 text-xs uppercase tracking-widest mb-2">{lead.property_name || 'General Inquiry'}</p>
                                            <p className="text-stone-400 text-sm italic mb-2">"{lead.message}"</p>

                                            {/* Contact Details (Masked or Unmasked) */}
                                            <div className="flex gap-4 text-xs font-mono text-stone-600 bg-stone-50 p-2 inline-flex items-center">
                                                <span>{lead.email}</span>
                                                <span className="text-stone-300">|</span>
                                                <span>{lead.phone}</span>

                                                {/* WhatsApp Quick Reply */}
                                                {!lead.is_masked && lead.phone ? (
                                                    <a
                                                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${lead.full_name}, I am ${agent?.name} from Luxe Estate regarding your inquiry on ${lead.property_name || 'our property'}.`)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-4 flex items-center gap-2 bg-[#25D366] text-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold hover:bg-[#128C7E] transition-colors rounded-sm"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                        </svg>
                                                        WhatsApp Client
                                                    </a>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="ml-4 flex items-center gap-2 bg-stone-200 text-stone-400 px-3 py-1 text-[10px] uppercase tracking-widest font-bold cursor-not-allowed rounded-sm"
                                                        title="Upgrade to Premium to create direct WhatsApp links"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                                        </svg>
                                                        Locked
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-xs font-bold mb-1">{new Date(lead.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {agent?.tier !== 'premium' && leads.length > 0 && (
                            <div className="mt-4 text-center">
                                <p className="text-xs text-stone-500">Upgrade to Premium to view full contact details.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Listings Section */}
                <div className="mt-20">
                    <div className="flex justify-between items-end mb-12 border-b border-stone-200 pb-4">
                        <h2 className="font-serif text-3xl text-[#0D0D0D]">My Inventory</h2>
                        <Link href="/agent/properties/new">
                            <button className="bg-black text-white px-6 py-3 text-[10px] uppercase tracking-widest hover:bg-[#E91E63] transition-colors">
                                + Add New Property
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((prop, index) => (
                            <div key={prop.property_id || prop.id || index} className="bg-white group cursor-pointer border border-stone-100 pb-6 relative">
                                {/* Boosted Tag */}
                                {prop.is_boosted && (
                                    <div className="absolute top-2 right-2 z-10 bg-[#D4AF37] text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest">
                                        Promoted
                                    </div>
                                )}

                                <div className="aspect-[4/3] bg-stone-100 overflow-hidden mb-4 relative">
                                    {/* Fixed Image Access: Using property_images alias 'images' */}
                                    <img
                                        src={prop.images?.[0]?.image_url || 'https://via.placeholder.com/800x600?text=No+Image'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        alt={prop.title}
                                    />
                                </div>
                                <div className="px-6">
                                    <h4 className="font-serif text-xl mb-2 line-clamp-1">{prop.title}</h4>
                                    <p className="text-stone-400 text-[10px] uppercase tracking-widest mb-4">Ksh {prop.price.toLocaleString()}</p>

                                    {/* Analytics Component */}
                                    <PropertyAnalytics views={prop.views_count || 0} leads={leads.filter(l => l.property_id === (prop.property_id || prop.id)).length} />

                                    <div className="flex gap-4 mt-4">
                                        <Link href={`/agent/properties/${prop.property_id || prop.id}/edit`}>
                                            <button className="text-[10px] uppercase tracking-widest border-b border-black hover:text-[#E91E63] hover:border-[#E91E63] transition-colors">Edit</button>
                                        </Link>
                                        {!prop.is_boosted && (
                                            <button
                                                onClick={() => handleBoost(prop.property_id || prop.id)}
                                                className="text-[10px] uppercase tracking-widest text-[#E91E63] font-bold hover:text-black transition-colors"
                                            >
                                                Boost Listing
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
