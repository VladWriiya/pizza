'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Heading } from '@/shared/Heading';
import { CheckboxWithLabel } from '@/shared/CheckboxWithLabel';
import { Input } from '@/shared/ui/input';
import { useTranslations } from 'next-intl';

type CheckboxOption = {
  value: string;
  text: string;
};

interface CheckboxGroupFilterProps {
  title: string;
  items: CheckboxOption[];
  selectedValues?: Set<string>;
  onSelect: (value: string) => void;
  loading?: boolean;
  className?: string;
  limit?: number;
}

export const CheckboxGroupFilter = ({
  title,
  items,
  selectedValues,
  onSelect,
  loading,
  className,
  limit = 5,
}: CheckboxGroupFilterProps) => {
  const t = useTranslations('HomePage');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    // ... Skeleton код
  }

  const filteredItems = isExpanded
    ? items.filter((item) =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : items.slice(0, limit);

  return (
    <div className={cn(className)}>
      <Heading level="5" className="pz-font-bold pz-mb-3">
        {title}
      </Heading>

      {isExpanded && (
        <div className="pz-mb-5">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search')}
            className="pz-bg-gray-50 pz-border-none"
          />
        </div>
      )}

      <div className="pz-flex pz-flex-col pz-gap-4 pz-max-h-96 pz-pr-2 pz-overflow-auto scrollbar">
        {filteredItems.map((item) => (
          <CheckboxWithLabel
            key={item.value}
            label={item.text}
            checked={selectedValues?.has(item.value)}
            onCheckedChange={() => onSelect(item.value)}
          />
        ))}
      </div>

      {items.length > limit && (
        <div className={isExpanded ? 'pz-border-t pz-border-neutral-100 pz-mt-4' : ''}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="pz-text-primary pz-mt-3"
          >
            {isExpanded ? t('hide') : t('showAll', { count: items.length })}
          </button>
        </div>
      )}
    </div>
  );
};