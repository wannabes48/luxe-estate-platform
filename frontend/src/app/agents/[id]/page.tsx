import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import AgentAvatar from '@/components/AgentAvatar';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MessageSquare } from 'lucide-react';
import VerifiedBadge from '@/components/VerifiedBadge';

import { getAgentProperties } from '@/lib/api';
import { SmallPropertyCard } from '@/components/property/SmallPropertyCard';

// Helper to fetch agent data
async function getAgent(id: string) {
    const { data: agent } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();
    return agent;
}

export default async function AgentProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const agent = await getAgent(id);
    const properties = await getAgentProperties(id);

    if (!agent) {
        return <div className="min-h-screen flex items-center justify-center">Agent not found</div>;
    }

    return (
        <main className="min-h-screen bg-[#FAFAFA]">
            {/* Header / Nav */}
            <nav className="bg-white p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/agents">
                        <button className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-[#E91E63] transition-colors">
                            <ArrowLeft size={16} />
                            Back to The Team
                        </button>
                    </Link>
                </div>
                <h1 className="font-serif text-xl">Agent Profile</h1>
            </nav>

            <div className="max-w-5xl mx-auto p-8 md:p-12">
                {/* Agent Card */}
                <div className="bg-white p-12 shadow-sm border border-stone-100 flex flex-col md:flex-row gap-12 items-center md:items-start mb-20">
                    <div className="w-40 h-40">
                        <AgentAvatar src={agent.image_url} name={agent.name} isVerified={agent.is_verified} size="xl" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h2 className="font-serif text-4xl text-[#0D0D0D]">{agent.name}</h2>
                            {agent.is_verified && <VerifiedBadge />}
                        </div>
                        <p className="text-stone-500 text-sm uppercase tracking-widest mb-6">{agent.role || 'Real Estate Agent'}</p>

                        <p className="text-stone-600 leading-relaxed mb-8 max-w-2xl">
                            {agent.bio || `Experienced agent specializing in luxury properties. dedicated to helping clients find their dream homes with personalized service and market expertise.`}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6">
                            <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-xs uppercase tracking-widest border-b border-stone-300 pb-1 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors">
                                <Mail size={14} /> {agent.email}
                            </a>
                            <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-xs uppercase tracking-widest border-b border-stone-300 pb-1 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors">
                                <Phone size={14} /> {agent.phone}
                            </a>
                            <a href={`https://wa.me/${agent.whatsapp_number}`} className="flex items-center gap-2 text-xs uppercase tracking-widest border-b border-stone-300 pb-1 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors">
                                <MessageSquare size={14} /> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* Assigned Portfolio (Active Listings) */}
                <div>
                    <h3 className="font-serif text-3xl mb-12 text-center md:text-left">Assigned Portfolio ({properties.length})</h3>
                    {properties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((prop: any) => (
                                <SmallPropertyCard key={prop.property_id || prop.id} property={prop} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-stone-400 bg-white border border-stone-100 italic">
                            No active listings assigned to this agent yet.
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
