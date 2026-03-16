import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (Bypasses RLS to read all users)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // MUST be the Service Role Key from Supabase Dashboard
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { propertyId, grossRent, dividendPerShare } = body;

        if (!propertyId || !dividendPerShare) {
            return NextResponse.json({ success: false, error: 'Missing required parameters.' }, { status: 400 });
        }

        // 1. Fetch all investors for this property who own more than 0 shares
        const { data: investors, error: investErr } = await supabaseAdmin
            .from('investments')
            .select(`
                user_id,
                shares_owned,
                user_profiles ( full_name, phone_number ) 
            `)
            .eq('property_id', propertyId)
            .gt('shares_owned', 0);

        if (investErr || !investors || investors.length === 0) {
            return NextResponse.json({ success: false, error: 'No investors found for this asset.' }, { status: 404 });
        }

        // 2. Generate Safaricom M-Pesa Access Token
        const token = await getMpesaToken();

        // 3. Process Payouts
        let successfulPayouts = 0;
        const failedPayouts = [];

        for (const investor of investors) {
            // Note: Ensure your users table actually stores 'phone_number' in a 2547XXXXXXXX format
            const phone = investor.user_profiles?.[0]?.phone_number; 
            const payoutAmount = Math.floor(investor.shares_owned * dividendPerShare);

            if (!phone || payoutAmount <= 0) {
                failedPayouts.push({ user: investor.user_id, reason: 'Invalid phone or zero amount' });
                continue;
            }

            try {
                // 4. Initiate B2C API Call for this specific investor
                await initiateB2CPayout(phone, payoutAmount, token);
                successfulPayouts++;

                // Optional: Log this transaction in a 'yield_history' table
                await supabaseAdmin.from('yield_history').insert({
                    property_id: propertyId,
                    user_id: investor.user_id,
                    amount_paid: payoutAmount,
                    status: 'Processing' // B2C is asynchronous, true status comes to your ResultURL
                });

            } catch (err: any) {
                failedPayouts.push({ user: investor.user_id, reason: err.message });
            }
        }

        return NextResponse.json({ 
            success: true, 
            payoutsCount: successfulPayouts,
            failures: failedPayouts 
        });

    } catch (error: any) {
        console.error('Yield Distribution Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// --- M-PESA HELPER FUNCTIONS ---

async function getMpesaToken() {
    const key = process.env.MPESA_CONSUMER_KEY!;
    const secret = process.env.MPESA_CONSUMER_SECRET!;
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');

    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: { Authorization: `Basic ${auth}` }
    });

    if (!response.ok) throw new Error('Failed to authenticate with M-Pesa Daraja API');
    
    const data = await response.json();
    return data.access_token;
}

async function initiateB2CPayout(phone: string, amount: number, token: string) {
    const endpoint = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest';
    
    // In production, the SecurityCredential is an encrypted version of your Initiator Password
    // using the Safaricom Public Certificate.
    const payload = {
        InitiatorName: process.env.MPESA_B2C_INITIATOR_NAME || 'testapi',
        SecurityCredential: process.env.MPESA_B2C_SECURITY_CREDENTIAL || 'your_encrypted_credential',
        CommandID: 'BusinessPayment',
        Amount: amount,
        PartyA: process.env.MPESA_B2C_SHORTCODE || '600980', 
        PartyB: phone, // Must be 254... format
        Remarks: 'Luxe Estate Monthly Yield Dividend',
        QueueTimeOutURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/b2c-timeout`,
        ResultURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/b2c-result`,
        Occasion: 'Dividend Payout'
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (result.ResponseCode !== '0') {
        throw new Error(result.errorMessage || 'B2C API rejected the request');
    }

    return result;
}