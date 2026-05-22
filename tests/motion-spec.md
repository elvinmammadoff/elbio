# ELBIO Motion Spec
# Concrete timing, easing, and stagger values for team-motion implementation.
# Derived from reference-analysis.md (Hebo/Orisa/Jesper) with ELBIO-specific decisions.

Authored: [2026-05-21] by team-motion

---

## 1. Lenis Configuration

```javascript
new Lenis({
  duration: 1.5,        // From Jesper exactly (reference-analysis §3.3)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.0,
  infinite: false
})
```

GSAP ticker integration:
```javascript
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);
```

Desktop only: disabled when `window.matchMedia('(pointer: coarse)').matches` is true.

---

## 2. Hero Word-Mask Reveal (M-02)

Source: Jesper §3.5 — gold standard pattern.

HTML structure required (team-frontend applies):
```html
<h1 data-motion="word-mask">
  <span class="word-wrap"><span class="word">Elvin</span></span>
  <span class="word-wrap"><span class="word">Mammadoff</span></span>
</h1>
```

GSAP timeline parameters:
| Property | Value | Source |
|---|---|---|
| `from.yPercent` | `102` | Jesper §3.5 (101 → rounded to 102 for safety) |
| `to.yPercent` | `0` | — |
| `duration` | `1.0s` | reference-analysis §4.4 M-02 |
| `ease` | `"power3.out"` | reference-analysis §4.4 M-02 |
| `stagger` | `0.08` | reference-analysis §4.4 M-02 |
| `delay` (heading start) | `1.3s` | Jesper §3.3 page-transition timing |
| NO opacity | confirmed | Guardrail 1 — position-only mask |

Subtitle line timing:
| Property | Value |
|---|---|
| `delay` | `1.8s` |
| Same `ease` / `duration` | `power3.out` / `1.0s` |
| `stagger` | `0.08` |

Description paragraph lines (rotationX technique from Hebo §1.3):
| Property | Value |
|---|---|
| `from.rotationX` | `-80` |
| `from.transformOrigin` | `"top center -50px"` |
| `duration` | `0.8s` |
| `ease` | `"power2.out"` |
| `stagger` | `0.1` |
| `delay` | `2.1s` |

Social icons row:
| Property | Value |
|---|---|
| `from.y` | `40` |
| `from.autoAlpha` | `0` |
| `duration` | `0.7s` |
| `ease` | `"power2.out"` |
| `stagger` | `0.1` |
| `delay` | `1.7s` |

Portrait clip-path reveal:
| Property | Value |
|---|---|
| `from.clipPath` | `"circle(0% at 50% 50%)"` |
| `to.clipPath` | `"circle(55% at 50% 50%)"` |
| `from.scale` | `1.2` |
| `to.scale` | `1.0` |
| `duration` | `1.4s` |
| `ease` | `"power3.out"` |
| `delay` | `1.0s` |

Horizontal rule wipe:
| Property | Value |
|---|---|
| `from.scaleX` | `0` |
| `transformOrigin` | `"center"` |
| `duration` | `0.8s` |
| `ease` | `"expo.out"` |
| `delay` | `2.4s` |

Stat blocks:
| Property | Value |
|---|---|
| `from.y` | `20` |
| `from.autoAlpha` | `0` |
| `stagger` | `0.12` |
| `delay` | `2.6s` |

---

## 3. Page Transition Overlay (M-03)

Source: Jesper §3.3 page transitions.

Overlay element: `#page-transition-overlay`, `background: var(--el-bg-overlay)` (#222222), `z-index: 99999`.

Exit (navigating away):
| Property | Value |
|---|---|
| `from.scaleX` | `0` |
| `to.scaleX` | `1` |
| `transformOrigin` | `"center left"` |
| `ease` | `"expo.inOut"` |
| `duration` | `0.7s` |

Enter (new page loaded):
| Property | Value |
|---|---|
| `from.scaleX` | `1` |
| `to.scaleX` | `0` |
| `transformOrigin` | `"center right"` |
| `ease` | `"expo.inOut"` |
| `duration` | `0.7s` |

Hero entrance starts: `delay: 1.3s` after overlay-in completes (hero.js handles internally).

---

## 4. Scroll Reveals (M-04)

Source: Hebo §1.3 + reference-analysis §4.4.

### reveal (single element)
```javascript
{ y: 40, autoAlpha: 0 } → { y: 0, autoAlpha: 1 }
duration: 0.8s, ease: "power2.out"
ScrollTrigger: start: "top 88%", toggleActions: "play none none none"
```

### reveal-stagger (children)
Same as reveal but `stagger: 0.12` on children.
ScrollTrigger on parent container: `start: "top 88%"`.
Optional override: `data-motion-stagger="0.08"` for faster stagger.

### reveal-clip (clip-path wipe)
```javascript
{ clipPath: "inset(100% 0% 0% 0%)" } → { clipPath: "inset(0% 0% 0% 0%)" }
duration: 1.0s, ease: "power3.out"
ScrollTrigger: start: "top 85%"
```

### line-reveal (paragraph rotationX)
```javascript
{ rotationX: -80, transformOrigin: "top center -50px", autoAlpha: 0 }
→ { rotationX: 0, autoAlpha: 1 }
duration: 0.8s, ease: "power2.out", stagger: 0.1
ScrollTrigger: start: "top 88%"
```

---

## 5. 3D Tilt Cards (M-05)

Source: reference-analysis §4.4 M-05.

```javascript
// mousemove
{ rotationX: -deltaY * 10, rotationY: deltaX * 10,
  transformPerspective: 800, duration: 0.4, ease: "power1.out" }

// mouseleave
{ rotationX: 0, rotationY: 0,
  duration: 0.6, ease: "elastic.out(1, 0.4)" }
```

Max tilt angle: ±10 degrees.
Inner content counter-transform: `z: 30, translateZ: 20` for depth.
Disabled at `(max-width: 767px)`.

---

## 6. Custom Cursor (M-06)

Source: Jesper §3.7 — exact spec.

DOM:
```html
<div class="cursor-ball" id="cursor-ball"></div>
<div class="cursor-dot" id="cursor-dot"></div>
```

| State | Size | Style |
|---|---|---|
| Default | 36×36px | border: 2px solid rgba(255,255,255,0.24), transparent bg |
| `data-cursor="link"` | 64×64px | bg: #e8a020, no border, dot hidden |
| `data-cursor="view"` | 80×80px | bg: rgba(232,160,32,0.15), text inside |
| `data-cursor="drag"` | 80×80px | same as view with "DRAG" text |
| `data-cursor="image"` | 80×80px | bg: rgba(232,160,32,0.15) |

Lag ratio: `0.15` (Jesper §3.7 `$ballRatio = 0.15`).
State morph duration: `0.3s`.
Z-index: `99999`.
Disabled: `(pointer: coarse)` — touch devices.
rAF lerp loop via `gsap.ticker`, NOT direct `mousemove` positioning.

---

## 7. Pin-Stack Cards (M-07)

Source: Jesper §3.3 sticky portfolio stack + Orisa §2.3 card stacking.

Per card:
```javascript
ScrollTrigger: {
  pin: true,
  pinSpacing: false,
  scrub: 1,
  start: "top 15%",
  end: "bottom 15%"
}
// Scale background cards: 0.78 (Jesper reference)
// Counter-scale card image: 1.15 (Jesper reference)
```

Stagger offset: each card stacked 0px (pinSpacing: false creates natural layering).

---

## 8. Marquee Ticker (M-08)

```javascript
dur = totalGroupWidth / 80;   // 80px/s default speed
gsap.to(group, { x: -groupWidth, duration: dur, ease: "none", repeat: -1 });

// Hover slow
gsap.to(tween, { timeScale: 0.25, duration: 0.4 });
// Hover resume
gsap.to(tween, { timeScale: 1, duration: 0.4 });
```

Speed override: `data-motion-speed="120"` (px/s).

---

## 9. Text Scramble (M-09)

Source: Hebo §1.3 random character generator.

```
Interval: 30ms per cycle
Resolve stagger: 40ms per character (left to right)
Character set: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
Trigger: mouseenter
```

---

## 10. Grain Texture (M-10)

Source: Jesper §3.3 BgNoise keyframe.

```css
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10%       { transform: translate(-2%, -3%); }
  20%       { transform: translate(3%, 1%); }
  30%       { transform: translate(-1%, 4%); }
  40%       { transform: translate(2%, -2%); }
  50%       { transform: translate(-3%, 2%); }
  60%       { transform: translate(1%, -1%); }
  70%       { transform: translate(-2%, 3%); }
  80%       { transform: translate(3%, -3%); }
  90%       { transform: translate(-1%, 2%); }
}
animation: grain 0.4s steps(1) infinite;
opacity: 0.035;
```

SVG noise: feTurbulence baseFrequency 0.65, numOctaves 3, inline data URI.

---

## 11. Responsive Guards (M-12)

```javascript
gsap.matchMedia({
  "(min-width: 1280px)": () => { /* full motion */ },
  "(min-width: 768px) and (max-width: 1279px)": () => {
    /* parallax × 0.5, tilt × 0.5 */
  },
  "(max-width: 767px)": () => {
    /* disable tilt, cursor, parallax; y: 20 reveals; disable Lenis */
  }
});
```

---

## 12. Easing Reference Table

| Use Case | GSAP Easing | CSS Equivalent |
|---|---|---|
| Standard reveal | `power2.out` | `cubic-bezier(0.0, 0.0, 0.58, 1.0)` |
| Hero words | `power3.out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Page transition | `expo.inOut` | `cubic-bezier(0.87, 0, 0.13, 1)` |
| Spring/elastic card | `elastic.out(1, 0.4)` | N/A (GSAP only) |
| Scroll scrub | `none` | `linear` |
| Overshoot bounce | `back.out(1.7)` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Clip reveal | `power3.out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Rule wipe | `expo.out` | `cubic-bezier(0.16, 1, 0.3, 1)` |

BANNED easings: `linear` (except scroll scrub), `ease-in-out` (generic), any duration-only opacity fade.
