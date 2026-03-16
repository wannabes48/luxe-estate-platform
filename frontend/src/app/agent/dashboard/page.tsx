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

interface LeaderboardAgent {
    agent_id: string;
    agent_name: string;
    current_tier: string;
    total_properties: number;
    avg_green_score: number;
}

export default function AgentDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [agent, setAgent] = useState<any>(null)
    const [properties, setProperties] = useState<any[]>([])
    const [leads, setLeads] = useState<any[]>([])
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error', show: boolean }>({ msg: '', type: 'success', show: false })
    const [leaders, setLeaders] = useState<LeaderboardAgent[]>([]);

    // Tokenization Modal State
    const [isTokenizeModalOpen, setIsTokenizeModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [roiInput, setRoiInput] = useState('8.5');
    const [isTokenizing, setIsTokenizing] = useState(false);

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

                // Fetch Properties (Added property_shares to check if already tokenized)
                const { data: props } = await supabase
                    .from('properties')
                    .select('*, images:property_images(*), property_shares(*)')
                    .eq('agent_id', agentData.id)
                    .order('created_at', { ascending: false })

                setProperties(props || [])

                // Fetch Leads using Server Action
                const agentLeads = await getLeadsForAgent(agentData.id)
                setLeads(agentLeads || [])
            }

            setLoading(false)
        }

        async function fetchLeaderboard() {
            const { data, error } = await supabase
                .from('agent_sustainability_leaderboard')
                .select('*')
                .limit(10);
            
            if (data) setLeaders(data);
            setLoading(false);
        }
        fetchLeaderboard();

        checkSession()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/agent/login')
    }

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

    const handleUpgrade = async () => {
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

    const handleBoost = async (propertyId: string) => {
        const BOOST_COST = 50;
        if ((agent?.credits || 0) < BOOST_COST) {
            showToast(`Insufficient Credits. You need ${BOOST_COST} credits.`, 'error');
            return;
        }

        setLoading(true)
        try {
            const { error: propError } = await supabase
                .from('properties')
                .update({ is_boosted: true })
                .eq('property_id', propertyId)

            if (propError) throw new Error("Could not update property. " + propError.message)

            const { error: creditError } = await supabase
                .from('agents')
                .update({ credits: (agent.credits - BOOST_COST) })
                .eq('id', agent.id)

            if (creditError) showToast("Warning: Property boosted but credit deduction failed.", 'error')

            showToast("Property Boosted! Your listing is now promoted.", 'success')
            setTimeout(() => window.location.reload(), 1500)
        } catch (error: any) {
            showToast("Boost failed: " + error.message, 'error')
            setLoading(false)
        }
    }

    // --- NEW: Tokenization Handler ---
    const executeTokenization = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAsset) return;
        setIsTokenizing(true);

        try {
            const propertyId = selectedAsset.property_id || selectedAsset.id;
            const pricePerShare = selectedAsset.price / 1000;

            const { error } = await supabase
                .from('property_shares')
                .insert([{
                    property_id: propertyId,
                    total_shares: 1000,
                    available_shares: 1000,
                    price_per_share: pricePerShare,
                    projected_roi: parseFloat(roiInput),
                    // In Phase 3, this triggers the Hardhat script. For now, we mock the deployment status.
                    smart_contract_address: `PENDING_DEPLOYMENT_${Date.now()}` 
                }]);

            if (error) throw error;

            showToast(`${selectedAsset.title} successfully tokenized into 1,000 shares!`, 'success');
            setIsTokenizeModalOpen(false);
            
            // Reload to show the updated fractionalized tag
            setTimeout(() => window.location.reload(), 1500);

        } catch (error: any) {
            showToast("Tokenization failed: " + error.message, 'error');
        } finally {
            setIsTokenizing(false);
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
                    
                    {/* Leaderboard Column */}
                    <div className="bg-white border border-stone-100 p-8 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-serif text-2xl text-stone-900">Sustainability Leaderboard</h3>
                                <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">
                                    Average portfolio Green Score
                                </p>
                            </div>
                            <div className="hidden sm:block p-3 bg-emerald-50 rounded-full">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {leaders.map((ldr, index) => {
                                const isEcoPro = ldr.avg_green_score >= 70;
                                return (
                                    <div key={ldr.agent_id} className={`flex items-center justify-between p-4 border transition-all ${
                                        isEcoPro ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' : 'bg-[#FAFAFA] border-stone-100'
                                    }`}>
                                        <div className="flex items-center gap-4">
                                            <span className={`font-serif text-xl ${index < 3 ? 'text-black font-bold' : 'text-stone-400'}`}>#{index + 1}</span>
                                            <div>
                                                <p className="font-medium text-stone-900 text-sm">{ldr.agent_name}</p>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-wider">{ldr.total_properties} Listings</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-lg ${isEcoPro ? 'text-emerald-700' : 'text-stone-700'}`}>{ldr.avg_green_score}</p>
                                            <p className="text-[9px] uppercase tracking-widest text-stone-400">Avg Score</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

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

                        <div className="bg-stone-100 p-8 border border-stone-200">
                            <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-4 font-bold">Contact Admin</p>
                            <form onSubmit={handleContactAdmin} className="space-y-4">
                                <textarea name="message" className="w-full bg-white border border-stone-300 p-3 text-sm outline-none focus:border-black resize-none" rows={3} placeholder="Request support or credits..." required />
                                <button className="w-full bg-black text-white py-2 text-[10px] uppercase tracking-widest hover:bg-[#E91E63] transition-colors">Send Message</button>
                            </form>
                        </div>
                    </div>

                    {/* Leads Column */}
                    <div className="lg:col-span-1">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="font-serif text-3xl text-[#0D0D0D]">Recent Inquiries</h2>
                        </div>
                        <div className="space-y-4">
                            {leads.length === 0 ? (
                                <p className="text-stone-400 text-sm">No inquiries yet.</p>
                            ) : (
                                leads.map((lead, index) => (
                                    <div key={lead.id || index} className="bg-white p-6 border border-stone-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-serif text-xl">{lead.full_name}</p>
                                            <p className="text-xs font-bold text-stone-400">{new Date(lead.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <p className="text-stone-500 text-[10px] uppercase tracking-widest mb-2">{lead.property_name || 'General'}</p>
                                        <div className="flex gap-4 text-xs font-mono text-stone-600 bg-stone-50 p-2 mt-2">
                                            <span>{lead.email}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
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
                        {properties.map((prop, index) => {
                            const isTokenized = prop.property_shares && prop.property_shares.length > 0;

                            return (
                                <div key={prop.property_id || prop.id || index} className="bg-white group cursor-pointer border border-stone-100 pb-6 relative">
                                    {/* Promoted Tag */}
                                    {prop.is_boosted && (
                                        <div className="absolute top-2 right-2 z-10 bg-[#D4AF37] text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest">
                                            Promoted
                                        </div>
                                    )}
                                    {/* Web3 Tokenized Tag */}
                                    {isTokenized && (
                                        <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-black text-[9px] font-bold px-2 py-1 uppercase tracking-widest shadow-md">
                                            ✦ Fractionalized
                                        </div>
                                    )}

                                    <div className="aspect-[4/3] bg-stone-100 overflow-hidden mb-4 relative">
                                        <img
                                            src={prop.images?.[0]?.image_url || 'https://via.placeholder.com/800x600?text=No+Image'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            alt={prop.title}
                                        />
                                    </div>
                                    <div className="px-6">
                                        <h4 className="font-serif text-xl mb-2 line-clamp-1">{prop.title}</h4>
                                        <p className="text-stone-400 text-[10px] uppercase tracking-widest mb-4">Ksh {prop.price.toLocaleString()}</p>

                                        <PropertyAnalytics views={prop.views_count || 0} leads={leads.filter(l => l.property_id === (prop.property_id || prop.id)).length} />

                                        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-stone-100">
                                            <Link href={`/agent/properties/${prop.property_id || prop.id}/edit`}>
                                                <button className="text-[10px] uppercase tracking-widest border-b border-black hover:text-[#E91E63] hover:border-[#E91E63] transition-colors">Edit</button>
                                            </Link>
                                            {!prop.is_boosted && (
                                                <button onClick={() => handleBoost(prop.property_id || prop.id)} className="text-[10px] uppercase tracking-widest text-[#E91E63] font-bold hover:text-black transition-colors">
                                                    Boost
                                                </button>
                                            )}
                                            
                                            {/* Tokenize Button Logic */}
                                            {!isTokenized ? (
                                                <button 
                                                    onClick={() => { setSelectedAsset(prop); setIsTokenizeModalOpen(true); }}
                                                    className="ml-auto text-[10px] uppercase tracking-widest text-emerald-600 font-bold hover:text-black transition-colors"
                                                >
                                                    Tokenize Asset
                                                </button>
                                            ) : (
                                                <span className="ml-auto text-[10px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Web3 Active
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Tokenization Modal */}
            {isTokenizeModalOpen && selectedAsset && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full p-8 shadow-2xl relative">
                        <button onClick={() => setIsTokenizeModalOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-black">✕</button>
                        
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="font-serif text-2xl text-stone-900">Mint Property Shares</h3>
                            <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Convert asset to Web3 tokens</p>
                        </div>

                        <div className="bg-stone-50 p-4 border border-stone-100 mb-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-xs text-stone-500">Asset Value</span>
                                <span className="text-sm font-bold">{selectedAsset.price.toLocaleString()} KES</span>
                            </div>
                            <div className="flex justify-between border-b border-stone-200 pb-3">
                                <span className="text-xs text-stone-500">Total Shares to Mint</span>
                                <span className="text-sm font-bold text-emerald-600">1,000</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-xs text-stone-500">Price Per Share</span>
                                <span className="text-lg font-bold">{(selectedAsset.price / 1000).toLocaleString()} KES</span>
                            </div>
                        </div>

                        <form onSubmit={executeTokenization}>
                            <div className="mb-6">
                                <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2">Projected Annual ROI (%)</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    required
                                    value={roiInput} 
                                    onChange={(e) => setRoiInput(e.target.value)} 
                                    className="w-full bg-[#FAFAFA] border border-stone-200 p-3 outline-none focus:border-emerald-500 font-mono text-lg" 
                                    placeholder="e.g. 8.5"
                                />
                                <p className="text-[9px] text-stone-400 mt-2">This yield will be distributed to token holders monthly via M-Pesa B2C.</p>
                            </div>

                            <button 
                                disabled={isTokenizing} 
                                type="submit" 
                                className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors disabled:opacity-50"
                            >
                                {isTokenizing ? 'Generating Smart Contract...' : 'Confirm Tokenization'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}