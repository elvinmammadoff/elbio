/**
 * ELBIO Magic Cursor
 *
 * API:
 *   data-cursor="link"       → ring expands, no label
 *   data-cursor="View Demo"  → ring expands, label inside
 *   (no attribute)           → default small dot
 */

const LERP_DURATION = 0.4;

export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (typeof gsap === 'undefined') return;

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

  function applyCursor(target) {
    const raw  = target.getAttribute('data-cursor');
    const mode = raw ? raw.trim().toLowerCase() : '';

    wrap.classList.remove('is-active', 'has-label');

    if (mode && mode !== 'link') {
      ball.innerHTML = raw;
      wrap.classList.add('is-active', 'has-label');
    } else {
      ball.innerHTML = '';
      wrap.classList.add('is-active');
    }
  }

  function resetCursor() {
    ball.innerHTML = '';
    wrap.classList.remove('is-active', 'has-label');
  }

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

  document.addEventListener('mousedown', () => {
    gsap.to(ball, { scale: 0.7, duration: 0.18, ease: 'power2.out' });
  });
  document.addEventListener('mouseup', () => {
    gsap.to(ball, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });

  document.documentElement.classList.add('custom-cursor-active');
}
