/**
 * ELBIO Magic Cursor — Jesper-parity rebuild
 *
 * DOM (matches Jesper's "tt-magic-cursor"):
 *   <div id="magic-cursor"><div id="ball"></div></div>
 *
 * API — single attribute, value becomes the inner label:
 *   data-cursor="View Demo"   → ring expands, "View Demo" rendered inside
 *   data-cursor="View<br>Demo" → HTML allowed, two-line label
 *   data-cursor="link"        → ring expands, no label
 *   data-cursor=""            → ring expands, no label
 *   (no attribute)            → default small ring
 *
 * Visibility on any background: ring uses mix-blend-mode: difference.
 * Disabled on touch (pointer: coarse) and reduced motion (CSS).
 */

const LERP_DURATION = 0.4;   // GSAP quickTo duration — slight lag for feel
const MORPH_DURATION = 0.4;  // Size/state morph
const Z_INDEX = 99999;

export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (typeof gsap === 'undefined') return;

  // Build DOM if not present
  let wrap = document.getElementById('magic-cursor');
  let ball = document.getElementById('ball');

  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'magic-cursor';
    wrap.setAttribute('aria-hidden', 'true');
    document.body.appendChild(wrap);
  }
  if (!ball) {
    ball = document.createElement('div');
    ball.id = 'ball';
    wrap.appendChild(ball);
  }

  // GSAP quickTo for buttery position updates
  const setX = gsap.quickTo(wrap, 'x', { duration: LERP_DURATION, ease: 'power3' });
  const setY = gsap.quickTo(wrap, 'y', { duration: LERP_DURATION, ease: 'power3' });

  let visible = false;

  document.addEventListener('mousemove', (e) => {
    setX(e.clientX);
    setY(e.clientY);
    if (!visible) {
      gsap.to(wrap, { autoAlpha: 1, duration: 0.3 });
      visible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    gsap.to(wrap, { autoAlpha: 0, duration: 0.3 });
    visible = false;
  });

  document.addEventListener('mouseenter', () => {
    if (!visible) {
      gsap.to(wrap, { autoAlpha: 1, duration: 0.3 });
      visible = true;
    }
  });

  // State machine — read data-cursor value, render as label, expand ring
  function applyCursor(target) {
    const raw = target.getAttribute('data-cursor');
    const hasLabel = raw && raw.trim() !== '' && raw.trim().toLowerCase() !== 'link';

    if (hasLabel) {
      ball.innerHTML = raw;
      wrap.classList.add('is-active', 'has-label');
    } else {
      ball.innerHTML = '';
      wrap.classList.add('is-active');
      wrap.classList.remove('has-label');
    }
  }

  function resetCursor() {
    ball.innerHTML = '';
    wrap.classList.remove('is-active', 'has-label');
  }

  // Event delegation — works with dynamically injected DOM (project loader, etc.)
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest && e.target.closest('[data-cursor]');
    if (!target) return;
    applyCursor(target);
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest && e.target.closest('[data-cursor]');
    if (!target) return;
    const next = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-cursor]');
    if (!next) resetCursor();
  });

  // Click feedback — quick scale dip + elastic settle
  document.addEventListener('mousedown', () => {
    gsap.to(ball, { scale: 0.7, duration: 0.18, ease: 'power2.out' });
  });
  document.addEventListener('mouseup', () => {
    gsap.to(ball, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });

  // Hide system cursor
  document.documentElement.classList.add('custom-cursor-active');
}
