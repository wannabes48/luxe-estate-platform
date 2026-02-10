"use server"
import { cookies } from 'next/headers'

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

  const baseUrl = process.env.API_URL || 'http://127.0.0.1:8000';

  try {
    const response = await fetch(`${baseUrl}/api/inquiries/`, {
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