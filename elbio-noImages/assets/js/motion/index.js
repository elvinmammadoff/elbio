/**
 * ELBIO Motion System — Public Entry Point
 * Imported by main.js as: import { initMotion } from './motion/index.js'
 *
 * Required CDN scripts (must appear in HTML <head> BEFORE this module):
 *
 *   <!-- Lenis smooth scroll -->
 *   <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
 *   <!-- GSAP core -->
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
 *   <!-- GSAP ScrollTrigger plugin -->
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
 *   <!-- This module -->
 *   <script type="module" src="assets/js/motion/index.js"></script>
 *
 * NOTE: SplitText is GSAP Club-only. This system uses a manual word/line
 * splitter — zero external dependencies beyond GSAP core + ScrollTrigger + Lenis.
 */

import { initCursor }      from './cursor.js?v=2';
import { initHero }        from './hero.js?v=2';
import { initReveals }     from './reveals.js?v=2';
import { initScroll }      from './scroll.js?v=2';
import { initTransitions } from './transitions.js?v=2';

let lenis = null;

/**
 * Bootstrap Lenis and wire it to the GSAP ticker.
 * Desktop-only: on touch devices, Lenis is skipped.
 */
function initLenis() {
  // Bail on touch devices — Lenis can feel wrong on mobile
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return null;

  if (typeof Lenis === 'undefined') {
    console.warn('[ELBIO Motion] Lenis not found on window. Ensure CDN script is loaded before this module.');
    return null;
  }

  lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 2.0,
    infinite: false,
  });

  // Wire Lenis to GSAP ticker so ScrollTrigger stays in sync
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Keep ScrollTrigger positions synced on each Lenis scroll event
  lenis.on('scroll', ScrollTrigger.update);

  return lenis;
}

/**
 * Primary init. Called once from main.js after DOMContentLoaded.
 * Subsystems are initialised in dependency order:
 *   1. Lenis + ScrollTrigger (scroll infrastructure)
 *   2. Cursor (needs DOM ready)
 *   3. Reveals (needs ScrollTrigger registered)
 *   4. Hero (needs Lenis + ScrollTrigger, runs own DOMContentLoaded guard)
 *   5. Scroll effects (pin-stack, marquee, tilt — needs Lenis)
 *   6. Transitions (intercepts nav clicks — can run any time after DOM)
 */
export function initMotion() {
  if (typeof gsap === 'undefined') {
    console.warn('[ELBIO Motion] GSAP not found. Ensure CDN scripts are loaded.');
    return;
  }

  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    applyFinalStates();
    return;
  }

  const lenisInstance = initLenis();

  // Pass lenis to subsystems that need it
  initCursor();
  initReveals();
  initHero();
  initScroll(lenisInstance);
  initTransitions();
}

/**
 * If prefers-reduced-motion is set, skip all animations and apply
 * final (visible) states immediately so content is accessible.
 */
function applyFinalStates() {
  // Make all would-be animated elements immediately visible
  const selectors = [
    '[data-motion]',
    '.word',
    '.split-line',
    '.word-wrap',
  ];
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.style.transform = 'none';
      el.style.clipPath = 'none';
    });
  });
}

// Auto-init when the module is loaded and DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMotion);
} else {
  initMotion();
}
