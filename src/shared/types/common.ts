/** Visual phase of the site */
export type Phase = 'bait' | 'switching' | 'revealed';

/** Plausible Analytics global function (injected by script.tagged-events.js) */
declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: {
        props?: Record<string, string | number | boolean>;
        interactive?: boolean;
      },
    ) => void;
  }
}
