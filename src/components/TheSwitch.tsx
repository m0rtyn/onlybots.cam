import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

// Performance: Cache DOM selectors to avoid repeated queries
interface CachedElements {
  body: HTMLElement;
  cards: HTMLElement[];
  landingGrid: HTMLElement | null;
  mainWrapper: HTMLElement | null;
  header: HTMLElement | null;
  counter: HTMLElement | null;
  typingDots: HTMLElement | null;
  revealSections: HTMLElement[];
  scrollHint: HTMLElement | null;
}

function getCachedElements(): CachedElements {
  return {
    body: document.body,
    cards: Array.from(document.querySelectorAll<HTMLElement>('.card-flip')),
    landingGrid: document.querySelector<HTMLElement>('.landing-grid'),
    mainWrapper: document.querySelector<HTMLElement>('.bait-content'),
    header: document.querySelector<HTMLElement>('.platform-header'),
    counter: document.querySelector<HTMLElement>('.online-counter'),
    typingDots: document.querySelector<HTMLElement>('.typing-dots'),
    revealSections: Array.from(document.querySelectorAll<HTMLElement>('.reveal-section')),
    scrollHint: document.querySelector<HTMLElement>('.scroll-hint')
  };
}

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
  // Performance: Cache all elements once
  const elements = getCachedElements();
  const { body, cards, landingGrid, mainWrapper, header, counter, typingDots, revealSections, scrollHint } = elements;

  // Performance: Add will-change hints for GPU acceleration
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
      setTimeout(() => card.style.willChange = 'auto', 600);
    });

    // Hide landing grid for instant reveal
    if (landingGrid) {
      landingGrid.style.willChange = 'opacity, transform, filter';
      landingGrid.style.opacity = '0';
      landingGrid.style.transform = 'translateY(-50px) scale(0.95)';
      landingGrid.style.filter = 'blur(8px)';
      setTimeout(() => landingGrid.style.willChange = 'auto', 800);
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
      setTimeout(() => el.style.willChange = 'auto', 400);
    });

    // Show scroll hint instantly for returning visitors
    if (scrollHint) {
      scrollHint.style.opacity = '1';
      scrollHint.style.transform = 'translateY(0)';
    }

    // Header
    if (header) {
      header.style.willChange = 'opacity';
      header.style.opacity = '0.5';
      setTimeout(() => header.style.willChange = 'auto', 300);
    }

    // Document title
    document.title = REVEALED_TITLE;

    // Online counter text swap
    if (counter) {
      counter.textContent = REVEALED_COUNTER_TEXT;
    }

    // Typing dots text swap
    if (typingDots?.parentElement) {
      typingDots.parentElement.innerHTML = REVEALED_TYPING_TEXT;
    }
    
    // Clean up body will-change
    setTimeout(() => body.style.willChange = 'auto', 800);
  });

  // Scroll to first reveal section for returning visitors
  setTimeout(() => {
    const firstReveal = document.querySelector<HTMLElement>('.reveal-section');
    if (firstReveal) {
      firstReveal.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, 50);

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

    // Performance: Cache all DOM elements once
    const elements = getCachedElements();
    const { body, cards, landingGrid, mainWrapper, header, counter, typingDots, revealSections, scrollHint } = elements;
    
    // Performance: Add will-change hints before animation
    body.style.willChange = 'filter';
    if (landingGrid) landingGrid.style.willChange = 'opacity, transform, filter';
    if (header) header.style.willChange = 'opacity';
    cards.forEach(card => card.style.willChange = 'transform');
    revealSections.forEach(el => el.style.willChange = 'opacity, transform');

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

    // T+300ms — Typing bubble text swap
    tl.add(() => {
      if (typingDots?.parentElement) {
        typingDots.parentElement.innerHTML = REVEALED_TYPING_TEXT;
      }
    }, 0.3);

    // T+350ms — Font shift
    tl.add(() => {
      body.classList.add('font-mono');
    }, 0.35);

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
      revealSections.forEach(el => el.style.display = 'block');
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

    // T+1200ms — Show scroll hint
    tl.add(() => {
      if (scrollHint) {
        gsap.to(scrollHint, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
        const hideScrollHint = () => {
          gsap.to(scrollHint, {
            opacity: 0,
            y: 16,
            duration: 0.3,
            ease: 'power2.in',
          });
        };
        setTimeout(hideScrollHint, 4000);
        window.addEventListener('scroll', hideScrollHint, { once: true, passive: true });
      }
    }, 1.2);

    // T+1300ms — Auto scroll to first reveal section
    tl.add(() => {
      const firstRevealSection = revealSections[0];
      if (firstRevealSection) {
        gsap.to(window, {
          scrollTo: {
            y: firstRevealSection,
            offsetY: 40,
          },
          duration: 1.2,
          ease: 'power3.inOut',
        });
      }
    }, 1.3);

    // T+2000ms — Clean up will-change properties for performance
    tl.add(() => {
      requestAnimationFrame(() => {
        body.style.willChange = 'auto';
        if (landingGrid) landingGrid.style.willChange = 'auto';
        if (header) header.style.willChange = 'auto';
        cards.forEach(card => card.style.willChange = 'auto');
        revealSections.forEach(el => el.style.willChange = 'auto');
      });
    }, 2.0);

    // T+2500ms — Three.js cage visibility is managed by
    // DigitalCage's own MutationObserver watching for body.reveal-state
  }, [phase]);

  // ---------------------------------------------------------------
  // Mount: check session, attach event listeners
  // ---------------------------------------------------------------
  useEffect(() => {
    // Debug mode: ignore sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const isDebugMode = urlParams.get('debug') === '1';
    
    // Returning visitor → skip straight to revealed (unless debug mode)
    let alreadySwitched = false;
    if (!isDebugMode) {
      try {
        alreadySwitched = sessionStorage.getItem(STORAGE_KEY) === 'true';
      } catch {
        /* private browsing */
      }
    }

    if (alreadySwitched) {
      applyRevealedState();
      setPhase('revealed');
      setAnnounced(true);
      return;
    }

    // Event delegation handler - optimized to avoid closure deps and reduce delay
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isTrigger =
        target.closest('.subscribe-btn') !== null ||
        target.closest('.load-more-btn') !== null ||
        target.closest('[data-trigger-switch]') !== null;

      if (isTrigger && phase === 'bait') {
        e.preventDefault();
        e.stopPropagation();
        triggerSwitch();
      }
    };

    // Apply pointer cursor to all interactive elements immediately
    const applyPointerStyles = () => {
      document.querySelectorAll('.subscribe-btn, .load-more-btn, [data-trigger-switch]').forEach(el => {
        (el as HTMLElement).style.cursor = 'pointer';
      });
    };

    applyPointerStyles();
    // Re-apply after any DOM changes
    const observer = new MutationObserver(applyPointerStyles);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      observer.disconnect();
      // Kill any running timeline on unmount
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [triggerSwitch, phase]);

  // ---------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------
  return (
    <div data-switch-phase={phase}>
      {children}

      {/* Flash overlay */}
      <div
        ref={flashRef}
        className="fixed inset-0 bg-white z-40 opacity-0 pointer-events-none"
        style={{ pointerEvents: 'none' }}
        aria-hidden="true"
      />

      {/* Scroll hint - appears after switch
      <div
        className="scroll-hint fixed bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 translate-y-4 z-30 pointer-events-none"
        style={{ transform: 'translate(-50%, 16px)' }}
        aria-hidden="true"
      >
        <div className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 text-center">
          <div className="text-gray-300 text-sm mb-2 font-mono">
            Scroll down to learn more
          </div>
          <div className="animate-bounce">
            <svg
              className="w-5 h-5 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div> */}

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
