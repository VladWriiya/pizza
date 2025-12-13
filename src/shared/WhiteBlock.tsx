'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Heading } from '@/shared/Heading';

interface WhiteBlockProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export const WhiteBlock: React.FC<WhiteBlockProps> = ({ title, className, children }) => {
  return (
    <div className={cn('pz-bg-white pz-rounded-lg pz-shadow-md', className)}>
      {title && (
        <div className="pz-p-6 pz-border-b pz-border-gray-200">
          <Heading level="3" className="pz-font-bold">
            {title}
          </Heading>
        </div>
      )}
      <div className="pz-p-6">{children}</div>
    </div>
  );
};
