import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("Missing RESEND_API_KEY");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const body = await request.json();
    const { full_name, email, message, property_name } = body;

    const { data, error } = await resend.emails.send({
      from: 'Luxe Estate <onboarding@resend.dev>', // Use your verified domain in production
      to: ['sirodaniel48@gmail.com'], // Where you want to receive the lead
      subject: `New Inquiry: ${property_name || "General Contact"}`,
      html: `
        <h2>New Property Inquiry</h2>
        <p><strong>Name:</strong> ${full_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Property:</strong> ${property_name}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
  }
}