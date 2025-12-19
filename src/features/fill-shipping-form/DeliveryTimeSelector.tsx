'use client';

import { useState, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Clock, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlot {
  value: string;
  label: string;
}

export const DeliveryTimeSelector = () => {
  const t = useTranslations('CheckoutForm');
  const { control, setValue, watch } = useFormContext();
  const [deliveryType, setDeliveryType] = useState<'asap' | 'scheduled'>('asap');

  const scheduledFor = watch('scheduledFor');

  // Generate available dates (today + next 6 days)
  const availableDates = useMemo(() => {
    const dates: { value: string; label: string }[] = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      let label: string;
      if (i === 0) {
        label = t('delivery.today');
      } else if (i === 1) {
        label = t('delivery.tomorrow');
      } else {
        label = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      }

      dates.push({ value: dateStr, label });
    }
    return dates;
  }, [t]);

  // Generate time slots (10:00 - 22:00, every 30 min)
  const generateTimeSlots = (dateStr: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const now = new Date();
    const isToday = dateStr === now.toISOString().split('T')[0];
    const minTime = isToday ? now.getHours() + 1.5 : 10; // min +1.5 hours from now

    for (let hour = 10; hour <= 21; hour++) {
      for (const minutes of [0, 30]) {
        const slotTime = hour + minutes / 60;
        if (slotTime < minTime) continue;
        if (hour === 21 && minutes === 30) continue; // No 21:30

        const timeStr = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        slots.push({ value: timeStr, label: timeStr });
      }
    }
    return slots;
  };

  const [selectedDate, setSelectedDate] = useState(availableDates[0]?.value || '');
  const timeSlots = useMemo(() => generateTimeSlots(selectedDate), [selectedDate]);

  const handleDeliveryTypeChange = (type: 'asap' | 'scheduled') => {
    setDeliveryType(type);
    if (type === 'asap') {
      setValue('scheduledFor', '');
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setValue('scheduledFor', ''); // Reset time when date changes
  };

  const handleTimeChange = (time: string) => {
    if (selectedDate && time) {
      const isoDate = `${selectedDate}T${time}:00`;
      setValue('scheduledFor', isoDate);
    }
  };

  // Parse current scheduledFor value
  const currentTime = scheduledFor ? scheduledFor.split('T')[1]?.slice(0, 5) : '';

  return (
    <div className="pz-space-y-4">
      <RadioGroup
        value={deliveryType}
        onValueChange={(v) => handleDeliveryTypeChange(v as 'asap' | 'scheduled')}
        className="pz-flex pz-gap-4"
      >
        <div className="pz-flex pz-items-center pz-space-x-2">
          <RadioGroupItem value="asap" id="asap" />
          <Label
            htmlFor="asap"
            className={cn(
              'pz-flex pz-items-center pz-gap-2 pz-cursor-pointer',
              deliveryType === 'asap' && 'pz-text-primary pz-font-medium'
            )}
          >
            <Clock size={16} />
            {t('delivery.asap')}
          </Label>
        </div>
        <div className="pz-flex pz-items-center pz-space-x-2">
          <RadioGroupItem value="scheduled" id="scheduled" />
          <Label
            htmlFor="scheduled"
            className={cn(
              'pz-flex pz-items-center pz-gap-2 pz-cursor-pointer',
              deliveryType === 'scheduled' && 'pz-text-primary pz-font-medium'
            )}
          >
            <CalendarDays size={16} />
            {t('delivery.scheduled')}
          </Label>
        </div>
      </RadioGroup>

      {deliveryType === 'scheduled' && (
        <div className="pz-grid pz-grid-cols-2 pz-gap-3">
          <Select value={selectedDate} onValueChange={handleDateChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('delivery.selectDate')} />
            </SelectTrigger>
            <SelectContent>
              {availableDates.map((date) => (
                <SelectItem key={date.value} value={date.value}>
                  {date.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentTime} onValueChange={handleTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('delivery.selectTime')} />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.length > 0 ? (
                timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))
              ) : (
                <div className="pz-py-2 pz-px-3 pz-text-sm pz-text-gray-500">
                  {t('delivery.noSlotsAvailable')}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Hidden controller to register field with react-hook-form */}
      <Controller
        control={control}
        name="scheduledFor"
        render={({ field }) => <input type="hidden" {...field} />}
      />
    </div>
  );
};
