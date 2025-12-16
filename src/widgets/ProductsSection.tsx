'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ProductsSectionProps {
  children: React.ReactNode;
  filters: React.ReactNode;
  className?: string;
}

export const ProductsSection = ({ children, filters, className }: ProductsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filtersHeight, setFiltersHeight] = useState(0);
  const [canStick, setCanStick] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const filtersContentRef = useRef<HTMLDivElement>(null);
  const isExpandingRef = useRef(false);

  // Track filters height changes (e.g. when ingredients list expands)
  useEffect(() => {
    const filtersEl = filtersContentRef.current;
    if (!filtersEl) return;

    const updateHeight = () => {
      const height = filtersEl.offsetHeight;
      setFiltersHeight(height);
      // Can stick only if filters fit in viewport (with some margin for toolbar)
      setCanStick(height < window.innerHeight - 150);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(filtersEl);

    window.addEventListener('resize', updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const checkShouldExpand = useCallback(() => {
    if (isExpandingRef.current || !sectionRef.current || filtersHeight === 0) return;

    const sectionRect = sectionRef.current.getBoundingClientRect();
    const scrolledPastSection = -sectionRect.top + 120;
    const HYSTERESIS = 150;

    const shouldExpand = isExpanded
      ? scrolledPastSection > filtersHeight - HYSTERESIS
      : scrolledPastSection > filtersHeight + HYSTERESIS;

    if (shouldExpand !== isExpanded) {
      isExpandingRef.current = true;
      const scrollY = window.scrollY;

      setIsExpanded(shouldExpand);

      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
        setTimeout(() => {
          isExpandingRef.current = false;
        }, 350);
      });
    }
  }, [isExpanded, filtersHeight]);

  useEffect(() => {
    const THROTTLE_MS = 150;
    let lastUpdate = 0;
    let pendingUpdate: number | null = null;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastUpdate < THROTTLE_MS) {
        if (!pendingUpdate) {
          pendingUpdate = window.setTimeout(() => {
            pendingUpdate = null;
            handleScroll();
          }, THROTTLE_MS);
        }
        return;
      }
      lastUpdate = now;
      checkShouldExpand();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    checkShouldExpand();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (pendingUpdate) clearTimeout(pendingUpdate);
    };
  }, [checkShouldExpand]);

  return (
    <div id="products" ref={sectionRef} className={cn('pz-flex pz-gap-6 md:pz-gap-[60px]', className)}>
      {/* Filters sidebar - hidden on mobile */}
      <div
        className={cn(
          'pz-shrink-0 pz-transition-all pz-duration-300 pz-hidden md:pz-block',
          isExpanded
            ? 'pz-w-0 pz-opacity-0 pz-overflow-hidden'
            : 'pz-w-[250px] pz-opacity-100'
        )}
      >
        <div ref={filtersContentRef} className={cn(canStick && 'pz-sticky pz-top-28')}>
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
