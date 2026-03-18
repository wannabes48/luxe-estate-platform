import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Example using a generic fetch to an LLM provider. 
// You can replace this with the official SDK of your chosen AI provider.
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Fetch current live data from Supabase to feed the AI
    const { data: properties } = await supabase
      .from('properties')
      .select('title, location, status, property_shares(price_per_share, projected_roi, available_shares)')
      .eq('status', 'active');

    // 2. Format the data into a string the AI can read
    const marketContext = properties?.map(p => 
      `- ${p.title} in ${p.location}. Price per share: KES ${p.property_shares[0]?.price_per_share}. ROI: ${p.property_shares[0]?.projected_roi}%. Shares available: ${p.property_shares[0]?.available_shares}.`
    ).join('\n');

    // 3. Construct the System Prompt
    const systemPrompt = `
      You are the Luxe Estate AI Wealth Advisor, a sophisticated financial AI for a fractional real estate platform in Kenya.
      You analyze market trends, predict ROI, and suggest the best properties for investors. 
      Maintain a highly professional, luxurious, and analytical tone.
      
      CURRENT MARKET INVENTORY:
      ${marketContext}

      RULES:
      - Only recommend properties from the CURRENT MARKET INVENTORY list above.
      - Calculate potential returns based on the ROI percentage.
      - If asked about risk, explain that real estate is illiquid, but Luxe Estate mitigates this via the Secondary Trading Market and Polygon blockchain transparency.
      - Never guarantee returns. Always state that yields are projections based on historical data.
    `;

    // 4. Send to your LLM Provider (Example uses a generic fetch, adapt to your provider)
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    });
    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });
    */

    // Mock response for testing until you add your API Key
    return NextResponse.json({ 
      reply: "Based on your interest in high-yield assets, I recommend analyzing the current offerings in Westlands. The projected ROI is currently outperforming historical averages. How much capital are you looking to allocate?" 
    });

  } catch (error) {
    return NextResponse.json({ error: "Advisor offline." }, { status: 500 });
  }
}