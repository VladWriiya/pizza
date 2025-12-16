import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import React from 'react';

export const Logo = () => {
  return (
    <Link href="/" className="pz-flex pz-items-center pz-gap-2 md:pz-gap-4">
      <Image
        src="/logo.webp"
        alt="Collibri Pizza Logo"
        width={60}
        height={60}
        className="pz-w-10 pz-h-10 md:pz-w-[60px] md:pz-h-[60px]"
      />
      <div className="pz-hidden sm:pz-block">
        <h1 className="pz-text-lg md:pz-text-2xl pz-font-black pz-uppercase">Collibri Pizza</h1>
        <p className="pz-text-xs md:pz-text-sm pz-leading-3 pz-text-neutral-400">Can&apos;t be tastier</p>
      </div>
    </Link>
  );
};
