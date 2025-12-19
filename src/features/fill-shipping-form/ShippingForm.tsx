import React from 'react';
import { WhiteBlock } from '@/shared/WhiteBlock';
import { FormInput } from '@/shared/form/FormInput';
import { AddressCombobox } from '@/shared/AddressCombobox';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { FormTextarea } from '@/shared/FormTextarea';
import { FormField } from '@/shared/form/FormField';
import { DeliveryTimeSelector } from './DeliveryTimeSelector';

export const ShippingForm = () => {
  const t = useTranslations('CheckoutForm');
  const { control } = useFormContext();

  return (
    <>
      <WhiteBlock title={t('personalInfo')}>
        <div className="pz-grid pz-grid-cols-1 sm:pz-grid-cols-2 pz-gap-4 sm:pz-gap-5">
          <FormInput name="firstName" placeholder={t('firstName')} />
          <FormInput name="lastName" placeholder={t('lastName')} />
          <FormInput name="email" type="email" placeholder={t('email')} />
          <FormInput name="phone" type="tel" placeholder={t('phone')} />
        </div>
      </WhiteBlock>

      <WhiteBlock title={t('shippingAddress')}>
        <div className="pz-flex pz-flex-col pz-gap-4 sm:pz-gap-5">
          <FormField name="address">
            {(_, error) => (
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <AddressCombobox
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={!!error}
                  />
                )}
              />
            )}
          </FormField>

          <FormInput name="apartment" placeholder={t('apartment')} />

          <FormTextarea name="comment" placeholder={t('comment')} rows={3} />
        </div>
      </WhiteBlock>

      <WhiteBlock title={t('deliveryTime')}>
        <DeliveryTimeSelector />
      </WhiteBlock>
    </>
  );
};