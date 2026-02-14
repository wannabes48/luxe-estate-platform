"use server"
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If these are missing during the Vercel build, the fetch will fail
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase Env Variables. Check Vercel Settings.")
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function submitInquiry(formData: FormData) {
  const propertyId = formData.get('propertyId');
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Defensive check
  if (!name || !email || !message) {
    return { success: false, error: "Missing required fields." };
  }

  const rawData = {
    property: propertyId && propertyId !== "undefined" ? propertyId : null,
    full_name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    message: formData.get('message')?.toString() || '',
  };

  try {
    const response = await fetch(`${supabaseUrl}/api/inquiries/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rawData),
    });

    if (!response.ok) {
        const errorData = await response.json();
      // LOG THIS: Check your VS Code terminal to see exactly what field Django is complaining about
         console.log("SERVER VALIDATION ERROR:", errorData);
         return { success: false, error: "Submission failed." };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Server connection error." };
  }
}