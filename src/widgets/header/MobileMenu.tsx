'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { ProductSearch } from '@/features/search/ProductSearch';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Navigation');

  const menuLinks = [
    { href: '/', label: t('home') },
    { href: '/#pizza', label: t('pizza') },
    { href: '/#drinks', label: t('drinks') },
    { href: '/#desserts', label: t('desserts') },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="pz-h-10 pz-w-10">
          <Menu className="pz-h-6 pz-w-6" />
          <span className="pz-sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pz-bg-white pz-w-[300px] pz-p-0">
        <SheetHeader className="pz-p-4 pz-border-b">
          <SheetTitle className="pz-flex pz-items-center pz-gap-3">
            <Image src="/logo.webp" alt="Logo" width={40} height={40} />
            <span>Collibri Pizza</span>
          </SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="pz-p-4 pz-border-b">
          <ProductSearch />
        </div>

        {/* Navigation Links */}
        <nav className="pz-flex pz-flex-col pz-p-4">
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="pz-py-3 pz-px-2 pz-text-lg pz-font-medium pz-text-gray-700 hover:pz-text-orange-500 hover:pz-bg-orange-50 pz-rounded-lg pz-transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
