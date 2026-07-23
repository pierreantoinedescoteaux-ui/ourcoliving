# DESKTOP-SCALE-RULES.md — how every page scales from a small laptop to 4K

**v1 — 2026-07-22.** Companion to `MOBILE-RULES.md` (which owns ≤760px). This file
owns the DESKTOP range: **1280×620 laptops → 1440p → 4K (3840px)**. Sourced from a
research pass over Utopia.fyi fluid-type methodology, CSS-Tricks clamp() math,
OddBird 2025 fluid-type guidance, and Smashing's WCAG notes; solved for this
site's actual values. Zero JS, zero runtime cost — everything is CSS `clamp()`.

## The problem this solves
Every fluid value on this site was solved for a ~390→1440px range and goes FLAT
above 1440px. On 4K the type reads tiny in an ocean of margin; on short laptops
(1280×620) some heroes/images overflow the frame.

## The strategy (chosen over root-rem scaling — do not switch)
Extend each `clamp()`'s top anchor to 3840px, property by property. Root
`html{font-size:clamp(...)}` rem-scaling was evaluated and REJECTED for this
site: the pages are hand-authored px-based `<style>` blocks with no token
system, so root scaling has unaudited blast radius (px paddings/borders stop
matching suddenly-scaled rem type, images don't participate). Per-property
clamps are lower-risk and directly fix the complaint.

## R1 — The formula (re-solve ANY clamp for 1280→3840)
```
slope = (maxPx − minPx) / (3840 − 1280)
yAxis = minPx − 1280 × slope            // px
CSS:   clamp(minPx/16 rem, yAxis/16 rem + (slope×100)vw, maxPx/16 rem)
```
Bounds in `rem`, never `px` — keeps browser text-zoom working (WCAG 1.4.4).
Preferred value keeps `vw` so it scales between the anchors.

## R2 — Body text (drop-in for the current site-wide pattern)
```css
/* replaces clamp(18px, 1.5vw, 22px) — 18px@1280 → 24px@3840 */
font-size: clamp(1.125rem, 0.9375rem + 0.2344vw, 1.5rem);
```
(1920px ≈ 19.5px, 2560px = 21px, 3840px = 24px.)

## R3 — Secondary/meta text
```css
/* 14px@1280 → 18px@3840 */
font-size: clamp(0.875rem, 0.75rem + 0.1563vw, 1.125rem);
```

## R4 — Headings
Run every existing heading clamp through R1: keep its current min, raise its
max ×1.4–1.6 (the same ratio body text got). Example for a current
`clamp(32px, 3vw, 48px)` H1:
```css
font-size: clamp(2rem, 1.75rem + 0.9375vw, 4rem);  /* 32px@1280 → 64px@3840 */
```

## R5 — Container width (4K shouldn't be a postage stamp)
```css
/* flat 1320px through 1920, grows to 1760px by 3840 — line length stays readable */
--max: clamp(1320px, 880px + 22.92vw, 1760px);
```

## R6 — Gutters & big paddings
Any clamp()'d gutter/padding: re-solve via R1, top bound ≈ +50% over current.
Pure-vw values (no ceiling) already scale — leave them.

## R7 — Short laptops (620–768px tall): svh first, one media query max
```css
.hero, .hero img { max-height: min(560px, 78svh); }   /* primary defense, no MQ */
@media (max-width:1439px) and (max-height:760px) {     /* the ONE allowed height MQ */
  .hero { padding-block: clamp(24px, 4vh, 48px); }
}
```
Never plain `vh` (matches MOBILE-RULES rule 10).

## R8 — The px audit (mandatory when applying R2–R4 to a page)
Grep the page's `<style>` for hardcoded `px` on `padding/margin/gap/line-height`
sitting NEXT TO any element whose font-size you just made fluid — bump those
through R1 too, or the page reads cramped at 4K. Borders/hairlines stay px.

## Don'ts
- ❌ No `html{font-size:clamp()}` root scaling (see strategy above).
- ❌ No container queries for page shells — this is a content site; media
  queries + fluid clamps cover it (container queries are for reusable
  component libraries).
- ❌ No JS resize listeners, no `transform: scale()` zoom hacks.
- ❌ No second height media query without audit evidence (same bar as
  MOBILE-RULES' single-breakpoint rule).

## QA at desktop scale
Playwright shots at **1280×620, 1440×900, 2560×1440, 3840×2160** — check: body
text ≥18px equivalent at all sizes and visually ≥ comfortable at 4K; no clipped
heroes at 620px tall; measure `getComputedStyle(document.body).fontSize` at
3840 (expect ~24px on migrated pages).

## Rollout status
- 2026-07-22 — v1 written; **no pages migrated yet.** Application is its own
  round (sitewide clamp re-solve + px audit + full QA gate) — queued.
