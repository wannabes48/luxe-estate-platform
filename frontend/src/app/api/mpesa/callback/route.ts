// app/api/mpesa/callback/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin'; // Use Service Role key to bypass RLS

export async function POST(req: Request) {
    try {
        const data = await req.json();
        
        // 1. Extract the callback data
        const callbackData = data.Body.stkCallback;
        const merchantRequestID = callbackData.MerchantRequestID;
        const resultCode = callbackData.ResultCode;

        // 2. Handle Failed Transactions (User cancelled, insufficient funds, etc.)
        if (resultCode !== 0) {
            console.error(`M-Pesa transaction failed: ${callbackData.ResultDesc}`);
            // Optionally update a 'pending_transactions' table to 'failed' here
            return NextResponse.json({ status: 'Acknowledged' });
        }

        // 3. Parse Success Data
        const callbackItems = callbackData.CallbackMetadata.Item;
        let amount = 0, mpesaReceipt = '', phoneNumber = '';

        callbackItems.forEach((item: any) => {
            if (item.Name === 'Amount') amount = item.Value;
            if (item.Name === 'MpesaReceiptNumber') mpesaReceipt = item.Value;
            if (item.Name === 'PhoneNumber') phoneNumber = item.Value.toString();
        });

        // 4. Retrieve pending transaction context (You'd pass these in the STK Push AccountReference)
        // For this example, assume we temporarily stored the intent in Redis or a DB table
        const userId = "extracted-user-uuid"; 
        const propertyId = "extracted-property-uuid";
        const sharesBought = amount / 10000; // Assuming 10k KES per share

        // 5. Execute Atomic Database Transaction via RPC
        const { data: dbSuccess, error: rpcError } = await supabaseAdmin.rpc('process_share_purchase', {
            buyer_id: userId,
            target_property_id: propertyId,
            shares_to_buy: sharesBought,
            amount_paid: amount
        });

        if (rpcError || !dbSuccess) throw new Error("Database update failed");

        // 6. Log the exact M-Pesa receipt for auditing
        await supabaseAdmin.from('mpesa_transactions').insert([{
            user_id: userId,
            property_id: propertyId,
            mpesa_receipt: mpesaReceipt,
            amount: amount,
            phone_number: phoneNumber
        }]);

        // 7. FUTURE STEP: Trigger Web3 script to mint Polygon tokens to user's wallet here

        return NextResponse.json({ status: 'Success' });

    } catch (error) {
        console.error("M-Pesa Webhook Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}