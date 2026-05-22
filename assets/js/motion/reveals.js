/**
 * ELBIO Scroll Reveals (M-04, M-09)
 *
 * Handles all scroll-triggered reveal animations via GSAP ScrollTrigger.
 * Elements are activated by data-motion attributes:
 *
 *   data-motion="reveal"          → single element y + autoAlpha
 *   data-motion="reveal-stagger"  → children stagger (data-motion-stagger overrides default)
 *   data-motion="reveal-clip"     → clip-path inset wipe
 *   data-motion="line-reveal"     → paragraph rotationX reveal (non-hero)
 *   data-motion="word-mask"       → word-mask on non-hero headings (scroll-triggered)
 *   data-motion="scramble"        → text scramble on mouseenter
 *   data-motion="counter"         → animated number counter
 *   data-motion="parallax"        → handled in scroll.js for non-hero elements
 *
 * All guards: if element doesn't exist, skip silently.
 * Mobile guards: reduced distances at (max-width: 767px).
 */

// ----------------------------------------------------------------
// Utility: manual word-wrap splitter
// Wraps each whitespace-delimited word in:
//   <span class="word-wrap"><span class="word">word</span></span>
// The outer span has overflow:hidden (set via CSS).
// Returns an array of the inner .word spans.
// ----------------------------------------------------------------
export function wrapWords(el) {
  if (!el || el.dataset.wordWrapped) return [];

  const rawHTML = el.innerHTML;

  // Walk text nodes only, preserve child elements (em, strong, etc.)
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim()) return;
      const wrapped = text.replace(/(\S+)/g, (word) =>
        `<span class="word-wrap"><span class="word">${word}</span></span>`
      );
      const frag = document.createRange().createContextualFragment(wrapped);
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      Array.from(node.childNodes).forEach(processNode);
    }
  }

  // Clone to avoid mutating during iteration
  Array.from(el.childNodes).forEach(processNode);

  el.dataset.wordWrapped = 'true';
  return Array.from(el.querySelectorAll('.word'));
}

// ----------------------------------------------------------------
// Utility: split element into per-line spans for rotationX reveals
// Returns array of .split-line-inner elements
// ----------------------------------------------------------------
function wrapLines(el) {
  if (!el || el.dataset.lineWrapped) {
    return Array.from(el ? el.querySelectorAll('.split-line-inner') : []);
  }

  // Tokenise words with measuring spans
  const text = el.textContent.trim();
  if (!text) return [];

  const words = text.split(/\s+/);
  el.innerHTML = words
    .map((w) => `<span class="measure-word" style="display:inline;">${w} </span>`)
    .join('');

  const wordEls = Array.from(el.querySelectorAll('.measure-word'));

  // Group into lines by vertical rect position
  const lines = [];
  let currentLine = [];
  let lastTop = null;

  wordEls.forEach((w) => {
    const top = Math.round(w.getBoundingClientRect().top);
    if (lastTop === null) lastTop = top;
    if (Math.abs(top - lastTop) > 4) {
      if (currentLine.length) lines.push(currentLine.map((n) => n.textContent).join(''));
      currentLine = [];
      lastTop = top;
    }
    currentLine.push(w);
  });
  if (currentLine.length) lines.push(currentLine.map((n) => n.textContent).join(''));

  el.innerHTML = lines
    .map(
      (lineText) =>
        `<span class="split-line"><span class="split-line-inner">${lineText.trim()}</span></span>`
    )
    .join('');

  el.dataset.lineWrapped = 'true';
  return Array.from(el.querySelectorAll('.split-line-inner'));
}

// ----------------------------------------------------------------
// Text scramble (M-09)
// ----------------------------------------------------------------
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function scrambleText(el) {
  const original = el.textContent;
  const length = original.length;
  let frame = 0;
  const maxFrames = 8;
  const resolveStagger = 40; // ms per char
  const interval = 30;       // ms per frame

  function tick() {
    let output = '';
    for (let i = 0; i < length; i++) {
      const resolveAt = Math.floor(i * (resolveStagger / interval));
      if (original[i] === ' ') {
        output += ' ';
      } else if (frame >= resolveAt + maxFrames) {
        output += original[i];
      } else if (frame >= resolveAt) {
        output += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      } else {
        output += original[i];
      }
    }
    el.textContent = output;
    frame++;
    if (frame < maxFrames + Math.ceil(length * (resolveStagger / interval))) {
      setTimeout(tick, interval);
    } else {
      el.textContent = original;
    }
  }

  tick();
}

// ----------------------------------------------------------------
// Counter animation (M-04 counter)
// ----------------------------------------------------------------
function animateCounter(el) {
  const raw = el.textContent.replace(/[^0-9.]/g, '');
  const target = parseFloat(raw);
  if (isNaN(target)) return;

  const prefix = el.textContent.replace(raw, '').split(raw)[0] || '';
  const suffix = el.textContent.replace(raw, '').split(raw)[1] || '';

  gsap.fromTo(
    { value: 0 },
    { value: target },
    {
      duration: 2.0,
      ease: 'power2.out',
      onUpdate: function () {
        const current = Math.round(this.targets()[0].value);
        el.textContent = `${prefix}${current}${suffix}`;
      },
    }
  );
}

// ----------------------------------------------------------------
// Main reveals init
// ----------------------------------------------------------------
export function initReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const mm = gsap.matchMedia();

  // ----------------------------------------------------------------
  // Desktop + tablet reveals (768px+)
  // ----------------------------------------------------------------
  mm.add('(min-width: 768px)', () => {
    initRevealSingle(40);
    initRevealStagger(40);
    initRevealClip();
    initLineReveals();
    initWordMaskScroll();
    initScramble();
    initCounters();
  });

  // ----------------------------------------------------------------
  // Mobile reveals — reduced y distance
  // ----------------------------------------------------------------
  mm.add('(max-width: 767px)', () => {
    initRevealSingle(20);
    initRevealStagger(20);
    initRevealClip();
    initLineReveals();
    initWordMaskScroll();
    initScramble();
    initCounters();
  });
}

// ----------------------------------------------------------------
// data-motion="reveal" — single element
// ----------------------------------------------------------------
function initRevealSingle(yDist) {
  document.querySelectorAll('[data-motion="reveal"]').forEach((el) => {
    const delay = parseFloat(el.dataset.motionDelay || 0);

    gsap.fromTo(
      el,
      { y: yDist, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.out',
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

// ----------------------------------------------------------------
// data-motion="reveal-stagger" — children stagger
// ----------------------------------------------------------------
function initRevealStagger(yDist) {
  document.querySelectorAll('[data-motion="reveal-stagger"]').forEach((parent) => {
    const stagger = parseFloat(parent.dataset.motionStagger || 0.12);
    const children = Array.from(parent.children);
    if (!children.length) return;

    gsap.fromTo(
      children,
      { y: yDist, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger,
        scrollTrigger: {
          trigger: parent,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

// ----------------------------------------------------------------
// data-motion="reveal-clip" — clip-path inset wipe
// ----------------------------------------------------------------
function initRevealClip() {
  document.querySelectorAll('[data-motion="reveal-clip"]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

// ----------------------------------------------------------------
// data-motion="line-reveal" — paragraph rotationX (non-hero)
// ----------------------------------------------------------------
function initLineReveals() {
  // Skip hero line-reveal elements — those are handled by hero.js
  const heroSection = document.querySelector('[data-hero]') || document.querySelector('.hero');

  document.querySelectorAll('[data-motion="line-reveal"]').forEach((el) => {
    // Skip if inside hero (hero.js owns those)
    if (heroSection && heroSection.contains(el)) return;

    const lineInners = wrapLines(el);
    if (!lineInners.length) return;

    gsap.fromTo(
      lineInners,
      { rotationX: -80, transformOrigin: 'top center -50px', autoAlpha: 0 },
      {
        rotationX: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

// ----------------------------------------------------------------
// data-motion="word-mask" — non-hero headings (scroll-triggered)
// ----------------------------------------------------------------
function initWordMaskScroll() {
  const heroSection = document.querySelector('[data-hero]') || document.querySelector('.hero');

  document.querySelectorAll('[data-motion="word-mask"]').forEach((el) => {
    // Skip hero heading — hero.js owns those
    if (heroSection && heroSection.contains(el)) return;

    const words = wrapWords(el);
    if (!words.length) return;

    gsap.fromTo(
      words,
      { yPercent: 102 },
      {
        yPercent: 0,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });
}

// ----------------------------------------------------------------
// data-motion="scramble" — hover text scramble
// ----------------------------------------------------------------
function initScramble() {
  document.querySelectorAll('[data-motion="scramble"]').forEach((el) => {
    el.addEventListener('mouseenter', () => scrambleText(el));
  });
}

// ----------------------------------------------------------------
// data-motion="counter" — animated number on scroll
// ----------------------------------------------------------------
function initCounters() {
  document.querySelectorAll('[data-motion="counter"]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => animateCounter(el),
    });
  });
}
