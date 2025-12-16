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
    const HYSTERESIS = 150; // pixels buffer to prevent flickering
    const THROTTLE_MS = 100; // minimum time between updates
    let lastUpdate = 0;
    let pendingUpdate: number | null = null;

    const checkShouldExpand = () => {
      const now = Date.now();

      // Throttle: skip if called too recently
      if (now - lastUpdate < THROTTLE_MS) {
        // Schedule a delayed check if not already scheduled
        if (!pendingUpdate) {
          pendingUpdate = window.setTimeout(() => {
            pendingUpdate = null;
            checkShouldExpand();
          }, THROTTLE_MS);
        }
        return;
      }
      lastUpdate = now;

      if (sectionRef.current && filtersContentRef.current) {
        const filtersHeight = filtersContentRef.current.offsetHeight;
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const scrolledPastSection = -sectionRect.top + 120;

        setIsExpanded((prev) => {
          if (prev) {
            return scrolledPastSection > filtersHeight - HYSTERESIS;
          } else {
            return scrolledPastSection > filtersHeight + HYSTERESIS;
          }
        });
      }
    };

    window.addEventListener('scroll', checkShouldExpand, { passive: true });
    checkShouldExpand();

    return () => {
      window.removeEventListener('scroll', checkShouldExpand);
      if (pendingUpdate) clearTimeout(pendingUpdate);
    };
  }, []);

  return (
    <div id="products" ref={sectionRef} className={cn('pz-flex pz-gap-6 md:pz-gap-[60px] pz-transition-all pz-duration-300', className)}>
      {/* Filters sidebar - hidden on mobile */}
      <div
        className={cn(
          'pz-shrink-0 pz-transition-all pz-duration-300 pz-hidden md:pz-block',
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
