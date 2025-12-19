'use client';

import React from 'react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { signIn } from 'next-auth/react';
import { LoginForm } from '@/features/auth/LoginForm';
import { RegisterForm } from '@/features/auth/RegisterForm';
import { ForgotPasswordForm } from '@/features/auth/ForgotPasswordForm';
import { Github } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  initialType?: 'login' | 'register';
}

export const AuthModal: React.FC<Props> = ({ open, onClose, initialType = 'login' }) => {
  const [type, setType] = React.useState<'login' | 'register' | 'forgot'>(initialType);

  // Reset to initialType when modal opens
  React.useEffect(() => {
    if (open) {
      setType(initialType);
    }
  }, [open, initialType]);

  const renderForm = () => {
    switch (type) {
      case 'login':
        return (
          <LoginForm
            onSwitchToRegister={() => setType('register')}
            onSwitchToForgotPassword={() => setType('forgot')}
            onClose={onClose}
          />
        );
      case 'register':
        return <RegisterForm onSwitchToLogin={() => setType('login')} />;
      case 'forgot':
        return <ForgotPasswordForm onBack={() => setType('login')} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="pz-w-full sm:pz-max-w-md pz-bg-white pz-p-8">
        {renderForm()}

        {type !== 'forgot' && (
          <>
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
                <Github className="pz-w-5 pz-h-5" />
                GitHub
              </Button>
              <Button
                variant="outline"
                onClick={() => signIn('google', { callbackUrl: '/' })}
                type="button"
                className="pz-flex pz-items-center pz-justify-center pz-gap-2 pz-h-12"
              >
                <svg className="pz-w-5 pz-h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
