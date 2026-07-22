# why.html — mobile report

Baseline was already clean mechanically (report.json: 0 overflow, 0 tiny-text
flags, viewport meta present) — the page had already been through a mobile
pass (own `@media(max-width:860/820/680/640/520px)` rules exist in its
`<style>`). This pass focused on reading-floor + tap-target checks the
mechanical audit doesn't catch (font-size on text nodes that render fine
structurally but sit under the 16px/12px floors, and tap-target height).

## Done
- `.chip .l` (screen 3, the four stat captions — "deaths a year linked to
  loneliness…" etc.) was 12.8px carrying a full sentence; bumped to 16px —
  it's reading content, not a caption/label, per the floor rule.
- `.lcard p` (screen 4, "Why co-living answers" — six lens cards) was
  14.72px full-sentence body copy; bumped to 16px.
- `.way p` (screen 5, "Twelve ways in" — the italic "teaches" quote under
  each of the 12 model links) was 14.08px; bumped to 16px.
- `.nav .links a.on` — at ≤680px the sticky nav already hides every link
  but the current page's (page's own rule); that one remaining link's tap
  area was ~23px tall. Added vertical padding to clear 44px; nav bar's own
  height is set by the brand line so this doesn't grow the bar.
- `.close .ctas a` (screen 8, "Explore the twelve models" / "Read my
  vision") was ~42px tall, just under the 44px tap-target floor. Padding
  bumped 14px→15px top/bottom.

## Proposed (not done)
- The sticky nav hides Manifesto / Atlas / Design for Connection / About at
  ≤680px and shows only the current page's link — there's no hamburger/menu
  to reach the other pages from mobile on this specific page (unlike
  site-nav.js pages, which get a "Menu ▾" panel). Building that requires a
  toggle button + JS, out of CSS-only scope — flagging for a follow-up pass.

## Flags
- None. No broken assets, no JS errors in report.json for this page.

## Where each fix shows up
- `.chip .l`: screen with the four big stat numbers (871,000 / 61% / 12.3× /
  40%) on the dark band, directly under each number.
- `.lcard p`: the six-card "Health & longevity / Economics / Elders &
  children / Ecology / Meaning & growth / Resilience" list, still dark band.
- `.way p`: the paper-background "Twelve ways in" list (Ecovillage,
  Cohousing, etc.), the italic line under each model name.
- `.nav .links a.on`: sticky header, every screen (invisible padding only).
- `.close .ctas a`: very last screen, the two pill buttons under "The
  future is a place we build on purpose."
