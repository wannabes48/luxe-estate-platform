import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { full_name, email, message, property_name } = await request.json();

    const data = await resend.emails.send({
      from: 'Luxe Estate <onboarding@resend.dev>', // Use your verified domain in production
      to: ['your-email@example.com'], // Where you want to receive the lead
      subject: `New Inquiry: ${property_name}`,
      html: `
        <h2>New Property Inquiry</h2>
        <p><strong>Name:</strong> ${full_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Property:</strong> ${property_name}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}