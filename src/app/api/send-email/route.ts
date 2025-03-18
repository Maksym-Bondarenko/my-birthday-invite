import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'max.druppy@gmail.com',
      subject: 'New Birthday Party RSVP! 🎉',
      html: `
        <h2>New RSVP Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Number of Guests:</strong> ${formData.guests}</p>
        <p><strong>Dietary Preference:</strong> ${formData.diet}</p>
        <p><strong>Drink Preferences:</strong> ${formData.drinks.join(', ')}</p>
        <p><strong>Fun Fact:</strong> ${formData.funFact}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 