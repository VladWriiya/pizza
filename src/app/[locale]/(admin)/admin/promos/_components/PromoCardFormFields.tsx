'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { actionTypes } from '@/lib/schemas/promo.schema';

const actionTypeLabels: Record<string, string> = {
  scroll: 'Scroll to section',
  link: 'Internal link',
  external: 'External link',
  copy: 'Copy coupon code',
  modal: 'Open modal',
  info: 'Info only (no action)',
};

const actionValuePlaceholders: Record<string, string> = {
  scroll: 'Section ID (e.g., products, footer)',
  link: 'Path (e.g., /register)',
  external: 'URL (e.g., https://github.com)',
  copy: 'Coupon code (e.g., SALE20)',
  modal: 'Modal name (e.g., about)',
  info: 'Not required',
};

export const PromoCardFormFields: React.FC = () => {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const actionType = watch('actionType');

  return (
    <div className="pz-space-y-4">
      {/* Bilingual titles */}
      <div className="pz-grid pz-grid-cols-2 pz-gap-4">
        <div>
          <Label htmlFor="title_en">Title (EN)</Label>
          <Input
            id="title_en"
            {...register('title_en')}
            placeholder="Fresh Pizza"
          />
          {errors.title_en && (
            <p className="pz-text-red-500 pz-text-sm pz-mt-1">
              {errors.title_en.message as string}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="title_he">Title (HE)</Label>
          <Input
            id="title_he"
            {...register('title_he')}
            placeholder="פיצה טרייה"
            dir="rtl"
          />
          {errors.title_he && (
            <p className="pz-text-red-500 pz-text-sm pz-mt-1">
              {errors.title_he.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Bilingual subtitles */}
      <div className="pz-grid pz-grid-cols-2 pz-gap-4">
        <div>
          <Label htmlFor="subtitle_en">Subtitle (EN)</Label>
          <Input
            id="subtitle_en"
            {...register('subtitle_en')}
            placeholder="Order now!"
          />
          {errors.subtitle_en && (
            <p className="pz-text-red-500 pz-text-sm pz-mt-1">
              {errors.subtitle_en.message as string}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="subtitle_he">Subtitle (HE)</Label>
          <Input
            id="subtitle_he"
            {...register('subtitle_he')}
            placeholder="הזמן עכשיו!"
            dir="rtl"
          />
          {errors.subtitle_he && (
            <p className="pz-text-red-500 pz-text-sm pz-mt-1">
              {errors.subtitle_he.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Image URL */}
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          {...register('imageUrl')}
          placeholder="/promos/my-image.webp"
        />
        {errors.imageUrl && (
          <p className="pz-text-red-500 pz-text-sm pz-mt-1">
            {errors.imageUrl.message as string}
          </p>
        )}
      </div>

      {/* Action Type */}
      <div>
        <Label>Action Type</Label>
        <Controller
          name="actionType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {actionTypeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.actionType && (
          <p className="pz-text-red-500 pz-text-sm pz-mt-1">
            {errors.actionType.message as string}
          </p>
        )}
      </div>

      {/* Action Value (conditional) */}
      {actionType && actionType !== 'info' && (
        <div>
          <Label htmlFor="actionValue">Action Value</Label>
          <Input
            id="actionValue"
            {...register('actionValue')}
            placeholder={actionValuePlaceholders[actionType] || ''}
          />
        </div>
      )}

      {/* Is Active */}
      <div className="pz-flex pz-items-center pz-gap-2">
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <Switch
              id="isActive"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
    </div>
  );
};
