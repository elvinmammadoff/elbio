#!/usr/bin/env python3
"""
ELBIO image generator — uses Google's Gemini native image generation
(gemini-2.5-flash-image-preview) to produce every image referenced by the
template with a context-appropriate prompt per slot.

Usage:
    pip install google-genai Pillow
    python generate_images.py             # generates only missing files
    python generate_images.py --force     # regenerates every file
    python generate_images.py --only lumora-saas-dashboard   # filter by substring

The script reads GEMINI_API_KEY from the environment and falls back to the
key the project owner shared. Output is saved as JPG at 85% quality with a
per-slot crop/resize so layouts don't shift.
"""
from __future__ import annotations

import argparse
import io
import os
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

try:
    from google import genai
    from google.genai import types as genai_types
except ImportError:
    sys.exit("Install dependencies first: pip install google-genai Pillow")

try:
    from PIL import Image
except ImportError:
    sys.exit("Install dependencies first: pip install google-genai Pillow")

BASE_DIR = Path(__file__).resolve().parent / "assets" / "images"
MODEL = "gemini-3.1-flash-image-preview"

# The owner shared this key explicitly for this script.
DEFAULT_KEY = "AIzaSyBPG4nLBncc4hAVwGTFSY3HACbKvomB7CQ"

# Shared style suffix appended to every prompt so the set feels coherent.
STYLE_SUFFIX = (
    " Premium ThemeForest portfolio aesthetic, editorial composition, "
    "natural lighting, shallow depth of field, fine grain, "
    "high resolution, no text overlays, no watermarks, no logos."
)


@dataclass
class Slot:
    rel_path: str       # relative to BASE_DIR
    prompt: str         # creative direction
    size: tuple[int, int]  # final (w, h) — Pillow resizes/crops to this
    category: str       # for filtering


# ---------------------------------------------------------------------------
# Slot registry — 43 images
# ---------------------------------------------------------------------------

SLOTS: list[Slot] = [
    # Hero + identity
    Slot(
        "hero-portrait.jpg",
        "Cinematic moody portrait of a young male creative designer in his "
        "early thirties, side-lit by a single warm tungsten lamp, shot on "
        "Hasselblad 80mm, deep shadows, neutral charcoal-grey background, "
        "wearing a black turtleneck, three-quarter angle, gazing slightly "
        "off camera, editorial portrait photography reminiscent of a "
        "designer profile in It's Nice That magazine." + STYLE_SUFFIX,
        (1200, 1500),
        "identity",
    ),
    Slot(
        "about-photo.jpg",
        "Behind-the-scenes wide shot of a designer's studio: a person seen "
        "from behind seated at a clean wooden desk, two large monitors "
        "showing abstract design work, natural window light from the left, "
        "houseplants, neutral muted palette of warm greys and bone white, "
        "documentary editorial style, candid working moment." + STYLE_SUFFIX,
        (1400, 1000),
        "identity",
    ),
    Slot(
        "avatar.jpg",
        "Square headshot portrait of a friendly male creative designer, "
        "early thirties, soft natural light, neutral grey background, "
        "subtle smile, sharp focus on eyes, editorial headshot, "
        "shot at 85mm." + STYLE_SUFFIX,
        (800, 800),
        "identity",
    ),

    # Project covers (9)
    Slot(
        "projects/lumora-saas-dashboard/cover.jpg",
        "Isometric mockup of a B2B SaaS analytics dashboard floating on a "
        "deep navy background, multiple chart components visible (bar "
        "charts, line graphs, KPI cards), soft volumetric drop shadow, "
        "purple-to-blue gradient accent, clean Inter typography, premium "
        "product shot for a fintech portfolio case study." + STYLE_SUFFIX,
        (1600, 900),
        "lumora-saas-dashboard",
    ),
    Slot(
        "projects/vanta-brand-identity/cover.jpg",
        "Flat-lay brand identity stationery shot on warm cream paper: "
        "business cards, embossed logo mark in muted amber gold, letterhead, "
        "geometric brand pattern, condensed display typography, soft window "
        "light from the upper left, cybersecurity startup brand identity "
        "with unusual warm palette, art-directed top-down photograph." + STYLE_SUFFIX,
        (1600, 900),
        "vanta-brand-identity",
    ),
    Slot(
        "projects/forma-ecommerce/cover.jpg",
        "Editorial e-commerce product hero: a single walnut lounge chair "
        "photographed in a sunlit minimalist gallery space, polished "
        "concrete floor, soft directional light, deep oak tones, premium "
        "luxury furniture catalogue photography, oversized white negative "
        "space at the top for headline." + STYLE_SUFFIX,
        (1600, 900),
        "forma-ecommerce",
    ),
    Slot(
        "projects/meridian-mobile-app/cover.jpg",
        "Three iPhone 15 Pro mockups floating on a soft sage-green "
        "gradient background, displaying a travel planning app interface "
        "with map view, itinerary cards, and discovery feed, slight "
        "perspective angle, soft shadow beneath each phone, premium "
        "Apple-style product photography." + STYLE_SUFFIX,
        (1600, 900),
        "meridian-mobile-app",
    ),
    Slot(
        "projects/atlas-design-system/cover.jpg",
        "Overhead view of a design system component library on a Figma "
        "canvas: organized grid of buttons, input fields, navigation "
        "components, color tokens, and typography scales, light grey "
        "background, technical and structured, clean grid, vector flat "
        "design illustration in muted teal and slate." + STYLE_SUFFIX,
        (1600, 900),
        "atlas-design-system",
    ),
    Slot(
        "projects/grove-editorial/cover.jpg",
        "Open spread of a printed independent design magazine on a warm "
        "linen tablecloth, expressive variable-font typography, large "
        "drop cap, full-bleed editorial photo on one page, cream paper "
        "stock, soft natural window light, magazine still-life "
        "photography reminiscent of Apartamento or Cereal." + STYLE_SUFFIX,
        (1600, 900),
        "grove-editorial",
    ),
    Slot(
        "projects/helix-fintech/cover.jpg",
        "Three smartphone screens floating in a soft mint-green gradient "
        "space, showing a fintech onboarding flow with timeline metaphor, "
        "step progress indicators, and reassuring micro-illustrations, "
        "soft drop shadows, calming color palette of mint and pearl "
        "white, premium banking app product shot." + STYLE_SUFFIX,
        (1600, 900),
        "helix-fintech",
    ),
    Slot(
        "projects/solstice-wellness-app/cover.jpg",
        "Soft pastel mobile app interface for a meditation app, "
        "displayed on a phone resting on a smooth river stone, dappled "
        "morning light, eucalyptus leaves nearby, peach and lavender "
        "gradient screen, serene wellness brand mood, lifestyle product "
        "photography." + STYLE_SUFFIX,
        (1600, 900),
        "solstice-wellness-app",
    ),
    Slot(
        "projects/nomo-restaurant-web/cover.jpg",
        "Dark moody hero image for a luxury omakase restaurant website: "
        "macro shot of a single piece of nigiri sushi on a black slate "
        "plate, golden brushstroke garnish, single overhead spotlight, "
        "deep black background, cinematic food photography reminiscent "
        "of Chef's Table." + STYLE_SUFFIX,
        (1600, 900),
        "nomo-restaurant-web",
    ),

    # Project mockups — 3 per slug, 27 total
    # Lumora
    Slot(
        "projects/lumora-saas-dashboard/mockup-01.jpg",
        "Full laptop screenshot of a SaaS marketing analytics overview "
        "dashboard, multiple chart widgets (line, bar, donut), KPI tiles "
        "across the top, side navigation in dark mode, purple-blue "
        "accent color, soft Macbook bezel visible, photographed on a "
        "concrete desk with natural light." + STYLE_SUFFIX,
        (1600, 1000),
        "lumora-saas-dashboard",
    ),
    Slot(
        "projects/lumora-saas-dashboard/mockup-02.jpg",
        "Detail screenshot of a campaign drill-down panel from a SaaS "
        "analytics tool, showing a single channel breakdown with "
        "expandable rows, deep navy interface, white cards with subtle "
        "shadows, data table view, professional B2B SaaS UI." + STYLE_SUFFIX,
        (1600, 1000),
        "lumora-saas-dashboard",
    ),
    Slot(
        "projects/lumora-saas-dashboard/mockup-03.jpg",
        "Alert triage view from a B2B SaaS dashboard, list of system "
        "alerts with severity indicators (red, amber, green), action "
        "recommendations panel on the right, dark UI, accent purple, "
        "professional enterprise software." + STYLE_SUFFIX,
        (1600, 1000),
        "lumora-saas-dashboard",
    ),
    # Vanta
    Slot(
        "projects/vanta-brand-identity/mockup-01.jpg",
        "Brand identity guidelines page on cream paper showing the Vanta "
        "logo construction grid, geometric circular mark in warm amber, "
        "color palette swatches, condensed display typography specimen, "
        "art-directed flat-lay." + STYLE_SUFFIX,
        (1600, 1000),
        "vanta-brand-identity",
    ),
    Slot(
        "projects/vanta-brand-identity/mockup-02.jpg",
        "Cybersecurity startup website hero section mockup on a desktop "
        "browser, warm amber accent on dark background, large condensed "
        "headline, minimal geometric graphics, premium B2B SaaS marketing "
        "page design." + STYLE_SUFFIX,
        (1600, 1000),
        "vanta-brand-identity",
    ),
    Slot(
        "projects/vanta-brand-identity/mockup-03.jpg",
        "Editorial-style brand book cover photographed at an angle on a "
        "wooden desk, debossed amber logo on charcoal cloth cover, soft "
        "natural light, premium brand identity deliverable." + STYLE_SUFFIX,
        (1600, 1000),
        "vanta-brand-identity",
    ),
    # Forma
    Slot(
        "projects/forma-ecommerce/mockup-01.jpg",
        "Luxury furniture e-commerce product detail page on a desktop "
        "browser, large hero image of a walnut lounge chair, material "
        "swatches gallery below, premium serif typography, generous "
        "whitespace, clean editorial layout." + STYLE_SUFFIX,
        (1600, 1000),
        "forma-ecommerce",
    ),
    Slot(
        "projects/forma-ecommerce/mockup-02.jpg",
        "Build-your-room configurator interface mockup with three "
        "vertical material columns: oak, walnut, ash — each showing a "
        "tactile texture swatch, drag handles between, premium clean "
        "e-commerce UI." + STYLE_SUFFIX,
        (1600, 1000),
        "forma-ecommerce",
    ),
    Slot(
        "projects/forma-ecommerce/mockup-03.jpg",
        "Simplified three-step checkout flow mockup for a luxury "
        "furniture site, large product thumbnails, minimal form fields, "
        "warm beige background, premium serif headlines, photographed "
        "on a tablet on a marble surface." + STYLE_SUFFIX,
        (1600, 1000),
        "forma-ecommerce",
    ),
    # Meridian
    Slot(
        "projects/meridian-mobile-app/mockup-01.jpg",
        "iPhone screenshot mockup of a travel planning app in Plan mode: "
        "day-by-day itinerary with vertical time-block cards, sage and "
        "white interface, soft drop shadows, smooth corners." + STYLE_SUFFIX,
        (1200, 1600),
        "meridian-mobile-app",
    ),
    Slot(
        "projects/meridian-mobile-app/mockup-02.jpg",
        "iPhone screenshot of a travel app Explore mode: a map view with "
        "discovery cards overlaid at the bottom, soft sage-green map "
        "tiles, white card UI, location pins, mobile-first UI." + STYLE_SUFFIX,
        (1200, 1600),
        "meridian-mobile-app",
    ),
    Slot(
        "projects/meridian-mobile-app/mockup-03.jpg",
        "iPhone screenshot showing an itinerary screen with one "
        "highlighted discovery card revealing a contextual time-block "
        "link, soft pastel UI, premium iOS interaction design." + STYLE_SUFFIX,
        (1200, 1600),
        "meridian-mobile-app",
    ),
    # Helix
    Slot(
        "projects/helix-fintech/mockup-01.jpg",
        "Mobile screenshot of a fintech KYC onboarding landing screen: "
        "vertical timeline metaphor showing the steps ahead, calming "
        "mint-green color palette, plain-language microcopy, reassuring "
        "tone." + STYLE_SUFFIX,
        (1200, 1600),
        "helix-fintech",
    ),
    Slot(
        "projects/helix-fintech/mockup-02.jpg",
        "Mobile screenshot of a document upload step in a banking app: "
        "ID-card scan camera frame, progress dots at the top, "
        "encouraging microcopy, mint and pearl color palette." + STYLE_SUFFIX,
        (1200, 1600),
        "helix-fintech",
    ),
    Slot(
        "projects/helix-fintech/mockup-03.jpg",
        "Mobile screenshot of an 'awaiting review' confirmation screen "
        "with a friendly micro-win card revealed below, soft confetti "
        "graphic, mint-green palette, banking onboarding success state." + STYLE_SUFFIX,
        (1200, 1600),
        "helix-fintech",
    ),
    # Grove
    Slot(
        "projects/grove-editorial/mockup-01.jpg",
        "Independent digital magazine homepage layout shown on a "
        "desktop browser: bespoke issue grid skin, expressive serif "
        "typography, large editorial photography, cream background, "
        "art-directed layout reminiscent of Apartamento or The "
        "Gentlewoman." + STYLE_SUFFIX,
        (1600, 1000),
        "grove-editorial",
    ),
    Slot(
        "projects/grove-editorial/mockup-02.jpg",
        "Editorial article reading view mockup with variable-font "
        "typography increasing in weight as the reader scrolls, "
        "full-bleed photograph at the top, drop cap, cream paper texture." + STYLE_SUFFIX,
        (1600, 1000),
        "grove-editorial",
    ),
    Slot(
        "projects/grove-editorial/mockup-03.jpg",
        "Full-bleed editorial image with a small caption set in italic "
        "serif, slow-living craft aesthetic, warm muted color grading, "
        "magazine reading layout." + STYLE_SUFFIX,
        (1600, 1000),
        "grove-editorial",
    ),
    # Atlas
    Slot(
        "projects/atlas-design-system/mockup-01.jpg",
        "Overhead view of a component library grid in a design tool: "
        "buttons in many states, input fields, selects, badges, organized "
        "in a tidy grid, light grey background, technical clean "
        "documentation style." + STYLE_SUFFIX,
        (1600, 1000),
        "atlas-design-system",
    ),
    Slot(
        "projects/atlas-design-system/mockup-02.jpg",
        "Figma design token panel screenshot showing color tokens, "
        "spacing scale, type scale, all organized by category, dark "
        "Figma UI, technical mood." + STYLE_SUFFIX,
        (1600, 1000),
        "atlas-design-system",
    ),
    Slot(
        "projects/atlas-design-system/mockup-03.jpg",
        "Storybook component documentation page screenshot with a live "
        "interactive button example at the top and its prop table below, "
        "clean technical documentation layout." + STYLE_SUFFIX,
        (1600, 1000),
        "atlas-design-system",
    ),
    # Solstice
    Slot(
        "projects/solstice-wellness-app/mockup-01.jpg",
        "Mobile screenshot of a wellness app's one-tap meditation "
        "launcher: a single large soft circular button, calming peach "
        "and lavender gradient background, minimal UI." + STYLE_SUFFIX,
        (1200, 1600),
        "solstice-wellness-app",
    ),
    Slot(
        "projects/solstice-wellness-app/mockup-02.jpg",
        "Mobile screenshot of a meditation timer with a soothing "
        "expanding-circle breath visualization at the center, soft "
        "pastel gradient, minimal text." + STYLE_SUFFIX,
        (1200, 1600),
        "solstice-wellness-app",
    ),
    Slot(
        "projects/solstice-wellness-app/mockup-03.jpg",
        "Mobile screenshot of an ambient nudge notification in a "
        "wellness app: a soft toast card at the top with gentle "
        "microcopy, peach gradient background." + STYLE_SUFFIX,
        (1200, 1600),
        "solstice-wellness-app",
    ),
    # Nomo
    Slot(
        "projects/nomo-restaurant-web/mockup-01.jpg",
        "Cinematic dark restaurant website hero on a laptop: full-bleed "
        "macro food photograph of sushi, large serif title overlay, "
        "black background, premium hospitality web design." + STYLE_SUFFIX,
        (1600, 1000),
        "nomo-restaurant-web",
    ),
    Slot(
        "projects/nomo-restaurant-web/mockup-02.jpg",
        "Single still frame from a slow-motion food video essay: macro "
        "shot of soy sauce being drizzled over fish, motion blur, "
        "dramatic side light, cinematic dark food photography." + STYLE_SUFFIX,
        (1600, 1000),
        "nomo-restaurant-web",
    ),
    Slot(
        "projects/nomo-restaurant-web/mockup-03.jpg",
        "Reservation booking embed on a dark restaurant website, "
        "minimal date picker and party size selector, gold accent "
        "color, deep black background, luxury hospitality web UI." + STYLE_SUFFIX,
        (1600, 1000),
        "nomo-restaurant-web",
    ),

    # Blog thumbnails (3)
    Slot(
        "blog/post-01.jpg",
        "Abstract minimalist illustration of a design-system component "
        "hierarchy: a vertical tree of soft geometric shapes connecting "
        "by thin lines on a warm cream background, editorial article "
        "header image." + STYLE_SUFFIX,
        (1600, 1000),
        "blog",
    ),
    Slot(
        "blog/post-02.jpg",
        "Macro photograph of metal letterpress type specimens arranged "
        "in a wooden tray, deep shadows, warm tungsten light, editorial "
        "typography article cover, premium magazine feel." + STYLE_SUFFIX,
        (1600, 1000),
        "blog",
    ),
    Slot(
        "blog/post-03.jpg",
        "Long-exposure photograph of light trails forming a horizontal "
        "timeline-like streak on a dark background, abstract motion-design "
        "metaphor, editorial article cover for a piece about animation." + STYLE_SUFFIX,
        (1600, 1000),
        "blog",
    ),

    # Demo grid thumbnails for preview.html (7)
    Slot(
        "demo/home-1.jpg",
        "Dark moody portfolio website hero screenshot displayed on a "
        "modern desktop browser, large editorial serif heading, portrait "
        "photo on the right, warm amber accent, photographed at an "
        "angle, premium ThemeForest demo card thumbnail." + STYLE_SUFFIX,
        (1600, 1000),
        "demo",
    ),
    Slot(
        "demo/home-2.jpg",
        "Cream-colored editorial portfolio website hero on a modern "
        "desktop browser, centered serif name as the hero, warm beige "
        "background, gallery-like minimal layout, premium ThemeForest "
        "demo card thumbnail." + STYLE_SUFFIX,
        (1600, 1000),
        "demo",
    ),
    Slot(
        "demo/home-3.jpg",
        "Cyberpunk-style portfolio website hero with neon lime accent "
        "on a near-black background, large monospace heading on the "
        "left, portrait on the right inside a clip-path rectangle with "
        "scan-line overlay, futuristic tech aesthetic, premium demo "
        "card thumbnail." + STYLE_SUFFIX,
        (1600, 1000),
        "demo",
    ),
    Slot(
        "demo/project-single.jpg",
        "Case-study layout screenshot: a single project hero image at "
        "the top, project metadata below, premium portfolio case study "
        "page mockup on a desktop browser." + STYLE_SUFFIX,
        (1600, 1000),
        "demo",
    ),
    Slot(
        "demo/blog-single.jpg",
        "Editorial blog post article layout on a desktop browser: large "
        "cover image at top, long-form body copy below, serif headlines, "
        "premium magazine reading layout demo thumbnail." + STYLE_SUFFIX,
        (1600, 1000),
        "demo",
    ),
    Slot(
        "demo/contact.jpg",
        "Premium contact page layout on a desktop browser: large "
        "headline on the left, contact form card on the right, dark "
        "interface, amber accent, portfolio template demo thumbnail." + STYLE_SUFFIX,
        (1600, 1000),
        "demo",
    ),
    Slot(
        "demo/docs.jpg",
        "Documentation page layout on a desktop browser: left sidebar "
        "table of contents, main content with code blocks and section "
        "headings, light clean interface, developer-friendly docs "
        "template demo thumbnail." + STYLE_SUFFIX,
        (1600, 1000),
        "demo",
    ),
]


# ---------------------------------------------------------------------------
# Generation
# ---------------------------------------------------------------------------


def crop_to_aspect(img: Image.Image, target: tuple[int, int]) -> Image.Image:
    """Center-crop then resize so the output matches the slot exactly."""
    tw, th = target
    sw, sh = img.size
    target_ratio = tw / th
    src_ratio = sw / sh

    if src_ratio > target_ratio:
        new_w = int(sh * target_ratio)
        x0 = (sw - new_w) // 2
        img = img.crop((x0, 0, x0 + new_w, sh))
    elif src_ratio < target_ratio:
        new_h = int(sw / target_ratio)
        y0 = (sh - new_h) // 2
        img = img.crop((0, y0, sw, y0 + new_h))

    return img.resize(target, Image.LANCZOS)


def generate(client: genai.Client, slot: Slot) -> Optional[bytes]:
    response = client.models.generate_content(
        model=MODEL,
        contents=slot.prompt,
        config=genai_types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )
    for candidate in response.candidates or []:
        for part in candidate.content.parts or []:
            data = getattr(getattr(part, "inline_data", None), "data", None)
            if data:
                return data
    return None


def save(raw: bytes, dest: Path, target: tuple[int, int]) -> int:
    dest.parent.mkdir(parents=True, exist_ok=True)
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    img = crop_to_aspect(img, target)
    img.save(dest, "JPEG", quality=85, optimize=True)
    return dest.stat().st_size


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--force", action="store_true", help="Regenerate every file")
    parser.add_argument("--only", help="Only generate slots matching this substring in the path")
    parser.add_argument("--key", help="Override the Gemini API key")
    parser.add_argument("--sleep", type=float, default=0.6, help="Seconds to wait between calls")
    args = parser.parse_args()

    api_key = args.key or os.environ.get("GEMINI_API_KEY") or DEFAULT_KEY
    if not api_key:
        sys.exit("No API key. Set GEMINI_API_KEY or pass --key.")

    client = genai.Client(api_key=api_key)

    targets = [s for s in SLOTS if not args.only or args.only in s.rel_path]
    print(f"ELBIO image generator — {len(targets)} slots, model {MODEL}\n")

    ok = 0
    skipped = 0
    failed: list[tuple[str, str]] = []

    for i, slot in enumerate(targets, 1):
        dest = BASE_DIR / slot.rel_path
        label = f"[{i:>2}/{len(targets)}] {slot.rel_path}"

        if dest.exists() and not args.force:
            print(f"{label}  ·  skip (exists)")
            skipped += 1
            continue

        print(f"{label}  ·  generating ...", end=" ", flush=True)
        try:
            raw = generate(client, slot)
            if not raw:
                raise RuntimeError("model returned no image bytes")
            size = save(raw, dest, slot.size)
            print(f"OK ({size // 1024} KB)")
            ok += 1
        except Exception as e:  # noqa: BLE001
            print(f"FAIL — {e}")
            failed.append((slot.rel_path, str(e)))
        time.sleep(args.sleep)

    print()
    print(f"Done. Generated: {ok}  Skipped: {skipped}  Failed: {len(failed)}")
    if failed:
        print("\nFailures:")
        for path, err in failed:
            print(f"  {path} — {err}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
