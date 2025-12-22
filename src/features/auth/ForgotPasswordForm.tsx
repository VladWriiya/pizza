'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/shared/form/FormInput';
import { Button } from '@/shared/ui/button';
import toast from 'react-hot-toast';
import { requestPasswordResetAction } from '@/app/[locale]/actions/password-reset';
import { ArrowLeft, Mail } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

interface Props {
  onBack: () => void;
}

export const ForgotPasswordForm: React.FC<Props> = ({ onBack }) => {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const result = await requestPasswordResetAction(data.email);
      if (result.success) {
        setSubmitted(true);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="pz-flex pz-flex-col pz-gap-5 pz-text-center">
        <div className="pz-mx-auto pz-w-16 pz-h-16 pz-bg-green-100 pz-rounded-full pz-flex pz-items-center pz-justify-center">
          <Mail size={32} className="pz-text-green-600" />
        </div>
        <h2 className="pz-text-xl pz-font-bold">Check Your Email</h2>
        <p className="pz-text-gray-500">
          If an account exists with that email, we&apos;ve sent password reset instructions.
        </p>
        <Button variant="outline" onClick={onBack} className="pz-mt-4">
          <ArrowLeft size={16} className="pz-mr-2" />
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form className="pz-flex pz-flex-col pz-gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h1 className="pz-text-2xl pz-font-bold">Forgot Password?</h1>
          <p className="pz-text-gray-400">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        <FormInput name="email" label="E-Mail" type="email" required />

        <Button loading={form.formState.isSubmitting} type="submit" className="pz-h-12 pz-text-base">
          Send Reset Link
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="pz-flex pz-items-center pz-justify-center pz-gap-2 pz-text-sm pz-text-gray-500 hover:pz-text-gray-700"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </button>
      </form>
    </FormProvider>
  );
};
