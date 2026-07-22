## Done
- Bumped `.theme .num` (card index "01"/"02"...) from 10.56px to 12px — under the micro-label floor. Visible top-left of every card, all screens.
- Bumped `.theme .q` (italic question line under each card heading) from 14.72px to 16px + line-height 1.5 — was reading text under the body floor. Visible on every card in the grid.
- Gave `.theme .start a` ("start here" links) a real tap target: `display:inline-block; padding:12px 2px` and loosened `.start` gap to `12px 18px`. Font-size was already floored to 16px sitewide by `mobile.css` (`html.m-themes main a`), but the links had ~0 vertical padding, so wrapped-link rows had barely any separation and a tiny hit area. Visible on every card.
- Bumped `.young` (bottom "growing in public" note) from 14.4px to 16px + line-height 1.5, slightly more padding — was reading text under the body floor. Visible in the last section before the footer.

4 rules changed, all scoped to `html.m-themes` inside the existing 760px breakpoint.

## Proposed (not done)
- None — no HTML/JS/desktop-affecting changes were needed for this page. The layout (1-column grid below 860px, clamp'd headline/lede, card structure) already works on phone; this page just needed text-size/tap-target polish.

## Flags
- The `div.wmedia` / `img` overflow (-12 to 402, width 413) and `a.wback` 9.6px text from report.json both come from the shared "world band" component injected by `site-nav.js` (`.wband`, `.wbandwrap .wback`), not from themes.html's own markup or `themes-data.js`. That component already has its own `@media(max-width:640px)` rule inside `site-nav.js` (line ~273). If it's still overflowing/tiny at 390px after the sitewide nav pass, the fix belongs in `site-nav.js` or the sitewide `mobile.css` retrofit layer — out of scope for this themes.html-only pass (per instructions, and per the "touch only these two files" constraint).
- No broken assets or JS errors observed for this page (report.json shows `jsErrors: []`).
