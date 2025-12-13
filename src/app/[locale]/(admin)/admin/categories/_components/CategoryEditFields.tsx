'use client';

import { Input } from '@/shared/ui/input';
import React from 'react';

interface Props {
  isEditing?: boolean;
}

export const CategoryEditFields = ({ }: Props) => {
  return (
    <>
      <div>
        <label className="pz-block pz-text-sm pz-font-medium pz-mb-1">English Name</label>
        <Input name="name_en" placeholder="Pizza" required />
      </div>
      <div>
        <label className="pz-block pz-text-sm pz-font-medium pz-mb-1">Hebrew Name</label>
        <Input name="name_he" placeholder="פיצה" required dir="rtl" />
      </div>
    </>
  );
};