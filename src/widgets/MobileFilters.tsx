'use client';

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { useTranslations } from 'next-intl';

interface MobileFiltersProps {
  children: React.ReactNode;
}

export const MobileFilters = ({ children }: MobileFiltersProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('HomePage');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="pz-flex pz-items-center pz-gap-2 md:pz-hidden"
        >
          <SlidersHorizontal className="pz-h-4 pz-w-4" />
          {t('filters')}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="pz-bg-white pz-h-[85vh] pz-rounded-t-2xl pz-p-0">
        <SheetHeader className="pz-p-4 pz-border-b pz-flex pz-flex-row pz-items-center pz-justify-between">
          <SheetTitle>{t('filters')}</SheetTitle>
        </SheetHeader>
        <div className="pz-p-4 pz-overflow-y-auto pz-h-[calc(85vh-60px)]">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};
