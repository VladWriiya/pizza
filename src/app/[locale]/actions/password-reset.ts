'use server';

import { randomBytes } from 'crypto';
import { hashSync } from 'bcrypt';
import { prisma } from '../../../../prisma/prisma-client';
import { sendEmail } from '@/lib/email';
import { PasswordResetEmail } from '@/lib/email-templates';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Request a password reset email
 * Always returns success to prevent email enumeration
 */
export async function requestPasswordResetAction(email: string): Promise<ActionResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { success: true };
    }

    // Don't allow reset for OAuth users without password
    if (user.provider && !user.password) {
      return { success: true };
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate old tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    // Create new token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send email
    const resetLink = `${APP_URL}/reset-password?token=${token}`;
    await sendEmail(
      user.email,
      'Reset Your Password - Collibri Pizza',
      PasswordResetEmail({ fullName: user.fullName, resetLink })
    );

    return { success: true };
  } catch (error) {
    console.error('Password reset request error:', error);
    // Still return success to prevent enumeration
    return { success: true };
  }
}

/**
 * Validate a password reset token
 */
export async function validateResetTokenAction(token: string): Promise<{ valid: boolean; email?: string }> {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: { select: { email: true } } },
    });

    if (!resetToken) {
      return { valid: false };
    }

    if (resetToken.used) {
      return { valid: false };
    }

    if (resetToken.expiresAt < new Date()) {
      return { valid: false };
    }

    return { valid: true, email: resetToken.user.email };
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false };
  }
}

/**
 * Reset password with token
 */
export async function resetPasswordAction(
  token: string,
  newPassword: string
): Promise<ActionResult> {
  try {
    if (newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return { success: false, error: 'Invalid or expired reset link' };
    }

    if (resetToken.used) {
      return { success: false, error: 'This reset link has already been used' };
    }

    if (resetToken.expiresAt < new Date()) {
      return { success: false, error: 'This reset link has expired' };
    }

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashSync(newPassword, 10) },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Failed to reset password' };
  }
}
