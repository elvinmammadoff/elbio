/**
 * ELBIO Scroll Effects (M-05, M-07, M-08)
 *
 * Implements:
 *   M-05: 3D tilt on [data-motion="tilt"] cards
 *   M-07: Pin-stack scroll for [data-motion="pin-stack"] containers
 *   M-08: Marquee ticker for [data-motion="marquee"] rows
 *   Parallax: scroll-linked y translation for [data-motion="parallax"] (non-hero)
 *   Magnetic buttons: [data-motion="magnetic"] CTAs
 *
 * All guards: if element doesn't exist, skip silently.
 * Responsive: 3D tilt disabled below 768px, parallax range halved on tablet.
 */

export function initScroll(lenis) {
  if (typeof gsap === 'undefined') return;

  const mm = gsap.matchMedia();

  // ----------------------------------------------------------------
  // Desktop (1280px+) — full effects
  // ----------------------------------------------------------------
  mm.add('(min-width: 1280px)', () => {
    initTilt(1.0);
    initPinStack();
    initMarquee();
    initParallax(1.0);
    initZoomParallax(1.0);
    initMagnetic(1.0);
  });

  // ----------------------------------------------------------------
  // Tablet (768–1279px) — reduced parallax, half-intensity tilt
  // ----------------------------------------------------------------
  mm.add('(min-width: 768px) and (max-width: 1279px)', () => {
    initTilt(0.5);
    initPinStack();
    initMarquee();
    initParallax(0.5);
    initZoomParallax(0.6);
    initMagnetic(0.6);
  });

  // ----------------------------------------------------------------
  // Mobile (<768px) — marquee + gentle zoom parallax only
  // ----------------------------------------------------------------
  mm.add('(max-width: 767px)', () => {
    initMarquee();
    initZoomParallax(0.45);
  });
}

// ----------------------------------------------------------------
// M-05: 3D Tilt on [data-motion="tilt"]
// ----------------------------------------------------------------
function initTilt(intensityMultiplier) {
  document.querySelectorAll('[data-motion="tilt"]').forEach((card) => {
    const MAX_TILT = 10 * intensityMultiplier; // degrees

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;

      // Normalised delta: -0.5 to +0.5
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      gsap.to(card, {
        rotationX: -dy * MAX_TILT,
        rotationY:  dx * MAX_TILT,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power1.out',
        overwrite: 'auto',
      });

      // Counter-translate inner content for depth layering
      const inner = card.querySelector('.card-inner, .project-card__inner, .tilt-inner');
      if (inner) {
        gsap.to(inner, {
          z: 30,
          duration: 0.4,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });

      const inner = card.querySelector('.card-inner, .project-card__inner, .tilt-inner');
      if (inner) {
        gsap.to(inner, {
          z: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
        });
      }
    });
  });
}

// ----------------------------------------------------------------
// M-07: Pin-stack cards on [data-motion="pin-stack"]
//
// Expected HTML structure:
//   <section data-motion="pin-stack">
//     <div class="stack-card" data-motion="pin-card">...</div>
//     <div class="stack-card" data-motion="pin-card">...</div>
//     ...
//   </section>
//
// Each card pins while in view. Previous cards scale to 0.78.
// Card image counter-scales to 1.15 to maintain visual fill.
// ----------------------------------------------------------------
function initPinStack() {
  if (typeof ScrollTrigger === 'undefined') return;

  const containers = document.querySelectorAll('[data-motion="pin-stack"]');

  containers.forEach((container) => {
    const cards = Array.from(container.querySelectorAll('[data-motion="pin-card"]'));
    if (cards.length < 2) return;

    cards.forEach((card, i) => {
      // Each card gets its own ScrollTrigger pin
      ScrollTrigger.create({
        trigger: card,
        start: 'top 15%',
        end: 'bottom 15%',
        pin: true,
        pinSpacing: false,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Scale down all previous cards proportionally
          const progress = self.progress;
          cards.slice(0, i).forEach((prevCard, j) => {
            const depthFactor = (i - j) * 0.022; // incremental shrink
            const targetScale = Math.max(0.78, 1 - depthFactor - progress * 0.05);
            gsap.set(prevCard, { scale: targetScale });

            // Counter-scale image inside card to maintain fill
            const img = prevCard.querySelector('img, .card-image, .project-card__image');
            if (img) {
              gsap.set(img, { scale: 1 / targetScale * 1.05 });
            }
          });
        },
      });
    });
  });
}

// ----------------------------------------------------------------
// M-08: Marquee ticker on [data-motion="marquee"]
//
// Expected HTML structure:
//   <div data-motion="marquee" data-motion-speed="80">
//     <div class="marquee-track">
//       <div class="marquee-group"><!-- items --></div>
//       <div class="marquee-group" aria-hidden="true"><!-- duplicate --></div>
//     </div>
//   </div>
// ----------------------------------------------------------------
function initMarquee() {
  document.querySelectorAll('[data-motion="marquee"]').forEach((wrapper) => {
    const track = wrapper.querySelector('.marquee-track');
    const group = wrapper.querySelector('.marquee-group');
    if (!track || !group) return;

    // Ensure we have a duplicate group for seamless loop
    let duplicate = track.querySelector('.marquee-group[aria-hidden="true"]');
    if (!duplicate) {
      duplicate = group.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      track.appendChild(duplicate);
    }

    const speed = parseFloat(wrapper.dataset.motionSpeed || 80); // px/s
    const groupWidth = group.getBoundingClientRect().width;
    if (groupWidth === 0) return;

    const dur = groupWidth / speed;

    const tween = gsap.to(track, {
      x: -groupWidth,
      duration: dur,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % groupWidth),
      },
    });

    // Hover: decelerate
    wrapper.addEventListener('mouseenter', () => {
      gsap.to(tween, { timeScale: 0.25, duration: 0.4, ease: 'power2.out' });
    });
    wrapper.addEventListener('mouseleave', () => {
      gsap.to(tween, { timeScale: 1.0, duration: 0.4, ease: 'power2.out' });
    });
  });
}

// ----------------------------------------------------------------
// Parallax for non-hero [data-motion="parallax"] elements
// (Hero parallax is handled in hero.js)
// ----------------------------------------------------------------
function initParallax(rangeMultiplier) {
  if (typeof ScrollTrigger === 'undefined') return;

  const heroSection = document.querySelector('[data-hero]') || document.querySelector('.hero');

  document.querySelectorAll('[data-motion="parallax"]').forEach((el) => {
    // Skip hero-owned parallax elements
    if (heroSection && heroSection.contains(el)) return;

    const speed = parseFloat(el.dataset.motionSpeed || 0.3);
    const yRange = speed * 30 * rangeMultiplier;

    gsap.to(el, {
      yPercent: yRange,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

// ----------------------------------------------------------------
// Zoom parallax for [data-motion="zoom-parallax"] images
//
// mix_design / Azurio-style effect: the image is held at a constant
// zoom (so it overfills its frame) and pans vertically as the frame
// scrolls through the viewport. Scrubbed and Lenis-synced via the
// GSAP ticker + ScrollTrigger. The image MUST sit inside an
// overflow:hidden frame (mark it with [data-zoom-frame]) so the
// over-scaled image is cropped cleanly.
//
// Optional per-element overrides:
//   data-motion-zoom="1.25"  — constant scale (default 1.2)
//   data-motion-pan="14"     — vertical travel in % (default 12)
// ----------------------------------------------------------------
function initZoomParallax(rangeMultiplier) {
  if (typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('[data-motion="zoom-parallax"]').forEach((el) => {
    // Image both grows (zoom) and pans vertically as the frame transits
    // the viewport. Scrubbed → naturally reverses with scroll direction.
    const zStart = parseFloat(el.dataset.motionZoom || 1.2);   // scale at entry
    const zEnd = parseFloat(el.dataset.motionZoomEnd || 1.32); // scale at exit
    const pan = parseFloat(el.dataset.motionPan || 9) * rangeMultiplier;

    gsap.fromTo(
      el,
      { yPercent: -pan, scale: zStart, transformOrigin: 'center center' },
      {
        yPercent: pan,
        scale: zEnd,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: el.closest('[data-zoom-frame]') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
  });
}

// ----------------------------------------------------------------
// Magnetic buttons on [data-motion="magnetic"]
// ----------------------------------------------------------------
function initMagnetic(intensityMultiplier) {
  document.querySelectorAll('[data-motion="magnetic"]').forEach((btn) => {
    const STRENGTH = 0.35 * intensityMultiplier;
    const RADIUS   = 80; // px — activation radius

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        gsap.to(btn, {
          x: dx * STRENGTH,
          y: dy * STRENGTH,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    });
  });
}
