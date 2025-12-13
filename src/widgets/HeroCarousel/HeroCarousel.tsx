'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import toast from 'react-hot-toast';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/shared/ui/carousel';
import { Button } from '@/shared/ui/button';
import { cn } from '@/lib/utils';
import { AboutModal } from './AboutModal';

type SlideAction =
  | { type: 'scroll'; target: string }
  | { type: 'link'; href: string }
  | { type: 'external'; href: string }
  | { type: 'copy'; code: string }
  | { type: 'modal'; modal: 'about' }
  | { type: 'info' };

interface Slide {
  id: number;
  bgColor: string;
  titleKey: string;
  subtitleKey: string;
  ctaKey: string;
  action: SlideAction;
}

const slides: Slide[] = [
  {
    id: 1,
    bgColor: 'pz-bg-gradient-to-r pz-from-orange-500 pz-to-red-500',
    titleKey: 'slide1Title',
    subtitleKey: 'slide1Subtitle',
    ctaKey: 'slide1Cta',
    action: { type: 'scroll', target: 'products' },
  },
  {
    id: 2,
    bgColor: 'pz-bg-gradient-to-r pz-from-green-500 pz-to-teal-500',
    titleKey: 'slide2Title',
    subtitleKey: 'slide2Subtitle',
    ctaKey: 'slide2Cta',
    action: { type: 'copy', code: 'SALE20' },
  },
  {
    id: 3,
    bgColor: 'pz-bg-gradient-to-r pz-from-purple-500 pz-to-pink-500',
    titleKey: 'slide3Title',
    subtitleKey: 'slide3Subtitle',
    ctaKey: 'slide3Cta',
    action: { type: 'link', href: '/register' },
  },
  {
    id: 4,
    bgColor: 'pz-bg-gradient-to-r pz-from-blue-500 pz-to-indigo-500',
    titleKey: 'slide4Title',
    subtitleKey: 'slide4Subtitle',
    ctaKey: 'slide4Cta',
    action: { type: 'scroll', target: 'footer' },
  },
  {
    id: 5,
    bgColor: 'pz-bg-gradient-to-r pz-from-slate-700 pz-to-slate-900',
    titleKey: 'slide5Title',
    subtitleKey: 'slide5Subtitle',
    ctaKey: 'slide5Cta',
    action: { type: 'modal', modal: 'about' },
  },
  {
    id: 6,
    bgColor: 'pz-bg-gradient-to-r pz-from-amber-500 pz-to-orange-600',
    titleKey: 'slide6Title',
    subtitleKey: 'slide6Subtitle',
    ctaKey: 'slide6Cta',
    action: { type: 'info' },
  },
  {
    id: 7,
    bgColor: 'pz-bg-gradient-to-r pz-from-cyan-500 pz-to-blue-600',
    titleKey: 'slide7Title',
    subtitleKey: 'slide7Subtitle',
    ctaKey: 'slide7Cta',
    action: { type: 'scroll', target: 'products' },
  },
  {
    id: 8,
    bgColor: 'pz-bg-gradient-to-r pz-from-indigo-500 pz-to-purple-600',
    titleKey: 'slide8Title',
    subtitleKey: 'slide8Subtitle',
    ctaKey: 'slide8Cta',
    action: { type: 'info' },
  },
  {
    id: 9,
    bgColor: 'pz-bg-gradient-to-br pz-from-gray-900 pz-to-gray-700',
    titleKey: 'slide9Title',
    subtitleKey: 'slide9Subtitle',
    ctaKey: 'slide9Cta',
    action: { type: 'external', href: 'https://github.com/VladWriiya' },
  },
  {
    id: 10,
    bgColor: 'pz-bg-gradient-to-r pz-from-emerald-500 pz-to-teal-600',
    titleKey: 'slide10Title',
    subtitleKey: 'slide10Subtitle',
    ctaKey: 'slide10Cta',
    action: { type: 'external', href: 'https://nextjs.org' },
  },
];

export function HeroCarousel() {
  const t = useTranslations('HeroCarousel');
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [aboutOpen, setAboutOpen] = React.useState(false);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  const handleAction = (action: SlideAction) => {
    switch (action.type) {
      case 'scroll':
        const element = document.getElementById(action.target);
        element?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'copy':
        navigator.clipboard.writeText(action.code);
        toast.success(t('codeCopied', { code: action.code }));
        break;
      case 'modal':
        if (action.modal === 'about') {
          setAboutOpen(true);
        }
        break;
      case 'info':
        // Info slides don't have an action, just display info
        break;
    }
  };

  const renderButton = (slide: Slide) => {
    const buttonClass = "pz-bg-white pz-text-gray-900 hover:pz-bg-gray-100";

    if (slide.action.type === 'link') {
      return (
        <Link href={slide.action.href}>
          <Button size="lg" className={buttonClass}>
            {t(slide.ctaKey)}
          </Button>
        </Link>
      );
    }

    if (slide.action.type === 'external') {
      return (
        <a href={slide.action.href} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className={buttonClass}>
            {t(slide.ctaKey)}
          </Button>
        </a>
      );
    }

    if (slide.action.type === 'info') {
      return null;
    }

    return (
      <Button
        size="lg"
        className={buttonClass}
        onClick={() => handleAction(slide.action)}
      >
        {t(slide.ctaKey)}
      </Button>
    );
  };

  return (
    <>
      <div className="pz-relative pz-w-full">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{
            loop: true,
            align: 'start',
          }}
          className="pz-w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="pz-ml-0">
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="pz-pl-0">
                <div
                  className={cn(
                    'pz-flex pz-h-[200px] pz-w-full pz-flex-col pz-items-center pz-justify-center pz-rounded-xl pz-px-4 pz-text-center pz-text-white md:pz-h-[400px] md:pz-px-8',
                    slide.bgColor
                  )}
                >
                  <h2 className="pz-mb-2 pz-text-2xl pz-font-bold md:pz-mb-4 md:pz-text-5xl">
                    {t(slide.titleKey)}
                  </h2>
                  <p className="pz-mb-4 pz-text-sm pz-opacity-90 md:pz-mb-6 md:pz-text-xl">
                    {t(slide.subtitleKey)}
                  </p>
                  {renderButton(slide)}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots navigation */}
        <div className="pz-absolute pz-bottom-4 pz-left-1/2 pz-flex pz--translate-x-1/2 pz-gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => scrollTo(index)}
              className={cn(
                'pz-h-2 pz-w-2 pz-rounded-full pz-transition-all md:pz-h-3 md:pz-w-3',
                current === index
                  ? 'pz-w-6 pz-bg-white md:pz-w-8'
                  : 'pz-bg-white/50 hover:pz-bg-white/75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <AboutModal open={aboutOpen} onOpenChange={setAboutOpen} />
    </>
  );
}
