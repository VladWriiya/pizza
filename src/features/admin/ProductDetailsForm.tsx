'use client';

import React from 'react';
import { FormInput } from '@/shared/form/FormInput';
import { FormTextarea } from '@/shared/form/FormTextarea';

interface ProductDetailsFormProps {
  showDescriptions?: boolean;
}

export const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({ showDescriptions = false }) => {
  return (
    <div className="pz-space-y-6">
      <div className="pz-grid pz-grid-cols-2 pz-gap-6">
        <FormInput name="name_en" label="English Name" required />
        <FormInput name="name_he" label="Hebrew Name" dir="rtl" required />
      </div>
      <FormInput name="imageUrl" label="Image URL" required />

      {showDescriptions && (
        <>
          {/* Marketing Description */}
          <div className="pz-border-t pz-pt-6">
            <h3 className="pz-font-medium pz-mb-4">Marketing Description (promotional text)</h3>
            <div className="pz-grid pz-grid-cols-2 pz-gap-6">
              <FormTextarea
                name="marketingDescription_en"
                label="English"
                placeholder="Crispy on the outside, tender on the inside..."
                rows={3}
              />
              <FormTextarea
                name="marketingDescription_he"
                label="Hebrew"
                dir="rtl"
                placeholder="פריכים מבחוץ, רכים מבפנים..."
                rows={3}
              />
            </div>
          </div>

          {/* Technical Description (Ingredients) */}
          <div className="pz-border-t pz-pt-6">
            <h3 className="pz-font-medium pz-mb-4">Ingredients / Composition</h3>
            <div className="pz-grid pz-grid-cols-2 pz-gap-6">
              <FormTextarea
                name="description_en"
                label="English"
                placeholder="Chicken breast, crispy breading, served with sauce"
                rows={2}
              />
              <FormTextarea
                name="description_he"
                label="Hebrew"
                dir="rtl"
                placeholder="חזה עוף, ציפוי פריך, מוגש עם רוטב"
                rows={2}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};