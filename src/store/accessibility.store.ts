'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'default' | 'high-contrast-dark' | 'high-contrast-light' | 'monochrome' | 'low-saturation';
export type CursorSize = 'default' | 'large-white' | 'large-black';

export interface AccessibilityState {
  // Visual
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  theme: Theme;

  // Navigation
  highlightLinks: boolean;
  highlightFocus: boolean;

  // Content
  pauseAnimations: boolean;
  hideImages: boolean;
  readingGuide: boolean;

  // Cursor
  cursorSize: CursorSize;

  // Actions
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setLetterSpacing: (spacing: number) => void;
  setTheme: (theme: Theme) => void;
  setHighlightLinks: (value: boolean) => void;
  setHighlightFocus: (value: boolean) => void;
  setPauseAnimations: (value: boolean) => void;
  setHideImages: (value: boolean) => void;
  setReadingGuide: (value: boolean) => void;
  setCursorSize: (size: CursorSize) => void;
  reset: () => void;
}

const initialState = {
  fontSize: 100,
  lineHeight: 100,
  letterSpacing: 0,
  theme: 'default' as Theme,
  highlightLinks: false,
  highlightFocus: false,
  pauseAnimations: false,
  hideImages: false,
  readingGuide: false,
  cursorSize: 'default' as CursorSize,
};

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...initialState,
      setFontSize: (fontSize) => set({ fontSize }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      setLetterSpacing: (letterSpacing) => set({ letterSpacing }),
      setTheme: (theme) => set({ theme }),
      setHighlightLinks: (highlightLinks) => set({ highlightLinks }),
      setHighlightFocus: (highlightFocus) => set({ highlightFocus }),
      setPauseAnimations: (pauseAnimations) => set({ pauseAnimations }),
      setHideImages: (hideImages) => set({ hideImages }),
      setReadingGuide: (readingGuide) => set({ readingGuide }),
      setCursorSize: (cursorSize) => set({ cursorSize }),
      reset: () => set(initialState),
    }),
    {
      name: 'accessibility-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
