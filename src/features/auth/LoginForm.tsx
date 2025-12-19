'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, LoginFormValues } from '@/lib/schemas/auth-schema';
import { FormInput } from '@/shared/form/FormInput';
import { Button } from '@/shared/ui/button';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useRouter } from '@/i18n/navigation';

interface Props {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
  onClose: () => void;
}

export const LoginForm: React.FC<Props> = ({ onSwitchToRegister, onSwitchToForgotPassword, onClose }) => {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      if (response && !response.ok) {
        throw new Error(response.error || 'Invalid credentials.');
      }

      toast.success('Successfully signed in!');
      onClose();

      const sessionResponse = await fetch('/api/auth/session');
      const session = await sessionResponse.json();

      if (session?.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Login Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in.';
      toast.error(errorMessage);
    }
  };

  return (
    <FormProvider {...form}>
      <form className="pz-flex pz-flex-col pz-gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="pz-flex pz-justify-between pz-items-start">
          <div>
            <h1 className="pz-text-2xl pz-font-bold">Sign In</h1>
            <p className="pz-text-gray-400">Enter your email to sign in to your account</p>
          </div>
          {/* <Image src="/assets/images/phone-icon.png" alt="phone-icon" width={60} height={60} /> */}
        </div>

        <FormInput name="email" label="E-Mail" />
        <FormInput name="password" label="Password" type="password" />

        <button
          type="button"
          onClick={onSwitchToForgotPassword}
          className="pz-text-sm pz-text-primary hover:pz-underline pz-text-end pz--mt-2"
        >
          Forgot Password?
        </button>

        <Button loading={form.formState.isSubmitting} type="submit" className="pz-h-12 pz-text-base">
          Sign In
        </Button>

        <p className="pz-text-center pz-text-sm pz-text-gray-500">
          Not a member?{' '}
          <button type="button" onClick={onSwitchToRegister} className="pz-text-primary hover:pz-underline">
            Sign Up
          </button>
        </p>
      </form>
    </FormProvider>
  );
};
