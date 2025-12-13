'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProductsSectionProps {
  children: React.ReactNode;
  filters: React.ReactNode;
  className?: string;
}

export const ProductsSection = ({ children, filters, className }: ProductsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const filtersContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkShouldExpand = () => {
      if (sectionRef.current && filtersContentRef.current) {
        // Get the height of the filters content
        const filtersHeight = filtersContentRef.current.offsetHeight;
        // Get how much the user has scrolled past the start of this section
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const scrolledPastSection = -sectionRect.top + 120; // 120 is header offset

        // Expand when scrolled past the filters height
        const shouldExpand = scrolledPastSection > filtersHeight;
        setIsExpanded(shouldExpand);
      }
    };

    window.addEventListener('scroll', checkShouldExpand);
    checkShouldExpand();

    return () => window.removeEventListener('scroll', checkShouldExpand);
  }, []);

  return (
    <div id="products" ref={sectionRef} className={cn('pz-flex pz-gap-[60px] pz-transition-all pz-duration-300', className)}>
      {/* Filters sidebar */}
      <div
        className={cn(
          'pz-shrink-0 pz-transition-all pz-duration-300',
          isExpanded
            ? 'pz-w-0 pz-opacity-0 pz-overflow-hidden'
            : 'pz-w-[250px] pz-opacity-100'
        )}
      >
        <div ref={filtersContentRef} className="pz-sticky pz-top-28">
          {filters}
        </div>
      </div>

      {/* Products grid */}
      <div
        className={cn(
          'pz-flex-1 pz-transition-all pz-duration-300',
          isExpanded && 'products-expanded'
        )}
      >
        {children}
      </div>
    </div>
  );
};
