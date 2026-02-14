import { createClient } from '@supabase/supabase-js';

// Environment variables must be set in Vercel for this to work
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase Environment Variables');
}

export const supabase = createClient(supabaseUrl  || '', supabaseAnonKey || '');