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

            <Button
              variant="outline"
              onClick={() => signIn('github', { callbackUrl: '/' })}
              type="button"
              className="pz-flex pz-items-center pz-justify-center pz-gap-2 pz-h-12 pz-w-full"
            >
              <Github className="pz-w-5 pz-h-5" />
              GitHub
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
