'use server';

import { prisma } from '../../../../prisma/prisma-client';
import { sendEmail } from '@/lib/email';
import { VerificationEmail } from '@/lib/email-templates';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Generate a 6-digit verification code
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Send verification email to user
 */
export async function sendVerificationEmailAction(userId: number): Promise<ActionResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.verified) {
      return { success: false, error: 'Email already verified' };
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Upsert verification code (one per user)
    await prisma.verificationCode.upsert({
      where: { userId },
      update: { code, expiresAt },
      create: { userId, code, expiresAt },
    });

    // Send email
    const verificationLink = `${APP_URL}/verify-email?code=${code}&userId=${userId}`;
    await sendEmail(
      user.email,
      'Verify Your Email - Collibri Pizza',
      VerificationEmail({
        fullName: user.fullName,
        verificationCode: code,
        verificationLink,
      })
    );

    return { success: true };
  } catch (error) {
    console.error('Send verification email error:', error);
    return { success: false, error: 'Failed to send verification email' };
  }
}

/**
 * Verify email with code
 */
export async function verifyEmailAction(
  userId: number,
  code: string
): Promise<ActionResult> {
  try {
    const verificationCode = await prisma.verificationCode.findUnique({
      where: { userId_code: { userId, code } },
      include: { user: true },
    });

    if (!verificationCode) {
      return { success: false, error: 'Invalid verification code' };
    }

    if (verificationCode.expiresAt < new Date()) {
      return { success: false, error: 'Verification code has expired' };
    }

    if (verificationCode.user.verified) {
      return { success: false, error: 'Email already verified' };
    }

    // Mark user as verified and delete code
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { verified: new Date() },
      }),
      prisma.verificationCode.delete({
        where: { id: verificationCode.id },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Email verification error:', error);
    return { success: false, error: 'Failed to verify email' };
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmailAction(email: string): Promise<ActionResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Return success to prevent enumeration
      return { success: true };
    }

    if (user.verified) {
      return { success: false, error: 'Email already verified' };
    }

    return sendVerificationEmailAction(user.id);
  } catch (error) {
    console.error('Resend verification error:', error);
    return { success: true }; // Prevent enumeration
  }
}
