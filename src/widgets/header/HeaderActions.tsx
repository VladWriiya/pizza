'use client';

import React from 'react';
import { CartButton } from '@/features/cart/CartButton';
import { ProfileButton } from '@/shared/ProfileButton';
import { AuthModal } from '@/shared/AuthModal';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { LanguageSwitcher } from '@/shared/LanguageSwitcher';


export const HeaderActions = () => {
  const [openAuthModal, setOpenAuthModal] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isPurchasePage = pathname.includes('/purchase');

  React.useEffect(() => {
    let toastMessage = '';
    if (searchParams.has('paid')) {
      toastMessage = 'Order paid successfully! Details have been sent to your email.';
    }
    if (searchParams.has('verified')) {
      toastMessage = 'Email successfully verified!';
    }
    if (toastMessage) {
      toast.success(toastMessage, { duration: 3000 });
      router.replace('/');
    }
  }, [searchParams, router]);

  return (
    <>
      <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

      <div className="pz-flex pz-items-center pz-gap-2">
        <LanguageSwitcher />
        <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />
        {!isPurchasePage && <CartButton />}
      </div>
    </>
  );
};
