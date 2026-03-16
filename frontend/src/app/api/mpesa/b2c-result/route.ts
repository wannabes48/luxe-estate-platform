import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (Bypasses RLS to write securely)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        
        // Safaricom nests everything inside a "Result" object
        const result = payload.Result;

        if (!result) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const resultCode = result.ResultCode;
        const resultDesc = result.ResultDesc;
        const transactionId = result.TransactionID;

        // ResultCode 0 means the money successfully hit the user's M-Pesa account
        if (resultCode === 0) {
            // Extract the specific parameters from Safaricom's array
            const parameters = result.ResultParameters?.ResultParameter || [];
            
            const amountObj = parameters.find((p: any) => p.Key === 'TransactionAmount');
            const receiptObj = parameters.find((p: any) => p.Key === 'TransactionReceipt');
            const receiverObj = parameters.find((p: any) => p.Key === 'ReceiverPartyPublicName');

            const amount = amountObj ? amountObj.Value : 0;
            const receipt = receiptObj ? receiptObj.Value : transactionId;
            const receiverName = receiverObj ? receiverObj.Value : 'Unknown';

            // Log the successful transaction in your database
            // Note: If you stored the OriginatorConversationID in the previous step, 
            // you could use it to update the exact row in 'yield_history'. 
            // For now, we insert a fresh confirmed record.
            await supabaseAdmin.from('yield_history').insert({
                mpesa_receipt: receipt,
                amount_paid: amount,
                receiver_details: receiverName,
                status: 'Success',
                completed_at: new Date().toISOString()
            });

            console.log(`✅ [B2C SUCCESS] Paid KES ${amount} to ${receiverName}. Receipt: ${receipt}`);

        } else {
            // The transaction failed (e.g., user's M-Pesa is blocked, or your B2C balance is low)
            console.error(`❌ [B2C FAILED] Code: ${resultCode}. Reason: ${resultDesc}`);
            
            await supabaseAdmin.from('yield_history').insert({
                mpesa_receipt: transactionId || 'FAILED',
                status: 'Failed',
                failure_reason: resultDesc,
                completed_at: new Date().toISOString()
            });
        }

        // CRITICAL: You MUST return a successful response to Safaricom, 
        // otherwise they will assume your server is dead and keep retrying the webhook.
        return NextResponse.json({
            ResultCode: 0,
            ResultDesc: "Success"
        });

    } catch (error: any) {
        console.error('Webhook processing error:', error);
        // Even on error, tell Safaricom we received it so they don't spam the endpoint
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Error caught but acknowledged" });
    }
}