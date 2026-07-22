## Done
- "Back to the Coliving Atlas" crumb link and the sticky guide-rail icons (`.gr-item`, was 38px tall) bumped to a ≥44px tap area. Screen 1 (crumb) / bottom rail (appears once the intro gallery scrolls away).
- Sticky guide-rail and the shared back-to-top button now clear the home-indicator with a safe-area inset — only takes effect once `viewport-fit=cover` is added (see Proposed).
- Text floors mobile.css doesn't already cover for this page, all under the 12px micro-label / 16px reading floor: gallery-tile name (`.gname`, 11.5px), theme-card question label (`.tcard .q`, 11.5px), featured-example place tag (`.featcap .fpl`, 11.8px), prev/next kicker (`.pager .lab`, 10.2px), intro paragraph (`.ti-sub`, ~15.7px), diagram-placeholder note (`.ph-s`, 14.7px), theme-card body text (`.tcard p`, 15.2px), who's-it-for/watch-out body text (`.fnote p`, 15.2px), example-card note (`.ex .note`, 14.7px), prev/next guide name (`.pager a`, 14.7px). All bumped to floor. Visible throughout the guide body and the pager at the very bottom.
- Axis-readout rows ("Where it sits on every axis", near the bottom) restacked per recipe 7 — label above the track, label below right-aligned — instead of a cramped 110px+track+110px row (mobile.css already had the font-size at 12px; this fixes the layout squeeze).
- Theme-card grid gap (`.tgrid`) and who's-it-for/watch-out grid gap (`.fnotes`) bumped from 14px to 16px — recipe 4 floor.
- Diagram image and the "in action" featured image switched from `vh` to `svh` caps so mobile browser chrome (address bar) can't clip or jump-cut them.
- Fixed the shared "← [scene] · back to the tower" pill (`.wback`) — it ships its own `@media(max-width:640px)` rule in `site-nav.js` that should already land it at 12px, but the QA report measured 9.6px in practice; re-asserted the floor from this page's own scope as a safety net (see Flags).
- Gallery intro grid (3-col icon nav), floating guide-to-guide arrows (already hidden ≤1000px), themes/example card grids collapsing to 1 column, and the reduced-motion rule were already correct in the page's own `<style>` — no changes needed there.

## Proposed (not done)
- Add `viewport-fit=cover` to the page's `<meta name="viewport">` tag — the safe-area-inset fixes on `.guiderail`/`.stotop` are inert without it (currently resolve to 0, so no regression, just no effect yet). HTML edit, out of scope here.
- No interaction on this page needed a redesigned mobile fallback — the gallery intro and guide-rail are both already horizontally-scrollable strips (existing code), and every image+text section on this page is single-column top-to-bottom by nature (model/origin text columns, theme cards, example cards) rather than a desktop side-by-side split, so recipe 2's reorder pattern didn't apply here.

## Flags
- `div.wmedia`/`img`/`video` overflow (−12px to 402px, reported on every page) is the intentional parallax bleed on the shared world-banner (`inset:-7% -3%` in `site-nav.js`) — `overflow-x:clip` on `html,body` already prevents any real scrollbar. Not a bug.
- `a.gr-item`/`svg`/`path` overflow entries (off-screen at 398–475px) are guide-rail icons past the visible edge of its own `overflow-x:auto` scroll strip — expected, not a bug.
- Shared `.wback` "back to the tower" pill measured at 9.6px in the QA report despite `site-nav.js` shipping its own `@media(max-width:640px)` rule that should land it at 12px — same root-cause note as the map.html report; worth investigating centrally since it's sitewide, not type.html-specific. Patched locally above as a safety net.
