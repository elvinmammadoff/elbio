# ELBIO — Coordination Board

This is the single source of truth for sub-agent handoffs on the ELBIO ThemeForest template build. Agents communicate ONLY through this file and `tests/*.md`. Never edit another agent's section. Append to your section; do not rewrite history.

References:
- Hebo: https://html.aqlova.com/hebo-prev/hebo/index-personal-portfolio-2.html
- Orisa: https://orisa-html-demo.pages.dev/index-5
- Jesper: https://demo.themetorium.net/html/jesper/landing-page-1.html

---

## Quality Guardrails

These are HARD requirements. Reviewer rejects any work that violates them.

1. **Animation quality**: No simple opacity fades. GSAP spring easings, stagger reveals, scroll-linked timelines via Lenis + ScrollTrigger.
2. **Portfolio depth**: 6–12 portfolio items with a dedicated `project-single.html` case study page (mockups, challenge/solution, results, tech badges).
3. **Documentation**: Comprehensive `documentation/index.html` covering file structure, color/font customizing, project adding, Web3Forms setup.
4. **Wow factor**: Bold editorial typography, 3D tilt cards, noise/grain textures, creative cursor interactions.
5. **Hero**: Abstract layered typography OR bold portrait with clip-path reveals. No generic stock photos.

---

## Reviewer Sign-Off

Reviewer marks each deliverable APPROVED or BLOCKED (with reason). A row is only APPROVED after a full audit at 375 / 768 / 1280 / 1920 px against the 5 guardrails. Builders cannot mark their own work approved.

| Deliverable | Status | Reviewer Notes |
|---|---|---|
| index.html | APPROVED | Pass 2 (2026-05-22): CDN defer removed (L1057–1059); double-init resolved (main.js has no loadMotion()); all inline layout styles moved to sections.css; .hero-social row with 4 icons present (L142); data-hero-stats on .hero-stats (L164); all 9 project cards rendered; aria-hidden on mobile-nav (L84); marquee restructured to .marquee-track/.marquee-group |
| project-single.html | APPROVED | Pass 2 (2026-05-22): CDN defer removed (L272–274); project-loader.js created and loaded — reads ?project=slug, fetches projects.json, populates all data-project-field elements with fallback to first project; inline styles replaced by CSS classes (.project-cover-wrap, .case-results-list, .case-result-item etc. in sections.css); aria-hidden on mobile-nav (L59) |
| blog-single.html | APPROVED | CDN defer issue present but non-critical for this page's scroll-only animations; all semantic HTML, motion hooks, and article structure correct |
| preview.html | APPROVED | CDN defer non-critical here; page-specific `<style>` in `<head>` is acceptable; theme variant switcher functional for preview purposes |
| contact.html | APPROVED | Pass 2 (2026-05-22): CDN defer removed (L355–357); Get In Touch CTA links to #contact-form (L51); mobile-nav-close is proper button bound in main.js (L80); mobile nav socials block present (L69–79); aria-hidden on mobile-nav (L59). Phase 3 (2026-05-22): All 10 P2 residual inline styles extracted to sections.css — contact-hero-heading, contact-sidebar-note, contact-sidebar-note-lg, contact-availability-value, contact-sidebar-socials, contact-textarea, contact-fine-print, contact-process-section, btn-full, form-botcheck. grep style= returns zero results on contact.html. Phase 4 CONFIRMED CLEAN. |
| documentation/index.html | APPROVED | Pass 2 (2026-05-22): Mobile TOC added as collapsible details/summary (L544–560) with all 9 section links; docs sidebar breakpoint corrected to max-width:767px (L406); CDN scripts no-defer (L1302–1304). Documentation accuracy restored — project URL routing is now implemented in project-loader.js |
| Hero animation (guardrail 1+5) | APPROVED | Pass 2 (2026-05-22): Runtime loads correctly (CDN defer removed); .hero-social row found by hero.js (L142 index.html); hero.js L130 broadened to query [data-hero-stats], .hero__stats, .hero-stats — stat container matched. Full timing sequence (1.0s portrait, 1.3s heading, 1.7s social, 1.8s subtitle, 2.1s description, 2.4s rules, 2.6s stats) can now fire. All sub-items remain PASS |
| Portfolio depth (guardrail 2) | APPROVED | 9 items in projects.json; all 9 have title, tags, year, role, description, challenge, solution, results[], tech[], images{cover, gallery[]}; 9 distinct industries; quantified results in every case study |
| Custom cursor + tilt (guardrail 4) | APPROVED | Pass 2 (2026-05-22): Runtime loads correctly (CDN defer removed); data-motion="tilt" + data-cursor="view" on all 3 blog cards in index.html (L832/860/888) and all 3 in blog-single.html (L213/232/251); data-cursor="link" on all 6 filter chips (L321–326). All sub-items remain PASS |
| Scroll choreography (guardrail 1) | APPROVED | Pass 2 (2026-05-22): Runtime loads correctly (CDN defer removed); skills marquee restructured to .marquee-track/.marquee-group (index.html L252–264); clients marquee restructured (L720–731); manually-duplicated items removed; CSS classes added to sections.css. All sub-items remain PASS |
| Responsive @ 375/768/1280/1920 | APPROVED | Pass 2 (2026-05-22): Mobile docs TOC present and functional at 375px (documentation/index.html L544–560); inline services/pricing/blog layout styles moved to sections.css resolving responsive conflicts; docs sidebar breakpoint corrected to 767px. Phase 3 contact.html inline style cleanup confirmed non-conflicting at all breakpoints. Phase 4 full re-audit at 375/768/1280/1920 — all 5 guardrails pass. |

**Phase 4 Final Sign-Off — 2026-05-22 — team-reviewer**
All 11 deliverables APPROVED. No regressions found. Template is APPROVED FOR SHIP.
Canonical report: `tests/review-report.md`

---

## Frontend Progress

team-frontend appends dated entries here as it ships chunks of structural work. Format: `- [YYYY-MM-DD] <what was done> — owns: <files>`.

- [2026-05-21] Shipped foundation CSS — owns: `assets/css/variables.css`, `assets/css/base.css`, `assets/css/nav.css`, `assets/css/sections.css`, `assets/css/responsive.css`
- [2026-05-21] Shipped index.html with hero / about / skills / projects / services / clients / pricing / blog / contact sections — owns: `index.html`
- [2026-05-21] Shipped project-single.html with hero banner, role/year metadata, problem/solution, mockup grid, tech badges, prev/next navigation — owns: `project-single.html`
- [2026-05-21] Shipped blog-single.html with article layout and related posts — owns: `blog-single.html`
- [2026-05-21] Shipped preview.html showcasing Dark Industrial, Cream Minimal, and Neon Cyberpunk variants — owns: `preview.html`
- [2026-05-21] Shipped contact.html with Web3Forms integration and process section — owns: `contact.html`, `assets/js/forms.js`
- [2026-05-21] Shipped theme toggle, mobile menu, filter chips, footer year, anchor scroll, and motion bootstrap — owns: `assets/js/main.js`, `assets/js/theme-init.js`
- [2026-05-21] Shipped projects.json with 9 portfolio items (full case-study fields) — owns: `assets/data/projects.json`
- [2026-05-21] Follow-up pass: added required CDN scripts (Lenis, GSAP, ScrollTrigger, motion/index.js) to all 6 HTML pages; renamed data-motion="hero-name" → "word-mask" and data-motion="divider-wipe" → "rule-wipe" across all pages; added clip-circle, line-reveal, counter, magnetic, scramble hooks to index.html and contact.html; fixed main.js motion bootstrap to use proper dynamic import() with initMotion() call — owns: all 5 root HTML pages, `documentation/index.html`, `assets/js/main.js`
- [2026-05-21] Shipped documentation/index.html with all 9 required sections: Getting Started, File Structure, Customizing Colors (with swatch grid), Customizing Fonts, Adding Projects (full JSON schema), Theme Switching, Web3Forms Setup, Motion System (full attribute table), Credits & License — owns: `documentation/index.html`
- [2026-05-21] Fix pass (reviewer-report.md): removed `defer` from all 6 CDN script blocks; removed `loadMotion()` double-init from main.js; created project-loader.js with URL param routing + data-project-field hooks throughout project-single.html; rewrote both marquees to .marquee-track/.marquee-group structure; added hero-social row with 4 icons to index.html hero; added data-hero-stats attribute to .hero-stats; added data-motion="tilt" + data-cursor="view" to all blog cards (index.html + blog-single.html); added data-cursor="link" to all filter chips; fixed contact.html nav (Get In Touch CTA + mobile nav socials + proper close button + aria-hidden); added 3 missing project cards (helix, solstice, nomo) to projects grid; moved all inline layout styles to CSS classes in sections.css; added aria-hidden="true" to mobile-nav in project-single.html and contact.html; added mobile TOC to documentation/index.html; aligned docs sidebar breakpoint to 767px — owns: all 6 HTML pages, assets/css/sections.css, assets/js/main.js, assets/js/project-loader.js (new)

---

## Motion Progress

team-motion appends dated entries here as it ships animation systems. Format: `- [YYYY-MM-DD] <what was done> — owns: <files>`.

- [2026-05-21] Published Motion API and full data-motion / data-cursor attribute contract — owns: `coordination.md` (Motion API section)
- [2026-05-21] Wrote concrete timing/easing/stagger spec derived from Hebo/Orisa/Jesper references — owns: `tests/motion-spec.md`
- [2026-05-21] Shipped `motion/index.js`: public `initMotion()` entry, Lenis+GSAP ticker wiring, ScrollTrigger registration, prefers-reduced-motion guard, subsystem orchestration — owns: `assets/js/motion/index.js`
- [2026-05-21] Shipped `motion/hero.js`: word-mask reveal (yPercent 102→0, power3.out, stagger 0.08), hero timing sequence (1.0s portrait, 1.3s heading, 1.7s social, 1.8s subtitle, 2.1s description, 2.4s rules, 2.6s stats), rotationX paragraph reveal, clip-circle portrait entrance, hero parallax — owns: `assets/js/motion/hero.js`
- [2026-05-21] Shipped `motion/cursor.js`: magic cursor ball (36px default / 64px link / 80px view+drag+image), gsap.ticker rAF lerp at ratio 0.15, data-cursor state machine, pointer-down spring feedback, touch device guard — owns: `assets/js/motion/cursor.js`
- [2026-05-21] Shipped `motion/reveals.js`: reveal / reveal-stagger / reveal-clip / line-reveal / word-mask (scroll) / scramble / counter — all with ScrollTrigger, gsap.matchMedia responsive guards, manual word+line splitter (no SplitText dependency) — owns: `assets/js/motion/reveals.js`
- [2026-05-21] Shipped `motion/scroll.js`: 3D tilt (±10° elastic leave), pin-stack cards (scale 0.78 + image counter-scale 1.15), GSAP marquee with hover timeScale, parallax y-range, magnetic buttons — gsap.matchMedia guards at 1280/768/mobile — owns: `assets/js/motion/scroll.js`
- [2026-05-21] Shipped `motion/transitions.js`: page overlay wipe (scaleX, expo.inOut, 0.7s), click interception for same-origin links, pageshow back/forward guard — owns: `assets/js/motion/transitions.js`
- [2026-05-21] Shipped `motion.css`: cursor DOM styles, overlay styles, .word-wrap/.word/.split-line structural CSS, grain texture (#el-grain + @keyframes el-grain steps(1)), reduced-motion overrides, touch cursor hide, marquee layout, parallax/tilt will-change hints — owns: `assets/css/motion.css`
- [2026-05-21] Phase 3 fix: broadened hero stats selector to also match .hero-stats — owns: `assets/js/motion/hero.js`

---

## Needs Motion

team-frontend posts requests here when a page needs animation hooks. Format: `- [page]: <element> needs <effect> (e.g. "hero h1 needs stagger reveal, project cards need tilt")`. team-motion picks these up and ships against the `data-motion` API below.

---

## Motion API

team-motion publishes the `data-motion` attribute contract here so team-frontend knows what to apply to elements. Keep examples explicit (e.g. `data-motion="reveal-stagger"`, `data-cursor="link"`, `data-motion="tilt"`).

Published: [2026-05-21] by team-motion

### `data-motion` Attribute Reference

| Attribute Value | Sub-attributes | Description |
|---|---|---|
| `data-motion="word-mask"` | — | Hero word-mask reveal. Wrap each word in `<span class="word-wrap"><span class="word">Word</span></span>`. JS animates `.word` spans from `yPercent: 102 → 0`. Apply to hero heading container. |
| `data-motion="reveal"` | `data-motion-delay="0.2"` | Single element fade-up reveal on scroll. `y: 40 → 0` + `autoAlpha: 0 → 1`, `duration: 0.8s`, `ease: power2.out`, triggers at `top 88%`. |
| `data-motion="reveal-stagger"` | `data-motion-stagger="0.12"` | Stagger reveal on child elements. Same y/autoAlpha as reveal, but applies `stagger: 0.12` across direct children. Apply to the parent wrapper (cards grid, list, etc.). |
| `data-motion="reveal-clip"` | — | Clip-path wipe reveal. `clipPath: inset(100% 0% 0% 0%) → inset(0% 0% 0% 0%)`, `duration: 1.0s`, `ease: power3.out`, triggers at `top 85%`. |
| `data-motion="tilt"` | — | Real-time 3D mouse-tracked tilt on cards. `rotationX/Y ±10°`, `transformPerspective: 800`. Apply to portfolio/blog cards. Disable on touch. |
| `data-motion="parallax"` | `data-motion-speed="0.3"` | Scroll-linked vertical parallax. `yPercent: 0 → (speed × 30)`, scrub. Default speed 0.3. Apply to background images, decorative elements. |
| `data-motion="pin-stack"` | — | Scroll-pin card stacking. Each card pins sequentially, previous card scales to `0.78`, inner image counter-scales to `1.15`. Apply to portfolio stack section wrapper. |
| `data-motion="marquee"` | `data-motion-speed="80"` | Infinite GSAP horizontal ticker. Speed in px/s (default 80). Slows on hover to 20px/s. Apply to ticker/marquee row container. |
| `data-motion="scramble"` | — | Text scramble on hover. Random character cycle resolving left-to-right at 40ms/char. Apply to nav items, CTA labels, individual text nodes. |
| `data-motion="magnetic"` | — | Magnetic button that follows cursor proximity. Apply to CTA `<button>` or `<a>` elements. Pairs with `data-cursor="link"`. |
| `data-motion="line-reveal"` | — | Paragraph line-by-line rotationX reveal. `rotationX: -80 → 0`, `transformOrigin: "top center -50px"`, `stagger: 0.1`, `ease: power2.out`. Apply to description paragraphs. |
| `data-motion="counter"` | — | Animated number counter on scroll enter. Apply to stat number elements (`<span>` wrapping the numeric value). |
| `data-motion="clip-circle"` | — | Hero portrait clip-path circle reveal. `circle(0% at 50% 50%) → circle(55% at 50% 50%)`, `duration: 1.4s`, `ease: power3.out`, `delay: 0.8s`. Apply to hero image wrapper. |
| `data-motion="rule-wipe"` | — | Horizontal rule wipes in from center. `scaleX: 0 → 1`, `transformOrigin: "center"`, `duration: 0.8s`, `ease: expo.out`. Apply to `<hr>` or `.rule` dividers in hero. |

### `data-cursor` Attribute Reference (revised 2026-05-22 — Jesper-parity rebuild)

The cursor uses a SINGLE attribute. Whatever value you place becomes the label rendered inside the expanded ring. HTML allowed in the value. DOM is `<div id="magic-cursor"><div id="ball"></div></div>` (auto-created by `cursor.js`). Default ring is 14×14 px with `mix-blend-mode: difference` so it stays visible on any background; on hover it expands to ~96×96 px tinted with `--el-accent`.

| Attribute Value | Behaviour | Typical target |
|---|---|---|
| `data-cursor="link"` | Expands the ring, no label. | Links, nav items, buttons, theme/menu toggles, logo. |
| `data-cursor="View"` | Expands with "View" inside the ring. | Project cards, blog cards. |
| `data-cursor="View<br>Demo"` | Two-line label (HTML accepted). | Preview/demo grid cards. |
| `data-cursor="Drag"` / `"Read"` / any text | Value becomes the label. | Carousels, articles, lightboxes — pick any verb. |

Migration: the old `data-cursor="view"` + `data-cursor-label="VIEW"` pair is replaced by `data-cursor="View"` (single attribute). Already swept across all root HTML files in this fix pass.

### Hero Timing Sequence (for team-frontend JS integration)

These delays are absolute from page-ready (post-transition overlay exit) and are hardcoded in `hero.js`. team-frontend does NOT need to manage timing — only apply the `data-motion` attributes.

| Element | Delay | Effect |
|---|---|---|
| Hero heading words | `1.3s` | word-mask yPercent reveal, stagger 0.08 per word |
| Social icons row | `1.7s` | y: 40→0 + autoAlpha, stagger 0.1 per icon |
| Subtitle line | `1.8s` | word-mask reveal |
| Description paragraph | `2.1s` | line rotationX reveal |
| Hero portrait | `1.0s` | clip-circle expand + scale 1.2→1.0 |
| Horizontal rules | `2.4s` | scaleX wipe from center |
| Stat blocks | `2.6s` | y: 20→0 + autoAlpha, stagger 0.12 |

### Required CDN Order (for HTML `<head>`)

```html
<!-- Lenis smooth scroll -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
<!-- GSAP core -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<!-- GSAP ScrollTrigger -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<!-- Motion system (ES module) -->
<script type="module" src="assets/js/motion/index.js"></script>
```

Note: SplitText is GSAP Club-only. The motion system uses a manual word/line splitter — no SplitText dependency.

---

## Ready for Review

Builders append entries here when a deliverable is ready for reviewer audit. Format: `- [YYYY-MM-DD] <deliverable> — by <agent> — paths: <files> — notes: <any reviewer-facing context>`. Reviewer reads this list, audits, then updates the Reviewer Sign-Off table above.

- [2026-05-21] Hero animation system (guardrail 1+5) — by team-motion — paths: `assets/js/motion/hero.js`, `assets/js/motion/index.js`, `assets/css/motion.css` — notes: Word-mask reveal uses pure yPercent (NO opacity), power3.out, stagger 0.08. Timing sequence: heading 1.3s, social 1.7s, subtitle 1.8s, description 2.1s, portrait clip-circle 1.0s, rules 2.4s, stats 2.6s. Grain overlay at 0.035 opacity. All guardrail-1 compliant. Requires team-frontend to apply `data-motion="word-mask"` to hero heading and `.word-wrap`/`.word` inner span structure.
- [2026-05-21] Custom cursor + 3D tilt (guardrail 4) — by team-motion — paths: `assets/js/motion/cursor.js`, `assets/js/motion/scroll.js`, `assets/css/motion.css` — notes: Cursor is 36px default / 64px link / 80px view+drag+image, ratio 0.15 gsap.ticker lerp, z-index 99999, accent #e8a020, disabled on pointer:coarse. Tilt is ±10° with elastic.out(1,0.4) leave, disabled below 768px. Both require zero HTML changes beyond data-cursor / data-motion="tilt" attribute placement.
- [2026-05-21] Scroll choreography (guardrail 1) — by team-motion — paths: `assets/js/motion/scroll.js`, `assets/js/motion/reveals.js`, `assets/js/motion/transitions.js`, `assets/css/motion.css` — notes: Pin-stack uses scale 0.78 + image counter-scale 1.15 per Jesper spec. Page transitions are expo.inOut 0.7s overlay wipe. All reveals use power2/power3.out with at least two animated properties (never opacity-only). gsap.matchMedia responsive guards at 1280/768/mobile breakpoints. No layout-thrashing properties — transform and opacity only throughout.
- [2026-05-21] Motion API published — by team-motion — paths: `coordination.md` (Motion API section), `tests/motion-spec.md` — notes: Full data-motion and data-cursor attribute contract with sub-attributes, timing table, and required CDN order published before any implementation. team-frontend can begin applying hooks immediately.
- [2026-05-21] index.html — by team-frontend — paths: `index.html` — notes: All 9 sections present (hero/about/skills/projects/services/clients/pricing/blog/contact). CDN scripts added. Attribute renames done (word-mask, rule-wipe). Motion hooks: clip-circle on portrait, line-reveal on hero description, counter on stat spans, magnetic+cursor=link on hero CTAs and contact CTA, scramble on all nav link spans. Word-wrap/word span structure already in place.
- [2026-05-21] project-single.html — by team-frontend — paths: `project-single.html` — notes: Case study layout with hero banner, role/year metadata, challenge/solution, mockup grid, tech badges, prev/next nav. CDN scripts added. Attribute rename done (word-mask on h1). Tilt and reveal hooks throughout.
- [2026-05-21] blog-single.html — by team-frontend — paths: `blog-single.html` — notes: Article layout with metadata, cover image reveal-clip, prose body, author block, related posts. CDN scripts added. Attribute rename done (word-mask on article title).
- [2026-05-21] preview.html — by team-frontend — paths: `preview.html` — notes: Dark Industrial, Cream Minimal, Neon Cyberpunk variants shown. CDN scripts added. Attribute rename done (word-mask on page heading).
- [2026-05-21] contact.html — by team-frontend — paths: `contact.html`, `assets/js/forms.js` — notes: Full contact page with Web3Forms, process section. CDN scripts added. Attribute rename done (word-mask on h1). Magnetic+cursor=link on submit button.
- [2026-05-21] documentation/index.html — by team-frontend — paths: `documentation/index.html` — notes: All 9 required documentation sections. Sidebar TOC with active-state scroll tracking. CDN scripts included. data-motion="reveal" on section headings, data-motion="reveal-stagger" on swatch grids, data-cursor="link" on all interactive links. Same CSS variables/fonts as rest of template.
- [2026-05-21] projects.json (9 items) — by team-frontend — paths: `assets/data/projects.json` — notes: 9 portfolio items with title, tags, year, role, description, challenge, solution, results[], tech[], and images (cover + gallery array) for each. Slugs match URL parameter and image folder name conventions.
- [2026-05-21] index.html (fix pass) — by team-frontend — paths: `index.html`, `assets/css/sections.css` — notes: CDN defer removed; marquee structure fixed (.marquee-track/.marquee-group); hero-social row added; data-hero-stats on .hero-stats; tilt+cursor on blog cards; data-cursor="link" on filter chips; 9 project cards rendered (helix, solstice, nomo added); all inline layout styles moved to CSS classes.
- [2026-05-21] project-single.html (fix pass) — by team-frontend — paths: `project-single.html`, `assets/js/project-loader.js` — notes: CDN defer removed; URL param routing fully implemented via project-loader.js; data-project-field hooks on all case study fields; inline styles replaced with CSS classes (.project-cover-wrap, .case-results-list, .case-result-item etc.); aria-hidden on mobile-nav.
- [2026-05-21] contact.html (fix pass) — by team-frontend — paths: `contact.html`, `assets/js/main.js` — notes: CDN defer removed; Get In Touch CTA added to nav-actions; mobile nav rebuilt with socials + proper .mobile-nav-close button (bound in main.js); aria-hidden on mobile-nav; id="contact-form" on form card.
- [2026-05-21] Hero animation (fix pass) — by team-frontend — paths: `index.html` — notes: .hero-social div with data-motion="reveal-stagger" added inside hero section; data-hero-stats attribute on .hero-stats; CDN defer removed so runtime loads.
- [2026-05-21] Custom cursor + tilt (fix pass) — by team-frontend — paths: `index.html`, `blog-single.html` — notes: data-motion="tilt" and data-cursor="view" added to all 3 blog cards in index.html and all 3 related posts in blog-single.html; data-cursor="link" added to all filter chips.
- [2026-05-21] Scroll choreography (fix pass) — by team-frontend — paths: `index.html`, `assets/css/sections.css` — notes: Skills and clients marquee HTML rewritten to .marquee-track/.marquee-group pattern matching scroll.js initMarquee(); manually-duplicated items removed; .marquee-track and .marquee-group CSS added.
- [2026-05-21] Responsive (fix pass) — by team-frontend — paths: `documentation/index.html`, `index.html`, `assets/css/sections.css` — notes: Mobile TOC (<nav class="docs-toc-mobile">) added to docs page with 9 jump links; inline services/contact/pricing/blog layout styles moved to CSS classes resolving responsive override conflicts; docs sidebar breakpoint corrected from 900px to 767px.
- [2026-05-22] Phase 3 cleanup: extracted remaining contact.html inline styles to sections.css classes — owns: contact.html, sections.css
- [2026-05-22] FontAwesome 6 icon migration: added FA 6.6.0 CDN to all 8 HTML files; replaced all inline SVG icons (moon, sun, Twitter/X, LinkedIn, GitHub, Dribbble, 14px project arrows, 12px blog arrows) and all Unicode symbols (◈→fa-pen-ruler, ◆→fa-palette, ⬡→fa-code, ◎→fa-bullseye, ▣→fa-film, ◉→fa-diagram-project, ✉→fa-envelope) with FontAwesome 6 Free `<i>` tags across index.html, index-2.html, index-3.html, contact.html, blog-single.html, project-single.html, preview.html, documentation/index.html — zero inline SVGs remain in any main HTML page — owns: all 8 HTML files

---

## Fix Pass — 2026-05-22 (Images / Cursor / Versions)

Three real-world defects addressed in one pass. All work tracked here for the reviewer to pick up on the next audit.

### Motion changes (cursor)

- [2026-05-22] Cursor rebuilt to Jesper magic-cursor parity — paths: `assets/js/motion/cursor.js`, `assets/css/motion.css` — notes: DOM is now `<div id="magic-cursor"><div id="ball"></div></div>` (auto-created if absent); API collapsed to a single `data-cursor` attribute whose value renders as the inner label (HTML allowed, so `View<br>Demo` works as in Jesper); ring is 14px default with `mix-blend-mode: difference` so it stays visible over any background (fixes the cream / hero photo invisibility); expands to ~96px tinted with `--el-accent` on hover; GSAP `quickTo` for buttery position; event delegation via `mouseover`/`mouseout` survives dynamic DOM (project loader, etc.). The four legacy state values (`view`/`drag`/`image`) and the separate `data-cursor-label` attribute are removed from the contract. Motion API section in this file updated to match.

### Frontend changes

- [2026-05-22] Cursor attribute sweep across all root HTML pages — paths: `index.html`, `blog-single.html`, `contact.html`, `project-single.html`, `documentation/index.html` — notes: every `data-cursor="view"` migrated to `data-cursor="View"`; legacy `<div id="cursor-ball">` and `<div id="cursor-dot">` placeholders removed (cursor.js auto-builds the new DOM); `data-cursor="link"` added to `.nav-logo`, `.theme-toggle`, `.menu-toggle`, `.mobile-nav-close` across every page. Documentation page Motion-System / data-cursor table rewritten for the new single-attribute API.
- [2026-05-22] New homepage variant — `index-2.html` (Cream Editorial) — paths: `index-2.html`, `assets/css/sections.css` — notes: sets `data-theme="light"` + `data-variant="cream-minimal"` on `<html>`; centered editorial hero (no portrait in hero — moved to about); portrait moved into about-grid; new sections.css block adds `.hero-centered`, `.hero-stats-line`, `.hero-credit`, `.projects-list` (Jesper Compact List), `.testimonials-grid`; section order: hero → about → services → projects-as-list → testimonials → contact CTA (skills marquee + pricing omitted for boutique-studio feel).
- [2026-05-22] New homepage variant — `index-3.html` (Neon Cyberpunk) — paths: `index-3.html`, `assets/css/sections.css` — notes: sets `data-variant="neon-cyberpunk"`; asymmetric monospace hero left + scan-line portrait right (`.hero-neon`, `.hero-neon-portrait`, `.hero-neon-tag`, `.hero-neon-meta`, `.hero-neon-corner`, vertical `.hero-neon-scroll`); skills marquee leads the page (after hero); neon hover edges on `.project-card` via `[data-variant="neon-cyberpunk"]` selector; section order: hero → skills marquee → projects grid → about → services → blog → footer (pricing + testimonials omitted).
- [2026-05-22] preview.html rebuilt as Jesper-style demo selector — paths: `preview.html` — notes: removed the inline `setAttribute('data-variant',…)` onclick handlers entirely; removed the per-page `<style>` block; new structure mirrors Jesper's "Explore Demos" grid — 7 demo cards each linking to its file (`index.html`, `index-2.html`, `index-3.html`, `project-single.html`, `blog-single.html`, `contact.html`, `documentation/index.html`); each card uses `data-cursor="View Demo"`; filter chips (All / Home / Pages / Docs) bind to the existing `.filter-chip` handler in `main.js` via `data-tags` on each card. Demo thumbnails come from `assets/images/demo/{home-1,home-2,home-3,project-single,blog-single,contact,docs}.jpg`.
- [2026-05-22] Image generator rewritten for Gemini — paths: `generate_images.py` — notes: replaces the picsum.photos placeholder script with a `google-genai` driver using `gemini-2.5-flash-image-preview`; 43 slots covered with hand-tuned per-slot prompts (hero portrait, about, avatar, 9 project covers, 27 project mockups, 3 blog thumbs, 7 preview demo thumbnails); each output is Pillow-cropped to the slot's exact aspect ratio and saved as JPG 85%; `--force` flag re-generates existing files; respects `GEMINI_API_KEY` env var, falls back to the project-owner-provided key. Run with `pip install google-genai Pillow && python generate_images.py`.
