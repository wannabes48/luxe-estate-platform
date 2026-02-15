import { createClient } from '@supabase/supabase-js';

// Access the Service Role Key safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing Supabase Admin Environment Variables");
}

// Create a Supabase client with the SERVICE ROLE KEY
// This client bypasses Row Level Security (RLS) entirely.
// DO NOT use this client on the client-side (browser).
export const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceRoleKey || '', {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
