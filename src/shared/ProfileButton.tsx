'use client';

import { useSession, signOut } from 'next-auth/react';
import React from 'react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { CircleUser, LogIn, LogOut, User, ChefHat, Bike, LayoutDashboard } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface Props {
  onClickSignIn?: () => void;
}

export const ProfileButton: React.FC<Props> = ({ onClickSignIn }) => {
  const { data: session } = useSession();
  const t = useTranslations('ProfileMenu');

  if (!session) {
    return (
      <Button onClick={onClickSignIn} variant="outline" className="pz-flex pz-items-center pz-gap-2">
        <LogIn size={16} />
        {t('signIn')}
      </Button>
    );
  }

  const role = session.user?.role;
  const isStaff = role && ['ADMIN', 'KITCHEN', 'COURIER'].includes(role);

  const getRoleIcon = () => {
    switch (role) {
      case 'ADMIN':
        return <LayoutDashboard size={16} />;
      case 'KITCHEN':
        return <ChefHat size={16} />;
      case 'COURIER':
        return <Bike size={16} />;
      default:
        return null;
    }
  };

  const getDashboardLink = () => {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'KITCHEN':
        return '/kitchen';
      case 'COURIER':
        return '/courier';
      default:
        return null;
    }
  };

  const getDashboardLabel = () => {
    switch (role) {
      case 'ADMIN':
        return t('adminPanel');
      case 'KITCHEN':
        return t('kitchenDashboard');
      case 'COURIER':
        return t('courierDashboard');
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="pz-flex pz-items-center pz-gap-2">
          <CircleUser size={18} />
          {session.user?.name || t('profile')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="pz-w-56 pz-bg-white pz-border pz-border-gray-200 pz-shadow-lg pz-rounded-md pz-p-1">
        <DropdownMenuLabel className="pz-font-normal pz-px-2 pz-py-2">
          <div className="pz-flex pz-flex-col pz-gap-0.5">
            <p className="pz-text-sm pz-font-medium pz-text-gray-900">{session.user?.name}</p>
            <p className="pz-text-xs pz-text-gray-500 pz-truncate">{session.user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="pz-bg-gray-200 pz-my-1" />

        {isStaff && dashboardLink && (
          <>
            <DropdownMenuItem asChild className="pz-cursor-pointer pz-rounded pz-px-2 pz-py-2 hover:pz-bg-gray-100 focus:pz-bg-gray-100">
              <Link href={dashboardLink} className="pz-flex pz-items-center pz-gap-2 pz-text-gray-700">
                {getRoleIcon()}
                <span>{getDashboardLabel()}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="pz-bg-gray-200 pz-my-1" />
          </>
        )}

        <DropdownMenuItem asChild className="pz-cursor-pointer pz-rounded pz-px-2 pz-py-2 hover:pz-bg-gray-100 focus:pz-bg-gray-100">
          <Link href="/profile" className="pz-flex pz-items-center pz-gap-2 pz-text-gray-700">
            <User size={16} />
            <span>{t('profile')}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="pz-bg-gray-200 pz-my-1" />

        <DropdownMenuItem
          className="pz-cursor-pointer pz-rounded pz-px-2 pz-py-2 pz-text-red-600 hover:pz-bg-red-50 focus:pz-bg-red-50 pz-flex pz-items-center pz-gap-2"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut size={16} />
          <span>{t('signOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
