import type { Phase } from '@/shared/types/common';

export type { Phase };

/** DOM elements cached for animation performance */
export interface CachedElements {
  body: HTMLElement;
  cards: HTMLElement[];
  landingGrid: HTMLElement | null;
  mainWrapper: HTMLElement | null;
  header: HTMLElement | null;
  counter: HTMLElement | null;
  typingDots: HTMLElement | null;
  revealSections: HTMLElement[];
}

export interface TheSwitchProps {
  children: React.ReactNode;
}
