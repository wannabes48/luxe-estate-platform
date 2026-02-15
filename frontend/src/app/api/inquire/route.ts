import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { property_id, full_name, email, message, phone, property_name } = body;

        // 1. Validate Input
        if (!full_name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 2. Insert into Supabase using Admin Client (Bypassing RLS)
        const { data, error: dbError } = await supabaseAdmin
            .from('inquiries')
            .insert([
                {
                    property_id,
                    full_name,
                    email,
                    message,
                    phone,
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error("Database Insertion Error:", dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        // 3. Trigger Email Notification (Internal API call or direct logic)
        // We can call our existing email endpoint or inline the logic. 
        // Calling the endpoint keeps concerns separated.
        const emailResponse = await fetch(new URL('/api/send-email', request.url), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name,
                email,
                message,
                property_name,
                phone
            })
        });

        if (!emailResponse.ok) {
            console.warn("Email notification failed, but DB insert succeeded.");
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error("Inquiry API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
