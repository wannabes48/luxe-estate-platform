import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const stkCallback = payload.Body.stkCallback;
        const checkoutRequestId = stkCallback.CheckoutRequestID;
        const resultCode = stkCallback.ResultCode;

        // 1. Fetch the original pending transaction using Safaricom's Receipt ID
        const { data: transaction, error: txError } = await supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('checkout_request_id', checkoutRequestId)
            .single();

        if (txError || !transaction) {
            console.error("Transaction not found for ID:", checkoutRequestId);
            return NextResponse.json({ ResultCode: 0, ResultDesc: "Acknowledged" });
        }

        // 2. Handle Failed Payments (User cancelled, insufficient funds, wrong PIN)
        if (resultCode !== 0) {
            await supabaseAdmin.from('transactions').update({ status: 'failed' }).eq('id', transaction.id);
            return NextResponse.json({ ResultCode: 0, ResultDesc: "Failure Logged" });
        }

        // --- 3. EXECUTE SHARE TRANSFER SUCCESS LOGIC ---
        
        if (transaction.purchase_type === 'primary') {
            // SCENARIO A: Buying original shares from the platform
            
            const { data: propShares } = await supabaseAdmin.from('property_shares').select('price_per_share, available_shares').eq('property_id', transaction.property_id).single();
            const sharesBought = Math.floor(transaction.amount / propShares!.price_per_share);

            const { data: existingInvestment } = await supabaseAdmin.from('investments')
                .select('*').eq('user_id', transaction.user_id).eq('property_id', transaction.property_id).single();

            if (existingInvestment) {
                await supabaseAdmin.from('investments').update({
                    shares_owned: existingInvestment.shares_owned + sharesBought,
                    amount_invested: Number(existingInvestment.amount_invested) + Number(transaction.amount)
                }).eq('id', existingInvestment.id);
            } else {
                await supabaseAdmin.from('investments').insert({
                    user_id: transaction.user_id,
                    property_id: transaction.property_id,
                    shares_owned: sharesBought,
                    amount_invested: transaction.amount
                });
            }

            // Decrement available shares
            await supabaseAdmin.from('property_shares').update({
                available_shares: propShares!.available_shares - sharesBought
            }).eq('property_id', transaction.property_id);

        } else if (transaction.purchase_type === 'secondary') {
            // SCENARIO B: Peer-to-Peer Trading (Buying from another investor)

            const { data: listing } = await supabaseAdmin.from('secondary_listings').select('*').eq('id', transaction.listing_id).single();
            if (!listing) throw new Error("Listing not found.");

            // Add shares to the BUYER
            const { data: buyerInvestment } = await supabaseAdmin.from('investments')
                .select('*').eq('user_id', transaction.user_id).eq('property_id', transaction.property_id).single();

            if (buyerInvestment) {
                await supabaseAdmin.from('investments').update({
                    shares_owned: buyerInvestment.shares_owned + listing.shares_offered,
                    amount_invested: Number(buyerInvestment.amount_invested) + Number(transaction.amount)
                }).eq('id', buyerInvestment.id);
            } else {
                await supabaseAdmin.from('investments').insert({
                    user_id: transaction.user_id,
                    property_id: transaction.property_id,
                    shares_owned: listing.shares_offered,
                    amount_invested: transaction.amount
                });
            }

            // Deduct shares from the SELLER
            const { data: sellerInvestment } = await supabaseAdmin.from('investments')
                .select('*').eq('user_id', listing.seller_id).eq('property_id', transaction.property_id).single();

            const newSellerShares = sellerInvestment!.shares_owned - listing.shares_offered;
            if (newSellerShares <= 0) {
                await supabaseAdmin.from('investments').delete().eq('id', sellerInvestment!.id);
            } else {
                await supabaseAdmin.from('investments').update({
                    shares_owned: newSellerShares,
                    amount_invested: Number(sellerInvestment!.amount_invested) - Number(transaction.amount)
                }).eq('id', sellerInvestment!.id);
            }

            // Mark the secondary listing as SOLD
            await supabaseAdmin.from('secondary_listings').update({ status: 'sold' }).eq('id', listing.id);
        }

        // 4. Mark transaction as completed
        await supabaseAdmin.from('transactions').update({ status: 'completed' }).eq('id', transaction.id);

        // 5. FUTURE STEP: Trigger Web3 script to mint Polygon tokens here

        return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });

    } catch (error: any) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ ResultCode: 0, ResultDesc: "Error caught but acknowledged" });
    }
}