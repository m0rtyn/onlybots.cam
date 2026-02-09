import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type Phase = 'bait' | 'switching' | 'revealed';

interface TheSwitchProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'onlybots-switched';

const REVEALED_COUNTER_TEXT = '1,247 reported cases of coercion this year';
const REVEALED_TYPING_TEXT =
  'In 2024, Human Rights Watch documented sexual assault of webcam models on camera by studio managers.';
const REVEALED_TITLE = 'onlybots.cam — The Real Cost';
const ARIA_ANNOUNCEMENT =
  'Content has changed. This site reveals the human cost of the webcam industry.';

/**
 * Instantly applies the fully-revealed visual state — used for returning
 * visitors or when the user prefers reduced motion.
 */
function applyRevealedState(): void {
  const body = document.body;

  // Body visual treatment
  body.style.filter = 'saturate(0) brightness(0.8)';
  body.classList.remove('bait-state');
  body.classList.add('reveal-state', 'static-noise', 'font-mono');

  // Flip all cards
  document.querySelectorAll<HTMLElement>('.card-flip').forEach((card) => {
    card.classList.add('flipped');
  });

  // Reveal sections
  document.querySelectorAll<HTMLElement>('.reveal-section').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  // Header
  const header = document.querySelector<HTMLElement>('.platform-header');
  if (header) {
    header.style.opacity = '0.5';
  }

  // Document title
  document.title = REVEALED_TITLE;

  // Online counter text swap
  const counter = document.querySelector<HTMLElement>('.online-counter');
  if (counter) {
    counter.textContent = REVEALED_COUNTER_TEXT;
  }

  // Typing dots text swap
  const typingDots = document.querySelector<HTMLElement>('.typing-dots');
  if (typingDots?.parentElement) {
    typingDots.parentElement.innerHTML = REVEALED_TYPING_TEXT;
  }

  // Three.js digital cage — managed by DigitalCage's own MutationObserver
  // (no direct DOM manipulation to avoid hydration mismatch)
}

export default function TheSwitch({ children }: TheSwitchProps) {
  const [phase, setPhase] = useState<Phase>('bait');
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [announced, setAnnounced] = useState(false);

  // ---------------------------------------------------------------
  // The core switch animation — GSAP timeline
  // ---------------------------------------------------------------
  const triggerSwitch = useCallback(() => {
    // Guard: only trigger once
    if (phase !== 'bait') return;
    setPhase('switching');

    // Reduced-motion shortcut
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      applyRevealedState();
      setPhase('revealed');
      setAnnounced(true);
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        /* quota / private browsing */
      }
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('revealed');
        setAnnounced(true);
      },
    });

    timelineRef.current = tl;

    const cards = gsap.utils.toArray<HTMLElement>('.card-flip');

    // T+0ms — Flash overlay
    if (flashRef.current) {
      tl.to(
        flashRef.current,
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

    // T+100ms — Color drain
    tl.to(
      document.body,
      {
        filter: 'saturate(0) brightness(0.8)',
        duration: 0.8,
        ease: 'power2.inOut',
      },
      0.1,
    );

    // T+200ms — Glitch jitter on cards
    if (cards.length > 0) {
      tl.to(
        cards,
        {
          x: () => gsap.utils.random(-3, 3),
          duration: 0.05,
          repeat: 5,
          yoyo: true,
          ease: 'none',
          onComplete() {
            gsap.set(cards, { x: 0 });
          },
        },
        0.2,
      );
    }

    // T+400ms — Notification morph (online counter)
    tl.add(() => {
      const counter = document.querySelector<HTMLElement>('.online-counter');
      if (counter) {
        counter.textContent = REVEALED_COUNTER_TEXT;
      }
    }, 0.4);

    // T+500ms — Card flip (staggered)
    if (cards.length > 0) {
      tl.add(() => {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('flipped');
          }, i * 100);
        });
      }, 0.5);
    }

    // T+500ms — Static noise on body
    tl.add(() => {
      document.body.classList.add('static-noise');
    }, 0.5);

    // T+800ms — Typing bubble text swap
    tl.add(() => {
      const typingDots = document.querySelector<HTMLElement>('.typing-dots');
      if (typingDots?.parentElement) {
        typingDots.parentElement.innerHTML = REVEALED_TYPING_TEXT;
      }
    }, 0.8);

    // T+1000ms — Font shift
    tl.add(() => {
      document.body.classList.add('font-mono');
    }, 1.0);

    // T+1200ms — Header drain
    const header = document.querySelector<HTMLElement>('.platform-header');
    if (header) {
      tl.to(
        header,
        {
          opacity: 0.5,
          duration: 0.4,
          ease: 'power2.out',
        },
        1.2,
      );

      // Drain neon-pink elements inside the header to gray
      const pinkEls = header.querySelectorAll<HTMLElement>(
        '.text-neon-pink, .neon-glow-text, .bg-neon-pink',
      );
      if (pinkEls.length > 0) {
        tl.to(
          Array.from(pinkEls),
          {
            color: '#666',
            textShadow: 'none',
            duration: 0.4,
            ease: 'power2.out',
          },
          1.2,
        );
      }
    }

    // T+1500ms — Body class swap
    tl.add(() => {
      document.body.classList.remove('bait-state');
      document.body.classList.add('reveal-state');
    }, 1.5);

    // T+1800ms — Reveal sections stagger
    const revealSections =
      gsap.utils.toArray<HTMLElement>('.reveal-section');
    if (revealSections.length > 0) {
      tl.fromTo(
        revealSections,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
        },
        1.8,
      );
    }

    // T+2000ms — Update document title
    tl.add(() => {
      document.title = REVEALED_TITLE;
    }, 2.0);

    // T+2200ms — Persist in sessionStorage
    tl.add(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        /* quota / private browsing */
      }
    }, 2.2);

    // T+2500ms — Three.js cage visibility is managed by
    // DigitalCage's own MutationObserver watching for body.reveal-state
  }, [phase]);

  // ---------------------------------------------------------------
  // Mount: check session, attach event listeners
  // ---------------------------------------------------------------
  useEffect(() => {
    // Returning visitor → skip straight to revealed
    let alreadySwitched = false;
    try {
      alreadySwitched = sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      /* private browsing */
    }

    if (alreadySwitched) {
      applyRevealedState();
      setPhase('revealed');
      setAnnounced(true);
      return;
    }

    // Event delegation handler
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isTrigger =
        target.closest('.subscribe-btn') !== null ||
        target.closest('.load-more-btn') !== null ||
        target.closest('[data-trigger-switch]') !== null;

      if (isTrigger) {
        e.preventDefault();
        triggerSwitch();
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      // Kill any running timeline on unmount
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [triggerSwitch]);

  // ---------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------
  return (
    <div data-switch-phase={phase}>
      {children}

      {/* Flash overlay */}
      <div
        ref={flashRef}
        className="fixed inset-0 bg-white z-50 opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Accessibility announcement */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announced ? ARIA_ANNOUNCEMENT : ''}
      </div>
    </div>
  );
}
