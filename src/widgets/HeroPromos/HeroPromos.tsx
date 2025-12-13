'use client';

import React, { useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { PromoModal } from './PromoModal';
import { PromoCard } from '@prisma/client';

interface PromoCardAction {
  type: 'scroll' | 'link' | 'external' | 'copy' | 'modal' | 'info';
  value?: string;
}

interface HeroPromosProps {
  promoCards: PromoCard[];
}

export function HeroPromos({ promoCards }: HeroPromosProps) {
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 160;
    const newScrollLeft =
      direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
    scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  const getAction = (card: PromoCard): PromoCardAction => ({
    type: card.actionType as PromoCardAction['type'],
    value: card.actionValue || undefined,
  });

  const handleCardClick = (card: PromoCard) => {
    const action = getAction(card);
    switch (action.type) {
      case 'scroll':
        if (action.value) {
          const element = document.getElementById(action.value);
          element?.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'copy':
        if (action.value) {
          navigator.clipboard.writeText(action.value);
          toast.success(`Code ${action.value} copied!`);
        }
        break;
      case 'modal':
        if (action.value === 'about') {
          setAboutOpen(true);
        }
        break;
      case 'info':
        // Info cards just show information, no action needed
        break;
    }
  };

  const getTitle = (card: PromoCard) => locale === 'he' ? card.title_he : card.title_en;
  const getSubtitle = (card: PromoCard) => locale === 'he' ? card.subtitle_he : card.subtitle_en;

  const renderCard = (card: PromoCard) => {
    const action = getAction(card);

    const cardContent = (
      <div
        className={cn(
          'pz-flex-shrink-0',
          'pz-w-[120px] pz-h-[160px]',
          'sm:pz-w-[140px] sm:pz-h-[190px]',
          'md:pz-w-[160px] md:pz-h-[220px]',
          'pz-rounded-2xl pz-overflow-hidden',
          'pz-cursor-pointer pz-transition-transform hover:pz-scale-[1.03]',
          'pz-relative pz-snap-start'
        )}
      >
        {/* Background image */}
        <div
          className="pz-absolute pz-inset-0 pz-bg-cover pz-bg-center"
          style={{ backgroundImage: `url(${card.imageUrl})` }}
        />
        {/* Gradient overlay for text readability */}
        <div className="pz-absolute pz-inset-0 pz-bg-gradient-to-t pz-from-black/70 pz-via-black/20 pz-to-transparent" />
        {/* Text content */}
        <div className="pz-absolute pz-bottom-0 pz-start-0 pz-end-0 pz-p-3">
          <h3 className="pz-font-bold pz-text-sm sm:pz-text-base md:pz-text-lg pz-leading-tight pz-text-white pz-drop-shadow-md">
            {getTitle(card)}
          </h3>
          <p className="pz-text-xs sm:pz-text-sm pz-text-white/90 pz-mt-1 pz-leading-snug pz-drop-shadow-md">
            {getSubtitle(card)}
          </p>
        </div>
      </div>
    );

    // External links
    if (action.type === 'external' && action.value) {
      return (
        <a
          key={card.id}
          href={action.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cardContent}
        </a>
      );
    }

    // Internal links
    if (action.type === 'link' && action.value) {
      return (
        <Link key={card.id} href={action.value}>
          {cardContent}
        </Link>
      );
    }

    // Clickable cards (scroll, copy, modal, info)
    return (
      <div key={card.id} onClick={() => handleCardClick(card)}>
        {cardContent}
      </div>
    );
  };

  if (promoCards.length === 0) {
    return null;
  }

  return (
    <>
      <div className="pz-relative pz-flex pz-items-center pz-justify-center pz-px-4">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={cn(
            'pz-flex-shrink-0 pz-hidden md:pz-flex',
            'pz-items-center pz-justify-center',
            'pz-p-1',
            'hover:pz-opacity-70 pz-transition-opacity'
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="pz-w-8 pz-h-8 pz-text-orange-500 rtl:pz-rotate-180" />
        </button>

        {/* Cards Container */}
        <div
          ref={scrollRef}
          className={cn(
            'pz-flex pz-gap-3 pz-overflow-x-auto pz-scroll-smooth',
            'pz-max-w-[1400px] pz-w-full pz-mx-4',
            'pz-pb-1 pz-scrollbar-hide',
            'pz-snap-x pz-snap-mandatory'
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {promoCards.map(renderCard)}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={cn(
            'pz-flex-shrink-0 pz-hidden md:pz-flex',
            'pz-items-center pz-justify-center',
            'pz-p-1',
            'hover:pz-opacity-70 pz-transition-opacity'
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="pz-w-8 pz-h-8 pz-text-orange-500 rtl:pz-rotate-180" />
        </button>
      </div>

      <PromoModal open={aboutOpen} onOpenChange={setAboutOpen} />
    </>
  );
}
