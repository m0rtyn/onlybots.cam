import { useState, useEffect, useRef, useCallback } from 'react';
import type { Phase } from '../types';
import { STORAGE_KEY } from '@/shared/config/constants';
import { useReducedMotion } from '@/shared/hooks/use-reduced-motion';
import { applyRevealedState } from '../lib/apply-revealed';
import { createSwitchTimeline } from '../lib/switch-animation';

export interface UseSwitchPhaseReturn {
  phase: Phase;
  announced: boolean;
  flashRef: React.RefObject<HTMLDivElement | null>;
  triggerSwitch: () => void;
}

export function useSwitchPhase(): UseSwitchPhaseReturn {
  const [phase, setPhase] = useState<Phase>('bait');
  const phaseRef = useRef<Phase>('bait');
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [announced, setAnnounced] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(prefersReducedMotion);
  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  // Keep ref in sync so event handlers always read the latest phase
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // -------------------------------------------------------------------
  // The core switch animation — delegates to createSwitchTimeline
  // -------------------------------------------------------------------
  const triggerSwitch = useCallback(() => {
    // Guard: only trigger once — read from ref, not stale closure
    if (phaseRef.current !== 'bait') return;
    setPhase('switching');
    phaseRef.current = 'switching';

    // Reduced-motion shortcut
    if (reducedMotionRef.current) {
      applyRevealedState();
      phaseRef.current = 'revealed';
      setPhase('revealed');
      setAnnounced(true);
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        /* quota / private browsing */
      }
      return;
    }

    const tl = createSwitchTimeline({
      flashEl: flashRef.current,
      onComplete: () => {
        phaseRef.current = 'revealed';
        setPhase('revealed');
        setAnnounced(true);
      },
    });

    timelineRef.current = tl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------
  // Mount: check session, attach event listeners, handle debug mode
  // -------------------------------------------------------------------
  useEffect(() => {
    // Debug mode: ignore sessionStorage and clear it so page resets to bait
    const urlParams = new URLSearchParams(window.location.search);
    const isDebugMode = urlParams.get('debug') === '1';

    if (isDebugMode) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* private browsing */
      }
      // Reset DOM to bait state in case it was previously revealed
      const body = document.body;
      body.classList.remove('reveal-state', 'static-noise', 'font-mono');
      body.classList.add('bait-state');
      body.style.filter = '';

      // Reset bait content visibility
      const mainWrapper =
        document.querySelector<HTMLElement>('.bait-content');
      if (mainWrapper) {
        mainWrapper.style.display = '';
        mainWrapper.style.minHeight = '';
        mainWrapper.style.overflow = '';
        mainWrapper.style.height = '';
        mainWrapper.style.padding = '';
        mainWrapper.style.margin = '';
      }

      // Reset landing grid
      const landingGrid =
        document.querySelector<HTMLElement>('.landing-grid');
      if (landingGrid) {
        landingGrid.style.opacity = '';
        landingGrid.style.transform = '';
        landingGrid.style.filter = '';
      }

      // Reset header
      const header =
        document.querySelector<HTMLElement>('.platform-header');
      if (header) {
        header.style.opacity = '';
      }

      // Unflip cards
      document
        .querySelectorAll<HTMLElement>('.card-flip')
        .forEach((card) => {
          card.classList.remove('flipped');
        });

      // Hide reveal sections
      document
        .querySelectorAll<HTMLElement>('.reveal-section')
        .forEach((el) => {
          el.style.display = '';
          el.style.opacity = '0';
          el.style.transform = '';
        });

      // Reset document title
      document.title = 'onlybots.cam — Coming Soon';
    }

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

    // Event delegation handler — reads phaseRef (always current, no stale closure)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isTrigger =
        target.closest('.subscribe-btn') !== null ||
        target.closest('.load-more-btn') !== null ||
        target.closest('[data-trigger-switch]') !== null;

      if (isTrigger && phaseRef.current === 'bait') {
        e.preventDefault();
        e.stopPropagation();
        triggerSwitch();
      }
    };

    // Keyboard handler — Enter or Space on trigger elements
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isTrigger =
        target.closest('.subscribe-btn') !== null ||
        target.closest('.load-more-btn') !== null ||
        target.closest('[data-trigger-switch]') !== null;

      if (isTrigger && phaseRef.current === 'bait') {
        e.preventDefault();
        e.stopPropagation();
        triggerSwitch();
      }
    };

    // Apply pointer cursor to all interactive elements immediately
    const applyPointerStyles = () => {
      document
        .querySelectorAll(
          '.subscribe-btn, .load-more-btn, [data-trigger-switch]',
        )
        .forEach((el) => {
          (el as HTMLElement).style.cursor = 'pointer';
        });
    };

    applyPointerStyles();
    // Re-apply after any DOM changes
    const observer = new MutationObserver(applyPointerStyles);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeydown, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeydown, true);
      observer.disconnect();
      // Kill any running timeline on unmount
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
    // Register once on mount — handlers read phaseRef (always current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { phase, announced, flashRef, triggerSwitch };
}
