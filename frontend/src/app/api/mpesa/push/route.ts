import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { phoneNumber, amount, propertyId, userId, purchaseType, listingId } = await req.json();

        // 1. Format Phone Number (Assuming Kenya format 07... or 254...)
        let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.slice(1);
        }

        // 2. Generate M-Pesa Authentication & Timestamps
        const shortCode = process.env.MPESA_SHORTCODE!;
        const passkey = process.env.MPESA_PASSKEY!;
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
        
        const tokenResponse = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { Authorization: `Basic ${Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')}` }
        });
        const { access_token } = await tokenResponse.json();

        // 3. Initiate the STK Push
        const stkResponse = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                BusinessShortCode: shortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: Math.ceil(amount), // Safaricom rejects decimals
                PartyA: formattedPhone,
                PartyB: shortCode,
                PhoneNumber: formattedPhone,
                CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
                AccountReference: 'Luxe Estate',
                TransactionDesc: `${purchaseType} Market Share Purchase`
            })
        });

        const stkData = await stkResponse.json();

        if (stkData.ResponseCode !== '0') {
            throw new Error(stkData.errorMessage || 'Safaricom rejected the push request.');
        }

        // 4. Save the Pending Intent to the Database
        await supabaseAdmin.from('transactions').insert({
            checkout_request_id: stkData.CheckoutRequestID,
            user_id: userId,
            property_id: propertyId,
            amount: amount,
            purchase_type: purchaseType,
            listing_id: listingId || null,
            status: 'pending'
        });

        return NextResponse.json({ success: true, checkoutRequestId: stkData.CheckoutRequestID });

    } catch (error: any) {
        console.error("STK Push Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}