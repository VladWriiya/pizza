'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/shared/form/FormInput';
import { Button } from '@/shared/ui/button';
import { Heading } from '@/shared/Heading';
import { validateResetTokenAction, resetPasswordAction } from '@/app/[locale]/actions/password-reset';
import { Link } from '@/i18n/navigation';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'success'>('loading');
  const [email, setEmail] = useState<string>('');

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setStatus('invalid');
        return;
      }

      const result = await validateResetTokenAction(token);
      if (result.valid) {
        setStatus('valid');
        setEmail(result.email || '');
      } else {
        setStatus('invalid');
      }
    }

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) return;

    const result = await resetPasswordAction(token, data.password);
    if (result.success) {
      setStatus('success');
      toast.success('Password reset successfully!');
    } else {
      toast.error(result.error || 'Failed to reset password');
    }
  };

  if (status === 'loading') {
    return (
      <div className="pz-min-h-[60vh] pz-flex pz-items-center pz-justify-center">
        <Loader2 className="pz-w-8 pz-h-8 pz-animate-spin pz-text-primary" />
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="pz-min-h-[60vh] pz-flex pz-items-center pz-justify-center">
        <div className="pz-text-center pz-max-w-md pz-p-8">
          <XCircle className="pz-w-16 pz-h-16 pz-text-red-500 pz-mx-auto pz-mb-4" />
          <Heading level="2">Invalid or Expired Link</Heading>
          <p className="pz-text-gray-500 pz-mt-2 pz-mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="pz-min-h-[60vh] pz-flex pz-items-center pz-justify-center">
        <div className="pz-text-center pz-max-w-md pz-p-8">
          <CheckCircle className="pz-w-16 pz-h-16 pz-text-green-500 pz-mx-auto pz-mb-4" />
          <Heading level="2">Password Reset!</Heading>
          <p className="pz-text-gray-500 pz-mt-2 pz-mb-6">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pz-min-h-[60vh] pz-flex pz-items-center pz-justify-center">
      <div className="pz-w-full pz-max-w-md pz-p-8 pz-bg-white pz-rounded-xl pz-shadow-lg">
        <Heading level="2" className="pz-mb-2">Reset Your Password</Heading>
        <p className="pz-text-gray-500 pz-mb-6">
          Enter a new password for {email}
        </p>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="pz-space-y-4">
            <FormInput
              name="password"
              label="New Password"
              type="password"
              required
            />
            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              required
            />
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              className="pz-w-full pz-h-12"
            >
              Reset Password
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
