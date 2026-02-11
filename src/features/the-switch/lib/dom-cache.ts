import type { CachedElements } from '../types';

/**
 * Query and cache all DOM elements needed by the switch animation.
 * Call once per animation cycle — avoids repeated querySelector calls.
 */
export function getCachedElements(): CachedElements {
  return {
    body: document.body,
    cards: Array.from(document.querySelectorAll<HTMLElement>('.card-flip')),
    landingGrid: document.querySelector<HTMLElement>('.landing-grid'),
    mainWrapper: document.querySelector<HTMLElement>('.bait-content'),
    header: document.querySelector<HTMLElement>('.platform-header'),
    counter: document.querySelector<HTMLElement>('.online-counter'),
    typingDots: document.querySelector<HTMLElement>('.typing-dots'),
    revealSections: Array.from(
      document.querySelectorAll<HTMLElement>('.reveal-section'),
    ),
  };
}
