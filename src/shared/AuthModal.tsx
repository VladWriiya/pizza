'use client';

import React from 'react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { signIn } from 'next-auth/react';
import { LoginForm } from '@/features/auth/LoginForm';
import { RegisterForm } from '@/features/auth/RegisterForm';
import Image from 'next/image';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
  const [type, setType] = React.useState<'login' | 'register'>('login');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="pz-w-full sm:pz-max-w-md pz-bg-white pz-p-8">
        {type === 'login' ? (
          <LoginForm onSwitchToRegister={() => setType('register')} onClose={onClose} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setType('login')} />
        )}

        <div className="pz-relative pz-my-5">
          <div className="pz-absolute pz-inset-0 pz-flex pz-items-center">
            <span className="pz-w-full pz-border-t" />
          </div>
          <div className="pz-relative pz-flex pz-justify-center pz-text-xs">
            <span className="pz-bg-white pz-px-2 pz-text-gray-500">OR CONTINUE WITH</span>
          </div>
        </div>

        <div className="pz-grid pz-grid-cols-2 pz-gap-4">
          <Button
            variant="outline"
            onClick={() => signIn('github', { callbackUrl: '/' })}
            type="button"
            className="pz-flex pz-items-center pz-justify-center pz-gap-2 pz-h-12"
          >
            <Image src="/github-logo.png" alt="github" width={24} height={24} />
            GitHub
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            type="button"
            className="pz-flex pz-items-center pz-justify-center pz-gap-2 pz-h-12"
          >
            <Image src="/google-logo.png" alt="google" width={24} height={24} />
            Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
