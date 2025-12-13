import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, content: React.ReactNode) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Your Pizza Project <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      react: content as React.ReactElement,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email sending failed.');
  }
};
