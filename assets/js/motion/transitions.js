/**
 * ELBIO Page Transitions (M-03)
 *
 * Full-page overlay wipe on internal navigation.
 * Overlay: scaleX 0→1 (Expo.easeInOut, 0.7s) on exit,
 *           scaleX 1→0 (Expo.easeInOut, 0.7s) on enter.
 *
 * Intercepts clicks on a[href$=".html"] and same-origin links that
 * don't open in a new tab.
 *
 * Hero entrance (hero.js) is on a 1.3s delay — the overlay takes
 * 0.7s to complete, giving 0.6s of overlap for a natural reveal.
 *
 * The overlay DOM element is created by this module if not present.
 * team-frontend may pre-place it in HTML:
 *   <div id="page-transition-overlay" aria-hidden="true"></div>
 */

let isTransitioning = false;

/**
 * Create or retrieve the overlay element.
 */
function getOverlay() {
  let overlay = document.getElementById('page-transition-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
  }
  return overlay;
}

/**
 * Animate the overlay wipe in, then navigate to `url`.
 */
function transitionOut(url) {
  if (isTransitioning) return;
  isTransitioning = true;

  const overlay = getOverlay();

  // Ensure overlay is at scaleX: 0 before animating
  gsap.set(overlay, { scaleX: 0, transformOrigin: 'center left', display: 'block' });

  gsap.to(overlay, {
    scaleX: 1,
    duration: 0.7,
    ease: 'expo.inOut',
    onComplete: () => {
      window.location.href = url;
    },
  });
}

/**
 * Animate the overlay wipe out on new page load.
 * Called from initTransitions() on DOMContentLoaded.
 */
function transitionIn() {
  const overlay = getOverlay();

  // Check if overlay is visible (came from a transition)
  const currentScaleX = gsap.getProperty(overlay, 'scaleX');
  const style = window.getComputedStyle(overlay);
  const isVisible = style.display !== 'none' && parseFloat(style.opacity || 1) > 0;

  if (!isVisible) {
    // No incoming transition — make sure overlay is hidden
    gsap.set(overlay, { scaleX: 0, display: 'none' });
    return;
  }

  gsap.set(overlay, { scaleX: 1, transformOrigin: 'center right', display: 'block' });
  gsap.to(overlay, {
    scaleX: 0,
    duration: 0.7,
    ease: 'expo.inOut',
    delay: 0.1,
    onComplete: () => {
      gsap.set(overlay, { display: 'none' });
      isTransitioning = false;
    },
  });
}

/**
 * Determine if an anchor should trigger a page transition.
 * Skip: same-page anchors, external links, target="_blank", download attrs,
 *       hash-only, javascript: protocol, mailto:, tel:.
 */
function shouldTransition(anchor) {
  if (!anchor) return false;
  if (anchor.target === '_blank') return false;
  if (anchor.hasAttribute('download')) return false;
  if (anchor.getAttribute('data-no-transition') !== null) return false;

  const href = anchor.getAttribute('href');
  if (!href) return false;
  if (href.startsWith('#')) return false;
  if (href.startsWith('javascript:')) return false;
  if (href.startsWith('mailto:')) return false;
  if (href.startsWith('tel:')) return false;

  // External links
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
  } catch (_) {
    return false;
  }

  return true;
}

export function initTransitions() {
  if (typeof gsap === 'undefined') return;

  // Animate overlay out when this page loads
  transitionIn();

  // Intercept all internal navigation clicks
  document.addEventListener('click', (e) => {
    // Walk up the DOM to find the anchor
    let anchor = e.target.closest('a');
    if (!anchor) return;
    if (!shouldTransition(anchor)) return;

    e.preventDefault();
    const href = anchor.getAttribute('href');
    transitionOut(href);
  });

  // Handle browser back/forward — no transition, just ensure overlay hidden
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      const overlay = getOverlay();
      gsap.set(overlay, { scaleX: 0, display: 'none' });
      isTransitioning = false;
    }
  });
}
