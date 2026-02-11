import { gsap } from '@/shared/lib/gsap';
import {
  REVEALED_COUNTER_TEXT,
  REVEALED_TITLE,
  STORAGE_KEY,
} from '@/shared/config/constants';
import { getCachedElements } from './dom-cache';

export interface SwitchAnimationOptions {
  flashEl: HTMLElement | null;
  onComplete: () => void;
}

/**
 * Build and return the full GSAP switch timeline.
 *
 * Every animation step from the original TheSwitch.triggerSwitch callback
 * is preserved here in chronological order.
 */
export function createSwitchTimeline(
  options: SwitchAnimationOptions,
): gsap.core.Timeline {
  const tl = gsap.timeline({ onComplete: options.onComplete });

  // Performance: Cache all DOM elements once
  const elements = getCachedElements();
  const {
    body,
    cards,
    landingGrid,
    mainWrapper,
    header,
    counter,
    revealSections,
  } = elements;

  // Performance: Add will-change hints before animation
  body.style.willChange = 'filter';
  if (landingGrid) landingGrid.style.willChange = 'opacity, transform, filter';
  if (header) header.style.willChange = 'opacity';
  cards.forEach((card) => (card.style.willChange = 'transform'));
  revealSections.forEach((el) => (el.style.willChange = 'opacity, transform'));

  // T+0ms — Flash overlay
  if (options.flashEl) {
    tl.to(
      options.flashEl,
      {
        keyframes: [
          { opacity: 0.8, duration: 0.15 },
          { opacity: 0, duration: 0.15 },
        ],
        ease: 'power2.inOut',
      },
      0,
    );
  }

  // T+50ms — Color drain (faster)
  tl.to(
    body,
    {
      filter: 'saturate(0) brightness(0.8)',
      duration: 0.4,
      ease: 'power2.inOut',
    },
    0.05,
  );

  // T+100ms — Glitch jitter on cards (faster)
  if (cards.length > 0) {
    tl.to(
      cards,
      {
        x: () => gsap.utils.random(-3, 3),
        duration: 0.03,
        repeat: 3,
        yoyo: true,
        ease: 'none',
        onComplete() {
          gsap.set(cards, { x: 0 });
        },
      },
      0.1,
    );
  }

  // T+150ms — Notification morph (online counter)
  tl.add(() => {
    if (counter) {
      counter.textContent = REVEALED_COUNTER_TEXT;
    }
  }, 0.15);

  // T+200ms — Card flip (staggered, faster)
  if (cards.length > 0) {
    tl.add(() => {
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.add('flipped');
        }, i * 50);
      });
    }, 0.2);
  }

  // T+250ms — Static noise on body
  tl.add(() => {
    body.classList.add('static-noise');
  }, 0.25);

  // T+400ms — Header drain (faster)
  if (header) {
    tl.to(
      header,
      {
        opacity: 0.5,
        duration: 0.3,
        ease: 'power2.out',
      },
      0.4,
    );

    // Drain neon-pink elements inside the header to blood red
    const pinkEls = header.querySelectorAll<HTMLElement>(
      '.text-neon-pink, .neon-glow-text, .bg-neon-pink',
    );
    if (pinkEls.length > 0) {
      tl.to(
        Array.from(pinkEls),
        {
          color: '#cc0000',
          textShadow: '0 0 10px rgba(204,0,0,0.6)',
          duration: 0.3,
          ease: 'power2.out',
        },
        0.4,
      );
    }
  }

  // T+500ms — Body class swap and show reveal sections
  tl.add(() => {
    body.classList.remove('bait-state');
    body.classList.add('reveal-state');
    // Make reveal sections visible in DOM before animating them
    revealSections.forEach((el) => (el.style.display = 'block'));
  }, 0.5);

  // T+550ms — Fade out the entire LandingGrid section
  if (landingGrid) {
    tl.to(
      landingGrid,
      {
        opacity: 0,
        y: -50,
        scale: 0.95,
        filter: 'blur(8px)',
        duration: 0.8,
        ease: 'power2.inOut',
      },
      0.55,
    );
  }

  // T+600ms — Reveal sections stagger (faster)
  if (revealSections.length > 0) {
    tl.fromTo(
      revealSections,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
      },
      0.6,
    );
  }

  // T+700ms — Update document title
  tl.add(() => {
    document.title = REVEALED_TITLE;
  }, 0.7);

  // T+800ms — Persist in sessionStorage
  tl.add(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* quota / private browsing */
    }
  }, 0.8);

  // T+900ms — Collapse bait content wrapper
  tl.add(() => {
    if (mainWrapper) {
      mainWrapper.style.minHeight = '0';
      mainWrapper.style.overflow = 'hidden';
      gsap.to(mainWrapper, {
        height: 0,
        padding: 0,
        margin: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          if (mainWrapper) mainWrapper.style.display = 'none';
        },
      });
    }
  }, 0.9);

  // T+1000ms — Restore color on body: the 'color returns as horror' moment
  // Desaturation was for the dramatic drain; now lift it so reveal reds show
  tl.to(
    body,
    {
      filter: 'brightness(0.95)',
      duration: 0.8,
      ease: 'power2.out',
    },
    1.0,
  );

  // T+2000ms — Clean up will-change properties for performance
  tl.add(() => {
    requestAnimationFrame(() => {
      body.style.willChange = 'auto';
      if (landingGrid) landingGrid.style.willChange = 'auto';
      if (header) header.style.willChange = 'auto';
      cards.forEach((card) => (card.style.willChange = 'auto'));
      revealSections.forEach((el) => (el.style.willChange = 'auto'));
    });
  }, 2.0);

  return tl;
}
