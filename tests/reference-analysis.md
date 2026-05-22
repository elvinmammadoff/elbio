# ELBIO Reference Analysis
# Primary spec for team-frontend and team-motion. Do not refetch the references — everything needed is here.

Analyzed: 2026-05-21
Reviewer: team-reviewer (Phase 1)

Sources:
- Hebo: https://html.aqlova.com/hebo-prev/hebo/index-personal-portfolio-2.html
- Orisa: https://orisa-html-demo.pages.dev/index-5
- Jesper: https://demo.themetorium.net/html/jesper/landing-page-1.html

---

## 1. HEBO — Reference Analysis

### 1.1 Typography

Font families available in system (CSS variables from main.css):
- `--tp-ff-heading`: 'Inter', sans-serif (default body/heading)
- `--tp-ff-poppins`: 'Poppins', serif
- `--tp-ff-teko`: 'Teko', serif (display, condensed)
- `--tp-ff-manrope`: 'Manrope', sans-serif
- `--tp-ff-grotesk`: 'Space Grotesk', sans-serif
- `--tp-ff-clash-bold`: 'ClashDisplay-Bold' (custom web font, editorial display)
- `--tp-ff-thunder-bold`: 'Thunder-Bold' (custom web font, ultra-condensed display)

Heading scale (base HTML elements):
| Element | Size | Weight | Line-height |
|---------|------|--------|-------------|
| h1 | 40px | 500 | 1.2 |
| h2 | 36px | 500 | 1.2 |
| h3 | 28px | 500 | 1.2 |
| h4 | 24px | 500 | 1.2 |
| h5 | 20px | 500 | 1.2 |
| h6 | 16px | 500 | 1.2 |

Section title overrides (component-level, beyond base HTML):
- `.tp-section-title`: 80px desktop / 50px tablet / 34px mobile
- `.tp-section-title-thunder`: 130px (Thunder font, ultra-large editorial)
- `.dgs-section-content-title`: 140px desktop (responsive, extreme display scale)
- `.cr-section-content-title`: 60px responsive
- `.md-section-title`: 80px → 32px mobile

Body text: 16px base, paragraph 18px / line-height 1.56 / letter-spacing -0.02em

### 1.2 Color Palette

Background: white / off-white (light mode on personal portfolio 2 variant)
Text: `--tp-common-black: #030303`
Secondary text: `--tp-grey-1: #5C5C5C`
Borders: `--tp-border-1: #EAEBED`, `--tp-border-2: #e7e7e7`
Dark surface: `--tp-common-black-2: #111013`

Accent colors:
- `--tp-common-yellow: #FFB701` (amber/gold)
- `--tp-theme-yellow: #FFD337` (lighter gold)
- `--tp-theme-blue: #5265F9` (indigo-blue)
- `--tp-theme-green: #A0FF27` (neon chartreuse)
- `--tp-theme-green-yellow: #AFF42B` (neon yellow-green)
- `--tp-common-jelly: #F94E4E` (red/coral)
- `--tp-theme-paste: #073333` (dark teal)

Neutral greys: #5C5C5C through #2B2B2D (greys 1–9)
White: `#ffffff`
Black: `#030303`

### 1.3 Animation Patterns

JS library: GSAP with ScrollSmoother, ScrollTrigger, SplitText registered.

Smooth scroll:
```
ScrollSmoother.create({
  smooth: 1.35,
  effects: true,
  smoothTouch: 0.1,
  ignoreMobileResize: true
})
```
Wrapper elements: `#smooth-wrapper` / `#smooth-content`

ScrollTrigger patterns:
- Universal pattern: `trigger: element, start: 'top 85%', scrub: 1, toggleActions: 'play none none none'`
- Pin sections: `start: 'top 10%', end: 'bottom 99%', pin: section, scrub: 1, pinSpacing: false`
- Service panel: `start: 'top 10%', end: 'bottom 99%'`
- Portfolio scale stack: `gsap.set(sections, {scale: 1})` then `tl.to(section, {scale: 0.8})`

Easing strings used:
- `"bounce.out"` — button pop
- `"power2.out"` / `"Power2.out"` — standard reveals
- `"sine"` / `"sine.out"` — scale/letter
- `"back.out(1.7)"` — text bounce
- `"circ.out"` — image clip reveals
- `"none"` — scroll-synchronized invert

Durations: 0.2s (letter hover), 1s (standard), 1.5s (image reveals), 2s (paragraph lines)

Stagger values:
- Character reveals: `stagger: 0.02`
- Text characters: `stagger: 0.05`
- Perspective text: `stagger: 0.1`
- Fade-in elements: `stagger: 0.15`

Keyframe animations (CSS):
- `rotate2` / `roteted`: 0deg → 360deg (infinite decorative rotation)
- `move1`: bottom -300px to -300px, left -300px to 1200px (floating element drift)
- `hero-circle-2` / `hero-circle-3`: orbital movement
- `fadeInUp`: opacity 0→1, translateY 20px→0
- `tp_zoom_in_out`: scale 0.8→1.0→0.8 (7s infinite, subtle breathe)
- `animate-pulse`: box-shadow expansion
- `marquee-horizontal`: translateX -100% (ticker)

Notable animation functions:
- Text scale on hover: `scaleY: 1.2, y: '5%'` on word spans
- Random character generator on hover (data scramble effect)
- Studio perspective parallax: `rotationX: 1.8 → -0.5, z: '0vh' → '-2vh'`
- Character animation (SplitText): `x: 100, autoAlpha: 0, stagger: 0.05`
- Paragraph line reveal: `rotationX: -80, transformOrigin: "top center -50"`

### 1.4 Hover States

- Images: scale up slightly within card on hover
- Buttons: `all 0.3s ease-in-out` transition (CSS global on `a`, `button`, `input`)
- Portfolio cards: scale transform, image reveal technique
- Random text scramble effect on interactive text elements

### 1.5 Hero Treatment

Layout: light background, portrait photo (Eleanor Pena) positioned right. Large name heading left-aligned above "Freelance Product Designer" subtitle. Decorative geometric shape element upper-left. Stats blocks (Satisfied Clients, etc.) as data points. No clip-path in CSS declarations found — relies on GSAP-driven image scale reveals.

Typography approach: large name in Inter medium 500 weight, subhead in lighter weight. Mixed with inline stats.

### 1.6 Spacing Rhythm

Container: Bootstrap-based, `.tp-plr-80` = 80px padding (40px tablet, 20px mobile)
Section spacing: via gutter variables `.gx-2` through `.gx-135` (2px to 135px)
Section padding: `--tp-plr-35: 35px`, `--tp-plr-80: 80px`

### 1.7 Cursor / Micro-interactions

No dedicated cursor element found in CSS. Uses standard cursor. Interactive micro-interactions are JS-driven (random character scramble on pointer-over, hover image translation on portfolio cards).

---

## 2. ORISA — Reference Analysis

### 2.1 Typography

Font families (CSS variables from main.css):
- `--at-ff-body: 'DM Sans', sans-serif` (all text)
- `--at-ff-heading: 'DM Sans', sans-serif` (headings)
- `--at-ff-fontawesome: "Font Awesome 6 Pro"` (icons)
- Display size variable: `--at-fz-ds-1: 124px` (maximum display scale)

Font size scale variables:
- `--at-fz-body: 14px`
- `--at-fz-font-label: 12px`
- `--at-fz-font-md: 16px`
- `--at-fz-font-lg: 20px`
- `--at-fz-font-xl: 22px`
- `--at-fz-font-2xl: 28px`
- `--at-fz-font-3xl: 32px`
- `--at-fz-24: 24px`
- `--at-fz-ds-1: 124px`

Heading scale with responsive breakpoints:
| Element | 1401px+ | 1024–1400 | 768–991px | <575px |
|---------|---------|-----------|-----------|--------|
| h1 | 84px | 70px | 54px | 50px |
| h2 | 72px | 60px | 52px | 42px |
| h3 | 64px | 52px | 40px | 36px |
| h4 | 48px | 38px | 30px | 30px |
| h5 | 34px | 26px | 28px | 20px |
| h6 | 24px | 20px | 20px | 16px |

Line-height: 1.2 (headings), 1.5 (body)

### 2.2 Color Palette

Light mode (primary):
- Background: `--at-neutral-0: #FEFEFE` (near-white)
- Surface: `--at-neutral-50: #F2F2F2`
- Border light: `--at-neutral-100: #DFDFDF`
- Border mid: `--at-neutral-200: #CDCCCC`
- Text muted: `--at-neutral-300: #B7B7B7`
- Body text mid: `--at-neutral-500: #585959`
- Text dark: `--at-neutral-700: #303030`
- Surface dark: `--at-neutral-800: #212121`
- Heading text: `--at-neutral-900: #1D1D1D`
- Near-black: `--at-neutral-950: #0F0F0F`
- Black: `--at-common-black: #1e1e1e`
- White: `--at-common-white: #ffffff`

Accent:
- `--at-theme-primary: #F0460E` (burnt orange, warm red-orange)
- `--at-gradient-primary: linear-gradient(90deg, #a020f0 0%, #00ffd1 100%)` (purple to cyan)

Dark mode variants:
- `--at-neutral-dark-0: #0C0C0C`
- `--at-neutral-dark-50: #141414`
- `--at-neutral-dark-100: #212121`
- `--at-neutral-dark-900: #EFEFEF`
- `--at-neutral-dark-950: #F4F4F4`

### 2.3 Animation Patterns

JS library: GSAP with ScrollTrigger, ScrollSmoother, SplitText, ScrollToPlugin registered.

Smooth scroll:
```
ScrollSmoother.create({
  smooth: 1.35,
  effects: true,
  smoothTouch: 0.15,
  ignoreMobileResize: true
})
```

ScrollTrigger universal patterns:
- Pin + scrub: `start: 'top top'`, `end: 'bottom top'`, `scrub: 1` or `scrub: 0.85`
- `anticipatePin: 1` on pinned sections
- `pinSpacing: false` on stacked panels
- Mobile: parallax range reduced to `× 0.55`

Easing used:
- `power1.out` (parallax default)
- `expo.inOut` (parallax variant)
- `sine.inOut` (text scale)
- `power2.out` / `power3.out` (character reveals)
- `none` (scroll-driven scrub)

Durations:
| Animation | Duration | Ease |
|-----------|----------|------|
| Text reveal | 0.7s | power2.out |
| Service hover fade | 0.8s | none |
| Character animation | 1s | power2/power3.out |
| Text scale | 0.4s | sine.inOut |
| Parallax | varies | power1/expo/sine |

Stagger values:
- Character reveals: `stagger: 0.05` to `stagger: 0.2`
- Rise-up elements: `stagger: 0.03`

Special effects:
- Postbox zoom reveal: clip-path from `inset(Y X Y X round 4px)` → `inset(0 0 0 0 round 42px)` (scroll-driven)
- 3D flip cards: `transformPerspective: 1200`, `rotationX: 75° → 0°`, trigger `'top bottom'` to `'top 30%'`
- Card stacking: `stepScale: 0.025` per landed card, initial peek `50px`, stack-top offset `96px`
- Text scale hover: center letter `scaleY: 1.6, y: '-24%'`; neighbors `scaleY: 1.3, y: '-12%'`
- Footer reveal: `scale: 0.95 → 1`, `scrub: 1`
- GSAP marquee: `dur = groupWidth / speed`, `repeat: -1`, seamless directional loop

CSS keyframes:
- `postbox-marquee-left`: translateX 0 → -50%
- `postbox-marquee-right`: translateX -50% → 0
- `animate-pulse`: 3s linear infinite

Responsive: `gsap.matchMedia()` breakpoints at 576 / 992 / 1200 / 1400px

### 2.4 Hover States

- Blog card images: `transform: scale(1.1)` on `.postbox-thumb img`
- Product cards: `transform: scale(1.05)` on `.blog-card-2__img`
- Image hover: `filter: blur(5px); scale: 1.05` on `.at-image-hover:hover`
- Body overlay cursor: `cursor: url(cross-out.webp), pointer`
- Swiper nav buttons: 50×50px, `border: 1px solid var(--at-neutral-700)`, `background: var(--at-neutral-800)`

### 2.5 Hero Treatment

Layout: light background, multi-layered composition. Central name "Orisa Nova" as primary focal point. Supporting tagline about AI model design. Hero imagery (product/portfolio images) arranged strategically around text. Avatar stack. Dual CTAs: "View All Projects" / "Book A Call Now". Sophisticated minimalism blending technical credibility with creative flair. No clip-path on hero — relies on GSAP entrance.

### 2.6 Spacing Rhythm

Container widths:
- `max-width: 1750px` (ultra-wide)
- `.container-1136`: max-width 1136px
- `.container-2200`: max-width 2200px

Section padding using `pt-*/pb-*` classes: 170px / 165px / 160px / 155px / 150px descending scale down to 100px. Responsive reduction at 1200–1399px breakpoint.

Border radius: 8px, 12px, 16px, 42px (card radius), 50px (pill), 100px (circle)

Box shadows: `0 20px 30px -8px rgba(0, 0, 0, 0.8)`, `0 16px -32px 0 rgba(0, 0, 0, 0.8)`

Backdrop filters: `blur(4px)`, `blur(10px)`, `blur(20px)` with 0.9 opacity overlays

### 2.7 Cursor / Micro-interactions

Custom cursor: body overlay cursor via CSS url() referencing `cross-out.webp`.
Clip-path offcanvas: `circle(0% at calc(100% - 45px) 45px)` → full reveal on open.
Transitions: nav `0.55s cubic-bezier(0.65, 0, 0.35, 1)`, menu swaps `0.45s cubic-bezier(0.5, 1.5, 0.35, 1)` (overshoot bounce easing), offcanvas `0.7s ease-in-out`.

---

## 3. JESPER — Reference Analysis

### 3.1 Typography

Font families (CSS variables from theme.css):
- `--tt-body-font: 'Poppins', sans-serif` (body and general text)
- `--tt-alter-font: "Big Shoulders Display", sans-serif` (display/editorial)

Note: Big Shoulders Display is a Google Font — free, condensed, high-contrast weight range (100–900), designed for large display sizes. This is the hero headline font.

Heading scale (clamp-based fluid typography):
| Element | Min | Fluid | Max |
|---------|-----|-------|-----|
| h1 | 38px | 5vw | 78px |
| h2 | 34px | 4vw | 62px |
| h3 | 30px | 3vw | 52px |
| h4 | 26px | 3vw | 44px |
| h5 | 24px | 2vw | 30px |
| h6 | 24px | — | 24px (fixed) |

Component heading overrides:
| Class | Min | Fluid | Max |
|-------|-----|-------|-----|
| `.tt-heading-title` | 32px | 3vw | 42px |
| `.tt-heading-xsm` | 24px | 2vw | 26px |
| `.tt-heading-sm` | 26px | 2vw | 34px |
| `.tt-heading-lg` | 36px | 4vw | 62px |
| `.tt-heading-xlg` | 52px | 5vw | 82px |
| `.tt-heading-xxlg` | 52px | 6vw | 110px |
| `.tt-heading-xxxlg` | 64px | 10vw | 187px |

Body text: 19px / line-height 1.4

### 3.2 Color Palette

Dark mode (primary — Jesper is a dark-mode-first template):
- `--tt-bg-color: #0a0a0a` (near-black page background)
- `--tt-dark-color: #121212` (surface)
- `--tt-text-color: #efedea` (warm off-white body text)
- `--tt-text-muted-color: #8f8f8f` (secondary text)
- `--tt-border-color: rgb(133 133 133 / 50%)` (subtle border)
- `--tt-sub-menu-bg-color: #252525` (elevated surface)
- `--tt-sub-menu-link-color: #bbb9b2` (muted nav text)
- `--tt-force-to-light-color: #f3f3f3` (forced white when needed)
- `--tt-linear-text-bg-color: rgb(255 255 255 / 20%)` (subtle text gradient)
- Page transition overlay: `--tt-page-trans-overlay-bg-color: #161616`

Light mode alternative:
- `--tt-light-color: #efedea` (warm cream, used as background in light variant)

Accent colors:
- `--tt-main-color: #bf4a1a` (deep burnt orange/sienna — primary brand accent)
- `--tt-link-color: #c93b00` (darker orange for links)
- `--tt-link-hover-color: #f5533a` (brighter orange on hover)

Magic cursor:
- `--tt-ball-border-color: #666`
- `--tt-ball-magnetic-color: var(--tt-main-color)` (#bf4a1a)
- `--tt-ball-bg-color: color-mix(in oklab, #bf4a1a 93%, transparent)`
- `--tt-ball-color: #FFF`

### 3.3 Animation Patterns

JS libraries: GSAP, Lenis (smooth scroll), ScrollTrigger, SplitText, page transitions.

Lenis smooth scroll:
```javascript
// Desktop only (not mobile)
var lenis = new Lenis({ duration: 1.5 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

Scroll-to-anchor easing (custom quartic ease-in-out):
```javascript
(x) => Math.min(x < 0.5 ? 8*x*x*x*x : 1-Math.pow(-2*x+2, 4)/2)
```

Page transitions:
```javascript
// Enter: Expo.easeInOut, duration 0.7s
tl_transitIn.to($tt_ptrOverlayTop, { scaleX: 1, transformOrigin: "center left" }, 0);

// Exit / hero reveal:
// Title words: yPercent: 101 → 0, ease: Power2.easeOut, delay: 1.3s
// Subtitle: delay 1.8s
// Description: delay 2.1s
// Image: scale: 1.2 → 1, autoAlpha: 0→1, duration: 1.2s, delay: 1s
// Social icons: y: 40 → 0, autoAlpha: 0→1, stagger: 0.1, delay: 1.7s
```
Stagger on page enter: 0.05–0.1 between sequential elements.

ScrollTrigger configurations:

Parallax image:
```javascript
{ yPercent: 30, ease: "none",
  scrollTrigger: { start: 'top top', end: 'bottom top', scrub: true }}
```

Sticky portfolio stack:
```javascript
// Per item: pin: true, start: "top 20", end: "bottom -10", pinSpacing: false, scrub: true
// Scale: 0.78 (background items shrink)
// Counter-scale on image: 1.15 (maintains image fill)
```

Text reveal (gradient-based):
```javascript
// backgroundSize: "200% 100%" → "100% 100%", stagger: 0.5, scrub: 1
// start: "top 87%", end: "+= offsetHeight * 2"
```

Clip-path reveal (scroll-driven):
```javascript
// clipPath: "inset(100% round R)" → "inset(0% round R)", scrub: true
// start: "top bottom", end: "bottom bottom"
```

Horizontal sticky scroll:
```javascript
// x: 0 ↔ calculated distance, scrub: 1, pin: wrapper
// start: "50% 50%", end: "+= scrollDuration"
```

Keyframe animations (CSS):
- `BgNoise`: 1s `steps(2)` infinite (grain texture animation — steps() = film grain jitter)
- `sdc-rotation`: 8s infinite linear (rotating decorative element)
- `swipe-line`: 0.8s `cubic-bezier(0.475, 0.425, 0, 0.995)` (underline sweep)

Default transitions:
- Global: `.3s` ease
- Header scroll: `.4s ease-in-out`
- Scroll-down indicator: `8s infinite linear`

### 3.4 Hover States

- All buttons and links: `.3s` transition
- Magnetic buttons: `cursor: none`, GSAP-driven ball morphs to magnetic size
- Project/portfolio hover: nav arrows appear (cursor-arrow-left/right classes trigger GSAP ball resize to 100×100px, `yPercent: -70`)
- Cards: subtle scale + shadow transitions
- Navigation: submenu slide with `0.3s ease-in-out`

### 3.5 Hero Treatment

Layout: dark background (`#0a0a0a`). Large display name "Jesper Dietrich" in Big Shoulders Display. Subtitle "Digital Designer". Tagline: "Over 15 years of experience in the design industry". Scroll-to-explore CTA. Social media icons.

Word-wrap reveal technique: each word wrapped in `<span class="tt-cap-word-wrap"><span class="tt-cap-word">word</span></span>`, then animated from `yPercent: 101` (clipped below baseline) with `Power2.easeOut` — a clean mask-reveal without opacity fade. Image entrance: `scale: 1.2 → 1.0`, `autoAlpha: 0→1`.

This is the gold standard hero approach to adopt.

### 3.6 Spacing Rhythm

Container: `.tt-wrap` max-width `1282px`, padding `15px` left/right (tight sides).

Section padding:
- Desktop (standard): `padding: 80px 0`
- Mobile (≤768px): `padding: 40px 0`

Page header (hero area):
- Desktop: `padding-top: 240px`, `padding-bottom: 180px`
- Tablet (≤1500px): `padding-top: 200px`, `padding-bottom: 180px`
- Mobile (≤768px): `padding: 140px 0`

Spacing scale: 12, 15, 20, 30, 40, 50, 80, 120px. Viewport-relative: 5%, 7%, 10%, 2.5%, 3.5%.

Border radius: 15px (standard cards), 100px (pill buttons), 8px (form inputs), 6px (subtle).

### 3.7 Cursor / Micro-interactions

Magic cursor implementation:
- Ball element: 36×36px default, `border: 2px` with `--tt-ball-border-color`
- Follow multiplier: `$ballRatio = 0.15` (smooth lag)
- Magnetic hover state: 70×70px, `--tt-ball-magnetic-color`
- Alter state (navigation arrows): 100×100px, `yPercent: -70`
- Duration of all ball morphs: `0.3s`
- Z-index: `99999` (top of stack)

CSS `BgNoise` keyframe (`steps(2)` timing) animates a grain texture SVG or CSS noise overlay — confirms grain texture is implemented in this template.

---

## 4. ELBIO Design Direction

This section is the primary spec for team-frontend (CSS variables + structure) and team-motion (animation system). Build ELBIO as a dark-mode-first, editorially bold, motion-rich portfolio that sits stylistically between Jesper (dark mode authority, Big Shoulders Display energy) and Orisa (clean typographic precision, generous spacing, DM Sans legibility).

---

### 4.1 CSS Variables — Complete Token Set

```css
:root {
  /* ==========================================
     TYPOGRAPHY
     ========================================== */
  --el-ff-display:    "Cabinet Grotesk", "Big Shoulders Display", sans-serif;
  --el-ff-body:       "DM Sans", "Inter", sans-serif;
  --el-ff-mono:       "JetBrains Mono", monospace;

  /* Fluid heading scale using clamp() — matches Jesper approach */
  --el-fz-h1:         clamp(52px, 8vw, 120px);   /* hero / section title */
  --el-fz-h2:         clamp(38px, 5vw, 72px);    /* section heading */
  --el-fz-h3:         clamp(28px, 3.5vw, 52px);  /* subsection heading */
  --el-fz-h4:         clamp(22px, 2.5vw, 36px);  /* card title */
  --el-fz-h5:         clamp(18px, 2vw, 24px);    /* label large */
  --el-fz-h6:         16px;                       /* label small */
  --el-fz-body:       17px;
  --el-fz-small:      14px;
  --el-fz-label:      12px;
  --el-fz-display:    clamp(80px, 14vw, 200px);   /* hero name / mega text */

  /* Line heights */
  --el-lh-display:    0.9;   /* tight for display text */
  --el-lh-heading:    1.1;   /* headings */
  --el-lh-body:       1.6;   /* body copy */
  --el-lh-relaxed:    1.8;   /* long-form text */

  /* Font weights */
  --el-fw-light:      300;
  --el-fw-regular:    400;
  --el-fw-medium:     500;
  --el-fw-semibold:   600;
  --el-fw-bold:       700;
  --el-fw-black:      900;

  /* Letter spacing */
  --el-ls-tight:      -0.04em;
  --el-ls-normal:     -0.01em;
  --el-ls-wide:        0.08em;
  --el-ls-wider:       0.15em;

  /* ==========================================
     COLOR — DARK MODE (DEFAULT)
     ========================================== */

  /* Backgrounds */
  --el-bg-base:       #0a0a0a;   /* page background (from Jesper) */
  --el-bg-surface:    #111111;   /* card background */
  --el-bg-elevated:   #1a1a1a;   /* elevated card, tooltip */
  --el-bg-overlay:    #222222;   /* modal, offcanvas */

  /* Text */
  --el-text-primary:  #f0ede8;   /* warm off-white (from Jesper) */
  --el-text-secondary:#a8a49e;   /* muted, secondary */
  --el-text-muted:    #5a5754;   /* tertiary, disabled */
  --el-text-inverse:  #0a0a0a;   /* text on light backgrounds */

  /* Borders */
  --el-border-subtle: rgba(255, 255, 255, 0.06);
  --el-border-default:rgba(255, 255, 255, 0.12);
  --el-border-strong: rgba(255, 255, 255, 0.24);

  /* Accent — warm amber/orange (blends Hebo yellow + Jesper sienna) */
  --el-accent:        #e8a020;   /* primary accent: golden amber */
  --el-accent-dim:    #c47c10;   /* darker accent */
  --el-accent-bright: #ffc040;   /* bright hover state */
  --el-accent-glow:   rgba(232, 160, 32, 0.15); /* glow/tint backgrounds */

  /* Secondary accent (cool) */
  --el-accent-cool:   #4a6cf7;   /* blue-violet (from Hebo --tp-theme-blue) */
  --el-accent-neon:   #a8ff3e;   /* neon green (from Hebo --tp-theme-green) */

  /* Semantic */
  --el-success:       #a8ff3e;
  --el-error:         #f94e4e;   /* from Hebo --tp-common-jelly */

  /* ==========================================
     COLOR — LIGHT MODE OVERRIDE
     Apply via [data-theme="light"] on <html>
     ========================================== */
  /* team-frontend: define these under [data-theme="light"] selector */
  /* --el-bg-base:    #fafaf9; */
  /* --el-bg-surface: #f2f1ef; */
  /* --el-text-primary: #111111; */
  /* --el-text-secondary: #555555; */
  /* --el-border-subtle: rgba(0,0,0,0.06); */
  /* --el-border-default: rgba(0,0,0,0.12); */

  /* ==========================================
     SPACING
     ========================================== */
  --el-space-1:       4px;
  --el-space-2:       8px;
  --el-space-3:       12px;
  --el-space-4:       16px;
  --el-space-5:       20px;
  --el-space-6:       24px;
  --el-space-8:       32px;
  --el-space-10:      40px;
  --el-space-12:      48px;
  --el-space-16:      64px;
  --el-space-20:      80px;
  --el-space-24:      96px;
  --el-space-32:      128px;
  --el-space-40:      160px;

  /* Section rhythm */
  --el-section-pt:    clamp(80px, 10vw, 160px);
  --el-section-pb:    clamp(80px, 10vw, 160px);

  /* Hero padding */
  --el-hero-pt:       clamp(140px, 18vw, 240px);
  --el-hero-pb:       clamp(80px, 10vw, 160px);

  /* Container */
  --el-container-max: 1280px;
  --el-container-pad: clamp(20px, 4vw, 60px);

  /* Grid gaps */
  --el-gap-sm:        16px;
  --el-gap-md:        24px;
  --el-gap-lg:        40px;
  --el-gap-xl:        60px;

  /* ==========================================
     SHAPE / RADIUS
     ========================================== */
  --el-radius-sm:     4px;
  --el-radius-md:     8px;
  --el-radius-lg:     16px;
  --el-radius-xl:     24px;
  --el-radius-2xl:    40px;
  --el-radius-pill:   100px;
  --el-radius-circle: 50%;

  /* ==========================================
     SHADOWS
     ========================================== */
  --el-shadow-card:    0 8px 32px -8px rgba(0, 0, 0, 0.6);
  --el-shadow-hover:   0 20px 48px -12px rgba(0, 0, 0, 0.8);
  --el-shadow-glow:    0 0 40px rgba(232, 160, 32, 0.2);

  /* ==========================================
     TRANSITIONS (CSS-layer only, not GSAP)
     ========================================== */
  --el-transition-fast:   0.15s ease;
  --el-transition-base:   0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --el-transition-slow:   0.6s cubic-bezier(0.4, 0, 0.2, 1);
  --el-transition-spring: 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);  /* overshoot */

  /* ==========================================
     Z-INDEX
     ========================================== */
  --el-z-bg:          -1;
  --el-z-base:         0;
  --el-z-card:         1;
  --el-z-sticky:      10;
  --el-z-overlay:    100;
  --el-z-nav:        200;
  --el-z-modal:      300;
  --el-z-cursor:    9999;
  --el-z-transition:99999;
}
```

### 4.2 Google Fonts to Load

Primary stack (declare in `<head>` before any CSS):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Big+Shoulders+Display:wght@400;700;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Note: Cabinet Grotesk (via Fontshare CDN if preferred) is a strong editorial alternative. Fallback to Big Shoulders Display if CDN is unavailable.

Fontshare alternative for Cabinet Grotesk:
```html
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap" rel="stylesheet">
```

### 4.3 Responsive Breakpoints

```css
/* Mobile first */
/* xs: 0 – 374px (no variable, base styles) */
--el-bp-sm:  375px;   /* small mobile */
--el-bp-md:  768px;   /* tablet */
--el-bp-lg:  1280px;  /* desktop */
--el-bp-xl:  1920px;  /* wide */
```

Media query usage pattern:
```css
/* In responsive.css — always mobile-first min-width */
@media (min-width: 768px) { ... }
@media (min-width: 1280px) { ... }
@media (min-width: 1920px) { ... }
```

---

### 4.4 Motion Patterns for team-motion

The following are function-level descriptions, not code. team-motion owns all GSAP implementation in `assets/js/motion/`.

#### M-01: Smooth Scroll (hero.js or index.js)

Initialize Lenis with `duration: 1.2` (slightly snappier than Jesper's 1.5). Desktop only — disable on touch devices. Wire to GSAP ticker: `gsap.ticker.add((t) => lenis.raf(t * 1000))`. Set `gsap.ticker.lagSmoothing(0)`. Register ScrollTrigger to update on each Lenis scroll event.

#### M-02: Hero Word-Mask Reveal (hero.js)

This is the single most important motion piece. Replicate Jesper's technique exactly:
1. In the HTML, each word in the hero heading is wrapped: `<span class="word-wrap"><span class="word">Word</span></span>`. The outer span has `overflow: hidden`.
2. On page load (after Lenis init), animate all `.word` spans from `yPercent: 102` (fully hidden below baseline) to `yPercent: 0` using a staggered GSAP timeline.
3. Parameters: `duration: 1.0`, `ease: "power3.out"`, `stagger: 0.08` per word, `delay: 0.3` after page load.
4. Do NOT use opacity. This is a pure positional mask reveal — the guardrail explicitly bans opacity-only fades.
5. Follow with the subtitle line at `delay + 0.4s` using the same technique.
6. Follow with the descriptor paragraph lines using `rotationX: -80, transformOrigin: "top center -50px"` (from Hebo), `duration: 0.8s`, `stagger: 0.1`, `ease: "power2.out"`.

#### M-03: Page Transition (transitions.js)

Full-page overlay wipe on navigation:
1. Exit: overlay panel scales in from left (`scaleX: 0 → 1`, `transformOrigin: "center left"`, `ease: Expo.easeInOut`, `duration: 0.7s`).
2. Enter: new page hero text reveals (M-02 timing starts at 1.3s after overlay begins).
3. Overlay exits: `scaleX: 1 → 0`, `transformOrigin: "center right"`.
4. Overlay background color: `--el-bg-overlay` (#222222).

#### M-04: Scroll-Reveal Stagger (reveals.js)

Elements with `data-motion="reveal"` animate on enter viewport:
- From: `y: 40, autoAlpha: 0` → to: `y: 0, autoAlpha: 1`
- Duration: `0.8s`, ease: `"power2.out"`
- ScrollTrigger: `start: "top 88%"`, `toggleActions: "play none none none"`

Elements with `data-motion="reveal-stagger"` (cards, list items):
- Same parameters but `stagger: 0.12` applied to child elements
- ScrollTrigger on parent container

Elements with `data-motion="reveal-clip"`:
- Clip-path from `inset(100% 0% 0% 0%)` → `inset(0% 0% 0% 0%)`
- Duration: `1.0s`, ease: `"power3.out"`, start: `"top 85%"`

Note on the guardrail: `autoAlpha` is acceptable because it pairs opacity with visibility and is part of a multi-property animation. Pure opacity-only `{opacity: 0 → 1}` with nothing else is banned.

#### M-05: 3D Tilt Cards (scroll.js or cursor.js)

Portfolio project cards and blog cards implement real-time 3D tilt on mouse move:
1. On `mousemove` over card, compute cursor position relative to card center as percentage (-0.5 to 0.5 range).
2. Apply: `gsap.to(card, { duration: 0.4, rotationX: -deltaY * 10, rotationY: deltaX * 10, transformPerspective: 800, ease: "power1.out" })`
3. On `mouseleave`: `gsap.to(card, { duration: 0.6, rotationX: 0, rotationY: 0, ease: "elastic.out(1, 0.4)" })`
4. Elements with `data-motion="tilt"` receive this behavior.
5. Card inner content (image, text) counter-translates slightly: `z: 30, translateZ: 20` for depth layering.

#### M-06: Custom Cursor (cursor.js)

Implement the Jesper magic ball cursor:
1. Two DOM elements: `.cursor-ball` (36×36px, border-only circle) and `.cursor-dot` (6×6px, filled).
2. Cursor ball follows mouse with `ratio: 0.15` lag (interpolation via `gsap.ticker`): `x += (mouseX - x) * ratio` per frame.
3. States and transitions (all `duration: 0.3s`):
   - Default: 36×36px, border color `--el-border-strong`
   - On `[data-cursor="link"]`: 64×64px, background `--el-accent`, border none, dot hidden
   - On `[data-cursor="drag"]`: 80×80px with "DRAG" text inside
   - On `[data-cursor="view"]`: 80×80px with "VIEW" text inside (for portfolio cards)
   - On image hover: 80×80px, fill `--el-accent-glow`
4. Disable cursor on mobile (pointer: coarse media query).

#### M-07: Scroll-Linked Section Pins (scroll.js)

Portfolio listing section: implement card stacking inspired by Orisa's approach.
1. Each portfolio card is pinned sequentially.
2. When the next card arrives, the previous card scales to 0.95 with `ease: "none"`, `scrub: true`.
3. Per card: `pin: true, pinSpacing: false, scrub: 1`.
4. Counter-scale the card image to 1.05 to maintain fill (`scale(0.95 × 1.05 ≈ 1.0` visual).
5. `start: "top 15%"`, `end: "bottom 15%"`.

#### M-08: Marquee / Ticker (scroll.js)

For skills/services/clients horizontal marquee:
1. GSAP-based, not CSS: `dur = totalGroupWidth / speedPxPerSec`, `repeat: -1`, `x: 0 → -groupWidth`.
2. Speed: 80px/s (default), reducible via `data-speed` attribute.
3. On hover: decelerate to 20px/s with `gsap.to(tween, { timeScale: 0.25, duration: 0.4 })`.
4. Resume on mouseleave: `gsap.to(tween, { timeScale: 1, duration: 0.4 })`.

#### M-09: Text Scramble (reveals.js)

On `data-motion="scramble"` elements (nav items, CTA labels):
1. On mouseenter, cycle each character through random alphanumeric characters `n` times before resolving to the correct character.
2. Interval: 30ms per cycle. Resolve stagger: 40ms per character position from left.
3. This is the `randChar()` pattern from Hebo.

#### M-10: Grain Texture Overlay (hero.js or base CSS)

Implement a CSS `BgNoise` grain using Jesper's `steps(2)` technique:
1. Create an `::after` pseudo-element on `body` with a 200×200px SVG noise background (generated via feTurbulence filter or inline SVG data URI).
2. `position: fixed, top: 0, left: 0, width: 100vw, height: 100vh, pointer-events: none, z-index: 1, opacity: 0.035`.
3. Animate: `@keyframes grain { 0% { transform: translate(0, 0) } 10% { transform: translate(-2%, -3%) } ... }` with `animation: grain 0.4s steps(1) infinite`.
4. This creates the analog film grain visible in Jesper. Keep opacity very low (0.03–0.05 range) — it should be felt, not seen.

#### M-11: Hero Image Parallax (hero.js)

If the hero includes a portrait or decorative image:
1. `yPercent: 0 → 20` as user scrolls hero section out of view.
2. `ease: "none"`, `scrollTrigger: { start: 'top top', end: 'bottom top', scrub: true }`.
3. Wrap image in overflow-hidden container sized ~20% taller than display size to prevent gap.

#### M-12: Responsive Motion Guards (all motion files)

All GSAP animations must use `gsap.matchMedia()`:
- `(min-width: 1280px)`: full motion, all effects active
- `(min-width: 768px) and (max-width: 1279px)`: reduce parallax to 50% range, tilt to 50% intensity
- `(max-width: 767px)`: disable tilt, disable cursor, disable parallax; keep reveals with reduced distance (`y: 20` instead of `y: 40`); disable Lenis

#### Data-motion API (for team-frontend to apply in HTML)

```
data-motion="reveal"              → M-04: single element, y fade-up
data-motion="reveal-stagger"      → M-04: children stagger
data-motion="reveal-clip"         → M-04: clip-path wipe
data-motion="tilt"                → M-05: 3D card tilt
data-motion="scramble"            → M-09: text scramble on hover
data-motion="parallax"            → M-11: vertical parallax
data-motion="marquee"             → M-08: infinite ticker
data-cursor="link"                → M-06: cursor link state
data-cursor="view"                → M-06: cursor "VIEW" state
data-cursor="drag"                → M-06: cursor "DRAG" state
```

---

### 4.5 Hero Treatment Decision for ELBIO

Based on the three references and the Quality Guardrails (no generic stock photos, guardrail 5), ELBIO uses the following hero approach:

APPROACH: Abstract layered editorial typography with a subtle portrait reveal.

Structure:
1. Background: `--el-bg-base` (#0a0a0a) with grain overlay (M-10).
2. Mega display name text: 2–3 lines, `--el-fz-display` (`clamp(80px, 14vw, 200px)`), Cabinet Grotesk Black 900, `--el-text-primary`, `--el-ls-tight`. Split into word-spans for M-02 reveal.
3. Role/title: smaller size (`--el-fz-h4`), DM Sans 400 weight, `--el-text-secondary`. Underneath the name, left-aligned or centered.
4. A clip-path masked portrait (circular or geometric polygon) positioned right side or as background texture layer — enters via GSAP `clipPath: "circle(0% at 50% 50%)" → "circle(55% at 50% 50%)"` with `ease: "power3.out"`, `duration: 1.4s`, starting at `delay: 0.8s`.
5. Two horizontal rule lines (thin, `--el-border-default`) that wipe in from center outward after text reveal: `scaleX: 0 → 1, transformOrigin: "center"`, `duration: 0.8s`, `ease: "expo.out"`.
6. Stat blocks (3 numbers: projects, years, clients) fade in last with stagger — positioned bottom-left.
7. Scroll indicator: rotating text ring or animated arrow, `sdc-rotation` keyframe at 8s.

This satisfies guardrail 5 (abstract layered typography + clip-path portrait), guardrail 1 (no opacity-only fades — all mask/positional/clip-path), and guardrail 4 (bold editorial typography + creative micro-interactions).

---

### 4.6 Portfolio Card Design Tokens

Each portfolio card (`data-motion="tilt"`, `data-cursor="view"`):
- Background: `--el-bg-surface` (#111111)
- Border: `1px solid var(--el-border-subtle)`
- Border-radius: `--el-radius-xl` (24px)
- Overflow: hidden (for tilt perspective)
- Image ratio: 16/9 or 4/3, `object-fit: cover`, scale `1.0 → 1.08` on hover (within card, CSS transition)
- Tag chips: `--el-bg-elevated`, `--el-radius-pill`, `--el-fz-label`, `--el-ls-wider` uppercase
- Title: `--el-fz-h4`, Cabinet Grotesk 700
- Metadata row: `--el-fz-small`, `--el-text-muted`
- Hover: card border brightens to `--el-border-default`, box-shadow becomes `--el-shadow-hover`

---

### 4.7 Synthesis: What Separates Top-Tier Templates

From analyzing all three references, the distinguishing characteristics of premium ThemeForest portfolio templates at the $49–$79 tier are:

1. Typography scale: The use of `clamp()` fluid type rather than breakpoint-stepped sizes. Maximum display size exceeds 100px on desktop. Body size is 17–19px (not 14–16px which feels cramped).

2. Dark-mode-first: Jesper's `#0a0a0a` background is the industry standard for editorial portfolios. Light mode is an override, not the default.

3. No opacity-only fades: Every entrance animation uses at least two properties (position + clip OR position + scale). Opacity can accompany but never be the sole transform.

4. Lenis + GSAP: This combination (Lenis for native-feeling smooth scroll, GSAP for all animation) is the universal stack. ScrollSmoother is the GSAP-native alternative — both work but Lenis is more current (2024–2025 trend).

5. Grain texture: Even a 3% opacity grain overlay dramatically elevates perceived quality. It distinguishes handcrafted from generic.

6. Fluid type + fluid spacing: `clamp()` everywhere prevents "snapping" at breakpoints and makes the template feel premium at all viewport widths.

7. Page transitions: The overlay wipe on page navigation is table stakes for the $49+ tier. Without it, the template reads as 2019-era.

8. Real cursor: The magic cursor ball (36px, lagged follow, state morphing) is the single most visible quality signal during demo browsing on ThemeForest item pages.
