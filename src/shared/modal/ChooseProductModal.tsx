'use client';

import React from 'react';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Dialog, DialogPortal, DialogOverlay, DialogTitle } from '@/shared/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ProductWithDetails } from '@/lib/prisma-types';
import { ChooseProductForm } from '@/features/product/ChooseProductForm';


interface ChooseProductModalProps {
  product: ProductWithDetails;
}

export const ChooseProductModal = ({ product }: ChooseProductModalProps) => {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            'pz-fixed pz-left-[50%] pz-top-[50%] pz-z-50 pz-translate-x-[-50%] pz-translate-y-[-50%]',
            'pz-w-full pz-max-w-[1100px] pz-h-[750px]',
            'pz-bg-white pz-rounded-lg pz-shadow-lg pz-overflow-hidden',
            'data-[state=open]:pz-animate-in data-[state=closed]:pz-animate-out',
            'data-[state=closed]:pz-fade-out-0 data-[state=open]:pz-fade-in-0',
            'data-[state=closed]:pz-zoom-out-95 data-[state=open]:pz-zoom-in-95'
          )}
        >
          <DialogTitle className="pz-sr-only">{product.name}</DialogTitle>
          <ChooseProductForm product={product} onClose={() => router.back()} />
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};