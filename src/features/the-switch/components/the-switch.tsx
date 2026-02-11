import { useSwitchPhase } from '../hooks/use-switch-phase';
import type { TheSwitchProps } from '../types';
import { ARIA_ANNOUNCEMENT } from '@/shared/config/constants';

export default function TheSwitch({ children }: TheSwitchProps) {
  const { phase, announced, flashRef } = useSwitchPhase();

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
