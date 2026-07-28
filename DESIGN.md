# DESIGN.md — visual system canon

**STATUS: DRAFT v0.95 — P-A REJECTED homepage v4's raw-ludiq look (2026-07-11, verdict session): "the landing page is worse, I like the previous styling better but wanted bigger fonts and layout." The direction is the HYBRID this file already describes: Zodiak/Switzer warm-paper voice at ludiq scale (18-22px, big images, color blocks). Implemented on `index.html` v5, `map.html` v3, `type.html` (commit bc1b90d). Locks to v1.0 when P-A approves this round. Tokens live in index.html v5 `:root`.**

Every agent building or restyling ANY page reads this first. Machine-readable tokens + rules below; human canon will additionally live in a Google Slides brand guideline (via Gamma → PPTX) later.

## References (the taste anchors — P-A-provided)
- **ludiq.org** — sizing, image treatment, color-block layout ("the standard")
- `moodboard/Whole moodboard.png` (+ Dear Alice stills) — palette, vibe: solarpunk warmth
- P-A verbatim steers: "mostly bright, not dark" · "pale background with colored sections or graphic elements in colors" · "minimalism of some of these but also the colors and vibes" · "sings of warmth, hope and modernity"

## Palette (tokens live in `index.html` v5 `:root` — copy from there)
| Token | Hex | Use |
|---|---|---|
| --paper | #f6f2e7 | Default page ground (pale, warm). Most of every page. |
| --card | #fffdf8 | Cards/panels on paper |
| --ink / --ink-soft / --ink-faint | #22301f / #5c6b57 / #93a08d | Text hierarchy (green-cast ink) |
| --green / --green-deep | #5c9e4a / #3c6b32 | Life/growth: tags, links, dots, accents |
| --sky / --sky-wash / --sky-b | #7fb6c9 / #e3eff3 / #bfdde6 | Air: washes, tinted grids, soft blocks |
| --gold / --gold-deep | #d99a3d / #8f6215 | Warmth: stats, pull-quotes, em accents (deep = small text, contrast) |
| --sun / --sun-soft | #f7c948 / #fbe29a | Bold blocks (what-ifs panel), highlights |
| --forest / --forest-2 | #173a2c / #1f4a38 | THE dark: reserved for closing blocks/footer bands only |
| --clay / --clay-deep | #b5613c / #8f4a2c | Sparing accent (legacy Atelier); deep for small text (AA contrast) |

## The tower / landing palette (added 2026-07-28, P-A)
The landing world has its own grounds — the painted stills carry their own field colour, and the site cream is a shade lighter. Getting these two confused makes the tower sit on a visibly paler rectangle.

| Name | Hex | Use |
|---|---|---|
| Tower field | **#F1DBC0** | The field the tower paintings are painted on. The letterbox bands beside the contain-fit map MUST be this — never the page cream. |
| Landing cream | **#F8E9CF** | The landing page's own ground: label pills, leader-line halos, text glows, the zoom veil. |
| Interior paper | #f6f2e7 | Every interior page's ground (= `--paper` above). |
| Ink | #22301f | Text on all three grounds (= `--ink`). |

**Category colours** — the five meanings a space can carry. Every space name, leader line, popup bubble and legend chip on the landing takes its colour from this table, and the same colour tints that space's zoom veil.

| Category | Hex | Spaces |
|---|---|---|
| resources | **#2b8b8f** teal | The Library, The Workshop |
| hope | **#d08a2e** amber | The Garden |
| me | **#3e7db0** blue | The House |
| overview | **#b3543e** terracotta | The Summit |
| connect | **#3c6b32** green | The Commons |

**Usage rules:** pages are MOSTLY BRIGHT — paper ground with saturated flat color blocks as section markers. Dark (forest) appears only as a closing band or footer, never as the default. Small text on cream must use the -deep variants (WCAG AA ≥ 4.5:1).

## Type
- Display: **Zodiak** (serif, Fontshare) — headlines, pull-quotes.
- Body/UI: **Switzer** (grotesk, Fontshare) — everything else.
- Body size floor: **18px minimum, 18–22px fluid** (`clamp(18px,1.5vw,22px)`). P-A flagged small text twice — never go below.
- Very few words per section (Ludiq rule). Huge sparse stat numbers where data appears. If a section needs many words, layer it: short visible + "read more" reveal.

## Layout grammar (Ludiq)
- Max width 1320px, generous gutters (`clamp(20px,4.5vw,80px)`).
- Flat saturated **color-block sections** with rounded corners (**24–28px radius**) — the "colored sections" P-A asked for.
- Image frames: rounded rectangles (24px) as the default (v5). Organic/arch shapes were part of the rejected raw-ludiq v4 — reintroduce only if P-A asks.
- Poster-minimalism per moodboard: one bold element per section, generous negative space. Storybook illustration energy CONTAINED in framed moments — never full-bleed busy scenes.
- Subtle ground washes allowed: radial sky-wash top corner, warm wash bottom (see index v4 body background).

## Motion
- Default: vanilla IntersectionObserver reveals (as index v4).
- Richer motion (GSAP ScrollTrigger + Lenis, both free/CDN) allowed for hero/manifesto moments per the interactive-first asset rule — but motion serves warmth/hope, never showreel flash. Respect `prefers-reduced-motion`.

## Imagery
- Order per AGENT-RULES.md: interactive/code-built → generated (ASSETS.md pipeline, shared style anchor) → licensed photo (log CREDITS.md).
- Generated-image style anchor lives in `ASSETS.md` — keep the two files consistent.
- **Generated diagrams are near-monochrome (duotone).** Each illustration uses exactly ONE main accent color (across its full range of tints and shades) plus ONE secondary accent (small highlights only) on the neutral paper ground (#f6f2e7) — a calm monochrome-poster feel, never the full palette in a single image. Both accents stay within the palette above. Assign a distinct main accent per subject so the set reads cohesive but each type is still distinguishable.
- Real house photos: P-A's curation bar — only shots that survive an architect's eye; dedupe by function.

## Banned moves
- Dark-by-default pages or brown-black bands (old direction, explicitly rejected).
- Body text under 18px; walls of text (layer with read-more instead).
- Full-bleed busy illustration scenes; photorealism in generated images.
- Generic AI-site tells: purple-on-white gradients, Inter/Roboto, centered-hero-with-two-buttons template.
- Guessing taste from adjectives — anchor every visual call to ludiq.org or the moodboard, or escalate.
- New proprietary images without a CREDITS.md flag.
