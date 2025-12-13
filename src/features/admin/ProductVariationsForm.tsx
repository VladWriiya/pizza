'use client';

import React from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { Heading } from '@/shared/Heading';
import { Button } from '@/shared/ui/button';
import { FormInput } from '@/shared/form/FormInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Trash2 } from 'lucide-react';
import { SIZES_DATA, DOUGHS_DATA } from '@/constants/pizza-options';

export const ProductVariationsForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, remove, append } = useFieldArray({ control, name: 'items' });

  return (
    <div>
      <Heading level="3">Pizza Variations</Heading>
      {errors.items?.message && !Array.isArray(errors.items) && (
        <p className="pz-text-red-500 pz-text-sm pz-mt-2">{String(errors.items.message)}</p>
      )}
      <div className="pz-space-y-4 pz-mt-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="pz-grid pz-grid-cols-4 pz-gap-4 pz-items-start pz-p-4 pz-bg-gray-50 pz-rounded-md"
          >
            <FormInput name={`items.${index}.price`} label="Price" type="number" step="0.01" />
            <Controller
              control={control}
              name={`items.${index}.size`}
              render={({ field }) => (
                <div>
                  <label className="pz-block pz-mb-2 pz-font-medium">Size</label>
                  <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={String(field.value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZES_DATA.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {Array.isArray(errors.items) && errors.items[index]?.size && (
                    <p className="pz-text-red-500 pz-text-sm pz-mt-1">{String(errors.items[index]?.size?.message)}</p>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name={`items.${index}.pizzaType`}
              render={({ field }) => (
                <div>
                  <label className="pz-block pz-mb-2 pz-font-medium">Dough</label>
                  <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={String(field.value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dough" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOUGHS_DATA.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {Array.isArray(errors.items) && errors.items[index]?.pizzaType && (
                    <p className="pz-text-red-500 pz-text-sm pz-mt-1">
                      {String(errors.items[index]?.pizzaType?.message)}
                    </p>
                  )}
                </div>
              )}
            />
            <div className="pz-flex pz-items-end pz-h-full">
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        className="pz-mt-4"
        onClick={() => append({ price: undefined, size: 20, pizzaType: 1 })}
      >
        Add Variation
      </Button>
    </div>
  );
};
