# Floating-island village — reusable asset

The little village that grows. P-A's favorite (2026-07-27, "I really like it").
Drawn in the landing tower's hand-illustrated 3D-asset-object style, anchored on
the S1 world recipe. Warm cream background baked in (#FCE3BC-family), floats as
a collectible object on the page.

## Files
- `village-final.webp` — the finished village still (hero). 7 houses in a half
  circle (2 teal glass domes, 2 solar roofs), gardens + food rows, pond + stream
  + waterfall spilling off the island's edge, 2 wind turbines, sheep/dog/chickens,
  ~10 people at one long table. Sun, cloud, birds float in the cream field.
- `village-empty-plot.webp` — the same island before anything was built (dry,
  no waterfall). Story start.
- `village-construction.webp` — mid-story: same 7 houses simple + freshly built,
  bare garden rows, timber piles, pulley crane, builders.
- `village-growth-16s.mp4` — the full growth film (empty → construction → alive;
  waterfall starts spilling in the finale). Ungraded master, 24fps, frame-locked
  to the three stills. Two seedance clips concatenated (seam at 8.0s).
- `village-idle-loop-8s.mp4` — seamless ambient idle of the finished village
  (waterfall flows, turbines turn, people chat in place). Tail crossfaded into
  head — loops cleanly. Ungraded master.
- `prompts/` — the exact generation prompts (gpt_image_2 stills, seedance films).

## Where it's used
- `manifesto.html` bottom section: scroll-scrubbed growth film, then the idle
  loop crossfades in when the scrub completes. Site-served encodes live in
  `assets/world/village*` (graded mp4 fallback + alpha-keyed webm variants).

## Reuse notes
- Site pages don't use these masters directly — re-encode per destination
  (see `_landing/build2/finish-village2.sh` + `key_alpha.py` for the alpha
  pipeline that removes the cream background entirely).
- To re-grade the cream to another page background: map bg (252,227,188) to the
  target color with an ffmpeg `curves` spline (see LEDGER 2026-07-27 entries).
- Regenerating variants: use `village-final.webp` as the style reference image
  and describe the delta ("same exact floating island, but ...").
