import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// We need the Service Role key to access the auth.users table for the email address
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId, status, userName } = await req.json();
    
    // 1. Authenticate the Admin (Security Check)
    const cookieStore = await cookies();
    const supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch (error) {
              // Ignore if called from a context where cookies cannot be set
            }
          }
        }
      }
    );
    const { data: { user: adminUser } } = await supabaseClient.auth.getUser();
    
    if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: adminProfile } = await supabaseClient
      .from('user_profiles')
      .select('role')
      .eq('id', adminUser.id)
      .single();

    if (adminProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Fetch the Investor's Email Address
    const { data: targetUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userError || !targetUser.user.email) throw new Error("Could not fetch user email");

    // 3. Update the KYC Status
    const { error: updateError } = await supabaseClient
      .from('user_profiles')
      .update({ kyc_status: status })
      .eq('id', userId);

    if (updateError) throw updateError;

    // 4. Send the Premium Email Notification
    if (status === 'verified') {
      await resend.emails.send({
        from: 'Luxe Estate Compliance <compliance@luxe-estate.com>', // Update with your verified domain
        to: targetUser.user.email,
        subject: 'Account Verified - Luxe Estate Portfolio',
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border: 1px solid #eeeeee;">
            <h1 style="font-family: 'Georgia', serif; font-size: 24px; color: #0d0d0d; margin-bottom: 5px;">Luxe Estate.</h1>
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #E91E63; font-weight: bold; margin-top: 0;">Compliance Update</p>
            
            <h2 style="font-size: 18px; color: #0d0d0d; margin-top: 40px;">Welcome, ${userName}.</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #666666;">
              Your identity verification documents have been successfully reviewed and approved. 
              Your account restriction has been lifted, and you now have full access to fractional 
              trading on the Luxe Estate exchange.
            </p>
            
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display: inline-block; margin-top: 20px; background-color: #0d0d0d; color: #ffffff; padding: 16px 32px; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
              Access Portfolio
            </a>
            
            <p style="font-size: 10px; color: #aaaaaa; margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px;">
              This is an automated compliance notification. Do not reply to this email.
            </p>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("KYC Approval Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}