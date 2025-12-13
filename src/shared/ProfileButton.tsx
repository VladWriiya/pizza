'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import { Button } from '@/shared/ui/button';
import { CircleUser, LogIn } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface Props {
  onClickSignIn?: () => void;
}

export const ProfileButton: React.FC<Props> = ({ onClickSignIn }) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button onClick={onClickSignIn} variant="outline" className="pz-flex pz-items-center pz-gap-2">
        <LogIn size={16} />
        Sign In
      </Button>
    );
  }

  return (
    <Link href="/profile" passHref legacyBehavior>
      <a>
        <Button variant="secondary" className="pz-flex pz-items-center pz-gap-2">
          <CircleUser size={18} />
          {session.user?.name || 'Profile'}
        </Button>
      </a>
    </Link>
  );
};
