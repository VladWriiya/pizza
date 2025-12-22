'use client';

import { FormInput } from '@/shared/form/FormInput';
import React from 'react';

export const CategoryEditFields = () => {
  return (
    <>
      <FormInput name="name_en" label="English Name" placeholder="Pizza" required />
      <FormInput name="name_he" label="Hebrew Name" placeholder="פיצה" required dir="rtl" />
    </>
  );
};