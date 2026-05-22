/**
 * ELBIO Hero Entrance Animations
 *
 * Implements M-02 (word-mask reveal), M-10 (grain texture),
 * M-11 (hero image parallax), and clip-path portrait reveal.
 *
 * Required HTML structure (team-frontend applies data-motion attributes):
 *
 *   <h1 data-motion="word-mask">
 *     <span class="word-wrap"><span class="word">Name</span></span>
 *     ...
 *   </h1>
 *   <div data-motion="clip-circle">  <!-- hero portrait wrapper -->
 *     <img src="portrait.jpg" alt="..." />
 *   </div>
 *   <p data-motion="line-reveal">Description paragraph</p>
 *   <div class="hero-rules">          <!-- optional hr wipes -->
 *     <span data-motion="rule-wipe"></span>
 *   </div>
 *   <div class="hero-stats" data-motion="reveal-stagger">
 *     <div class="stat-item">...</div>
 *   </div>
 *   <div class="hero-social" data-motion="social-stagger">
 *     <a href="#" data-cursor="link">...</a>
 *   </div>
 *
 * All timings are absolute from page-ready (post-transition overlay exit).
 * If the page arrives fresh (no transition), the delays still provide a
 * natural progressive entrance.
 */

/**
 * Split a text element's contents into per-line spans for rotationX reveal.
 * Returns an array of the created `.split-line` elements.
 * This is a layout-based splitter: reads computed line positions after render.
 */
function splitIntoLines(el) {
  const text = el.textContent.trim();
  if (!text) return [];

  // Tokenise into words, wrap each in a measurable span
  const words = text.split(/\s+/);
  el.innerHTML = words
    .map((w) => `<span class="measure-word" style="display:inline-block;">${w}&nbsp;</span>`)
    .join('');

  const wordEls = Array.from(el.querySelectorAll('.measure-word'));

  // Group words by vertical position (line)
  const lines = [];
  let currentLine = [];
  let lastTop = null;

  wordEls.forEach((w) => {
    const top = w.getBoundingClientRect().top;
    if (lastTop === null) lastTop = top;
    if (Math.abs(top - lastTop) > 4) {
      lines.push(currentLine);
      currentLine = [];
      lastTop = top;
    }
    currentLine.push(w.textContent);
  });
  if (currentLine.length) lines.push(currentLine);

  // Re-render as split lines
  el.innerHTML = lines
    .map(
      (lineWords) =>
        `<span class="split-line" style="display:block;overflow:hidden;"><span class="split-line-inner">${lineWords.join(' ')}</span></span>`
    )
    .join('');

  return Array.from(el.querySelectorAll('.split-line-inner'));
}

/**
 * Build and play the hero entrance GSAP timeline.
 * Called once after DOMContentLoaded.
 */
export function initHero() {
  // Guard — hero elements must exist
  const heroSection = document.querySelector('[data-hero]') || document.querySelector('.hero') || document.querySelector('section:first-of-type');
  if (!heroSection) return;

  // ----------------------------------------------------------------
  // Grain texture — injected once onto body if not already present
  // ----------------------------------------------------------------
  if (!document.getElementById('el-grain')) {
    const grain = document.createElement('div');
    grain.id = 'el-grain';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);
  }

  // ----------------------------------------------------------------
  // Word-mask heading reveal
  // ----------------------------------------------------------------
  const wordMaskHeadings = document.querySelectorAll('[data-motion="word-mask"]');

  // ----------------------------------------------------------------
  // Subtitle (second heading or [data-hero-subtitle])
  // ----------------------------------------------------------------
  const subtitle = document.querySelector('[data-hero-subtitle]') || heroSection.querySelector('h2, .hero__subtitle');

  // ----------------------------------------------------------------
  // Paragraph line reveal
  // ----------------------------------------------------------------
  const descParagraphs = heroSection.querySelectorAll('[data-motion="line-reveal"]');

  // ----------------------------------------------------------------
  // Social icons
  // ----------------------------------------------------------------
  const socialContainer = heroSection.querySelector('[data-hero-social], .hero__social');
  const socialItems = socialContainer ? Array.from(socialContainer.children) : [];

  // ----------------------------------------------------------------
  // Portrait / hero image
  // ----------------------------------------------------------------
  const portraitWrap = heroSection.querySelector('[data-motion="clip-circle"]');

  // ----------------------------------------------------------------
  // Horizontal rule wipes
  // ----------------------------------------------------------------
  const rules = heroSection.querySelectorAll('[data-motion="rule-wipe"]');

  // ----------------------------------------------------------------
  // Stat blocks
  // ----------------------------------------------------------------
  const statsContainer = heroSection.querySelector('[data-hero-stats], .hero__stats, .hero-stats');
  const statItems = statsContainer ? Array.from(statsContainer.children) : [];

  // ----------------------------------------------------------------
  // Set initial states BEFORE timeline runs
  // ----------------------------------------------------------------

  // Word-mask: hide words below baseline
  wordMaskHeadings.forEach((heading) => {
    const words = heading.querySelectorAll('.word');
    if (words.length) {
      gsap.set(words, { yPercent: 102 });
    }
  });

  // Subtitle words
  if (subtitle) {
    const subWords = subtitle.querySelectorAll('.word');
    if (subWords.length) {
      gsap.set(subWords, { yPercent: 102 });
    }
  }

  // Paragraph lines — split and hide
  const allLineInners = [];
  descParagraphs.forEach((p) => {
    const lines = splitIntoLines(p);
    allLineInners.push(...lines);
  });
  if (allLineInners.length) {
    gsap.set(allLineInners, {
      rotationX: -80,
      transformOrigin: 'top center -50px',
      autoAlpha: 0,
    });
  }

  // Social icons
  if (socialItems.length) {
    gsap.set(socialItems, { y: 40, autoAlpha: 0 });
  }

  // Portrait
  if (portraitWrap) {
    gsap.set(portraitWrap, {
      clipPath: 'circle(0% at 50% 50%)',
      scale: 1.2,
    });
  }

  // Rules
  if (rules.length) {
    gsap.set(rules, { scaleX: 0, transformOrigin: 'center' });
  }

  // Stat items
  if (statItems.length) {
    gsap.set(statItems, { y: 20, autoAlpha: 0 });
  }

  // ----------------------------------------------------------------
  // Main timeline
  // ----------------------------------------------------------------
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // --- 1.0s: Portrait reveal ---
  if (portraitWrap) {
    tl.to(
      portraitWrap,
      {
        clipPath: 'circle(55% at 50% 50%)',
        scale: 1.0,
        duration: 1.4,
        ease: 'power3.out',
      },
      1.0
    );
  }

  // --- 1.3s: Hero heading words ---
  wordMaskHeadings.forEach((heading) => {
    const words = heading.querySelectorAll('.word');
    if (!words.length) return;
    tl.to(
      words,
      {
        yPercent: 0,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.08,
      },
      1.3
    );
  });

  // --- 1.7s: Social icons ---
  if (socialItems.length) {
    tl.to(
      socialItems,
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
      },
      1.7
    );
  }

  // --- 1.8s: Subtitle words ---
  if (subtitle) {
    const subWords = subtitle.querySelectorAll('.word');
    if (subWords.length) {
      tl.to(
        subWords,
        {
          yPercent: 0,
          duration: 1.0,
          ease: 'power3.out',
          stagger: 0.08,
        },
        1.8
      );
    }
  }

  // --- 2.1s: Description paragraph lines ---
  if (allLineInners.length) {
    tl.to(
      allLineInners,
      {
        rotationX: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
      },
      2.1
    );
  }

  // --- 2.4s: Horizontal rules ---
  if (rules.length) {
    tl.to(
      rules,
      {
        scaleX: 1,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.1,
      },
      2.4
    );
  }

  // --- 2.6s: Stat blocks ---
  if (statItems.length) {
    tl.to(
      statItems,
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
      },
      2.6
    );
  }

  // ----------------------------------------------------------------
  // Hero image parallax (M-11)
  // Parallax applied to whatever element has data-motion="parallax"
  // inside the hero section
  // ----------------------------------------------------------------
  const heroParallaxImg = heroSection.querySelector('[data-motion="parallax"]');
  if (heroParallaxImg && typeof ScrollTrigger !== 'undefined') {
    gsap.to(heroParallaxImg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}
