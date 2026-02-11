import {
  REVEALED_COUNTER_TEXT,
  REVEALED_TYPING_TEXT,
  REVEALED_TITLE,
} from '@/shared/config/constants';
import { getCachedElements } from './dom-cache';

/**
 * Instantly applies the fully-revealed visual state — used for returning
 * visitors or when the user prefers reduced motion.
 */
export function applyRevealedState(): void {
  const elements = getCachedElements();
  const {
    body,
    cards,
    landingGrid,
    mainWrapper,
    header,
    counter,
    typingDots,
    revealSections,
  } = elements;

  body.style.willChange = 'filter';

  // Batch DOM updates to minimize reflows
  requestAnimationFrame(() => {
    // Body visual treatment — no saturate(0) since bait is hidden;
    // reveal content needs its scary colors
    body.style.filter = 'brightness(0.95)';
    body.classList.remove('bait-state');
    body.classList.add('reveal-state', 'static-noise', 'font-mono');

    // Flip all cards with GPU hints
    cards.forEach((card) => {
      card.style.willChange = 'transform';
      card.classList.add('flipped');
      // Clean up will-change after animation
      setTimeout(() => (card.style.willChange = 'auto'), 600);
    });

    // Hide landing grid for instant reveal
    if (landingGrid) {
      landingGrid.style.willChange = 'opacity, transform, filter';
      landingGrid.style.opacity = '0';
      landingGrid.style.transform = 'translateY(-50px) scale(0.95)';
      landingGrid.style.filter = 'blur(8px)';
      setTimeout(() => (landingGrid.style.willChange = 'auto'), 800);
    }

    // Collapse bait content wrapper so reveal sections move up
    if (mainWrapper) {
      mainWrapper.style.display = 'none';
    }

    // Reveal sections - make visible and animate in
    revealSections.forEach((el) => {
      el.style.display = 'block'; // Make visible first
      el.style.willChange = 'opacity, transform';
      el.style.opacity = '1';
      el.style.transform = 'none';
      setTimeout(() => (el.style.willChange = 'auto'), 400);
    });

    // Header
    if (header) {
      header.style.willChange = 'opacity';
      header.style.opacity = '0.5';
      setTimeout(() => (header.style.willChange = 'auto'), 300);
    }

    // Document title + URL hash
    document.title = REVEALED_TITLE;
    history.replaceState(null, '', '#the-truth');

    // Favicon swap to blood-red variant
    const faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (faviconLink) faviconLink.href = '/favicon-revealed.svg';

    // Online counter text swap
    if (counter) {
      counter.textContent = REVEALED_COUNTER_TEXT;
    }

    // Typing dots text swap
    if (typingDots?.parentElement) {
      typingDots.parentElement.innerHTML = REVEALED_TYPING_TEXT;
    }

    // Clean up body will-change
    setTimeout(() => (body.style.willChange = 'auto'), 800);
  });

  // Scroll to first reveal section for returning visitors
  setTimeout(() => {
    const firstReveal = document.querySelector<HTMLElement>('.reveal-section');
    if (firstReveal) {
      firstReveal.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, 50);
}
