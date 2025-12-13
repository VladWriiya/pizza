'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerFormSchema, RegisterFormValues } from '@/lib/schemas/auth-schema';
import { FormInput } from '@/shared/form/FormInput';
import { Button } from '@/shared/ui/button';
import toast from 'react-hot-toast';
import { registerUser } from '@/app/[locale]/actions/auth';
import { Heading } from '@/shared/Heading';

interface Props {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onSwitchToLogin }) => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { email: '', fullName: '', password: '' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      toast.success('Registration successful! Please check your email to verify your account.');
      onSwitchToLogin();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register.';
      toast.error(errorMessage);
    }
  };

  return (
    <FormProvider {...form}>
      <form className="pz-flex pz-flex-col pz-gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <Heading level="3" className="pz-font-bold">
          Create an Account
        </Heading>

        <FormInput name="fullName" label="Full Name" required />
        <FormInput name="email" label="E-Mail" required />
        <FormInput name="password" label="Password" type="password" required />
        <FormInput name="confirmPassword" label="Confirm Password" type="password" required />

        <Button loading={form.formState.isSubmitting} type="submit" className="pz-h-12 pz-text-base">
          Sign Up
        </Button>

        <p className="pz-text-center pz-text-sm pz-text-gray-500">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin} className="pz-text-primary hover:pz-underline">
            Sign In
          </button>
        </p>
      </form>
    </FormProvider>
  );
};
