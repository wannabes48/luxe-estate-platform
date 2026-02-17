"use server"

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase Client with Service Role Key for Admin Access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Increment the views_count for a property.
 * This should be called when a user visits a property details page.
 */
export async function incrementPropertyView(propertyId: string) {
  if (!propertyId) {
    console.error("incrementPropertyView: No propertyId provided");
    return;
  }

  // console.log("Incrementing view for:", propertyId); // Debug Log

  try {
    // Option 1: RPC Call (Atomic)
    const { error: rpcError } = await supabaseAdmin.rpc('increment_property_views', { prop_id: propertyId })

    if (rpcError) {
      console.warn("RPC increment_property_views failed:", rpcError.message);

      // Fallback: Direct Update
      // Try 'property_id' column first
      let { data: prop, error: fetchError } = await supabaseAdmin
        .from('properties')
        .select('property_id, views_count')
        .eq('property_id', propertyId)
        .maybeSingle()

      if (fetchError || !prop) {
        console.error("Could not find property to increment views for (Direct Update):", propertyId);
        return;
      }

      // Perform Update
      const currentViews = (prop as any).views_count || 0;

      const { error: updateError } = await supabaseAdmin
        .from('properties')
        .update({ views_count: currentViews + 1 })
        .eq('property_id', propertyId)

      if (updateError) {
        console.error("Direct update of views failed:", updateError.message);
      } else {
        // console.log("Successfully incremented views (Direct Update)");
      }
    } else {
      // console.log("Successfully incremented views (RPC)");
    }
  } catch (error) {
    console.error("Failed to increment view:", error)
  }
}

/**
 * Fetch leads for an agent with masking based on tier.
 * Standard Tier: Emails and Phones are partially hidden.
 * Premium Tier: Full details visible.
 */
export async function getLeadsForAgent(agentId: string) {
  if (!agentId) return [];

  try {
    // 1. Get Agent Tier
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('tier')
      .eq('id', agentId)
      .single()

    if (agentError) throw agentError;

    // 2. Fetch Inquiries
    const { data: leads, error: leadsError } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })

    if (leadsError) throw leadsError;

    // 3. Apply Masking Logic if Standard Tier
    if (agent.tier !== 'premium') {
      return leads.map(lead => ({
        ...lead,
        email: maskEmail(lead.email),
        phone: maskPhone(lead.phone),
        is_masked: true
      }))
    }

    return leads.map(lead => ({ ...lead, is_masked: false }));

  } catch (error) {
    console.error("Error fetching leads:", error)
    return []
  }
}

// Helper: Mask Email (e.g., "joh***@gmail.com")
function maskEmail(email: string) {
  if (!email) return "********";
  const [user, domain] = email.split('@');
  if (user.length <= 3) return `***@${domain}`;
  return `${user.slice(0, 3)}***@${domain}`;
}

// Helper: Mask Phone (e.g., "+254 7*** **00")
function maskPhone(phone: string) {
  if (!phone) return "***********";
  return phone.slice(0, 5) + "****" + phone.slice(-2);
}