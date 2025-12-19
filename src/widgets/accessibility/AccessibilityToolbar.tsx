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
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SliderControl, ToggleButton } from './AccessibilityControls';

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
                {themes.map((themeItem) => (
                  <ToggleButton
                    key={themeItem.name}
                    label={themeItem.label}
                    active={theme === themeItem.name}
                    onClick={() => setTheme(themeItem.name)}
                    icon={themeItem.icon}
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
