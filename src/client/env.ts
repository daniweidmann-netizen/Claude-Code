/** Display and accessibility settings read once at start-up. */
const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');

/** Device pixels per CSS pixel used for rendering, capped to keep fill-rate reasonable on phones. */
export const DPR = typeof window !== 'undefined' ? Math.min(Math.max(window.devicePixelRatio || 1, 1), 2) : 1;

/**
 * Reduced motion: follows the system setting (prefers-reduced-motion) and can
 * be forced with ?motion=reduced or ?motion=full. Movement, bouncing and
 * zooming are replaced by short fades; outcomes and their order are unchanged.
 */
export const REDUCED_MOTION = params.get('motion') === 'reduced'
  || (params.get('motion') !== 'full' && typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

declare const __DEV_TOOLS__: boolean | undefined;
/**
 * True in the demo build. A production build (TLS_PRODUCTION=1) sets it to false, which removes
 * every developer and presentation tool: fixed seeds, start balance, test speed, demonstration,
 * presentation mode and the test hook. None of these tools changes the game's mathematics.
 */
export const DEV_TOOLS: boolean = typeof __DEV_TOOLS__ === 'undefined' ? true : __DEV_TOOLS__;
