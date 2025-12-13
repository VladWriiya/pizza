'use client';

import { useAccessibilityStore } from '@/store/accessibility.store';
import { useEffect, useState } from 'react';

export const AccessibilityProvider = () => {
  const {
    fontSize,
    lineHeight,
    letterSpacing,
    theme,
    highlightLinks,
    highlightFocus,
    pauseAnimations,
    hideImages,
    readingGuide,
    cursorSize,
  } = useAccessibilityStore();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Font size
    root.style.fontSize = `${fontSize}%`;

    // Line height
    body.style.lineHeight = lineHeight === 100 ? '' : `${lineHeight * 1.5 / 100}`;

    // Letter spacing
    body.style.letterSpacing = letterSpacing === 0 ? '' : `${letterSpacing}px`;

    // Theme
    root.setAttribute('data-theme', theme);

    // Highlight links
    root.classList.toggle('a11y-highlight-links', highlightLinks);

    // Highlight focus
    root.classList.toggle('a11y-highlight-focus', highlightFocus);

    // Pause animations
    root.classList.toggle('a11y-pause-animations', pauseAnimations);

    // Hide images
    root.classList.toggle('a11y-hide-images', hideImages);

    // Cursor size
    root.classList.remove('a11y-cursor-large-white', 'a11y-cursor-large-black');
    if (cursorSize !== 'default') {
      root.classList.add(`a11y-cursor-${cursorSize}`);
    }

    return () => {
      body.style.lineHeight = '';
      body.style.letterSpacing = '';
    };
  }, [
    fontSize,
    lineHeight,
    letterSpacing,
    theme,
    highlightLinks,
    highlightFocus,
    pauseAnimations,
    hideImages,
    cursorSize,
  ]);

  // Reading guide follows mouse
  useEffect(() => {
    if (!readingGuide) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingGuide]);

  return (
    <>
      {readingGuide && (
        <div
          className="pz-fixed pz-inset-x-0 pz-h-10 pz-pointer-events-none pz-z-[9999] pz-border-y-2 pz-border-primary pz-bg-primary/10"
          style={{ top: mousePos.y - 20 }}
          aria-hidden="true"
        />
      )}
    </>
  );
};
