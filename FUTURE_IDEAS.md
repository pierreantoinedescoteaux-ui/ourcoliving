# Future Ideas — coliving portfolio

Ideas discussed and liked but deferred. Date = when parked.

## ~~Village finale revamp (manifesto bottom)~~ — SHIPPED 2026-07-22
Scroll-scrubbed painted time-lapse: neighbors raising the first timber frame →
lantern-lit village at dinner (seedance A→B, frame-locked, 8s). Stills in
`_landing/build2/raw/village-{a,b}.png`, film at `assets/world/village.mp4`.
Possible later polish: regenerate at 12s for a slower build, or add ambient
loop mode when idle at the end state.

## Per-asset generated animations
2026-07-22. Every sticker in `assets/world/` currently animates via CSS only
(float/sway/flicker). Later: generate real animation clips per asset (e.g. lantern
flame flicker, bird wing-beat sprite sheet, balloon swaying with heat shimmer).
Token/credit-expensive — batch when a set of them is wanted at once.

## Comprehensive per-page treatments (the "intense" tier)
2026-07-22. Light pass shipped (scene banners, grain, accents, footer branch, fx).
Comprehensive candidates, one page at a time, when P-A wants to go deeper:
- **resources.html** — "library shelf" framing: orn-books + orn-lantern vignettes
  beside the directory sections; holographic zap accents on filter pills.
- **map.html** — "the lookout table": frame the atlas as the map table from S7;
  corner-vine ornaments on the map card; sun hover on model markers.
- **story.html / about.html** — "homes fragment collage": soft-edged painting
  fragments from S6 + existing object renders (`_landing/_candidates/scenes/*-asset*`)
  woven between chapters.
- **design.html / work.html** — "makers pinboard": tool/wall vignettes, project cards
  pinned like workshop sketches, zap hover on case-study links.
- **themes.html** — gardens treatment: seedling ornament per theme cluster,
  flower sprites as list bullets.
- **type.html field guides** — unify the 38 generated illustrations with one frame
  style + grain + caption typography so they read as one commissioned series.

## Painting-fragment object vignettes
2026-07-22. Use the `-asset`/`-obj` renders in `_landing/_candidates/scenes/` and crops
of the 7 scene stills as soft-edged rounded "fragments of the big painting" pinned
beside text sections (collage aesthetic, no hard cutouts). Approved by P-A; not yet
placed — belongs to the per-page comprehensive passes above.

## Button-vine hover: strengthen the sprout
2026-07-22. The leaf hover mood draws 2 small stems + leaf/flower pops at button
corners. Works but subtle. Later: richer vine wrap (path hugging the full border,
more sprites), maybe using vk-tendril along the border path.

## Native 9:16 portrait mobile chain for the landing
2026-07-21. ~940cr. Second camera chain rendered natively in portrait so phones get
composed scenes instead of centre-crop. Do only if the phone crop bothers P-A.

## Mobile touch micro-animations
2026-07-22. P-A: some mobile sites have small animations when you swipe / pass your
finger on things. Out of scope for the mobile round-2 retrofit (his call). If wanted
later: tap-ripples on cards, touch-drag parallax on painted banners, pull-release
bounce on carousels — all transform/opacity-only, reduced-motion-gated, sticker-kit
art (never code-drawn shapes).
