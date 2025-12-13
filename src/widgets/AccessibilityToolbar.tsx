'use client';

import { useAccessibilityStore, type Theme, type CursorSize } from '@/store/accessibility.store';
import { Button } from '@/shared/ui/button';
import {
  Accessibility,
  X,
  RotateCcw,
  Type,
  AlignJustify,
  Space,
  Sun,
  Moon,
  Contrast,
  Palette,
  Link2,
  Focus,
  PauseCircle,
  ImageOff,
  GalleryHorizontalEnd,
  MousePointer2,
  Plus,
  Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  icon: React.ReactNode;
}

const SliderControl = ({ label, value, min, max, step, unit, onChange, icon }: SliderControlProps) => (
  <div className="pz-space-y-2">
    <div className="pz-flex pz-items-center pz-justify-between">
      <div className="pz-flex pz-items-center pz-gap-2">
        {icon}
        <span className="pz-text-sm pz-font-medium">{label}</span>
      </div>
      <span className="pz-text-sm pz-font-bold pz-min-w-[50px] pz-text-end">{value}{unit}</span>
    </div>
    <div className="pz-flex pz-items-center pz-gap-2">
      <Button
        size="icon"
        variant="outline"
        className="pz-h-8 pz-w-8"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
      >
        <Minus size={14} />
      </Button>
      <div className="pz-flex-1 pz-h-2 pz-bg-secondary pz-rounded-full pz-relative">
        <div
          className="pz-absolute pz-inset-y-0 pz-start-0 pz-bg-primary pz-rounded-full pz-transition-all"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
      </div>
      <Button
        size="icon"
        variant="outline"
        className="pz-h-8 pz-w-8"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
      >
        <Plus size={14} />
      </Button>
    </div>
  </div>
);

interface ToggleButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const ToggleButton = ({ label, active, onClick, icon }: ToggleButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      'pz-flex pz-flex-col pz-items-center pz-gap-1 pz-p-3 pz-rounded-lg pz-border pz-transition-all',
      active
        ? 'pz-bg-primary pz-text-primary-foreground pz-border-primary'
        : 'pz-bg-card pz-border-border hover:pz-border-primary/50'
    )}
  >
    {icon}
    <span className="pz-text-xs pz-font-medium pz-text-center pz-leading-tight">{label}</span>
  </button>
);

export const AccessibilityToolbar = () => {
  const t = useTranslations('AccessibilityToolbar');
  const [isOpen, setIsOpen] = useState(false);

  const {
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    letterSpacing,
    setLetterSpacing,
    theme,
    setTheme,
    highlightLinks,
    setHighlightLinks,
    highlightFocus,
    setHighlightFocus,
    pauseAnimations,
    setPauseAnimations,
    hideImages,
    setHideImages,
    readingGuide,
    setReadingGuide,
    cursorSize,
    setCursorSize,
    reset,
  } = useAccessibilityStore();

  const themes: { name: Theme; label: string; icon: React.ReactNode }[] = [
    { name: 'default', label: t('themes.default'), icon: <Contrast size={18} /> },
    { name: 'high-contrast-light', label: t('themes.highContrastLight'), icon: <Sun size={18} /> },
    { name: 'high-contrast-dark', label: t('themes.highContrastDark'), icon: <Moon size={18} /> },
    { name: 'monochrome', label: t('themes.monochrome'), icon: <Palette size={18} /> },
    { name: 'low-saturation', label: t('themes.lowSaturation'), icon: <Palette size={18} className="pz-opacity-50" /> },
  ];

  const cursors: { name: CursorSize; label: string }[] = [
    { name: 'default', label: t('cursors.default') },
    { name: 'large-white', label: t('cursors.largeWhite') },
    { name: 'large-black', label: t('cursors.largeBlack') },
  ];

  return (
    <div className="pz-fixed pz-bottom-4 pz-start-4 pz-z-50">
      {/* Panel */}
      {isOpen && (
        <div className="pz-bg-card pz-border pz-rounded-xl pz-shadow-2xl pz-mb-3 pz-w-[320px] pz-max-h-[80vh] pz-overflow-hidden pz-flex pz-flex-col">
          {/* Header */}
          <div className="pz-flex pz-items-center pz-justify-between pz-p-4 pz-border-b pz-bg-primary pz-text-primary-foreground">
            <div className="pz-flex pz-items-center pz-gap-2">
              <Accessibility size={20} />
              <span className="pz-font-bold">{t('title')}</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="pz-h-8 pz-w-8 pz-text-primary-foreground hover:pz-bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>

          {/* Content */}
          <div className="pz-overflow-y-auto pz-flex-1 pz-p-4 pz-space-y-6 scrollbar">
            {/* Text Adjustments */}
            <section>
              <h3 className="pz-text-sm pz-font-bold pz-mb-3 pz-text-muted-foreground pz-uppercase">
                {t('sections.textAdjustments')}
              </h3>
              <div className="pz-space-y-4">
                <SliderControl
                  label={t('fontSize')}
                  value={fontSize}
                  min={75}
                  max={150}
                  step={5}
                  unit="%"
                  onChange={setFontSize}
                  icon={<Type size={16} />}
                />
                <SliderControl
                  label={t('lineHeight')}
                  value={lineHeight}
                  min={100}
                  max={200}
                  step={10}
                  unit="%"
                  onChange={setLineHeight}
                  icon={<AlignJustify size={16} />}
                />
                <SliderControl
                  label={t('letterSpacing')}
                  value={letterSpacing}
                  min={0}
                  max={5}
                  step={1}
                  unit="px"
                  onChange={setLetterSpacing}
                  icon={<Space size={16} />}
                />
              </div>
            </section>

            {/* Color & Contrast */}
            <section>
              <h3 className="pz-text-sm pz-font-bold pz-mb-3 pz-text-muted-foreground pz-uppercase">
                {t('sections.colorContrast')}
              </h3>
              <div className="pz-grid pz-grid-cols-3 pz-gap-2">
                {themes.map((t) => (
                  <ToggleButton
                    key={t.name}
                    label={t.label}
                    active={theme === t.name}
                    onClick={() => setTheme(t.name)}
                    icon={t.icon}
                  />
                ))}
              </div>
            </section>

            {/* Navigation & Focus */}
            <section>
              <h3 className="pz-text-sm pz-font-bold pz-mb-3 pz-text-muted-foreground pz-uppercase">
                {t('sections.navigation')}
              </h3>
              <div className="pz-grid pz-grid-cols-2 pz-gap-2">
                <ToggleButton
                  label={t('highlightLinks')}
                  active={highlightLinks}
                  onClick={() => setHighlightLinks(!highlightLinks)}
                  icon={<Link2 size={18} />}
                />
                <ToggleButton
                  label={t('highlightFocus')}
                  active={highlightFocus}
                  onClick={() => setHighlightFocus(!highlightFocus)}
                  icon={<Focus size={18} />}
                />
              </div>
            </section>

            {/* Content Adjustments */}
            <section>
              <h3 className="pz-text-sm pz-font-bold pz-mb-3 pz-text-muted-foreground pz-uppercase">
                {t('sections.content')}
              </h3>
              <div className="pz-grid pz-grid-cols-3 pz-gap-2">
                <ToggleButton
                  label={t('pauseAnimations')}
                  active={pauseAnimations}
                  onClick={() => setPauseAnimations(!pauseAnimations)}
                  icon={<PauseCircle size={18} />}
                />
                <ToggleButton
                  label={t('hideImages')}
                  active={hideImages}
                  onClick={() => setHideImages(!hideImages)}
                  icon={<ImageOff size={18} />}
                />
                <ToggleButton
                  label={t('readingGuide')}
                  active={readingGuide}
                  onClick={() => setReadingGuide(!readingGuide)}
                  icon={<GalleryHorizontalEnd size={18} />}
                />
              </div>
            </section>

            {/* Cursor */}
            <section>
              <h3 className="pz-text-sm pz-font-bold pz-mb-3 pz-text-muted-foreground pz-uppercase">
                {t('sections.cursor')}
              </h3>
              <div className="pz-grid pz-grid-cols-3 pz-gap-2">
                {cursors.map((c) => (
                  <ToggleButton
                    key={c.name}
                    label={c.label}
                    active={cursorSize === c.name}
                    onClick={() => setCursorSize(c.name)}
                    icon={<MousePointer2 size={18} />}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="pz-p-4 pz-border-t">
            <Button
              variant="outline"
              className="pz-w-full"
              onClick={reset}
            >
              <RotateCcw size={16} className="pz-me-2" />
              {t('reset')}
            </Button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="pz-w-14 pz-h-14 pz-rounded-full pz-shadow-lg"
        aria-label={t('title')}
        aria-expanded={isOpen}
      >
        <Accessibility size={28} />
      </Button>
    </div>
  );
};
