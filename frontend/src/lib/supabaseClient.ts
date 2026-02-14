import { createClient } from '@supabase/supabase-js';

// Environment variables must be set in Vercel for this to work
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("CRITICAL: NEXT_PUBLIC_SUPABASE_URL is missing!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);