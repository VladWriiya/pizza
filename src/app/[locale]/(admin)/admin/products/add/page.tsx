'use client';

import React from 'react';
import { useRouter } from '@/i18n/navigation';
import { Heading } from '@/shared/Heading';
import { Button } from '@/shared/ui';


export default function AddProductChoicePage() {
  const router = useRouter();

  return (
    <div>
      <Heading level="1">Add a New Product</Heading>
      <p className="pz-mt-4 pz-text-gray-500">What type of product would you like to create?</p>
      <div className="pz-mt-8 pz-flex pz-gap-6">
        <Button size="lg" onClick={() => router.push('/admin/products/add/simple')}>
          Add Simple Product
        </Button>
        <Button size="lg" onClick={() => router.push('/admin/products/add/pizza')}>
          Add Pizza
        </Button>
      </div>
    </div>
  );
}
